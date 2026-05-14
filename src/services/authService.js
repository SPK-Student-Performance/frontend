/**
 * Auth Service
 * Handles user authentication (login & register).
 */

import { api, setToken, removeToken } from './api'

/**
 * Login with username and password.
 * Backend uses 'username' not 'email' for the LoginRequest.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{message: string, token: string}>}
 */
export async function login(username, password) {
  const data = await api.post('/auth/login', { username, password })
  if (data.token) {
    setToken(data.token)
  }
  return data
}

/**
 * Register a new teacher account.
 * @param {string} username
 * @param {string} password
 * @param {string} fullName
 * @returns {Promise<{message: string}>}
 */
export async function register(username, password, fullName) {
  return api.post('/auth/register', { username, password, full_name: fullName })
}

export async function getCurrentUser() {
  return api.get('/auth/me')
}

export async function updateProfile({ username, fullName }) {
  return api.put('/auth/profile', { username, full_name: fullName })
}

/**
 * Logout: clear token and redirect to login.
 */
export function logout() {
  removeToken()
  window.location.hash = 'login'
}
