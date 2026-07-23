import { Billboard, Float, Html, RoundedBox } from '@react-three/drei';

export function FloatingUIPanel({ position, title='TEMPORAL CACHE', color='#46cfff', fields=[] }) {
  return <Float speed={1.05} rotationIntensity={.035} floatIntensity={.11}>
    <Billboard position={position} scale={.62} follow lockX={false} lockY={false} lockZ={false}>
      <RoundedBox args={[2.9,1.55,.09]} radius={.16} smoothness={7} castShadow>
        <meshPhysicalMaterial color="#173342" transparent opacity={.68} roughness={.12} metalness={.18} transmission={.18} thickness={.18} emissive={color} emissiveIntensity={.045}/>
      </RoundedBox>
      <RoundedBox position={[0,0,.051]} args={[2.82,1.47,.012]} radius={.14} smoothness={6}>
        <meshBasicMaterial color="#071824" transparent opacity={.62}/>
      </RoundedBox>
      <Html transform position={[0,0,.07]} distanceFactor={7.5}><div className="holo-panel cache-card">
        <div className="holo-head"><i/><strong>{title}</strong><em>LIVE</em></div>
        <div className="holo-fields">{fields.map((field,i)=><div className="holo-field" key={field.label}><span>{field.label}</span><div><i style={{width:`${field.value}%`,animationDelay:`${i*.18}s`}}/></div><b>{field.display}</b></div>)}</div>
        <div className="scanline"/>
      </div></Html>
      <pointLight color={color} intensity={2.4} distance={3.5}/>
    </Billboard>
  </Float>;
}
