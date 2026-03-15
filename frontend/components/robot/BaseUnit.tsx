"use client";

/**
 * Base control unit – a dark box that anchors the robotic arm.
 */
export default function BaseUnit() {
  return (
    <group position={[0, -0.25, 0]}>
      {/* Main box */}
      <mesh>
        <boxGeometry args={[0.5, 0.3, 0.35]} />
        <meshStandardMaterial
          color="#111111"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Top plate (connection point) */}
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.04, 24]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Subtle wireframe outline */}
      <mesh>
        <boxGeometry args={[0.502, 0.302, 0.352]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  );
}
