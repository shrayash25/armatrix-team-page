"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Segment from "./Segment";
import BaseUnit from "./BaseUnit";

const SEGMENT_COUNT = 10;
const SEGMENT_HEIGHT = 0.34; // hingeLength + bodyLength per segment

/**
 * Procedural snake robotic arm – horizontal, 2D screen-plane motion.
 *
 * The arm extends from the LEFT side of the screen toward the RIGHT.
 * All bending happens in the screen plane (Z rotation only) –
 * no depth (3D) rotation.
 */
export default function SnakeArm() {
  const { pointer } = useThree();

  const jointRefs = useRef<(THREE.Group | null)[]>([]);

  // Current smooth rotation state per joint (Z-axis only for 2D)
  const rotations = useRef(
    Array.from({ length: SEGMENT_COUNT }, () => 0)
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

    // ── Target: cursor Y maps to arm bend (up/down in screen plane) ──
    // pointer.y ranges roughly -1 to 1.  Positive = cursor is high = arm bends up.
    // We use a strong multiplier so the tip clearly follows.
    const targetZ = -pointer.y * 0.5;

    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const joint = jointRefs.current[i];
      if (!joint) continue;

      let segTarget: number;

      if (i === 0) {
        segTarget = targetZ * 0.35;
      } else {
        // Cascading: carry most of parent + add own contribution
        const prev = rotations.current[i - 1];
        segTarget = prev * 0.92 + targetZ * 0.15;
      }

      // Clamp per-segment angle
      const maxAngle = 0.28;
      segTarget = THREE.MathUtils.clamp(segTarget, -maxAngle, maxAngle);

      // Idle micro-motion
      const idleFactor = Math.min(idleTime.current * 0.4, 1.0);
      const idle = Math.sin(time * 0.6 + i * 0.55) * 0.03 * idleFactor;

      // Smooth lerp
      const lerpSpeed = 0.06 - i * 0.002;
      rotations.current[i] = THREE.MathUtils.lerp(
        rotations.current[i],
        segTarget + idle,
        lerpSpeed
      );

      // Apply ONLY Z rotation (2D screen plane bending)
      joint.rotation.z = rotations.current[i];
      joint.rotation.x = 0;
    }
  });

  return (
    // Position base on far left, rotated -90° so the Y-chain goes rightward
    <group position={[-3.8, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
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
