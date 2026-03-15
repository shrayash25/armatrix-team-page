"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Segment from "./Segment";
import BaseUnit from "./BaseUnit";

const SEGMENT_COUNT = 18;
const SEGMENT_HEIGHT = 0.45; // longer segments for more reach

/**
 * Procedural snake robotic arm – horizontal from left, 3D cursor following.
 *
 * The arm's HEAD/TIP follows the cursor position.
 * Both pitch (up/down) and yaw (depth) respond to mouse.
 * Extended to ~75% of viewport width and allowed to go off-screen.
 */
export default function SnakeArm() {
  const { pointer } = useThree();

  const jointRefs = useRef<(THREE.Group | null)[]>([]);

  // Current smooth rotation state per joint
  const rotations = useRef(
    Array.from({ length: SEGMENT_COUNT }, () => ({ x: 0, z: 0 }))
  );

  const lastPointer = useRef({ x: 0, y: 0 });
  const idleTime = useRef(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Idle detection
    const dx = Math.abs(pointer.x - lastPointer.current.x);
    const dy = Math.abs(pointer.y - lastPointer.current.y);
    const isMoving = dx + dy > 0.002;

    if (isMoving) {
      idleTime.current = 0;
      lastPointer.current = { x: pointer.x, y: pointer.y };
    } else {
      idleTime.current += 1 / 60;
    }

    // ── Target direction from cursor ──
    // pointer.y > 0 = cursor is high.
    // Normalized and scaled cursor mapping:
    const targetZ = pointer.y * 0.5;     // mouse Y -> screen vertical range

    const maxAngleY = 0.5;

    // Clamped target value (2D only - no depth)
    const clampedTargetZ = THREE.MathUtils.clamp(targetZ, -maxAngleY, maxAngleY);

    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const joint = jointRefs.current[i];
      if (!joint) continue;

      const rot = rotations.current[i];

      let segTargetZ: number;

      if (i === 0) {
        segTargetZ = clampedTargetZ * 0.25;
      } else {
        const prev = rotations.current[i - 1];
        segTargetZ = prev.z * 0.9 + clampedTargetZ * 0.14;
      }

      // ── Per-segment rotation limits [-0.35, 0.35] ──
      const segmentLimit = 0.35; 
      segTargetZ = THREE.MathUtils.clamp(segTargetZ, -segmentLimit, segmentLimit);

      // Idle micro-motion (2D only)
      const idleFactor = Math.min(idleTime.current * 0.4, 1.0);
      const idleZ = Math.sin(time * 0.6 + i * 0.55) * 0.02 * idleFactor;

      // Fast lerp for quick response
      const lerpSpeed = 0.1 - i * 0.003;
      rot.z = THREE.MathUtils.lerp(rot.z, segTargetZ + idleZ, lerpSpeed);
      rot.x = THREE.MathUtils.lerp(rot.x, 0, lerpSpeed); // Keep X at 0

      joint.rotation.z = rot.z;
      joint.rotation.x = rot.x; // Actually zero
    }
  });

  return (
    // Base pushed further left to allow 75% screen coverage
    <group position={[-5.5, -0.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
      <BaseUnit />
      {buildChain(0, jointRefs)}
    </group>
  );
}

/**
 * Recursively build nested segment groups.
 */
function buildChain(
  index: number,
  jointRefs: React.MutableRefObject<(THREE.Group | null)[]>
): React.ReactNode {
  if (index >= SEGMENT_COUNT) return null;

  return (
    <group
      position={[0, index === 0 ? 0.2 : SEGMENT_HEIGHT, 0]}
      ref={(el) => {
        jointRefs.current[index] = el;
      }}
    >
      <Segment index={index} totalSegments={SEGMENT_COUNT} />
      {buildChain(index + 1, jointRefs)}
    </group>
  );
}
