import { Html, RoundedBox } from '@react-three/drei';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { loadSkylineGeometry } from '../../utils/legacyCarGeometry';

const WHEELS=[[7,3,-13.2],[-7,3,-13.2],[7,3,13.5],[-7,3,13.5]];

function DetailedCar({geometry,color}) {
  return <group scale={.074} rotation-y={Math.PI} position-y={.02}>
    <mesh geometry={geometry.body} scale={10} receiveShadow><meshStandardMaterial color={color} metalness={.72} roughness={.24} side={THREE.DoubleSide}/></mesh>
    <mesh geometry={geometry.windows} scale={10}><meshPhysicalMaterial color="#183943" metalness={.45} roughness={.08} transparent opacity={.78} side={THREE.DoubleSide}/></mesh>
    <mesh geometry={geometry.interior} scale={10}><meshStandardMaterial color="#171d20" roughness={.72} side={THREE.DoubleSide}/></mesh>
    <mesh geometry={geometry.exhaust} scale={10}><meshStandardMaterial color="#30383b" metalness={.9} roughness={.28} side={THREE.DoubleSide}/></mesh>
    <mesh geometry={geometry['lights-front']} scale={10}><meshStandardMaterial color="#e8fbff" emissive="#bdefff" emissiveIntensity={1.1} side={THREE.DoubleSide}/></mesh>
    <mesh geometry={geometry['lights-back']} scale={10}><meshStandardMaterial color="#e8423b" emissive="#ef3730" emissiveIntensity={.9} side={THREE.DoubleSide}/></mesh>
    {WHEELS.map(([x,y,z],i)=><group key={i} position={[x,y,z]} rotation-z={i%2?Math.PI:0}><mesh geometry={geometry.tire} scale={10}><meshStandardMaterial color="#111314" roughness={.82} side={THREE.DoubleSide}/></mesh><mesh geometry={geometry.rim} scale={10}><meshStandardMaterial color="#aab1b3" metalness={.92} roughness={.2} side={THREE.DoubleSide}/></mesh></group>)}
  </group>;
}

export function Car({position,rotation=0,color='#777',ego,collaborator,label}) {
  const glow=ego?'#35b9ff':collaborator?'#f4c766':color;
  const [geometry,setGeometry]=useState(null);
  useEffect(()=>{let active=true;loadSkylineGeometry().then(value=>active&&setGeometry(value)).catch(console.error);return()=>{active=false}},[]);
  return <group position={position} rotation-y={rotation}>
    {geometry?<DetailedCar geometry={geometry} color={color}/>:<RoundedBox position-y={.48} args={[1.58,.56,3.15]} radius={.22}><meshStandardMaterial color={color}/></RoundedBox>}
    {(ego||collaborator)&&<><RoundedBox position-y={.58} args={[1.75,.85,3.35]} radius={.25}><meshBasicMaterial color={glow} wireframe transparent opacity={.6}/></RoundedBox><pointLight color={glow} intensity={8} distance={5}/></>}
    {label&&<Html position={[0,1.7,0]} center distanceFactor={13}><div className={`tag ${ego?'blue':'amber'}`}>{label}</div></Html>}
  </group>;
}
