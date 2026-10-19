export function ExplorationCapsule() {
  return (
    <>
      <mesh><cylinderGeometry args={[0.5, 0.5, 1.6, 24]} /><meshStandardMaterial color="#d7d2bf" roughness={0.55} metalness={0.3} /></mesh>
      <mesh position={[0, 1, 0]}><coneGeometry args={[0.5, 0.6, 24]} /><meshStandardMaterial color="#a598b9" roughness={0.6} metalness={0.2} /></mesh>
      <mesh position={[0, -0.95, 0]}><cylinderGeometry args={[0.4, 0.28, 0.3, 16]} /><meshStandardMaterial color="#384351" roughness={0.55} metalness={0.5} /></mesh>
      <mesh position={[0, 0.2, 0.51]}><circleGeometry args={[0.24, 24]} /><meshStandardMaterial color="#163f54" emissive="#82c7d0" emissiveIntensity={0.25} roughness={0.3} /></mesh>
      <mesh position={[0, 0.2, 0.51]}><torusGeometry args={[0.28, 0.04, 8, 24]} /><meshStandardMaterial color="#8c8376" roughness={0.6} metalness={0.5} /></mesh>
    </>
  );
}
