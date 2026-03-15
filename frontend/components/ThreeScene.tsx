"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import FloatingObject from "./FloatingObject";

/**
 * Three.js canvas wrapper for the hero section.
 * Renders a wireframe icosahedron with ambient lighting.
 * Lazy-loaded via Suspense for performance.
 */
export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Subtle ambient fill */}
          <ambientLight intensity={0.3} />
          {/* Directional for edge highlights */}
          <directionalLight position={[5, 5, 5]} intensity={0.2} />

          <FloatingObject />
        </Suspense>
      </Canvas>
    </div>
  );
}
