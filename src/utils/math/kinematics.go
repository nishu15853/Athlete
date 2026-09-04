// Package kinematics provides hardened biomechanical joint angle derivations
// for the AthleteMind AI platform using 2D planar trigonometry.
package main

import (
	"fmt"
	"math"
)

// Landmark represents a normalized 2D/3D skeletal keypoint.
type Landmark struct {
	X          float64
	Y          float64
	Z          float64
	Visibility float64 // Confidence score in [0.0, 1.0]
}

// CalculateAngle derives the interior planar joint angle between 3 points:
// A (proximal) -> B (vertex) -> C (distal) with branch-cut wrap normalization.
//
// Formula:
//   Δθ = |atan2(Cy - By, Cx - Bx) - atan2(Ay - By, Ax - Bx)|
//   if Δθ > π => Δθ = 2π - Δθ
//   θ_deg = Δθ * (180 / π)
func CalculateAngle(a, b, c Landmark, minConfidence float64) float64 {
	// Visibility & Confidence Gating
	if a.Visibility < minConfidence || b.Visibility < minConfidence || c.Visibility < minConfidence {
		return 0.0
	}

	v1x := a.X - b.X
	v1y := a.Y - b.Y
	v2x := c.X - b.X
	v2y := c.Y - b.Y

	// Prevent NaN on overlapping coordinates (zero length vectors)
	if (v1x == 0.0 && v1y == 0.0) || (v2x == 0.0 && v2y == 0.0) {
		return 0.0
	}

	// Calculate difference across branch cut
	angleA := math.Atan2(v1y, v1x)
	angleC := math.Atan2(v2y, v2x)

	deltaTheta := math.Abs(angleC - angleA)

	// Normalize radian difference prior to degree conversion
	if deltaTheta > math.Pi {
		deltaTheta = 2.0*math.Pi - deltaTheta
	}

	angleDeg := deltaTheta * (180.0 / math.Pi)

	if math.IsNaN(angleDeg) {
		return 0.0
	}

	return math.Round(angleDeg*10) / 10
}

// GetKneeAngle computes Knee angle: Hip (23/24) -> Knee (25/26) -> Ankle (27/28)
func GetKneeAngle(hip, knee, ankle Landmark, minConfidence float64) float64 {
	return CalculateAngle(hip, knee, ankle, minConfidence)
}

// GetElbowAngle computes Elbow angle: Shoulder (11/12) -> Elbow (13/14) -> Wrist (15/16)
func GetElbowAngle(shoulder, elbow, wrist Landmark, minConfidence float64) float64 {
	return CalculateAngle(shoulder, elbow, wrist, minConfidence)
}

// GetHipAngle computes Hip angle: Shoulder (11/12) -> Hip (23/24) -> Knee (25/26)
func GetHipAngle(shoulder, hip, knee Landmark, minConfidence float64) float64 {
	return CalculateAngle(shoulder, hip, knee, minConfidence)
}

func main() {
	// Unit verification test case: 90 degree angle
	hip := Landmark{X: 0.5, Y: 0.2, Visibility: 0.99}
	knee := Landmark{X: 0.5, Y: 0.5, Visibility: 0.99}
	ankle := Landmark{X: 0.8, Y: 0.5, Visibility: 0.99}

	angle := GetKneeAngle(hip, knee, ankle, 0.5)
	fmt.Printf("Computed Knee Angle: %.1f° (Expected: 90.0°)\n", angle)

	// Straight line test case: 180 degrees
	p1 := Landmark{X: 0.5, Y: 0.8, Visibility: 0.99}
	vertex := Landmark{X: 0.5, Y: 0.5, Visibility: 0.99}
	p2 := Landmark{X: 0.5, Y: 0.2, Visibility: 0.99}

	straight := CalculateAngle(p1, vertex, p2, 0.5)
	fmt.Printf("Straight Line Angle: %.1f° (Expected: 180.0°)\n", straight)
}
