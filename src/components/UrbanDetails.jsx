import { Line, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { StreetLight, Tree } from './scene/StreetElements';
import { Pedestrian } from './scene/Pedestrian';

const asphaltA = '#50595b';
const asphaltB = '#626b6d';
const curbColor = '#b4b0a7';
const mapX = value => (value - 360) / 18;
const mapZ = value => (value - 440) / 18;

function Mark({ position, size, color = '#edf0e9', rotation = 0, opacity = 1 }) {
  return <mesh position={position} rotation-y={rotation} receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={.7} transparent opacity={opacity} />
  </mesh>;
}

function CircleMark({ position, radius = .3, color = '#e8e2c5', opacity = 1 }) {
  return <mesh position={position} rotation-x={-Math.PI / 2} receiveShadow>
    <circleGeometry args={[radius, 24]} />
    <meshStandardMaterial color={color} roughness={.72} transparent opacity={opacity} />
  </mesh>;
}

function UtilityCover({ position, radius = .42, color = '#384145' }) {
  return <mesh position={position} rotation-x={-Math.PI / 2} receiveShadow>
    <circleGeometry args={[radius, 28]} />
    <meshStandardMaterial color={color} metalness={.45} roughness={.38} />
  </mesh>;
}

function DrainGrate({ position }) {
  return <group position={position}>
    <mesh receiveShadow>
      <boxGeometry args={[.72, .04, .18]} />
      <meshStandardMaterial color="#2f393c" metalness={.58} roughness={.44} />
    </mesh>
    {[-.24, -.08, .08, .24].map(x => <mesh key={x} position={[x, .02, 0]}>
      <boxGeometry args={[.05, .02, .14]} />
      <meshStandardMaterial color="#7a8386" metalness={.5} />
    </mesh>)}
  </group>;
}

function CurbBand({ position, size, color = curbColor }) {
  return <mesh position={position} receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={.88} />
  </mesh>;
}

function GreenPatch({ position, size = [3, .16, 2.2], trees = 1, color = '#7c9d77' }) {
  return <group position={position}>
    <mesh receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={.96} />
    </mesh>
    <mesh position={[0, .12, 0]} receiveShadow>
      <boxGeometry args={[size[0] - .18, .06, size[2] - .18]} />
      <meshStandardMaterial color="#93b08d" roughness={.98} />
    </mesh>
    {Array.from({ length: trees }).map((_, i) => <Tree key={i} position={[-.6 + i * .65, .16, -0.42 + (i % 2) * .44]} scale={.58} />)}
  </group>;
}

function PocketGarden({ position }) {
  return <group position={position}>
    <RoundedBox args={[4.2, .16, 2.5]} radius={.12} smoothness={5} receiveShadow>
      <meshStandardMaterial color="#7f9586" roughness={.88} />
    </RoundedBox>
    <mesh position={[0, .12, 0]} receiveShadow>
      <boxGeometry args={[3.86, .08, 2.08]} />
      <meshStandardMaterial color="#92af91" roughness={.98} />
    </mesh>
    <GreenPatch position={[-1.15, .12, -.08]} size={[1.7, .12, 1.18]} trees={1} color="#79946f" />
    <GreenPatch position={[1.1, .12, .12]} size={[1.55, .12, 1.05]} trees={1} color="#829c76" />
    <mesh position={[0, .21, 0]} receiveShadow>
      <boxGeometry args={[1.8, .03, .86]} />
      <meshStandardMaterial color="#e1e0d9" roughness={.92} />
    </mesh>
    <Line points={[[-1.42, .28, -.62], [1.42, .28, -.62]]} color="#ced3cb" lineWidth={.35} />
    <Line points={[[-1.42, .28, .64], [1.42, .28, .64]]} color="#ced3cb" lineWidth={.35} />
  </group>;
}

function SidewalkCorner({ position, rotation = 0, long = 10, short = 4.5 }) {
  return <group position={position} rotation-y={rotation}>
    <mesh receiveShadow>
      <boxGeometry args={[long, .18, short]} />
      <meshStandardMaterial color="#c9c5bb" roughness={.9} />
    </mesh>
    <mesh position={[0, .12, 0]} receiveShadow>
      <boxGeometry args={[long - .4, .04, short - .4]} />
      <meshStandardMaterial color="#e1ddd4" roughness={.92} />
    </mesh>
    {[-2.2, 0, 2.2].map(x => <mesh key={x} position={[x, .22, 0]} receiveShadow>
      <boxGeometry args={[.24, .02, short - .8]} />
      <meshStandardMaterial color="#d4c48f" roughness={.94} />
    </mesh>)}
  </group>;
}

function Crosswalk({ position, rotation = 0 }) {
  return <group position={position} rotation-y={rotation}>
    {[-2.1, -1.2, -.3, .6, 1.5, 2.4].map(x => <Mark key={x} position={[x, .055, 0]} size={[.62, .03, 3.5]} color="#f0efea" />)}
  </group>;
}

function BikeLane({ position, rotation = 0 }) {
  return <group position={position} rotation-y={rotation}>
    <Line points={[[-12, .05, 0], [12, .05, 0]]} color="#8fd3e2" lineWidth={1.2} dashed dashSize={.9} gapSize={.65} />
    {[ -8, -4, 0, 4, 8 ].map(x => <CircleMark key={x} position={[x, .06, 0]} radius={.24} color="#9fe3f1" opacity={.72} />)}
  </group>;
}

export function RoadMarkings({ palette }) {
  return <group>
    {[mapX(160), mapX(560)].map(x => <Line key={`edge-${x}`} points={[[x, .058, -18.2], [x, .058, 17.8]]} color="#f6f2df" lineWidth={1.5} />)}
    {[mapX(260), mapX(360), mapX(460)].map((x, i) => <Line key={`lane-${x}`} points={[[x, .056, -18.2], [x, .056, 17.8]]} color={i === 1 ? '#f7f1d8' : palette.lane} lineWidth={i === 1 ? 1.2 : .9} dashed dashSize={i === 1 ? 1.3 : 1.05} gapSize={i === 1 ? .9 : .75} />)}
    {[mapX(310), mapX(410), mapX(510)].map(x => <Line key={`minor-${x}`} points={[[x, .054, -18.2], [x, .054, 17.8]]} color="#a6b3b2" lineWidth={.45} dashed dashSize={.45} gapSize={.48} />)}
    {[mapZ(360), mapZ(400), mapZ(439)].map(z => <Line key={`sight-${z}`} points={[[mapX(160), .064, z], [mapX(590), .064, z]]} color="#d7ecea" lineWidth={.65} dashed dashSize={.45} gapSize={.32} />)}
    <Mark position={[mapX(360), .058, mapZ(600)]} size={[2.35, .03, .18]} color="#f5f2e8" opacity={.9} />
    {[mapX(260), mapX(460)].map(x => <BikeLane key={`bike-lane-${x}`} position={[x, .058, 0]} rotation={Math.PI / 2} />)}
    <UtilityCover position={[mapX(300), .06, mapZ(540)]} />
    <UtilityCover position={[mapX(500), .06, mapZ(350)]} radius={.36} color="#434d4f" />
    <DrainGrate position={[mapX(165), .06, mapZ(650)]} />
    <DrainGrate position={[mapX(555), .06, mapZ(230)]} />
  </group>;
}

export function SidewalkDetail({ palette }) {
  return <group>
    <mesh receiveShadow position={[0, -.2, 0]}>
      <boxGeometry args={[58, .2, 58]} />
      <meshStandardMaterial color={palette.ground} roughness={.94} />
    </mesh>
    {[[-14.2, 0, 5.8, 37], [14.2, 0, 5.8, 37]].map(([x, z, w, d], i) => <group key={i}>
      <mesh receiveShadow position={[x, .14, z]}>
        <boxGeometry args={[w, .18, d]} />
        <meshStandardMaterial color="#ccc8be" roughness={.9} />
      </mesh>
      <mesh receiveShadow position={[x, .22, z]}>
        <boxGeometry args={[w - .36, .04, d - .36]} />
        <meshStandardMaterial color="#e1ddd3" roughness={.95} />
      </mesh>
    </group>)}
    {[[ mapX(160), mapZ(400) ], [ mapX(560), mapZ(400) ], [ mapX(160), mapZ(439) ], [ mapX(560), mapZ(439) ]].map(([x, z], i) => <group key={i} position={[x, .27, z]}>
      {[ -1.25, 0, 1.25 ].map(u => <mesh key={u} position={[u, 0, 0]} receiveShadow>
        <boxGeometry args={[.46, .026, 1.65]} />
        <meshStandardMaterial color="#dbbc55" roughness={.94} />
      </mesh>)}
    </group>)}
    <PocketGarden position={[mapX(650), .19, mapZ(270)]} />
    <PocketGarden position={[mapX(650), .19, mapZ(540)]} />
  </group>;
}

function MedianBoulevard() {
  const length = 36.6;
  const curb = '#8d9188';
  const concrete = '#b5b6aa';
  const planting = '#758d6c';
  const soil = '#56674f';

  return <group position={[0, 0, 0]}>
    <mesh position={[0, .086, 0]} receiveShadow>
      <boxGeometry args={[1.36, .16, length]} />
      <meshStandardMaterial color={curb} roughness={.92} />
    </mesh>
    <mesh position={[0, .18, 0]} receiveShadow>
      <boxGeometry args={[1.04, .045, length - .5]} />
      <meshStandardMaterial color={concrete} roughness={.88} />
    </mesh>
    <mesh position={[0, .225, 0]} receiveShadow>
      <boxGeometry args={[.62, .035, length - 1.25]} />
      <meshStandardMaterial color={planting} roughness={.98} />
    </mesh>
    <mesh position={[0, .25, 0]} receiveShadow>
      <boxGeometry args={[.38, .018, length - 2.6]} />
      <meshStandardMaterial color={soil} roughness={1} />
    </mesh>
    {[-17.7, 17.7].map(z => <mesh key={`median-end-${z}`} position={[0, .18, z]} rotation-x={-Math.PI / 2}>
      <circleGeometry args={[.68, 36]} />
      <meshStandardMaterial color={curb} roughness={.92} />
    </mesh>)}
    {[-16, -12, -8, -4, 0, 4, 8, 12, 16].map(z => <Line key={`joint-${z}`} points={[[-.52, .255, z], [.52, .255, z]]} color="#8f948a" lineWidth={.28} />)}
    {[-15, -10, -5, 0, 5, 10, 15].map((z, i) => <group key={`median-plant-${z}`} position={[0, .31, z]}>
      <mesh castShadow position={[i % 2 ? -.18 : .17, .08, 0]}>
        <sphereGeometry args={[.19, 10, 8]} />
        <meshStandardMaterial color={i % 2 ? '#6f8b64' : '#587853'} roughness={.94} />
      </mesh>
      <mesh castShadow position={[i % 2 ? .14 : -.16, .055, .34]}>
        <sphereGeometry args={[.14, 9, 7]} />
        <meshStandardMaterial color="#80996f" roughness={.94} />
      </mesh>
    </group>)}
    {[-14, -7, 7, 14].map(z => <group key={`median-reflector-${z}`} position={[0, .31, z]}>
      <mesh position={[-.48, 0, 0]} castShadow>
        <boxGeometry args={[.08, .08, .28]} />
        <meshStandardMaterial color="#d7c96c" emissive="#d7b84e" emissiveIntensity={.12} roughness={.55} />
      </mesh>
      <mesh position={[.48, 0, 0]} castShadow>
        <boxGeometry args={[.08, .08, .28]} />
        <meshStandardMaterial color="#d7c96c" emissive="#d7b84e" emissiveIntensity={.12} roughness={.55} />
      </mesh>
    </group>)}
    {[-11.8, 2.2, 13.2].map(z => <mesh key={`median-grate-${z}`} position={[0, .285, z]} rotation-x={-Math.PI / 2}>
      <boxGeometry args={[.34, .18, .03]} />
      <meshStandardMaterial color="#4a5350" metalness={.55} roughness={.38} />
    </mesh>)}
  </group>;
}

export function RoadSurface({ palette }) {
  return <group>
    <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-.08}>
      <planeGeometry args={[74, 74]} />
      <meshStandardMaterial color={palette.ground} roughness={.96} />
    </mesh>
    <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={.01}>
      <planeGeometry args={[22.2, 36.2]} />
      <meshStandardMaterial color={palette.road} roughness={.9} metalness={.04} />
    </mesh>
    <SidewalkDetail palette={palette} />
    <RoadMarkings palette={palette} />
    {[[mapX(305), .07, mapZ(545)], [mapX(505), .07, mapZ(395)], [mapX(215), .07, mapZ(225)], [mapX(545), .07, mapZ(465)]].map((p, i) => <mesh key={i} position={p} rotation-x={-Math.PI / 2}>
      <circleGeometry args={[.46, 24]} />
      <meshStandardMaterial color="#364145" metalness={.6} roughness={.46} />
    </mesh>)}
    {[[mapX(160), .22, mapZ(650)], [mapX(560), .22, mapZ(230)], [mapX(160), .22, mapZ(360)], [mapX(560), .22, mapZ(439)]].map((p, i) => <group key={i} position={p}>
      {[-.28, -.09, .1, .29].map(x => <mesh key={x} position={[x, 0, 0]}>
        <boxGeometry args={[.1, .03, .88]} />
        <meshStandardMaterial color="#2d373a" metalness={.62} roughness={.3} />
      </mesh>)}
    </group>)}
    <MedianBoulevard />
  </group>;
}

