"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A wireframe icosahedron that rotates slowly and
 * subtly reacts to mouse position for parallax depth.
 */
export default function FloatingObject() {
  const meshRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  // Create wireframe edges geometry once
  const edgesGeometry = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(2.2, 1);
    return new THREE.EdgesGeometry(ico);
  }, []);

  // Secondary smaller inner shape
  const innerEdges = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.2, 0);
    return new THREE.EdgesGeometry(ico);
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Slow continuous rotation
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.08;

    // Subtle mouse-reactive tilt
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      pointer.x * 0.15,
      0.05
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      pointer.y * 0.3,
      0.05
    );
  });

  return (
    <group ref={meshRef}>
      {/* Outer wireframe */}
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </lineSegments>

      {/* Inner wireframe – counter-rotated for depth */}
      <group rotation={[0.5, 0.5, 0]}>
        <lineSegments geometry={innerEdges}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </lineSegments>
      </group>

      {/* Central glow point */}
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
