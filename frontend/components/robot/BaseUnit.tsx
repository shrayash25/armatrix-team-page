"use client";

/**
 * Base control unit – a dark box that anchors the robotic arm.
 * Matches the reference image's rectangular control box design.
 */
export default function BaseUnit() {
  return (
    <group position={[0, -0.15, 0]}>
      {/* Main box – wider and flatter like the reference */}
      <mesh>
        <boxGeometry args={[0.6, 0.28, 0.4]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      {/* Edge bevel detail */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.58, 0.02, 0.38]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Connection port (where arm exits) */}
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.05, 20]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Subtle wireframe outline */}
      <mesh>
        <boxGeometry args={[0.604, 0.284, 0.404]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.03}
        />
      </mesh>
    </group>
  );
}