export function Bench({ position, rotation = 0 }) {
  return <group position={position} rotation-y={rotation}>
    <mesh castShadow position-y={.45}>
      <boxGeometry args={[1.8, .12, .48]} />
      <meshStandardMaterial color="#9b724e" roughness={.58} />
    </mesh>
    <mesh castShadow position={[0, .82, .21]} rotation-x={-.08}>
      <boxGeometry args={[1.8, .58, .1]} />
      <meshStandardMaterial color="#9b724e" roughness={.55} />
    </mesh>
    {[-.66, .66].map(x => <mesh key={x} position={[x, .22, 0]}>
      <boxGeometry args={[.08, .5, .4]} />
      <meshStandardMaterial color="#334145" metalness={.8} roughness={.28} />
    </mesh>)}
  </group>;
}

export function TrafficLight({ position, rotation = 0 }) {
  return <group position={position} rotation-y={rotation}>
    <mesh castShadow position-y={2.25}>
      <cylinderGeometry args={[.07, .11, 4.5, 12]} />
      <meshStandardMaterial color="#26363a" metalness={.82} roughness={.25} />
    </mesh>
    <mesh position={[.64, 4.45, 0]} rotation-z={Math.PI / 2}>
      <cylinderGeometry args={[.055, .055, 1.28, 10]} />
      <meshStandardMaterial color="#26363a" metalness={.82} />
    </mesh>
    <RoundedBox position={[1.18, 4.2, 0]} args={[.38, 1.02, .36]} radius={.05}>
      <meshStandardMaterial color="#162124" metalness={.5} roughness={.22} />
    </RoundedBox>
    {[[ '#e74f45', 4.49 ], [ '#e6bd3e', 4.2 ], [ '#44bd78', 3.91 ]].map(([c, y], i) => <group key={c}>
      <mesh position={[1.18, y, -.2]}>
        <sphereGeometry args={[.095, 12, 8]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={i === 2 ? 1.5 : .15} />
      </mesh>
      <mesh position={[1.18, y - .04, -.24]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[.13, .13, .11, 16, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color="#172124" />
      </mesh>
    </group>)}
  </group>;
}

function Planter({ position }) {
  return <group position={position}>
    <RoundedBox args={[1.35, .48, 1.35]} radius={.12} position={[0, .24, 0]}>
      <meshStandardMaterial color="#737c79" roughness={.8} />
    </RoundedBox>
    <mesh position={[0, .52, 0]}>
      <boxGeometry args={[1.08, .08, 1.08]} />
      <meshStandardMaterial color="#273e32" roughness={.9} />
    </mesh>
    <Tree position={[0, .54, 0]} scale={.78} />
  </group>;
}

function Bin({ position }) {
  return <group position={position}>
    <mesh castShadow position-y={.42}>
      <cylinderGeometry args={[.24, .27, .84, 14]} />
      <meshStandardMaterial color="#35494c" metalness={.45} roughness={.4} />
    </mesh>
    <mesh position-y={.86}>
      <cylinderGeometry args={[.26, .26, .06, 14]} />
      <meshStandardMaterial color="#1e2d30" />
    </mesh>
  </group>;
}

function Sign({ position, rotation = 0 }) {
  return <group position={position} rotation-y={rotation}>
    <mesh position-y={1.25}>
      <cylinderGeometry args={[.035, .05, 2.5, 10]} />
      <meshStandardMaterial color="#56666a" metalness={.85} roughness={.2} />
    </mesh>
    <mesh position={[0, 2.2, 0]}>
      <cylinderGeometry args={[.34, .34, .055, 24]} />
      <meshStandardMaterial color="#f1f3ed" metalness={.2} roughness={.4} />
    </mesh>
    <mesh position={[0, 2.2, -.035]}>
      <circleGeometry args={[.26, 24]} />
      <meshBasicMaterial color="#4e8cb5" />
    </mesh>
  </group>;
}

export function PedestrianPlaza({ showPedestrians = true }) {
  return <group>
    {showPedestrians && <Pedestrian position={[mapX(585), .24, mapZ(382)]} color="#4f7bb0" rotation={Math.PI} />}
  </group>;
}

export function UrbanProps({ showStreetFurniture = true }) {
  return <group>
    {[[mapX(160), mapZ(200), 0], [mapX(160), mapZ(470), 0], [mapX(560), mapZ(320), Math.PI], [mapX(560), mapZ(620), Math.PI]].map((p, i) => <StreetLight key={`l${i}`} position={[p[0], .15, p[1]]} rotation={p[2]} />)}
    {[[mapX(620), mapZ(210)], [mapX(675), mapZ(305)], [mapX(625), mapZ(485)], [mapX(675), mapZ(605)], [mapX(135), mapZ(380)], [mapX(130), mapZ(680)]].map((p, i) => <Tree key={`t${i}`} position={[p[0], .16, p[1]]} scale={i % 3 === 0 ? 1.08 : .95} />)}
    <TrafficLight position={[mapX(160), .15, mapZ(360)]} />
    <TrafficLight position={[mapX(560), .15, mapZ(439)]} rotation={Math.PI} />
    <TrafficLight position={[mapX(160), .15, mapZ(439)]} />
    <TrafficLight position={[mapX(560), .15, mapZ(360)]} rotation={Math.PI} />
    <Sign position={[mapX(135), .2, mapZ(520)]} rotation={.3} />
    <Sign position={[mapX(585), .2, mapZ(335)]} rotation={Math.PI} />
    {showStreetFurniture && <>
      <Bin position={[mapX(145), .18, mapZ(620)]} />
      <Bin position={[mapX(585), .18, mapZ(260)]} />
      <Bench position={[mapX(130), .2, mapZ(500)]} rotation={Math.PI / 2} />
      <Bench position={[mapX(640), .2, mapZ(405)]} rotation={Math.PI / 2} />
      <Planter position={[mapX(625), .2, mapZ(250)]} />
      <Planter position={[mapX(625), .2, mapZ(570)]} />
    </>}
    <mesh position={[mapX(645), .17, mapZ(270)]}>
      <boxGeometry args={[6.4, .06, 9.8]} />
      <meshStandardMaterial color="#89a67b" roughness={.96} />
    </mesh>
    <mesh position={[mapX(645), .17, mapZ(540)]}>
      <boxGeometry args={[6.4, .06, 9.8]} />
      <meshStandardMaterial color="#7f9c71" roughness={.96} />
    </mesh>
  </group>;
}
