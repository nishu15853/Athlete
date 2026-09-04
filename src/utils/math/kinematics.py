"""
AthleteMind AI - Kinematic Angle Computation Engine (Python / NumPy Reference)

Trigonometrically computes interior planar joint angles using atan2 vector subtraction
with branch-cut wrap normalization and visibility/confidence gating.

Mathematical Formulation:
    Δθ = |atan2(Cy - By, Cx - Bx) - atan2(Ay - By, Ax - Bx)|
    if Δθ > π:
        Δθ = 2π - Δθ
    θ_deg = Δθ * (180 / π)
"""

import numpy as np
from typing import Dict, Optional, Union, Tuple

# MediaPipe 33 Landmark Indices Constants
LANDMARKS = {
    'NOSE': 0,
    'LEFT_SHOULDER': 11,
    'RIGHT_SHOULDER': 12,
    'LEFT_ELBOW': 13,
    'RIGHT_ELBOW': 14,
    'LEFT_WRIST': 15,
    'RIGHT_WRIST': 16,
    'LEFT_HIP': 23,
    'RIGHT_HIP': 24,
    'LEFT_KNEE': 25,
    'RIGHT_KNEE': 26,
    'LEFT_ANKLE': 27,
    'RIGHT_ANKLE': 28,
}

def calculate_angle(
    a: Union[np.ndarray, list, Tuple[float, float]],
    b: Union[np.ndarray, list, Tuple[float, float]],
    c: Union[np.ndarray, list, Tuple[float, float]],
    min_confidence: float = 0.5,
    a_vis: Optional[float] = None,
    b_vis: Optional[float] = None,
    c_vis: Optional[float] = None,
) -> float:
    """
    Calculates interior planar joint angle between 3 points: A (proximal) -> B (vertex) -> C (distal).

    Args:
        a: Coordinates of proximal point [x, y]
        b: Coordinates of vertex point [x, y]
        c: Coordinates of distal point [x, y]
        min_confidence: Threshold below which angle evaluates to 0.0
        a_vis, b_vis, c_vis: Optional visibility scores from pose estimator

    Returns:
        float: Interior angle in degrees [0.0, 180.0], or 0.0 if invalid/low confidence.
    """
    # Visibility / Confidence Gating
    for vis in [a_vis, b_vis, c_vis]:
        if vis is not None and vis < min_confidence:
            return 0.0

    a_arr = np.asarray(a[:2], dtype=np.float64)
    b_arr = np.asarray(b[:2], dtype=np.float64)
    c_arr = np.asarray(c[:2], dtype=np.float64)

    # Vector differences relative to vertex B
    v1 = a_arr - b_arr  # B -> A
    v2 = c_arr - b_arr  # B -> C

    # Overlapping coordinates check (prevent NaN on zero length vectors)
    if (v1[0] == 0.0 and v1[1] == 0.0) or (v2[0] == 0.0 and v2[1] == 0.0):
        return 0.0

    # Branch cut normalization across (-π <-> +π)
    angle_a = np.arctan2(v1[1], v1[0])
    angle_c = np.arctan2(v2[1], v2[0])

    delta_theta = np.abs(angle_c - angle_a)

    # Normalize radian difference directly before degree conversion
    if delta_theta > np.pi:
        delta_theta = 2.0 * np.pi - delta_theta

    angle_deg = delta_theta * (180.0 / np.pi)

    if np.isnan(angle_deg):
        return 0.0

    return round(float(angle_deg), 1)

def get_knee_angle(hip, knee, ankle, min_confidence: float = 0.5) -> float:
    """Calculates Knee angle: Hip (23/24) -> Knee (25/26) -> Ankle (27/28)"""
    return calculate_angle(hip, knee, ankle, min_confidence)

def get_elbow_angle(shoulder, elbow, wrist, min_confidence: float = 0.5) -> float:
    """Calculates Elbow angle: Shoulder (11/12) -> Elbow (13/14) -> Wrist (15/16)"""
    return calculate_angle(shoulder, elbow, wrist, min_confidence)

def get_hip_angle(shoulder, hip, knee, min_confidence: float = 0.5) -> float:
    """Calculates Hip angle: Shoulder (11/12) -> Hip (23/24) -> Knee (25/26)"""
    return calculate_angle(shoulder, hip, knee, min_confidence)

if __name__ == '__main__':
    # Unit verification test cases
    hip = [0.5, 0.2]
    knee = [0.5, 0.5]
    ankle = [0.8, 0.5]

    angle = get_knee_angle(hip, knee, ankle)
    print(f"Computed Right Angle Test: {angle}° (Expected: 90.0°)")
    assert np.isclose(angle, 90.0), f"Expected 90.0, got {angle}"

    # Branch cut boundary test (crossing 180 degrees line)
    p1 = [0.5, 0.8]
    vertex = [0.5, 0.5]
    p2 = [0.5, 0.2]
    straight_angle = calculate_angle(p1, vertex, p2)
    print(f"Straight Line Test: {straight_angle}° (Expected: 180.0°)")
    assert np.isclose(straight_angle, 180.0), f"Expected 180.0, got {straight_angle}"
    print("All Python kinematics validation tests passed successfully!")
