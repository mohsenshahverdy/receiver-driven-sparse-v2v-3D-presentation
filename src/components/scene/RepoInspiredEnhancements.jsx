import { Billboard, Html, Line, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';

const mapX = value => (value - 360) / 18;
const mapZ = value => (value - 440) / 18;

function TilePlate({ position, size = [2, .04, 2], color = '#cfd0c7' }) {
  return <mesh receiveShadow position={position}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={.92} />
  </mesh>;
}

function ServicePatch({ position, rotation = 0 }) {
  return <group position={position} rotation-y={rotation}>
    <TilePlate position={[0, 0, 0]} size={[3.6, .05, 1.9]} color="#d5d1c6" />
    {[-1.35, -.45, .45, 1.35].map(x => <mesh key={x} position={[x, .05, -.72]}>
      <boxGeometry args={[.52, .035, .22]} />
      <meshStandardMaterial color="#b8b4aa" roughness={.88} />
    </mesh>)}
    <mesh position={[-1.22, .16, .38]} castShadow>
      <boxGeometry args={[.62, .26, .46]} />
      <meshStandardMaterial color="#46545a" metalness={.35} roughness={.42} />
    </mesh>
    <mesh position={[.05, .14, .42]} castShadow>
      <boxGeometry args={[.9, .22, .38]} />
      <meshStandardMaterial color="#59656a" metalness={.22} roughness={.5} />
    </mesh>
    <mesh position={[1.15, .18, .38]} castShadow>
      <cylinderGeometry args={[.2, .24, .32, 14]} />
      <meshStandardMaterial color="#39464a" metalness={.45} roughness={.36} />
    </mesh>
  </group>;
}

function ProceduralTree({ position, scale = 1, lean = .08, color = '#4d8461' }) {
  const crown = useRef();
  const branches = useMemo(() => [
    [0, 1.1, 0, .12, .52, 0],
    [.2, 1.55, .05, .055, .72, .45],
    [-.22, 1.48, -.04, .05, .62, -.5],
    [.02, 1.82, -.18, .045, .58, .14],
  ], []);

  useFrame(({ clock }) => {
    if (!crown.current) return;
    crown.current.rotation.z = Math.sin(clock.elapsedTime * .85 + position[0]) * .025;
    crown.current.rotation.x = Math.cos(clock.elapsedTime * .7 + position[2]) * .018;
  });

  return <group position={position} scale={scale} rotation-z={lean}>
    <mesh castShadow position={[0, .7, 0]}>
      <cylinderGeometry args={[.12, .22, 1.4, 10]} />
      <meshStandardMaterial color="#6c4c36" roughness={.98} />
    </mesh>
    {branches.map(([x, y, z, r, h, rz], i) => <mesh key={i} castShadow position={[x, y, z]} rotation-z={rz}>
      <cylinderGeometry args={[r * .58, r, h, 8]} />
      <meshStandardMaterial color="#684933" roughness={.98} />
    </mesh>)}
    <group ref={crown}>
      {[
        [0, 2.05, 0, .72, color],
        [.42, 1.82, .08, .48, '#5c936c'],
        [-.38, 1.82, -.1, .48, '#3f7356'],
        [.08, 2.42, -.06, .42, '#73a679'],
        [.05, 1.55, .18, .38, '#4d7f5f'],
      ].map(([x, y, z, s, c], i) => <mesh key={i} castShadow position={[x, y, z]}>
        <icosahedronGeometry args={[s, 1]} />
        <meshStandardMaterial color={c} roughness={.96} />
      </mesh>)}
    </group>
  </group>;
}

function VehicleWake({ from, to, color = '#75d8ff' }) {
  const points = useMemo(() => {
    const midX = (from[0] + to[0]) / 2;
    const midZ = (from[2] + to[2]) / 2;
    return [[from[0], .08, from[2]], [midX, .08, midZ], [to[0], .08, to[2]]];
  }, [from, to]);

  return <group>
    <Line points={points} color={color} lineWidth={1.25} dashed dashSize={.45} gapSize={.28} />
    {points.map((p, i) => <mesh key={i} position={[p[0], .09, p[2]]} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[.18, .24, 20]} />
      <meshBasicMaterial color={color} transparent opacity={.65} />
    </mesh>)}
  </group>;
}

