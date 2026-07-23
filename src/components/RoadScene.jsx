import { Float, Grid, Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Building } from './scene/Building';
import { Car } from './scene/Car';
import { CommunicationArrow } from './scene/CommunicationArrow';
import { Module } from './scene/Module';
import { SensorField } from './scene/SensorField';
import { Bike, Truck } from './scene/RoadActors';
import { RepoInspiredEnhancements } from './scene/RepoInspiredEnhancements';
import { PedestrianPlaza, RoadSurface, UrbanProps } from './UrbanDetails';
import { SCENE_CONFIG, THEMES } from '../config/scene';

const sparse = [[-3,-2],[-2,0],[-1,2],[0,1],[1,3],[2,2],[3,3],[3,4]];
const mapX = value => (value - 360) / 18;
const mapZ = value => (value - 440) / 18;
const mapVehicle = (x, y, width = 30, height = 50) => [mapX(x + width / 2), .15, mapZ(y + height / 2)];
const carDownLane = Math.PI;
const carUpLane = 0;
const truckUpLane = Math.PI;

function GreenPocket({ position, rotation = 0, width = 6.2, depth = 2.2 }) {
  return <group position={position} rotation-y={rotation}>
    <mesh receiveShadow>
      <boxGeometry args={[width, .18, depth]} />
      <meshStandardMaterial color="#788f71" roughness={.98} />
    </mesh>
    <mesh position={[0, .1, 0]} receiveShadow>
      <boxGeometry args={[width - .4, .06, depth - .4]} />
      <meshStandardMaterial color="#92aa84" roughness={.99} />
    </mesh>
    <Line points={[[-width / 2 + .3, .18, -depth / 2 + .22], [width / 2 - .3, .18, -depth / 2 + .22]]} color="#cfd5c9" lineWidth={.3} />
    <Line points={[[-width / 2 + .3, .18, depth / 2 - .22], [width / 2 - .3, .18, depth / 2 - .22]]} color="#cfd5c9" lineWidth={.3} />
  </group>;
}

function BEVGrid({visible}) { return <group visible={visible}><Grid position={[0,.07,0]} args={[24,24]} cellSize={1} cellColor="#2d91aa" sectionColor="#66d9ef" cellThickness={.35} fadeDistance={35} infiniteGrid={false}/></group>; }
function SparseCells({visible,dense=false,color='#52dcff'}) { const cells=dense?Array.from({length:81},(_,i)=>[i%9-4,Math.floor(i/9)-4]):sparse; return <group visible={visible} position={[0,.16,0]}>{cells.map(([x,z],i)=><mesh key={i} position={[x,dense?.12:.2,z]}><boxGeometry args={[.78,dense?.12:.25,.78]}/><meshStandardMaterial color={dense?'#e66f52':color} emissive={dense?'#d94b31':color} emissiveIntensity={dense?.8:2} transparent opacity={dense?.55:.9}/></mesh>)}</group>; }
function Trajectory({visible}) {
  const path = [
    [3.35, .22, 10.95],
    [3.18, .22, 9.6],
    [2.92, .22, 8.25],
    [2.52, .22, 6.85],
    [1.98, .22, 5.5],
    [1.28, .22, 4.2],
    [.48, .22, 2.95],
    [-.34, .22, 1.75],
    [-1.08, .22, .55],
    [-1.72, .22, -.65]
  ];
  const futurePoses = [
    [3.25, .24, 9.95],
    [2.82, .24, 7.55],
    [1.7, .24, 4.95],
    [.15, .24, 2.2],
    [-1.2, .24, -.25]
  ];

  return <group visible={visible}>
    <Line points={path} color="#2fd7ff" lineWidth={3.8} transparent opacity={.88} />
    <Line points={path.map(([x, y, z]) => [x + .22, y + .01, z])} color="#baf7ff" lineWidth={1.1} transparent opacity={.42} dashed dashSize={.28} gapSize={.22} />
    {futurePoses.map((point, i) => <group key={i} position={point} rotation-x={-Math.PI / 2}>
      <mesh>
        <ringGeometry args={[.3 + i * .04, .48 + i * .055, 36]} />
        <meshBasicMaterial color={i < 2 ? '#fff2a8' : '#d7f8ff'} transparent opacity={i < 2 ? .8 : .62} depthWrite={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[.08, 20]} />
        <meshBasicMaterial color="#f7ffff" transparent opacity={.85} depthWrite={false} />
      </mesh>
    </group>)}
  </group>;
}
function Results({visible}) { if(!visible)return null; return <group position={[0,3,-2]}>{[['~10%','COMM. BUDGET',-5],['STRONG','DETECTION',0],['HIGH','RISK RECALL',5]].map(([a,b,x])=><Float key={b} speed={1.2}><Module position={[x,0,0]} title={a} lines={[b]} color={x===0?'#f2c65a':'#41caff'}/></Float>)}</group>; }

