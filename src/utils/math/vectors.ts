import { Landmark } from '../../types/biomechanics';

/**
 * Calculates Euclidean distance between two landmarks in 2D/3D space
 */
export function euclideanDistance(p1: Landmark, p2: Landmark, use3D: boolean = false): number {
  if (!p1 || !p2) return 0;
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  if (use3D && p1.z !== undefined && p2.z !== undefined) {
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Returns coordinate displacement vector between two points
 */
export function coordinateDisplacement(p1: Landmark, p2: Landmark): { dx: number; dy: number; dz?: number } {
  return {
    dx: p2.x - p1.x,
    dy: p2.y - p1.y,
    dz: p1.z !== undefined && p2.z !== undefined ? p2.z - p1.z : undefined,
  };
}

/**
 * Calculates midpoint between two landmarks
 */
export function midpoint(p1: Landmark, p2: Landmark): Landmark {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
    z: p1.z !== undefined && p2.z !== undefined ? (p1.z + p2.z) / 2 : undefined,
    visibility: p1.visibility !== undefined && p2.visibility !== undefined
      ? Math.min(p1.visibility, p2.visibility)
      : undefined,
  };
}

/**
 * Applies exponential moving average (EMA) smoothing across landmark frames
 * to eliminate high-frequency camera jitter.
 * @param current Latest detected landmarks
 * @param previous Previous frame's smoothed landmarks
 * @param alpha Smoothing factor (0 = keep previous, 1 = no smoothing, default = 0.65)
 */
export function smoothLandmarks(
  current: Landmark[],
  previous: Landmark[],
  alpha: number = 0.65
): Landmark[] {
  if (!previous || previous.length !== current.length) {
    return current;
  }

  return current.map((curr, idx) => {
    const prev = previous[idx];
    if (!prev) return curr;

    return {
      x: alpha * curr.x + (1 - alpha) * prev.x,
      y: alpha * curr.y + (1 - alpha) * prev.y,
      z: curr.z !== undefined && prev.z !== undefined
        ? alpha * curr.z + (1 - alpha) * prev.z
        : curr.z,
      visibility: curr.visibility,
    };
  });
}
