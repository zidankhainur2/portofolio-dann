import { RoundedBox } from "@react-three/drei";

export function ProjectShowcase3D({ accent }: { accent: string }) {
  return (
    <>
      <RoundedBox args={[2.3, 1.5, 0.24]} radius={0.08} smoothness={3} bevelSegments={2}>
        <meshStandardMaterial color="#46566a" roughness={0.6} metalness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.03, 0.13]}><planeGeometry args={[2.06, 1.2]} /><meshBasicMaterial color="#101c30" /></mesh>
      <mesh position={[-0.66, 0.33, 0.14]}><planeGeometry args={[0.44, 0.12]} /><meshBasicMaterial color={accent} /></mesh>
      <mesh position={[-0.62, -0.17, 0.14]}><planeGeometry args={[0.3, 0.3]} /><meshBasicMaterial color={accent} /></mesh>
      <mesh position={[-0.15, -0.07, 0.14]}><planeGeometry args={[0.3, 0.5]} /><meshBasicMaterial color={accent} /></mesh>
      <mesh position={[0.32, 0.06, 0.14]}><planeGeometry args={[0.3, 0.76]} /><meshBasicMaterial color={accent} /></mesh>
      <mesh position={[0, -0.95, -0.05]}><cylinderGeometry args={[0.14, 0.2, 0.4, 12]} /><meshStandardMaterial color="#59616c" roughness={0.7} metalness={0.3} /></mesh>
      <mesh position={[0, -1.17, -0.05]}><boxGeometry args={[1.2, 0.08, 0.6]} /><meshStandardMaterial color="#46566a" roughness={0.7} metalness={0.3} /></mesh>
    </>
  );
}