function FullCommunicationStream({ visible, from, to }) {
  if (!visible) return null;
  const offsets = [-1.8, -1.2, -.6, 0, .6, 1.2, 1.8];
  return <group>
    {offsets.map((offset, i) => {
      const lift = .18 + i * .035;
      const start = [from[0] + offset * .55, lift, from[2] + offset * .18];
      const mid = [(from[0] + to[0]) / 2 + offset * .35, lift + .22, (from[2] + to[2]) / 2];
      const end = [to[0] + offset * .25, lift, to[2] - offset * .12];
      return <Line key={offset} points={[start, mid, end]} color={i % 2 ? '#8eeeff' : '#e7fbff'} lineWidth={i === 3 ? 2.8 : 1.45} transparent opacity={i === 3 ? .95 : .58} dashed dashSize={.42} gapSize={.18} />;
    })}
    {offsets.map((offset, i) => <mesh key={`packet-${offset}`} position={[from[0] + offset * .55, .28 + i * .025, from[2] + offset * .18]} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[.13, .2, 20]} />
      <meshBasicMaterial color={i % 2 ? '#8eeeff' : '#ffffff'} transparent opacity={.62} depthWrite={false} />
    </mesh>)}
  </group>;
}

function TopKSelectedStream({ visible, from, to }) {
  if (!visible) return null;
  const points = [
    [from[0] - .15, .34, from[2] - .05],
    [(from[0] + to[0]) / 2 + .25, .64, (from[2] + to[2]) / 2 + .12],
    [to[0] + .05, .34, to[2] + .08],
  ];

  return <group>
    <Line points={points} color="#f0c65d" lineWidth={6.2} transparent opacity={.86} dashed dashSize={.8} gapSize={.22} />
    <Line points={points} color="#fff2a9" lineWidth={2.15} transparent opacity={.95} dashed dashSize={.62} gapSize={.36} />
    {points.map((point, i) => <mesh key={i} position={point} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[.22 + i * .045, .32 + i * .045, 32]} />
      <meshBasicMaterial color={i === 1 ? '#fff2a9' : '#f0c65d'} transparent opacity={.75} depthWrite={false} />
    </mesh>)}
    <SceneMarker
      visible
      position={[(from[0] + to[0]) / 2 + .35, .12, (from[2] + to[2]) / 2 + .1]}
      label="TOP-K ENERGY"
      sublabel="selected cells only"
      color="#f0c65d"
      labelOffset={[.35, 1.82, .12]}
      scale={.92}
    />
    <SceneMarker
      visible
      position={[from[0], .12, from[2]]}
      label="DECISION"
      sublabel="sender ranks Top-K"
      color="#f0c65d"
      labelOffset={[.48, 2.38, .5]}
      scale={1.02}
    />
  </group>;
}

function SnapshotCell({ position, color, selected = false, delay = 0 }) {
  const cell = useRef();
  const material = useRef();

  useFrame(({ clock }) => {
    const pulse = (Math.sin(clock.elapsedTime * 2.15 + delay) + 1) / 2;
    if (cell.current) {
      const scale = selected ? 1.05 + pulse * .12 : .94 + pulse * .08;
      cell.current.scale.set(scale, 1, scale);
    }
    if (material.current) {
      material.current.opacity = selected ? .64 + pulse * .22 : .32 + pulse * .16;
      material.current.emissiveIntensity = selected ? 1.1 + pulse * 1.1 : .55 + pulse * .55;
    }
  });

  return <group ref={cell} position={position}>
    <mesh position-y={.02}>
      <boxGeometry args={[.82, .07, .82]} />
      <meshStandardMaterial ref={material} color={color} emissive={color} transparent opacity={selected ? .72 : .4} roughness={.42} />
    </mesh>
    <mesh rotation-x={-Math.PI / 2} position-y={.065}>
      <ringGeometry args={[selected ? .48 : .38, selected ? .55 : .45, 30]} />
      <meshBasicMaterial color={color} transparent opacity={selected ? .75 : .42} depthWrite={false} />
    </mesh>
  </group>;
}

