/**
 * Dashboard Service
 * Fetches aggregated data for the teacher dashboard.
 */

import { api } from './api'

/**
 * Get dashboard summary with statistics and priority students.
 * Response shape:
 * {
 *   summary: {
 *     total_students: number,
 *     average_gpa: number,
 *     average_attendance_pct: number,
 *     total_at_risk: number,
 *     risk_distribution: { high: number, medium: number, low: number }
 *   },
 *   students: [
 *     { student: {...}, prediction: {...} },
 *     ...
 *   ]
 * }
 */
export async function getDashboardSummary() {
  return api.get('/dashboard/summary')
}
