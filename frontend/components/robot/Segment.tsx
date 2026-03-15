"use client";

import * as THREE from "three";

interface SegmentProps {
  index: number;
  totalSegments: number;
}

/**
 * A single robotic arm segment matching the Armatrix snake arm design:
 *   [dark hinge band] → [main cylinder body] → (next segment)
 *
 * The hinge band is a short, slightly narrower dark cylinder that
 * connects between the main body cylinders.
 */
export default function Segment({ index, totalSegments }: SegmentProps) {
  // Slight taper along the arm (thicker at base, thinner at tip)
  const taper = 1 - index * 0.04;
  const bodyRadius = 0.07 * taper;
  const bodyLength = 0.28;
  const hingeRadius = bodyRadius * 0.75;
  const hingeLength = 0.06;

  // End effector: hollow cylinder tip on the last segment
  const isLast = index === totalSegments - 1;

  return (
    <group>
      {/* ── Hinge band (dark connector joint) ── */}
      <mesh position={[0, hingeLength / 2, 0]}>
        <cylinderGeometry args={[hingeRadius, hingeRadius, hingeLength, 16]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>

      {/* ── Main cylinder body ── */}
      <mesh position={[0, hingeLength + bodyLength / 2, 0]}>
        <cylinderGeometry args={[bodyRadius, bodyRadius, bodyLength, 20]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* ── End effector (only on last segment) ── */}
      {isLast && (
        <group position={[0, hingeLength + bodyLength + 0.08, 0]}>
          {/* Hollow tube tip */}
          <mesh>
            <cylinderGeometry args={[bodyRadius * 0.9, bodyRadius * 1.1, 0.14, 20]} />
            <meshStandardMaterial
              color="#999999"
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
          {/* Inner bore */}
          <mesh>
            <cylinderGeometry args={[bodyRadius * 0.5, bodyRadius * 0.5, 0.15, 12]} />
            <meshStandardMaterial
              color="#111111"
              metalness={0.3}
              roughness={0.8}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
