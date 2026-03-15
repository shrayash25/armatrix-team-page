"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Segment from "./Segment";
import BaseUnit from "./BaseUnit";

const SEGMENT_COUNT = 18;
const SEGMENT_LENGTH = 0.45;
const FIRST_SEGMENT_OFFSET = 0.2; 

export default function SnakeArm() {
  const { viewport } = useThree();

  const baseGroupRef = useRef<THREE.Group>(null);
  const joints = useRef<(THREE.Group | null)[]>([]);
  
  const smoothedTarget = useRef(new THREE.Vector2(0, 0));
  
  // --- NEW: Idle State Tracking Refs ---
  const lastPointer = useRef(new THREE.Vector2(0, 0));
  const idleTimer = useRef(0);
  const isIdle = useRef(false);

  // 1. Setup mathematical segment lengths
  const lengths = useMemo(() => {
    const arr = new Array(SEGMENT_COUNT).fill(SEGMENT_LENGTH);
    arr[0] = FIRST_SEGMENT_OFFSET;
    return arr;
  }, []);

  const totalLength = useMemo(() => lengths.reduce((a, b) => a + b, 0), [lengths]);

  // 2. Setup virtual IK nodes
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

  useFrame((state, delta) => {
    if (!baseGroupRef.current || ikNodes.current.length === 0) return;

    const bx = state.viewport.width * 0.45;
    const by = state.viewport.height * 0.45;

    // --- NEW: Idle State Logic ---
    const currentPointer = new THREE.Vector2(state.pointer.x, state.pointer.y);
    
    // Check if mouse moved more than a tiny threshold
    if (currentPointer.distanceTo(lastPointer.current) > 0.001) {
      idleTimer.current = 0;
      isIdle.current = false;
      lastPointer.current.copy(currentPointer);
    } else {
      idleTimer.current += delta;
      if (idleTimer.current > 2) { // 2 seconds of no movement triggers idle
        isIdle.current = true;
      }
    }

    const rawTarget2D = new THREE.Vector2();

    if (isIdle.current) {
      // Generate a smooth wandering motion using elapsed time
      const t = state.clock.elapsedTime;
      // Creates an organic figure-8 breathing pattern bounded to 60% of the screen
      const idleX = Math.sin(t * 0.4) * (bx * 0.6);
      const idleY = Math.sin(t * 0.3) * Math.cos(t * 0.2) * (by * 0.6);
      rawTarget2D.set(idleX, idleY);
    } else {
      // Standard cursor tracking
      const targetX = state.pointer.x * state.viewport.width * 0.4;
      const targetY = state.pointer.y * state.viewport.height * 0.4;
      const tx = THREE.MathUtils.clamp(targetX, -bx, bx);
      const ty = THREE.MathUtils.clamp(targetY, -by, by);
      rawTarget2D.set(tx, ty);
    }

    // Lerp the target position (slower lerp during idle for a calmer resting state)
    const trackingSpeed = isIdle.current ? 0.015 : 0.04;
    smoothedTarget.current.lerp(rawTarget2D, trackingSpeed); 

    const worldTarget = new THREE.Vector3(
      smoothedTarget.current.x, 
      smoothedTarget.current.y, 
      0
    );

    const localTarget3D = baseGroupRef.current.worldToLocal(worldTarget.clone());
    const target2D = new THREE.Vector2(localTarget3D.x, localTarget3D.y);
    
    const nodes = ikNodes.current;

    // --- FABRIK ALGORITHM ---
    const dist = nodes[0].distanceTo(target2D);
    
    if (dist >= totalLength) {
      const dir = new THREE.Vector2().subVectors(target2D, nodes[0]).normalize();
      for (let i = 0; i < SEGMENT_COUNT; i++) {
        nodes[i + 1].copy(nodes[i]).add(dir.clone().multiplyScalar(lengths[i]));
      }
    } else {
      const iterations = 5; 
      for (let iter = 0; iter < iterations; iter++) {
        nodes[SEGMENT_COUNT].copy(target2D);
        for (let i = SEGMENT_COUNT - 1; i >= 0; i--) {
          const dir = new THREE.Vector2().subVectors(nodes[i], nodes[i + 1]).normalize();
          nodes[i].copy(nodes[i + 1]).add(dir.multiplyScalar(lengths[i]));
        }

        nodes[0].set(0, 0); 
        for (let i = 0; i < SEGMENT_COUNT; i++) {
          const dir = new THREE.Vector2().subVectors(nodes[i + 1], nodes[i]).normalize();
          nodes[i + 1].copy(nodes[i]).add(dir.multiplyScalar(lengths[i]));
        }
      }
    }

    // --- APPLY MATH TO 3D HIERARCHY ---
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const dx = nodes[i + 1].x - nodes[i].x;
      const dy = nodes[i + 1].y - nodes[i].y;
      const segmentAbsoluteAngle = Math.atan2(dy, dx); 

      let targetRotation = 0;

      if (i === 0) {
        targetRotation = segmentAbsoluteAngle - Math.PI / 2;
      } else {
        const prevDx = nodes[i].x - nodes[i - 1].x;
        const prevDy = nodes[i].y - nodes[i - 1].y;
        const prevAbsoluteAngle = Math.atan2(prevDy, prevDx);

        let diff = segmentAbsoluteAngle - prevAbsoluteAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        // --- NEW: Mechanical hinge limits (~60 degrees) ---
        const maxBend = Math.PI / 3; 
        targetRotation = THREE.MathUtils.clamp(diff, -maxBend, maxBend);
      }

      const joint = joints.current[i];
      if (joint) {
        joint.rotation.z = THREE.MathUtils.lerp(
          joint.rotation.z,
          targetRotation,
          0.12 
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