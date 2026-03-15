"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Segment from "./Segment";
import BaseUnit from "./BaseUnit";

const SEGMENT_COUNT = 8;
const SEGMENT_LENGTH = 0.35;

/**
 * Procedural snake robotic arm.
 *
 * - 8 segments chained together via nested groups
 * - Each segment rotates toward the cursor with propagation delay
 * - Idle sine-wave micro-motion when cursor is still
 * - Cursor tracking with intentional offset (never reaches cursor)
 */
export default function SnakeArm() {
  const { pointer } = useThree();

  // One ref per segment joint (the group that rotates)
  const jointRefs = useRef<(THREE.Group | null)[]>([]);

  // Store current rotations for smooth interpolation
  const rotations = useRef(
    Array.from({ length: SEGMENT_COUNT }, () => ({ x: 0, y: 0 }))
  );

  // Track pointer velocity for idle detection
  const lastPointer = useRef({ x: 0, y: 0 });
  const idleTime = useRef(0);

  // Memoize the segment components
  const segments = useMemo(() => {
    const build = (index: number): React.ReactNode => {
      if (index >= SEGMENT_COUNT) {
        // End effector – rounded tip
        return (
          <group position={[0, SEGMENT_LENGTH, 0]}>
            <mesh>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      }

      return (
        <group
          key={index}
          position={index === 0 ? [0, 0.05, 0] : [0, SEGMENT_LENGTH, 0]}
          ref={(el) => {
            jointRefs.current[index] = el;
          }}
        >
          <Segment index={index} />
          {build(index + 1)}
        </group>
      );
    };

    return build(0);
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Detect if pointer is idle
    const dx = pointer.x - lastPointer.current.x;
    const dy = pointer.y - lastPointer.current.y;
    const pointerMoving = Math.abs(dx) + Math.abs(dy) > 0.001;

    if (pointerMoving) {
      idleTime.current = 0;
      lastPointer.current = { x: pointer.x, y: pointer.y };
    } else {
      idleTime.current += 1 / 60;
    }

    // Target direction from cursor (with intentional offset – never fully reaches)
    const targetX = pointer.y * 0.6; // map Y mouse → X rotation (pitch)
    const targetY = pointer.x * 0.7; // map X mouse → Y rotation (yaw)

    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const joint = jointRefs.current[i];
      if (!joint) continue;

      const rot = rotations.current[i];

      // Propagation: each segment follows the previous one with decay
      let segTargetX: number;
      let segTargetY: number;

      if (i === 0) {
        segTargetX = targetX * 0.3;
        segTargetY = targetY * 0.3;
      } else {
        const prev = rotations.current[i - 1];
        segTargetX = prev.x * 0.78;
        segTargetY = prev.y * 0.78;
      }

      // Idle micro-motion (sine wave along chain)
      const idleFactor = Math.min(idleTime.current * 0.5, 1);
      const idleX = Math.sin(time * 0.8 + i * 0.5) * 0.025 * idleFactor;
      const idleY = Math.sin(time * 0.6 + i * 0.7) * 0.02 * idleFactor;

      // Smooth mechanical interpolation
      const lerpSpeed = 0.04 + i * 0.005;
      rot.x = THREE.MathUtils.lerp(rot.x, segTargetX + idleX, lerpSpeed);
      rot.y = THREE.MathUtils.lerp(rot.y, segTargetY + idleY, lerpSpeed);

      joint.rotation.x = rot.x;
      joint.rotation.z = rot.y;
    }
  });

  return (
    <group position={[0, -1.2, 0]}>
      <BaseUnit />
      {segments}
    </group>
  );
}
