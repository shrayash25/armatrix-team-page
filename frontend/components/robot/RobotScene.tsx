"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import SnakeArm from "./SnakeArm";

/**
 * Three.js scene for the robot arm hero.
 * Camera positioned to see the full arm with slight elevation.
 */
export default function RobotScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 5, 4]} intensity={0.6} />
          <directionalLight position={[-2, 3, -3]} intensity={0.2} />

          {/* Robot */}
          <SnakeArm />
        </Suspense>
      </Canvas>
    </div>
  );
}
