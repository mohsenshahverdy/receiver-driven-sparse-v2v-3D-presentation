import { Billboard, Html, RoundedBox } from '@react-three/drei';

export function Module({position,title,lines,color='#36bfff'}) {
  return <Billboard position={position} scale={.46} follow lockX={false} lockY={false} lockZ={false}>
    <RoundedBox args={[2.75,1.55,.12]} radius={.18} smoothness={8} castShadow>
      <meshPhysicalMaterial color="#152936" transparent opacity={.72} roughness={.18} metalness={.14} transmission={.08} thickness={.16} emissive={color} emissiveIntensity={.05}/>
    </RoundedBox>
    <RoundedBox position={[0,0,.071]} args={[2.62,1.42,.012]} radius={.15} smoothness={6}>
      <meshBasicMaterial color="#07151d" transparent opacity={.54}/>
    </RoundedBox>
    <Html transform position={[0,0,.09]} distanceFactor={8}>
      <div className="module module-card"><strong>{title}</strong>{lines.map(line=><span key={line}>{line}</span>)}</div>
    </Html>
    <pointLight color={color} intensity={3.6} distance={4}/>
  </Billboard>;
}
