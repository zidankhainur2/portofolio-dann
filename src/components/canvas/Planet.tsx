// shortcut: low-poly geometry stands in for the planet GLB until final models are supplied.
export function Planet() {
  return (
    <>
      <mesh><sphereGeometry args={[1, 48, 32]} /><meshStandardMaterial color="#847091" roughness={0.9} metalness={0.05} /></mesh>
      <mesh scale={1.004}><sphereGeometry args={[1, 16, 10]} /><meshBasicMaterial color="#dcc6e2" wireframe transparent opacity={0.09} /></mesh>
      <mesh rotation={[1.2, 0.4, 0.2]}><torusGeometry args={[1.12, 0.012, 6, 64]} /><meshStandardMaterial color="#c5b6cf" roughness={0.7} /></mesh>
    </>
  );
}
