# ATHLETEMIND AI — Biomechanical Wellness & Rehabilitation

ATHLETEMIND AI is a client-side computer vision application for real-time biomechanical analysis, postural assessment, and kinematic exercise tracking.

---

## Key Capabilities

- **Real-Time Kinematic Analysis:** Computes multi-joint angles (elbows, knees, hips, shoulder balance) at 60 FPS using MediaPipe BlazePose (33 body landmarks).
- **Postural Quality Scoring:** Evaluates postural symmetry and form in real time using geometric angular thresholds.
- **FSM Exercise Rep Counter:** Finite State Machine (FSM) tracking for repetition phases and depth analysis (Squats, Arm Raises, Lunges).
- **100% Client-Side Privacy:** All computer vision inference executes entirely on-device via WebAssembly/WebGL. No video feeds or images are ever transmitted to external servers.
- **Biomechanical Telemetry & Insights:** Interactive recovery score, mobility indices, joint angle telemetry, and session history tracking.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Custom Glassmorphic Aesthetics
- **Computer Vision:** `@mediapipe/tasks-vision`, `@mediapipe/pose`, `@mediapipe/camera_utils`
- **Charts & Visuals:** Recharts, Canvas Confetti, Lucide React
- **Routing:** React Router v6

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) (or the port indicated in the terminal).

### 3. Production Build
```bash
npm run build
```

---

## Disclaimer
ATHLETEMIND AI provides wellness and biomechanical insights only and does not provide medical diagnosis or treatment advice.
