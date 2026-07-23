import { RoundedBox } from '@react-three/drei';

export function StreetLight({ position, rotation = 0 }) {
  return <group position={position} rotation-y={rotation}>
    <mesh position-y={.08} castShadow>
      <cylinderGeometry args={[.21, .28, .14, 16]} />
      <meshStandardMaterial color="#46585d" metalness={.68} roughness={.34} />
    </mesh>
    <mesh position={[0, 1.25, 0]} castShadow>
      <cylinderGeometry args={[.07, .1, 2.35, 14]} />
      <meshStandardMaterial color="#34454a" metalness={.82} roughness={.24} />
    </mesh>
    <mesh position={[0, 2.42, 0]} rotation-z={-.06}>
      <cylinderGeometry args={[.05, .05, 1.1, 12]} />
      <meshStandardMaterial color="#34454a" metalness={.82} roughness={.2} />
    </mesh>
    <mesh position={[.5, 2.95, 0]} rotation-z={Math.PI / 2} castShadow>
      <cylinderGeometry args={[.04, .05, 1.06, 12]} />
      <meshStandardMaterial color="#34454a" metalness={.82} roughness={.2} />
    </mesh>
    <RoundedBox position={[.98, 2.91, 0]} args={[.7, .17, .34]} radius={.07} smoothness={4} castShadow>
      <meshStandardMaterial color="#d8f5ef" emissive="#9be1d3" emissiveIntensity={.38} roughness={.24} />
    </RoundedBox>
    <mesh position={[.98, 2.82, 0]} castShadow>
      <boxGeometry args={[.44, .06, .18]} />
      <meshStandardMaterial color="#263338" metalness={.72} roughness={.18} />
    </mesh>
    <pointLight color="#d6fff7" intensity={.55} distance={6} />
  </group>;
}

export function Tree({ position, scale = 1 }) {
  return <group position={position} scale={scale}>
    <mesh castShadow position={[0, .68, 0]}>
      <cylinderGeometry args={[.14, .2, 1.15, 10]} />
      <meshStandardMaterial color="#6b4a36" roughness={.98} />
    </mesh>
    <mesh castShadow position={[0, 1.3, 0]} rotation-z={.12}>
      <cylinderGeometry args={[.08, .06, .7, 8]} />
      <meshStandardMaterial color="#6b4a36" roughness={.98} />
    </mesh>
    {[
      [0, 2.05, .76, '#406f54'],
      [.55, 1.82, .55, '#4a805f'],
      [-.44, 1.74, .5, '#35684d'],
      [.1, 2.42, .45, '#5a926e'],
      [.16, 1.55, .38, '#44775a'],
    ].map(([x, y, s, c], i) => <mesh key={i} castShadow position={[x, y, i % 2 ? .12 : -.08]}>
      <icosahedronGeometry args={[s, 1]} />
      <meshStandardMaterial color={c} roughness={.96} />
    </mesh>)}
    <mesh castShadow position={[0, 1.68, 0]}>
      <sphereGeometry args={[.72, 18, 14]} />
      <meshStandardMaterial color="#5f906e" roughness={.92} />
    </mesh>
  </group>;
}

