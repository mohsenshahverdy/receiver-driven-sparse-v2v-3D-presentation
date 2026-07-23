import { Html, Line, RoundedBox, useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

function Wheel({ position, scale = 1 }) {
  return <group position={position} scale={scale}>
    <mesh>
      <cylinderGeometry args={[.34, .34, .22, 18]} />
      <meshStandardMaterial color="#111416" roughness={.88} />
    </mesh>
    <mesh rotation-z={Math.PI / 2}>
      <cylinderGeometry args={[.18, .18, .26, 14]} />
      <meshStandardMaterial color="#bbc2c5" metalness={.92} roughness={.18} />
    </mesh>
  </group>;
}

function TruckFallback({ color = '#6b7781' }) {
  return <group position-y={.16}>
    <RoundedBox receiveShadow args={[2.25, .9, 4.15]} radius={.16} smoothness={6} position={[0, .82, 0]}>
      <meshStandardMaterial color={color} metalness={.22} roughness={.42} />
    </RoundedBox>
    <RoundedBox receiveShadow args={[1.55, 1.02, 1.28]} radius={.16} smoothness={6} position={[0, .82, 1.92]}>
      <meshStandardMaterial color="#4b5960" metalness={.18} roughness={.42} />
    </RoundedBox>
    {[[-.82, .18, -1.45], [.82, .18, -1.45], [-.82, .18, .95], [.82, .18, .95]].map(p => <Wheel key={p.join(':')} position={p} scale={.82} />)}
  </group>;
}

export function Truck({ position, rotation = 0, color = '#6b7781', label }) {
  const { scene } = useGLTF('/models/simcity/truck.glb');
  const truck = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = false;
      child.receiveShadow = true;
      const name = `${child.name || ''} ${child.material?.name || ''}`.toLowerCase();
      const neutral = name.includes('wheel') || name.includes('tire')
        ? '#171b1d'
        : name.includes('glass') || name.includes('window')
          ? '#1e3d48'
          : color;
      const tuneMaterial = material => {
        const next = material?.clone ? material.clone() : new THREE.MeshStandardMaterial();
        next.color = new THREE.Color(neutral);
        next.roughness = name.includes('wheel') || name.includes('tire') ? .82 : .48;
        next.metalness = name.includes('wheel') || name.includes('tire') ? .2 : .28;
        if ('transparent' in next && (name.includes('glass') || name.includes('window'))) {
          next.transparent = true;
          next.opacity = .72;
        }
        return next;
      };
      child.material = Array.isArray(child.material) ? child.material.map(tuneMaterial) : tuneMaterial(child.material);
    });
    return clone;
  }, [scene, color]);

  return <group position={position} rotation-y={rotation}>
    {truck ? <primitive object={truck} scale={.76} position={[0, .04, 0]} /> : <TruckFallback color={color} />}
    {label && <Html position={[0, 2.35, 0]} center distanceFactor={12}><div className="tag amber">{label}</div></Html>}
  </group>;
}

useGLTF.preload('/models/simcity/truck.glb');

function BikeWheel({ position }) {
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const a = i / 12 * Math.PI * 2;
    return [[0, 0, 0], [Math.cos(a) * .31, Math.sin(a) * .31, 0]];
  });
  return <group position={position}>
    <mesh>
      <torusGeometry args={[.34, .038, 12, 28]} />
      <meshStandardMaterial color="#1a1d20" roughness={.9} />
    </mesh>
    <mesh>
      <torusGeometry args={[.24, .012, 8, 24]} />
      <meshStandardMaterial color="#9aa5a8" metalness={.68} roughness={.26} />
    </mesh>
    {spokes.map((points, i) => <Line key={i} points={points} color="#c8d0d2" lineWidth={.55} />)}
    <mesh>
      <cylinderGeometry args={[.07, .07, .04, 10]} />
      <meshStandardMaterial color="#bbc3c8" metalness={.86} roughness={.2} />
    </mesh>
  </group>;
}