function SpatialBadge({ position, title, value, color = '#6be6ff' }) {
  return <Billboard position={position} scale={.58} follow lockX={false} lockY={false} lockZ={false}>
    <RoundedBox args={[1.65, .58, .035]} radius={.06} smoothness={4}>
      <meshPhysicalMaterial color="#102932" transparent opacity={.68} roughness={.18} metalness={.18} emissive={color} emissiveIntensity={.05} />
    </RoundedBox>
    <Html transform position={[0, 0, .04]} distanceFactor={8}>
      <div className="repo-badge">
        <span>{title}</span>
        <b>{value}</b>
      </div>
    </Html>
  </Billboard>;
}

function LaneDirectionGlyphs() {
  const ArrowGlyph = ({ rotation = 0 }) => <group rotation-y={rotation}>
    <mesh position={[0, .005, -.12]}>
      <boxGeometry args={[.08, .025, .62]} />
      <meshStandardMaterial color="#f4f0dc" roughness={.72} />
    </mesh>
    <mesh position={[-.16, .006, -.42]} rotation-y={-.55}>
      <boxGeometry args={[.07, .025, .42]} />
      <meshStandardMaterial color="#f4f0dc" roughness={.72} />
    </mesh>
    <mesh position={[.16, .006, -.42]} rotation-y={.55}>
      <boxGeometry args={[.07, .025, .42]} />
      <meshStandardMaterial color="#f4f0dc" roughness={.72} />
    </mesh>
  </group>;

  return <group>
    {[mapX(215), mapX(305)].map(x => [-13.5, -8, -2, 4, 10].map(z => <group key={`${x}-${z}`} position={[x, .07, z]} rotation-y={Math.PI}>
      <ArrowGlyph />
    </group>))}
    {[mapX(415), mapX(505)].map(x => [-13.5, -8, -2, 4, 10].map(z => <group key={`${x}-${z}`} position={[x, .07, z]}>
      <ArrowGlyph />
    </group>))}
  </group>;
}

function CityBlockMicroDetail() {
  return <group>
    <ServicePatch position={[mapX(122), .25, mapZ(225)]} rotation={Math.PI / 2} />
    <ServicePatch position={[mapX(126), .25, mapZ(520)]} rotation={Math.PI / 2} />
    {[mapZ(190), mapZ(260), mapZ(590), mapZ(660)].map((z, i) => <group key={i} position={[mapX(145), .25, z]}>
      {[-.55, 0, .55].map(x => <mesh key={x} position={[x, .18, 0]} castShadow>
        <boxGeometry args={[.18, .36, .18]} />
        <meshStandardMaterial color="#566468" metalness={.32} roughness={.42} />
      </mesh>)}
    </group>)}
    {[mapX(620), mapX(670)].map((x, i) => <group key={i} position={[x, .23, mapZ(405)]}>
      <TilePlate position={[0, 0, 0]} size={[1.8, .05, 3.4]} color={i ? '#c9d7bf' : '#d7ddd0'} />
      <Line points={[[-.65, .05, -1.35], [.65, .05, 1.35]]} color="#eef3e8" lineWidth={.35} />
    </group>)}
  </group>;
}

export function RepoInspiredEnhancements({ step = 0 }) {
  const ego = [mapX(414), .15, mapZ(645)];
  const collaborator = [mapX(505), .15, mapZ(515)];
  const truck = [mapX(414), .15, mapZ(515)];

  return <group>
    <CityBlockMicroDetail />
    <LaneDirectionGlyphs />
    {[
      [mapX(628), .25, mapZ(222), .9, '#4e8761'],
      [mapX(674), .25, mapZ(302), .72, '#5c9268'],
      [mapX(640), .25, mapZ(500), .82, '#4d8060'],
      [mapX(682), .25, mapZ(610), .7, '#6a9b73'],
    ].map(([x, y, z, s, c], i) => <ProceduralTree key={i} position={[x, y, z]} scale={s} color={c} lean={(i - 1.5) * .035} />)}
    {step > 0 && <>
      <VehicleWake from={collaborator} to={ego} color="#f3bd5f" />
      <VehicleWake from={truck} to={ego} color="#8edcff" />
    </>}
    {step >= 13 && <>
      <SpatialBadge position={[ego[0] + 1.25, 1.65, ego[2] - .15]} title="REQUEST" value="SPARSE" />
    </>}
  </group>;
}
