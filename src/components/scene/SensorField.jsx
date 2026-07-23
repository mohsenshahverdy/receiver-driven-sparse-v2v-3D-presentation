import * as THREE from 'three';

export function SensorField({position,rotation=0,color='#39baff',radius=10,opacity=.13,visible=true}) {
  const shape=new THREE.Shape(); shape.moveTo(0,0); const angle=.68;
  for(let i=0;i<=24;i++){const t=-angle+(2*angle*i/24);shape.lineTo(Math.sin(t)*radius,Math.cos(t)*radius)} shape.lineTo(0,0);
  return <mesh visible={visible} position={position} rotation={[-Math.PI/2,0,rotation]}><shapeGeometry args={[shape]}/><meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide}/></mesh>;
}
