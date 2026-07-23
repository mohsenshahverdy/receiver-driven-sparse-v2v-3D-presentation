import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

function FallbackPedestrian({ color = '#4f7bb0' }) {
  return <group>
    <mesh castShadow position-y={1.44}>
      <sphereGeometry args={[.17, 14, 10]} />
      <meshStandardMaterial color="#ad745c" />
    </mesh>
    <mesh castShadow position={[0, 1.54, -.035]}>
      <sphereGeometry args={[.18, 12, 8, 0, Math.PI * 2, 0, Math.PI * .55]} />
      <meshStandardMaterial color="#2f2522" roughness={.82} />
    </mesh>
    <mesh castShadow position-y={.86}>
      <capsuleGeometry args={[.21, .62, 4, 9]} />
      <meshStandardMaterial color={color} roughness={.72} />
    </mesh>
    <mesh castShadow position={[.24, .88, .03]} rotation-z={-.32}>
      <capsuleGeometry args={[.045, .42, 4, 7]} />
      <meshStandardMaterial color="#ad745c" roughness={.76} />
    </mesh>
    <mesh castShadow position={[-.24, .88, -.02]} rotation-z={.28}>
      <capsuleGeometry args={[.045, .4, 4, 7]} />
      <meshStandardMaterial color="#ad745c" roughness={.76} />
    </mesh>
    {[-.11, .11].map((x, i) => <mesh key={x} position={[x, .27, i ? .06 : -.06]} rotation-x={i ? .08 : -.08}>
      <capsuleGeometry args={[.052, .43, 4, 7]} />
      <meshStandardMaterial color="#33414a" roughness={.82} />
    </mesh>)}
  </group>;
}

export function Pedestrian({ position, rotation = 0, color = '#4f7bb0', scale = .52 }) {
  const { scene } = useGLTF('/models/kenney/character.glb');
  const model = useMemo(() => {
    if (!scene) return null;
    const clone = scene.clone(true);
    clone.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const name = `${child.name || ''} ${child.material?.name || ''}`.toLowerCase();
      const material = child.material?.clone ? child.material.clone() : new THREE.MeshStandardMaterial();
      if (material.color) {
        if (name.includes('body') || name.includes('shirt') || name.includes('torso')) material.color.set(color);
        else if (name.includes('skin') || name.includes('head') || name.includes('hand')) material.color.set('#bd8064');
      }
      material.roughness = .72;
      child.material = material;
    });
    return clone;
  }, [scene, color]);

  return <group position={position} rotation-y={rotation}>
    {model
      ? <primitive object={model} scale={scale} position={[0, .02, 0]} />
      : <FallbackPedestrian color={color} />}
    <mesh position={[0, .03, 0]} rotation-x={-Math.PI / 2} receiveShadow>
      <circleGeometry args={[.34, 24]} />
      <meshBasicMaterial color="#1c2528" transparent opacity={.16} />
    </mesh>
  </group>;
}

useGLTF.preload('/models/kenney/character.glb');
