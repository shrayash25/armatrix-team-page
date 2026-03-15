"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Segment from "./Segment";
import BaseUnit from "./BaseUnit";

const SEGMENT_COUNT = 10;
const SEGMENT_HEIGHT = 0.34; // hingeLength + bodyLength per segment

/**
 * Procedural snake robotic arm – Armatrix style.
 *
 * Key changes from v1:
 *   - Much freer joints (higher rotation multipliers)
 *   - The tip actually reaches toward the cursor direction
 *   - Hinge-joint visual style (dark bands between cylinders)
 *   - Smooth wave propagation with stronger articulation
 */
export default function SnakeArm() {
  const { pointer } = useThree();

  // Refs for each joint group
  const jointRefs = useRef<(THREE.Group | null)[]>([]);

  // Current smooth rotation state per joint
  const rotations = useRef(
    Array.from({ length: SEGMENT_COUNT }, () => ({ x: 0, z: 0 }))
  );

  // Pointer tracking
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

    // ── Target: map mouse position to arm direction ──
    // Much stronger multipliers for actual cursor-following
    const targetX = pointer.y * 0.45;  // mouse Y → pitch (lean forward/back)
    const targetZ = -pointer.x * 0.5;  // mouse X → yaw (lean left/right)

    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const joint = jointRefs.current[i];
      if (!joint) continue;

      const rot = rotations.current[i];

      // ── Cascading target: accumulates down the chain ──
      // Each segment adds its own contribution toward the target,
      // creating a smooth curve that actually reaches toward the cursor.
      let segTargetX: number;
      let segTargetZ: number;

      if (i === 0) {
        // Base segment: moderate turn
        segTargetX = targetX * 0.35;
        segTargetZ = targetZ * 0.35;
      } else {
        // Each subsequent segment adds MORE rotation in the same direction,
        // so the tip actually points toward cursor.
        const prev = rotations.current[i - 1];
        const amplify = 0.92; // carry most of parent's rotation
        const addOwn = 0.15;  // plus add a fraction of the original target
        segTargetX = prev.x * amplify + targetX * addOwn;
        segTargetZ = prev.z * amplify + targetZ * addOwn;
      }

      // ── Clamp to prevent extreme bending ──
      const maxAngle = 0.28;
      segTargetX = THREE.MathUtils.clamp(segTargetX, -maxAngle, maxAngle);
      segTargetZ = THREE.MathUtils.clamp(segTargetZ, -maxAngle, maxAngle);

      // ── Idle micro-motion (subtle breathing when cursor is still) ──
      const idleFactor = Math.min(idleTime.current * 0.4, 1.0);
      const idleX = Math.sin(time * 0.6 + i * 0.55) * 0.03 * idleFactor;
      const idleZ = Math.cos(time * 0.45 + i * 0.7) * 0.025 * idleFactor;

      // ── Smooth interpolation (mechanical feel) ──
      // Slightly faster lerp for responsive tracking
      const lerpSpeed = 0.06 - i * 0.002; // base joints react faster
      rot.x = THREE.MathUtils.lerp(rot.x, segTargetX + idleX, lerpSpeed);
      rot.z = THREE.MathUtils.lerp(rot.z, segTargetZ + idleZ, lerpSpeed);

      joint.rotation.x = rot.x;
      joint.rotation.z = rot.z;
    }
  });

  return (
    <group position={[0, -1.6, 0]}>
      <BaseUnit />

      {/* Build the kinematic chain: nested groups so rotation cascades */}
      {buildChain(0, jointRefs)}
    </group>
  );
}

/**
 * Recursively build nested segment groups.
 * Each segment is wrapped in a group that acts as the joint pivot point.
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
