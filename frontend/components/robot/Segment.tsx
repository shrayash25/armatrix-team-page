"use client";

import { useRef } from "react";
import * as THREE from "three";

interface SegmentProps {
  index: number;
  radius?: number;
  length?: number;
}

/**
 * A single robotic arm segment: cylinder body + joint connector.
 * Oriented along the Y-axis so segments chain vertically.
 */
export default function Segment({
  index,
  radius = 0.08,
  length = 0.35,
}: SegmentProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Alternate slight radius variation for visual interest
  const r = radius * (1 - index * 0.02);

  return (
    <group ref={groupRef}>
      {/* Joint connector (small ring at the base of this segment) */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[r + 0.015, 0.012, 8, 24]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Cylinder body */}
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[r, r, length, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Subtle wireframe overlay for technical feel */}
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[r + 0.001, r + 0.001, length, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.04}
        />
      </mesh>
    </group>
  );
}
