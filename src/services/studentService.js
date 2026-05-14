/**
 * Student Service
 * Fetches student roster and student detail data.
 */

import { api } from './api'

/**
 * Get all students with their predictions.
 * Response shape:
 * {
 *   data: [
 *     {
 *       student: { student_id, student_identifier, age, grade, gender, gpa, attendance_rate, ... },
 *       prediction: { risk_level, risk_probability, confidence_pct, flags, ui_status, ... }
 *     }
 *   ]
 * }
 */
export async function getStudents() {
  return api.get('/students')
}

/**
 * Get detailed info for a single student including prediction and interventions.
 * Response shape:
 * {
 *   student: { ... },
 *   prediction: { risk_level, risk_probability, confidence_pct, flags, model_consistent, ... },
 *   interventions: [
 *     { rank, kode_intervensi, intervensi_name, preference_score, ... }
 *   ]
 * }
 */
export async function getStudentDetail(studentId) {
  return api.get(`/students/${studentId}`)
}

/**
 * Add a new student and trigger AI prediction
 */
export async function addStudent(studentData) {
  return api.post('/students', studentData)
}

/**
 * Update an existing student and trigger AI prediction
 */
export async function updateStudent(studentId, studentData, isNewAssessment = false, replacePredictionId = '') {
  const params = new URLSearchParams()
  if (isNewAssessment) params.set('new_assessment', 'true')
  if (replacePredictionId) params.set('replace_prediction_id', replacePredictionId)
  const qs = params.toString()
  const url = `/students/${studentId}${qs ? `?${qs}` : ''}`
  return api.put(url, studentData)
}

/**
 * Delete a student and their related data
 */
export async function deleteStudent(studentId) {
  return api.delete(`/students/${studentId}`)
}