function SnapshotRequestVisuals({ visible, ego, collaborator }) {
  const requestPacket = useRef();
  const responsePacket = useRef();

  useFrame(({ clock }) => {
    const requestT = (Math.sin(clock.elapsedTime * .85) + 1) / 2;
    const responseT = (Math.sin(clock.elapsedTime * .85 + Math.PI) + 1) / 2;
    const move = (ref, from, to, t, lift = .42) => {
      if (!ref.current) return;
      const arc = Math.sin(t * Math.PI) * .42;
      ref.current.position.set(
        from[0] + (to[0] - from[0]) * t,
        lift + arc,
        from[2] + (to[2] - from[2]) * t
      );
    };
    move(requestPacket, ego, collaborator, requestT, .46);
    move(responsePacket, collaborator, ego, responseT, .54);
  });

  if (!visible) return null;

  const egoNeedCells = [
    [ego[0] - 1.15, .2, ego[2] - .95],
    [ego[0] - .15, .2, ego[2] - 1.28],
    [ego[0] + .92, .2, ego[2] - .82],
    [ego[0] + .48, .2, ego[2] + .18],
  ];
  const contextCells = [
    [collaborator[0] - .88, .21, collaborator[2] - .52],
    [collaborator[0] + .12, .21, collaborator[2] - .9],
    [collaborator[0] + .88, .21, collaborator[2] - .22],
    [collaborator[0] + .35, .21, collaborator[2] + .62],
  ];
  const selectedCells = [
    [ego[0] + 1.12, .28, ego[2] - 1.32],
    [ego[0] + 1.98, .28, ego[2] - 1.02],
    [ego[0] + 2.62, .28, ego[2] - .4],
  ];
  const requestLine = [
    [ego[0] + .25, .32, ego[2] - .25],
    [(ego[0] + collaborator[0]) / 2 - .38, .76, (ego[2] + collaborator[2]) / 2 + .18],
    [collaborator[0] - .18, .32, collaborator[2] + .08],
  ];
  const responseLine = [
    [collaborator[0] + .08, .42, collaborator[2] - .1],
    [(ego[0] + collaborator[0]) / 2 + .42, .92, (ego[2] + collaborator[2]) / 2 - .18],
    [ego[0] + .45, .42, ego[2] - .55],
  ];

  return <group>
    {egoNeedCells.map((position, i) => <SnapshotCell key={`need-${i}`} position={position} color="#45d5ff" delay={i * .55} />)}
    {contextCells.map((position, i) => <SnapshotCell key={`context-${i}`} position={position} color="#67e6a4" delay={i * .48 + .35} />)}
    {selectedCells.map((position, i) => <SnapshotCell key={`selected-${i}`} position={position} color="#d8fbff" selected delay={i * .5 + .7} />)}

    <Line points={requestLine} color="#45d5ff" lineWidth={2.1} transparent opacity={.72} dashed dashSize={.34} gapSize={.24} />
    <Line points={responseLine} color="#67e6a4" lineWidth={3.6} transparent opacity={.82} dashed dashSize={.46} gapSize={.2} />

    <mesh ref={requestPacket} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[.14, .24, 26]} />
      <meshBasicMaterial color="#45d5ff" transparent opacity={.9} depthWrite={false} />
    </mesh>
    <mesh ref={responsePacket} rotation-x={-Math.PI / 2}>
      <boxGeometry args={[.42, .08, .42]} />
      <meshBasicMaterial color="#d8fbff" transparent opacity={.86} depthWrite={false} />
    </mesh>

    <SceneMarker
      visible
      position={[ego[0] + 1.98, .12, ego[2] - .95]}
      label="SELECTED"
      sublabel="need ∩ context"
      color="#d8fbff"
      labelOffset={[.22, 1.62, -.08]}
      scale={.82}
    />
  </group>;
}

function FullCommunicationMarkers({ visible, collaborator }) {
  if (!visible) return null;
  const featureCells = [
    [-4.1, .1, 6.4], [-2.7, .1, 7.1], [-1.2, .1, 6.1], [.4, .1, 7.4],
    [1.8, .1, 6.7], [3.1, .1, 7.8], [4.6, .1, 6.3], [5.8, .1, 7.2],
    [-3.4, .1, 4.9], [-1.7, .1, 4.6], [.1, .1, 5.1], [1.8, .1, 4.7],
    [3.6, .1, 5.1], [5.2, .1, 4.8],
  ];

  return <group>
    {featureCells.map(([x, y, z], i) => <group key={i} position={[x, y, z]}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[.18, .28, 24]} />
        <meshBasicMaterial color="#baf7ff" transparent opacity={.72} depthWrite={false} />
      </mesh>
      <mesh position-y={.035}>
        <boxGeometry args={[.42, .045, .42]} />
        <meshStandardMaterial color="#7be7ff" emissive="#52d8ff" emissiveIntensity={.7} transparent opacity={.42} />
      </mesh>
    </group>)}
    <SceneMarker visible position={[collaborator[0], .1, collaborator[2]]} label="DECISION" sublabel="collaborator sends all" color="#8eeeff" labelOffset={[.35, 2.55, .35]} scale={1.05} />
    <SceneMarker visible position={[5.35, .1, 7.05]} label="FULL BANDWIDTH" sublabel="all BEV cells" color="#8eeeff" labelOffset={[0, 2.05, .15]} scale={1.05} />
  </group>;
}

