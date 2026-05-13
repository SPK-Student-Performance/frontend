/**
 * Upload Service
 * Handles CSV file uploads for student data processing.
 */

import { api } from './api'

/**
 * Upload a CSV file containing student data for AI analysis.
 * @param {File} file - The CSV file to upload
 * @returns {Promise<{message: string, predictions: Array}>}
 */
export async function uploadCSV(file) {
  const formData = new FormData()
  formData.append('file', file)
  return api.upload('/uploads', formData)
}

/**
 * Check AI model health status.
 * Response shape (online):
 * { status: 'online', message: '...', ai_info: { ... } }
 *
 * Response shape (down):
 * { status: 'down', error: '...', detail: '...' }
 */
export async function checkAiHealth() {
  return api.get('/system/ai-health')
}
