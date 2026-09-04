import { ExerciseSession } from '../types/biomechanics';

const STORAGE_KEY = 'athletemind_sessions_history_v1';

const INITIAL_SESSIONS: ExerciseSession[] = [
  {
    id: 'session-101',
    date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    durationSeconds: 332, // 05:32
    averagePostureScore: 89,
    movementQuality: 'Good',
    issuesDetected: 2,
    exerciseType: 'General Posture',
    anglesSummary: { avgLeftKnee: 172, avgRightKnee: 170, avgLeftElbow: 165, avgRightElbow: 162 }
  },
  {
    id: 'session-102',
    date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    durationSeconds: 420, // 07:00
    averagePostureScore: 91,
    movementQuality: 'Excellent',
    issuesDetected: 1,
    exerciseType: 'Squat',
    repsCompleted: 12,
    anglesSummary: { avgLeftKnee: 98, avgRightKnee: 96, avgLeftElbow: 168, avgRightElbow: 166 }
  },
  {
    id: 'session-103',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    durationSeconds: 245, // 04:05
    averagePostureScore: 86,
    movementQuality: 'Good',
    issuesDetected: 3,
    exerciseType: 'Arm Raise',
    repsCompleted: 8,
    anglesSummary: { avgLeftKnee: 175, avgRightKnee: 174, avgLeftElbow: 142, avgRightElbow: 140 }
  }
];

export function getStoredSessions(): ExerciseSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SESSIONS));
      return INITIAL_SESSIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse sessions from localStorage:', err);
    return INITIAL_SESSIONS;
  }
}

export function saveSession(session: ExerciseSession): ExerciseSession[] {
  try {
    const existing = getStoredSessions();
    const updated = [session, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save session to localStorage:', err);
    return [];
  }
}

export function clearStoredHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
}
