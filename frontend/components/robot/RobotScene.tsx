"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import SnakeArm from "./SnakeArm";

/**
 * Three.js scene for the horizontal robot arm hero.
 * Camera centered with wider FOV to see the full arm extending from left.
 */
export default function RobotScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 5, 4]} intensity={0.6} />
          <directionalLight position={[-2, 3, -3]} intensity={0.2} />

          <SnakeArm />
        </Suspense>
      </Canvas>
    </div>
  );
}