function SceneMarker({ position, label, sublabel, color = '#4bd7ff', visible = true, labelOffset = [0, 1.65, 0], scale = 1 }) {
  if (!visible) return null;
  return <group visible={visible} position={position}>
    <mesh position-y={.075} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[.8, .92, 40]} />
      <meshBasicMaterial color={color} transparent opacity={.9} depthWrite={false} />
    </mesh>
    <Line points={[[0, .18, 0], labelOffset]} color={color} lineWidth={1.2} />
    <Html position={labelOffset} center distanceFactor={11} zIndexRange={[2, 0]}>
      <div className="scene-marker" style={{ '--marker-color': color, '--marker-scale': scale }}>
        <b>{label}</b>
        {sublabel && <span>{sublabel}</span>}
      </div>
    </Html>
  </group>;
}

function circlePoints(radius, segments = 96) {
  return Array.from({ length: segments + 1 }, (_, index) => {
    const angle = index / segments * Math.PI * 2;
    return [Math.cos(angle) * radius, .18, Math.sin(angle) * radius];
  });
}

function DangerObjectFootprint({ position, color, dashed = false, width = 1.15, depth = 1.75 }) {
  const y = .28;
  const x = width / 2;
  const z = depth / 2;
  return <Line
    points={[[-x, y, -z], [x, y, -z], [x, y, z], [-x, y, z], [-x, y, -z]].map(point => [point[0] + position[0], point[1], point[2] + position[2]])}
    color={color}
    lineWidth={1.15}
    transparent
    opacity={.92}
    dashed={dashed}
    dashSize={.22}
    gapSize={.12}
  />;
}

function StaticRiskDisk({ radius, color, opacity, y = .095 }) {
  return <mesh rotation-x={-Math.PI / 2} position-y={y}>
    <circleGeometry args={[radius, 96]} />
    <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
  </mesh>;
}

function StaticDangerMetricVisuals({ visible, ego, hidden, frontCar, bikeOne, truck }) {
  if (!visible) return null;
  const dangerZoneAnchor = [ego[0] + 1.85, .1, ego[2] - 2.55];
  const riskWeightAnchor = [ego[0] + 2.75, .1, ego[2] - 3.65];
  const outside = [ego[0] + 4.65, .1, ego[2] - 6.1];
  const detectedTruck = [truck[0], .1, truck[2] - .15];
  const ringScale = 1.5;

  return <group>
    <group position={[ego[0], 0, ego[2]]}>
      <StaticRiskDisk radius={7.25 * ringScale} color="#d8e88b" opacity={.11} y={.088} />
      <StaticRiskDisk radius={5.35 * ringScale} color="#ffd15d" opacity={.14} y={.093} />
      <StaticRiskDisk radius={3.45 * ringScale} color="#ff9a50" opacity={.17} y={.098} />
      <StaticRiskDisk radius={1.95 * ringScale} color="#ff5c4d" opacity={.20} y={.103} />
      <Line points={circlePoints(7.25 * ringScale)} color="#ff584f" lineWidth={1.55} transparent opacity={.74} dashed dashSize={.42} gapSize={.28} />
    </group>

    <DangerObjectFootprint position={detectedTruck} color="#36e879" width={1.75} depth={5.2} />
    <DangerObjectFootprint position={hidden} color="#ff5f55" dashed />
    <DangerObjectFootprint position={bikeOne} color="#ff5f55" dashed width={.75} depth={1.25} />
    <DangerObjectFootprint position={outside} color="#cbd4d1" width={1.45} depth={2.05} />

    <SceneMarker
      visible
      position={dangerZoneAnchor}
      label="DANGER ZONE"
      sublabel="static ego-centric boundary"
      color="#ff655c"
      labelOffset={[.45, 1.82, -.35]}
      scale={.78}
    />
    <SceneMarker
      visible
      position={[hidden[0], .1, hidden[2]]}
      label="MISSED GT"
      sublabel="high static weight"
      color="#ff5f55"
      labelOffset={[-1.25, 2.0, -.35]}
      scale={.72}
    />
    <SceneMarker
      visible
      position={detectedTruck}
      label="DETECTED GT"
      sublabel="truck detected"
      color="#36e879"
      labelOffset={[-1.05, 2.15, -.35]}
      scale={.7}
    />
    <SceneMarker
      visible
      position={riskWeightAnchor}
      label="RISK WEIGHT"
      sublabel="closer = higher"
      color="#ffd15d"
      labelOffset={[.35, 1.82, -.25]}
      scale={.74}
    />

    <Html position={[outside[0] + .75, 1.82, outside[2] + .1]} center distanceFactor={10} zIndexRange={[3, 0]}>
      <div className="danger-mini-label outside-zone">OUTSIDE ZONE</div>
    </Html>
  </group>;
}

