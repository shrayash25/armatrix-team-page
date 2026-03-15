"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Segment from "./Segment";
import BaseUnit from "./BaseUnit";

const SEGMENT_COUNT = 18;
const SEGMENT_LENGTH = 0.45;
const FIRST_SEGMENT_OFFSET = 0.2; // Based on your initial position offset

export default function SnakeArm() {
  const { pointer, viewport } = useThree();

  const baseGroupRef = useRef<THREE.Group>(null);
  const joints = useRef<(THREE.Group | null)[]>([]);
  
  // New ref to hold the smoothed target position
  const smoothedTarget = useRef(new THREE.Vector2(0, 0));

  // 1. Setup mathematical segment lengths
  const lengths = useMemo(() => {
    const arr = new Array(SEGMENT_COUNT).fill(SEGMENT_LENGTH);
    arr[0] = FIRST_SEGMENT_OFFSET;
    return arr;
  }, []);

  const totalLength = useMemo(() => lengths.reduce((a, b) => a + b, 0), [lengths]);

  // 2. Setup virtual IK nodes (mathematical points for FABRIK)
  const ikNodes = useRef<THREE.Vector2[]>([]);
  useEffect(() => {
    ikNodes.current = Array.from({ length: SEGMENT_COUNT + 1 }, () => new THREE.Vector2());
    let currentY = 0;
    ikNodes.current[0].set(0, 0);
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      currentY += lengths[i];
      ikNodes.current[i + 1].set(0, currentY);
    }
  }, [lengths]);

  useFrame((state) => {
    if (!baseGroupRef.current || ikNodes.current.length === 0) return;

    // Convert cursor → clamped world position
    const targetX = state.pointer.x * state.viewport.width * 0.4;
    const targetY = state.pointer.y * state.viewport.height * 0.4;

    const bx = state.viewport.width * 0.45;
    const by = state.viewport.height * 0.45;

    const tx = THREE.MathUtils.clamp(targetX, -bx, bx);
    const ty = THREE.MathUtils.clamp(targetY, -by, by);

    // Lerp the target position itself to simulate mechanical drag
    const rawTarget2D = new THREE.Vector2(tx, ty);
    
    // Adjust 0.04 to change how "heavy" the arm's tracking feels
    smoothedTarget.current.lerp(rawTarget2D, 0.04); 

    const worldTarget = new THREE.Vector3(
      smoothedTarget.current.x, 
      smoothedTarget.current.y, 
      0
    );

    // Convert world target to the local coordinate space of the base group
    const localTarget3D = baseGroupRef.current.worldToLocal(worldTarget.clone());
    const target2D = new THREE.Vector2(localTarget3D.x, localTarget3D.y);
    
    const nodes = ikNodes.current;

    // --- FABRIK ALGORITHM (Math Only) ---
    const dist = nodes[0].distanceTo(target2D);
    
    if (dist >= totalLength) {
      // Unreachable: Point all segments in a straight line toward target
      const dir = new THREE.Vector2().subVectors(target2D, nodes[0]).normalize();
      for (let i = 0; i < SEGMENT_COUNT; i++) {
        nodes[i + 1].copy(nodes[i]).add(dir.clone().multiplyScalar(lengths[i]));
      }
    } else {
      // Reachable: Iterative Forward/Backward reaching
      const iterations = 5; 
      for (let iter = 0; iter < iterations; iter++) {
        // Backward pass (from tip to base)
        nodes[SEGMENT_COUNT].copy(target2D);
        for (let i = SEGMENT_COUNT - 1; i >= 0; i--) {
          const dir = new THREE.Vector2().subVectors(nodes[i], nodes[i + 1]).normalize();
          nodes[i].copy(nodes[i + 1]).add(dir.multiplyScalar(lengths[i]));
        }

        // Forward pass (from base to tip)
        nodes[0].set(0, 0); // Base is permanently anchored
        for (let i = 0; i < SEGMENT_COUNT; i++) {
          const dir = new THREE.Vector2().subVectors(nodes[i + 1], nodes[i]).normalize();
          nodes[i + 1].copy(nodes[i]).add(dir.multiplyScalar(lengths[i]));
        }
      }
    }

    // --- APPLY MATH TO 3D HIERARCHY ---
    // In local space, the straight arm points UP (Y axis), which is Math.PI/2
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const dx = nodes[i + 1].x - nodes[i].x;
      const dy = nodes[i + 1].y - nodes[i].y;
      const segmentAbsoluteAngle = Math.atan2(dy, dx); 

      let targetRotation = 0;

      // Convert absolute world angles to relative parent-child angles
      if (i === 0) {
        targetRotation = segmentAbsoluteAngle - Math.PI / 2;
      } else {
        const prevDx = nodes[i].x - nodes[i - 1].x;
        const prevDy = nodes[i].y - nodes[i - 1].y;
        const prevAbsoluteAngle = Math.atan2(prevDy, prevDx);

        // Find the shortest rotation path to prevent 360-degree flipping
        let diff = segmentAbsoluteAngle - prevAbsoluteAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        targetRotation = diff;
      }

      // Smooth, mechanical lerp toward the calculated IK angle
      const joint = joints.current[i];
      if (joint) {
        joint.rotation.z = THREE.MathUtils.lerp(
          joint.rotation.z,
          targetRotation,
          0.12 // Adjust this value to make the robot feel heavier/lighter
        );
      }
    }
  });

  return (
    <group 
      ref={baseGroupRef}
      position={[-5.5, -0.2, 0]} 
      rotation={[0, 0, -Math.PI / 2]}
    >
      <BaseUnit />
      {buildChain(0, joints)}
    </group>
  );
}

function buildChain(
  index: number,
  joints: React.MutableRefObject<(THREE.Group | null)[]>
): React.ReactNode {
  if (index >= SEGMENT_COUNT) return null;

  return (
    <group
      position={[0, index === 0 ? FIRST_SEGMENT_OFFSET : SEGMENT_LENGTH, 0]}
      ref={(el) => {
        joints.current[index] = el;
      }}
    >
      <Segment index={index} totalSegments={SEGMENT_COUNT} />
      {buildChain(index + 1, joints)}
    </group>
  );
}