function BikeTube({ from, to, color = '#2b3438', width = .045 }) {
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) - Math.PI / 2;
  return <mesh position={mid} rotation-z={angle}>
    <cylinderGeometry args={[width, width, len, 10]} />
    <meshStandardMaterial color={color} metalness={.56} roughness={.36} />
  </mesh>;
}

export function Bike({ position, rotation = 0, color = '#547f92', accent = '#f2d16f', label }) {
  return <group position={position} rotation-y={rotation}>
    <group position-y={.16}>
      <BikeWheel position={[-.75, 0, 0]} />
      <BikeWheel position={[.75, 0, 0]} />
      <BikeTube from={[-.75, .02, 0]} to={[-.18, .55, 0]} color={accent} />
      <BikeTube from={[.75, .02, 0]} to={[-.18, .55, 0]} color={accent} />
      <BikeTube from={[-.18, .55, 0]} to={[.34, .52, 0]} color={accent} />
      <BikeTube from={[.34, .52, 0]} to={[.75, .02, 0]} color={accent} />
      <BikeTube from={[-.75, .02, 0]} to={[.34, .52, 0]} color={accent} width={.036} />
      <BikeTube from={[.72, .04, 0]} to={[.88, .74, 0]} color="#252d31" width={.04} />
      <BikeTube from={[.55, .05, 0]} to={[.88, .74, 0]} color="#252d31" width={.035} />
      <mesh position={[-.22, .64, 0]}>
        <boxGeometry args={[.42, .08, .2]} />
        <meshStandardMaterial color="#20272b" roughness={.7} />
      </mesh>
      <mesh position={[.98, .76, 0]}>
        <boxGeometry args={[.44, .045, .12]} />
        <meshStandardMaterial color="#20272b" metalness={.62} roughness={.35} />
      </mesh>
      <mesh position={[0, .25, .02]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[.075, .075, .08, 16]} />
        <meshStandardMaterial color="#161c1f" metalness={.72} roughness={.22} />
      </mesh>
      <mesh position={[0, .25, .21]}>
        <boxGeometry args={[.62, .035, .055]} />
        <meshStandardMaterial color="#222b2e" metalness={.55} roughness={.3} />
      </mesh>
      <mesh position={[0, .25, -.21]}>
        <boxGeometry args={[.62, .035, .055]} />
        <meshStandardMaterial color="#222b2e" metalness={.55} roughness={.3} />
      </mesh>
      <mesh position={[.06, .92, 0]}>
        <sphereGeometry args={[.18, 14, 10]} />
        <meshStandardMaterial color="#d2b29b" />
      </mesh>
      <mesh position={[.03, 1.06, 0]}>
        <sphereGeometry args={[.19, 14, 8, 0, Math.PI * 2, 0, Math.PI * .48]} />
        <meshStandardMaterial color={accent} roughness={.52} />
      </mesh>
      <mesh position={[-.08, .48, 0]} rotation-z={-.16}>
        <capsuleGeometry args={[.16, .52, 5, 9]} />
        <meshStandardMaterial color={color} roughness={.65} />
      </mesh>
      <BikeTube from={[-.04, .74, .16]} to={[.86, .77, .08]} color="#d2b29b" width={.034} />
      <BikeTube from={[-.04, .74, -.16]} to={[.86, .77, -.08]} color="#d2b29b" width={.034} />
      <BikeTube from={[-.14, .23, .11]} to={[-.48, .04, .05]} color="#263137" width={.04} />
      <BikeTube from={[.05, .23, -.11]} to={[.4, .04, -.04]} color="#263137" width={.04} />
      <mesh position={[-.34, .67, -.19]} rotation-z={-.25}>
        <boxGeometry args={[.12, .34, .09]} />
        <meshStandardMaterial color="#2f3a40" roughness={.72} />
      </mesh>
      <mesh position={[-.36, .08, 0]}>
        <boxGeometry args={[.2, .08, .34]} />
        <meshStandardMaterial color="#2b3135" metalness={.55} />
      </mesh>
      {label && <Html position={[0, 1.78, 0]} center distanceFactor={12}><div className="tag blue">{label}</div></Html>}
    </group>
  </group>;
}