function MotivationMarkers({ step, ego, collaborator, hidden, bikeOne, bikeTwo, truck, frontCar }) {
  const egoView = step === 2;
  const collaboratorView = step === 3;
  const visibleContext = egoView || collaboratorView;

  return <group>
    <SceneMarker visible={egoView} position={[bikeOne[0], .1, bikeOne[2]]} label="MISSED" sublabel="bike" color="#ff6f61" labelOffset={[-1.45, 2.28, -.25]} />
    <SceneMarker visible={egoView} position={[bikeTwo[0], .1, bikeTwo[2]]} label="MISSED" sublabel="bike" color="#ff6f61" labelOffset={[-1.65, 2.48, -.2]} />

    <SceneMarker visible={egoView} position={[collaborator[0], .1, collaborator[2]]} label="COLLABORATOR" sublabel="source vehicle" color="#62e8a6" labelOffset={[.45, 2.04, .65]} />
    <SceneMarker visible={visibleContext} position={[hidden[0], .1, hidden[2]]} label="VISIBLE" sublabel="red car" color="#62e8a6" labelOffset={[-.65, 1.82, -.15]} />
    <SceneMarker visible={visibleContext} position={[truck[0], .1, truck[2] + .25]} label="VISIBLE" sublabel="truck" color="#62e8a6" labelOffset={[0, 2.35, 0]} />
    <SceneMarker visible={collaboratorView} position={[bikeOne[0], .1, bikeOne[2]]} label="VISIBLE" sublabel="bike" color="#62e8a6" labelOffset={[-.25, 2.55, .05]} scale={.74} />
    <SceneMarker visible={collaboratorView} position={[bikeTwo[0], .1, bikeTwo[2]]} label="VISIBLE" sublabel="bike" color="#62e8a6" labelOffset={[-1.65, 2.48, -.2]} />
    <SceneMarker visible={collaboratorView} position={[frontCar[0], .1, frontCar[2]]} label="VISIBLE" sublabel="front car" color="#62e8a6" labelOffset={[1.45, 1.55, .65]} />

  </group>;
}

function MethodStageVisuals({ step, ego, collaborator }) {
  return <group>
    {step === 7 && <>
      <Float speed={1.05} floatIntensity={.12}>
        <Module position={[-2.8, 2.75, 3.2]} title="BEV CELLS" lines={['top-down feature grid', 'same fusion boundary']} color="#45d5ff" />
      </Float>
    </>}
    <SceneMarker
      visible={step === 10}
      position={[ego[0], .12, ego[2]]}
      label="DECISION"
      sublabel="ego requests snapshot"
      color="#45d5ff"
      labelOffset={[1.35, 2.18, -.18]}
      scale={1.02}
    />
    <SceneMarker
      visible={step === 11}
      position={[ego[0], .12, ego[2]]}
      label="DECISION"
      sublabel="ego checks cache"
      color="#54e6b2"
      labelOffset={[1.28, 2.18, -.22]}
      scale={1.02}
    />
  </group>;
}

function LearnedMapCard({ type = 'ego' }) {
  const classForEgoCell = (row, col) => {
    const inRect = (r0, r1, c0, c1) => row >= r0 && row <= r1 && col >= c0 && col <= c1;
    if (inRect(10, 10, 5, 5)) return 'ego';
    if (inRect(2, 7, 10, 10)) return 'critical';
    if (inRect(1, 3, 5, 7)) return 'missed';
    if (inRect(4, 5, 9, 9) || inRect(5, 6, 5, 6) || inRect(7, 7, 5, 6) || inRect(7, 7, 9, 9) || inRect(5, 5, 3, 3) || inRect(8, 8, 3, 3)) return 'detected';
    return '';
  };

  const classForCollaboratorCell = (row, col) => {
    const inRect = (r0, r1, c0, c1) => row >= r0 && row <= r1 && col >= c0 && col <= c1;
    if (inRect(10, 10, 5, 5)) return 'ego';
    if (inRect(1, 3, 5, 7)) return 'missed';
    if (inRect(2, 3, 3, 3) || inRect(5, 6, 3, 3) || inRect(5, 6, 7, 7) || inRect(6, 7, 5, 5) || inRect(9, 10, 2, 3) || inRect(9, 9, 7, 7)) return 'detected';
    return '';
  };

  const classForUpdatedEgoCell = (row, col) => {
    const inRect = (r0, r1, c0, c1) => row >= r0 && row <= r1 && col >= c0 && col <= c1;
    if (inRect(10, 10, 5, 5)) return 'ego';
    if (
      inRect(0, 0, 6, 6) ||
      inRect(3, 3, 6, 6) ||
      inRect(3, 3, 10, 10) ||
      inRect(4, 4, 3, 3) ||
      inRect(4, 4, 9, 9) ||
      inRect(5, 7, 5, 6) ||
      inRect(6, 6, 10, 10) ||
      inRect(7, 7, 3, 3) ||
      inRect(7, 7, 9, 9)
    ) return 'detected';
    return '';
  };

  const isCollaborator = type === 'collaborator';
  const isUpdatedEgo = type === 'egoUpdated';
  const position = isCollaborator ? [10.35, .72, 2.95] : isUpdatedEgo ? [4.55, 1.14, 11.7] : [5.45, 1.18, 11.85];
  const distanceFactor = isCollaborator ? 7.2 : 5.45;
  const title = isCollaborator ? 'COLLAB CONTEXT MAP' : isUpdatedEgo ? 'UPDATED EGO MAP' : 'EGO NEED MAP';
  const legend = isCollaborator ? 'blue collaborator · green visible · yellow selected' : isUpdatedEgo ? 'blue ego · green received context' : 'blue ego · green detected · yellow missed · red critical';
  const getClass = isCollaborator ? classForCollaboratorCell : isUpdatedEgo ? classForUpdatedEgoCell : classForEgoCell;

  return <Html position={position} center distanceFactor={distanceFactor} zIndexRange={[4, 0]}>
    <div className={`learned-map-card${isCollaborator ? ' collaborator-map-card' : ''}`}>
      <b>{title}</b>
      <div className="learned-map-grid" aria-hidden="true">
        {Array.from({ length: 121 }, (_, i) => {
          const row = Math.floor(i / 11);
          const col = i % 11;
          return <i key={i} className={getClass(row, col)} />;
        })}
      </div>
      <em>{legend}</em>
    </div>
  </Html>;
}

