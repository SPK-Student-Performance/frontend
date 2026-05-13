/**
 * Base API Service
 * Centralized HTTP client with JWT token management.
 * All protected endpoints automatically include Authorization: Bearer <token>.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

/**
 * Get the stored JWT token from localStorage.
 */
export function getToken() {
  return localStorage.getItem('artha_token')
}

/**
 * Store the JWT token in localStorage.
 */
export function setToken(token) {
  localStorage.setItem('artha_token', token)
}

/**
 * Remove the JWT token from localStorage (logout).
 */
export function removeToken() {
  localStorage.removeItem('artha_token')
}

/**
 * Check if user is currently authenticated (has a valid token stored).
 */
export function isAuthenticated() {
  return !!getToken()
}

/**
 * Core fetch wrapper with automatic token injection and error handling.
 * @param {string} endpoint - API endpoint path (e.g., '/auth/login')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} Parsed JSON response
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getToken()

  const headers = {
    ...(options.headers || {}),
  }

  // Don't set Content-Type for FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  // If body is a plain object, stringify it
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body)
  }

  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, config)

    // Handle 401 Unauthorized -> clear token and redirect to login
    if (response.status === 401) {
      removeToken()
      window.location.hash = 'login'
      throw new ApiError('Session expired. Please log in again.', 401)
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const message = data?.error || data?.message || `Request failed with status ${response.status}`
      throw new ApiError(message, response.status, data)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    // Network errors
    throw new ApiError(
      'Unable to connect to server. Please check your connection.',
      0,
      null
    )
  }
}

/**
 * Custom API Error class with status code and response data.
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Convenience methods
export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
  upload: (endpoint, formData) =>
    apiRequest(endpoint, { method: 'POST', body: formData }),
}
