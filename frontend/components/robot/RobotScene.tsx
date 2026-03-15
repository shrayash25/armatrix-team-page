"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import SnakeArm from "./SnakeArm";

/**
 * Three.js scene for the horizontal robot arm hero.
 * Wider FOV and slightly pulled-back camera to see the full extended arm.
 */
export default function RobotScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.0} />
          {/* Primary light */}
          <directionalLight position={[3, 3, 3]} intensity={2.0} />
          {/* Rim light */}
          <directionalLight position={[-3, 2, -3]} intensity={1.0} />

          <SnakeArm />
        </Suspense>
      </Canvas>
    </div>
  );
}