function LearnedTemporalVisuals({ step, ego, collaborator, bikeOne, bikeTwo, hidden, frontCar }) {
  const requestPacket = useRef();
  const responsePacket = useRef();
  const visible = step >= 12 && step <= 15;
  const requestMode = step === 13;
  const collaboratorMode = step === 14;
  const receiveMode = step === 15;

  const busStart = [ego[0] + .55, .48, ego[2] - .35];
  const busMid = [(ego[0] + collaborator[0]) / 2 - .08, 1.04, (ego[2] + collaborator[2]) / 2 - .03];
  const busEnd = [collaborator[0] - .2, .5, collaborator[2] + .1];

  useFrame(({ clock }) => {
    const requestT = (Math.sin(clock.elapsedTime * .8) + 1) / 2;
    const responseT = (Math.sin(clock.elapsedTime * .8 + Math.PI * .28) + 1) / 2;
    const move = (ref, from, to, t, lift = .58) => {
      if (!ref.current) return;
      const arc = Math.sin(t * Math.PI) * .56;
      ref.current.position.set(
        from[0] + (to[0] - from[0]) * t,
        lift + arc,
        from[2] + (to[2] - from[2]) * t
      );
    };
    move(requestPacket, busStart, busEnd, requestT, .58);
    move(responsePacket, busEnd, busStart, responseT, .62);
  });

  if (!visible) return null;

  const packetPositions = [
    [busStart[0] * .72 + busEnd[0] * .28, .64, busStart[2] * .72 + busEnd[2] * .28],
    [busStart[0] * .48 + busEnd[0] * .52, .78, busStart[2] * .48 + busEnd[2] * .52],
    [busStart[0] * .25 + busEnd[0] * .75, .64, busStart[2] * .25 + busEnd[2] * .75],
  ];

  return <group>
    <SceneMarker
      visible={step === 12 || requestMode || receiveMode}
      position={[ego[0], .12, ego[2]]}
      label="DECISION"
      sublabel={step === 12 ? 'ego owns sparse mask' : requestMode ? 'ego predicts request' : 'ego fuses selected cells'}
      color="#e6b23d"
      labelOffset={step === 12 ? [.05, 2.3, -1.65] : [.5, 2.1, -1.05]}
      scale={step === 12 ? .82 : .92}
    />
    <SceneMarker
      visible={step === 12 || collaboratorMode}
      position={[collaborator[0], .12, collaborator[2]]}
      label="LEARNED HEAD"
      sublabel={collaboratorMode ? 'applies request mask' : '6 inputs → request logits'}
      color="#e6b23d"
      labelOffset={[.34, 2.05, .38]}
      scale={.72}
    />

    <Line points={[busStart, busMid, busEnd]} color={requestMode ? '#45d5ff' : '#e6b23d'} lineWidth={5.2} transparent opacity={.82} dashed dashSize={.44} gapSize={.18} />
    <Line points={[busStart, busMid, busEnd]} color="#fff0a8" lineWidth={1.6} transparent opacity={.92} dashed dashSize={.28} gapSize={.24} />

    {step === 12 && packetPositions.map((position, index) => <mesh key={index} position={position}>
      <boxGeometry args={[.28, .1, .28]} />
      <meshBasicMaterial color={index === 1 ? '#fff0a8' : '#e6b23d'} transparent opacity={.88} depthWrite={false} />
    </mesh>)}

    <mesh ref={requestPacket} visible={requestMode || collaboratorMode} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[.16, .28, 28]} />
      <meshBasicMaterial color="#45d5ff" transparent opacity={.92} depthWrite={false} />
    </mesh>
    <mesh ref={responsePacket} visible={collaboratorMode || receiveMode} rotation-x={-Math.PI / 2}>
      <boxGeometry args={[.44, .08, .44]} />
      <meshBasicMaterial color="#fff0a8" transparent opacity={.9} depthWrite={false} />
    </mesh>

    <Html position={[busMid[0], 1.42, busMid[2]]} center distanceFactor={9} zIndexRange={[3, 0]}>
      <div className="learned-bus-card">
        <b>{requestMode ? 'SPARSE REQUEST' : collaboratorMode ? 'SELECTED FEATURES' : receiveMode ? 'SPARSE RESPONSE' : 'LEARNED REQUEST HEAD'}</b>
        <span>{requestMode ? 'ego sends learned request mask' : collaboratorMode ? 'mask applied to remote BEV cells' : receiveMode ? 'selected cells return to ego' : '6 input maps → request probability → Top-K mask'}</span>
      </div>
    </Html>

    {requestMode && <>
      <LearnedMapCard type="ego" />
      <SceneMarker visible position={[bikeOne[0], .1, bikeOne[2]]} label="MISSING" sublabel="bike" color="#ff6f61" labelOffset={[-1.25, 2.35, -.25]} scale={.78} />
      <SceneMarker visible position={[bikeTwo[0], .1, bikeTwo[2]]} label="MISSING" sublabel="bike" color="#ff6f61" labelOffset={[-1.35, 2.48, -.25]} scale={.78} />
      <SceneMarker visible position={[frontCar[0], .1, frontCar[2]]} label="MISSING" sublabel="front car" color="#ff6f61" labelOffset={[.8, 1.78, .45]} scale={.78} />
    </>}

    {collaboratorMode && <>
      <LearnedMapCard type="collaborator" />
      <SceneMarker visible position={[bikeOne[0], .1, bikeOne[2]]} label="VISIBLE" sublabel="bike cell" color="#62e8a6" labelOffset={[-.25, 2.45, .05]} scale={.74} />
      <SceneMarker visible position={[bikeTwo[0], .1, bikeTwo[2]]} label="VISIBLE" sublabel="bike cell" color="#62e8a6" labelOffset={[-1.45, 2.36, -.15]} scale={.74} />
      <SceneMarker visible position={[hidden[0], .1, hidden[2]]} label="VISIBLE" sublabel="car cell" color="#62e8a6" labelOffset={[-.75, 1.88, -.15]} scale={.8} />
      <SceneMarker visible position={[frontCar[0], .1, frontCar[2]]} label="SELECTED" sublabel="remote feature" color="#fff0a8" labelOffset={[1.1, 1.72, .55]} scale={.8} />
      {[bikeOne, bikeTwo, hidden, frontCar].map((position, index) => <SnapshotCell key={`learned-select-${index}`} position={[position[0], .22, position[2]]} color={index === 3 ? '#fff0a8' : '#62e8a6'} selected delay={index * .42} />)}
    </>}

    {receiveMode && <>
      <LearnedMapCard type="egoUpdated" />
      <SceneMarker visible position={[bikeOne[0], .1, bikeOne[2]]} label="AVAILABLE" sublabel="received bike" color="#62e8a6" labelOffset={[-.25, 2.45, .05]} scale={.78} />
      <SceneMarker visible position={[bikeTwo[0], .1, bikeTwo[2]]} label="AVAILABLE" sublabel="received bike" color="#62e8a6" labelOffset={[-1.35, 2.38, -.15]} scale={.78} />
      <SceneMarker visible position={[frontCar[0], .1, frontCar[2]]} label="AVAILABLE" sublabel="received car" color="#62e8a6" labelOffset={[.98, 1.72, .55]} scale={.78} />
      {[bikeOne, bikeTwo, frontCar].map((position, index) => <SnapshotCell key={`learned-receive-${index}`} position={[position[0], .24, position[2]]} color="#d8fbff" selected delay={index * .5} />)}
    </>}
  </group>;
}

export function RoadScene({step, theme = SCENE_CONFIG.theme}) {
  const sun=useRef();
  const palette=THEMES[theme]||THEMES.day;
  useFrame(({clock})=>{if(sun.current)sun.current.position.x=Math.sin(clock.elapsedTime*.08)*7+12});
  const ego=mapVehicle(399,620), truck=mapVehicle(399,465,30,100);
  const collab=mapVehicle(490,490), hidden=mapVehicle(490,370), frontCar=mapVehicle(399,340);
  const bikeOne=[mapX(545),.16,mapZ(465)], bikeTwo=[mapX(545),.16,mapZ(335)];
  return <>
    <color attach="background" args={[palette.sky]}/><fog attach="fog" args={[palette.fog,34,76]}/>
    <ambientLight intensity={palette.ambient}/><hemisphereLight args={['#eef7f7','#73796f',1.18]}/>
    <directionalLight ref={sun} castShadow position={[16,26,12]} intensity={palette.sun} color="#fff1d4" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-34} shadow-camera-right={34} shadow-camera-top={34} shadow-camera-bottom={-34} shadow-camera-far={70} shadow-bias={-.00018} shadow-radius={5}/>
    <RoadSurface palette={palette}/>
    <Building position={[mapX(65),4.7,mapZ(270)]} size={[6.1,9.4,11.1]} color="#6f7e83" accent="#d4a866"/>
    <Building position={[mapX(65),4.2,mapZ(540)]} size={[6.1,8.4,11.1]} color="#617276" accent="#9fb9ba"/>
    <GreenPocket position={[mapX(645),.2,mapZ(270)]} width={6.1} depth={10.6}/>
    <GreenPocket position={[mapX(645),.2,mapZ(540)]} width={6.1} depth={10.6}/>
    <GreenPocket position={[mapX(645),.2,mapZ(405)]} width={6.1} depth={2.1}/>
    <PedestrianPlaza showPedestrians={SCENE_CONFIG.showPedestrians}/>
    <UrbanProps showStreetFurniture={SCENE_CONFIG.showStreetFurniture}/>
    {SCENE_CONFIG.repoInspiredDetails && <RepoInspiredEnhancements step={step}/>}

    <Car position={ego} rotation={carUpLane} color="#1976a8" ego/>
    <Car position={collab} rotation={carUpLane} color="#bd8126" collaborator={step > 0}/>
    <Truck position={truck} rotation={truckUpLane} color="#68777f"/>
    <Bike position={bikeOne} rotation={Math.PI / 2} color="#587f92" accent="#f2d06d"/>
    <Bike position={bikeTwo} rotation={Math.PI / 2} color="#6f8f68" accent="#f0cb64"/>
    <Car position={frontCar} rotation={carUpLane} color="#68787e"/>
    <Car position={mapVehicle(290,520)} rotation={carDownLane} color="#7a8589"/>
    <Car position={mapVehicle(290,620)} rotation={carDownLane} color="#87969b"/>
    <Car position={mapVehicle(200,470)} rotation={carDownLane} color="#526d77"/>
    <Car position={mapVehicle(200,200)} rotation={carDownLane} color="#74848b"/>
    <Car position={mapVehicle(300,240)} rotation={carDownLane} color="#78888c"/>
    <Car position={mapVehicle(300,400)} rotation={carDownLane} color="#8b4650"/>
    <Car position={mapVehicle(510,220)} rotation={carUpLane} color="#6f7d82"/>
    <Car position={mapVehicle(400,200)} rotation={carUpLane} color="#576d77"/>
    <Car position={hidden} rotation={carUpLane} color="#d45545"/>
    <MotivationMarkers step={step} ego={ego} collaborator={collab} hidden={hidden} bikeOne={bikeOne} bikeTwo={bikeTwo} truck={truck} frontCar={frontCar}/>
    <MethodStageVisuals step={step} ego={ego} collaborator={collab}/>
    <FullCommunicationStream visible={step===8} from={collab} to={ego}/>
    <FullCommunicationMarkers visible={step===8} collaborator={collab}/>
    <TopKSelectedStream visible={step===9} from={collab} to={ego}/>
    <SnapshotRequestVisuals visible={step===10} ego={ego} collaborator={collab}/>
    <LearnedTemporalVisuals step={step} ego={ego} collaborator={collab} bikeOne={bikeOne} bikeTwo={bikeTwo} hidden={hidden} frontCar={frontCar}/>
    <StaticDangerMetricVisuals visible={step===18} ego={ego} hidden={hidden} frontCar={frontCar} bikeOne={bikeOne} truck={truck}/>

    <SensorField position={[ego[0],.09,ego[2]+.6]} rotation={0} visible={step>=2&&step<=15}/><SensorField position={[collab[0],.1,collab[2]]} rotation={0} color="#e2aa2e" radius={13} opacity={step===3?.12:step===8?.2:step>=12?.15:.08} visible={(step>=3&&step<=5)||(step>=8&&step<=15)}/>
    <BEVGrid visible={step>=4&&step<=20}/><Trajectory visible={step>=19&&step<=20}/>
    <group visible={step>=3&&step!==8&&step!==9&&step!==10&&step!==12&&step!==13&&step!==14&&step!==15}><CommunicationArrow from={collab} to={ego} dense={step===4} color={step===4?'#e7604c':'#35d89b'}/></group><group visible={step===5||step===6}><CommunicationArrow from={ego} to={collab} color="#0fbbe9"/></group><group visible={step===11||step>=19}><CommunicationArrow from={collab} to={ego} color="#35d89b"/></group>
  </>;
}
