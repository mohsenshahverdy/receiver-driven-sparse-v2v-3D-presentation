export function Building({ position, size, color = '#263039', accent = '#7faebb' }) {
  const rows = Math.max(2, Math.floor(size[1] / 1.8));
  const cols = Math.max(2, Math.floor(size[0] / 2.35));
  const windowInset = size[2] / 2 + .06;
  const windows = Array.from({ length: rows * cols }, (_, i) => {
    const x = (i % cols - (cols - 1) / 2) * 1.92;
    const y = (Math.floor(i / cols) - (rows - 1) / 2) * 1.52;
    const lit = i % 5 === 0 || i % 9 === 0;
    return <group key={i} position={[x, y, windowInset]}>
      <mesh>
        <boxGeometry args={[1.18, 1.02, .16]} />
        <meshStandardMaterial color={accent} roughness={.42} metalness={.08} />
      </mesh>
      <mesh position-z={.088}>
        <planeGeometry args={[.92, .72]} />
        <meshPhysicalMaterial
          color={lit ? '#d9c892' : '#203742'}
          emissive={lit ? '#c4a86d' : '#10262c'}
          emissiveIntensity={lit ? .2 : .05}
          metalness={.42}
          roughness={.12}
        />
      </mesh>
      <mesh position={[0, 0, .03]}>
        <boxGeometry args={[1.34, 1.1, .04]} />
        <meshStandardMaterial color="#55656c" transparent opacity={.25} />
      </mesh>
    </group>;
  });

  const floors = Array.from({ length: Math.max(1, rows - 1) }, (_, i) => {
    const y = (i - (rows - 2) / 2) * 1.52;
    return <mesh key={i} position={[0, y, size[2] / 2 + .03]}>
      <boxGeometry args={[size[0] - .6, .08, .12]} />
      <meshStandardMaterial color="#4d5d63" roughness={.55} />
    </mesh>;
  });

  const sideWindows = Array.from({ length: Math.max(3, rows) }, (_, i) => {
    const y = (i - (rows - 1) / 2) * 1.48;
    return <group key={i} position={[size[0] / 2 + .04, y, 0]} rotation-y={Math.PI / 2}>
      <mesh>
        <boxGeometry args={[1.08, .84, .11]} />
        <meshStandardMaterial color="#4c6066" roughness={.52} />
      </mesh>
      <mesh position-z={.07}>
        <planeGeometry args={[.84, .58]} />
        <meshPhysicalMaterial color={i % 3 === 0 ? '#cdbb86' : '#1c343c'} emissive={i % 3 === 0 ? '#b69a58' : '#0d2329'} emissiveIntensity={i % 3 === 0 ? .16 : .04} metalness={.48} roughness={.14} />
      </mesh>
    </group>;
  });

  const balconies = Array.from({ length: Math.max(1, Math.floor(cols / 2)) }, (_, i) => {
    const x = (i - (Math.floor(cols / 2) - 1) / 2) * 3.1;
    const y = Math.min(size[1] / 2 - 1.25, -.4 + i * 1.5);
    return <group key={i} position={[x, y, size[2] / 2 + .34]}>
      <mesh castShadow>
        <boxGeometry args={[1.55, .08, .5]} />
        <meshStandardMaterial color="#56666a" metalness={.26} roughness={.44} />
      </mesh>
      <mesh position={[0, .26, .22]} castShadow>
        <boxGeometry args={[1.55, .42, .05]} />
        <meshStandardMaterial color="#2d3b40" metalness={.46} roughness={.3} transparent opacity={.72} />
      </mesh>
      {[-.56, 0, .56].map(r => <mesh key={r} position={[r, .2, .24]}>
        <boxGeometry args={[.035, .38, .035]} />
        <meshStandardMaterial color="#6d7b7f" metalness={.55} roughness={.26} />
      </mesh>)}
    </group>;
  });

  return <group position={position}>
    <mesh receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={.66} metalness={.08} />
    </mesh>
    <mesh receiveShadow castShadow position={[0, 0, size[2] / 2 + .14]}>
      <boxGeometry args={[size[0] - .55, size[1] - .55, .1]} />
      <meshStandardMaterial color="#334247" roughness={.5} />
    </mesh>
    <mesh position={[0, -size[1] / 2 + .72, size[2] / 2 + .18]}>
      <planeGeometry args={[size[0] - 1.1, 1.14]} />
      <meshPhysicalMaterial color="#182e36" metalness={.5} roughness={.14} />
    </mesh>
    <mesh position={[-size[0] / 2 + .9, -size[1] / 2 + .76, size[2] / 2 + .27]}>
      <boxGeometry args={[.58, 1.04, .08]} />
      <meshStandardMaterial color="#1f2e34" metalness={.3} roughness={.22} />
    </mesh>
    <mesh position={[size[0] / 2 - .9, -size[1] / 2 + .76, size[2] / 2 + .27]}>
      <boxGeometry args={[.58, 1.04, .08]} />
      <meshStandardMaterial color="#1f2e34" metalness={.3} roughness={.22} />
    </mesh>
    <mesh position={[0, -size[1] / 2 + 1.42, size[2] / 2 + .38]} castShadow>
      <boxGeometry args={[size[0] - .65, .16, .52]} />
      <meshStandardMaterial color={accent} metalness={.25} roughness={.36} />
    </mesh>
    <mesh position={[0, -size[1] / 2 + .12, size[2] / 2 + .2]}>
      <boxGeometry args={[size[0] - .4, .2, .2]} />
      <meshStandardMaterial color="#303d42" roughness={.62} />
    </mesh>
    <mesh position={[0, -size[1] / 2 + .71, size[2] / 2 + .26]}>
      <boxGeometry args={[size[0] - 1.1, .12, .12]} />
      <meshStandardMaterial color={accent} roughness={.62} />
    </mesh>
    {floors}
    {windows}
    {sideWindows}
    {balconies}
    {Array.from({ length: cols - 1 }, (_, i) => <mesh key={i} position={[(i - (cols - 2) / 2) * 1.92 + .96, 0, size[2] / 2 + .08]}>
      <boxGeometry args={[.08, size[1] - .3, .16]} />
      <meshStandardMaterial color="#45565c" roughness={.52} />
    </mesh>)}
    <mesh position={[0, size[1] / 2 + .14, 0]}>
      <boxGeometry args={[size[0] + .38, .18, size[2] + .38]} />
      <meshStandardMaterial color="#3b4b50" metalness={.24} roughness={.46} />
    </mesh>
    <mesh position={[0, size[1] / 2 + .28, 0]}>
      <boxGeometry args={[size[0] - .72, .1, size[2] - .72]} />
      <meshStandardMaterial color={accent} roughness={.56} />
    </mesh>
    <mesh position={[-size[0] / 2 + 1.1, size[1] / 2 + .52, -size[2] / 2 + 1.2]} castShadow>
      <boxGeometry args={[1.1, .32, .82]} />
      <meshStandardMaterial color="#536166" metalness={.32} roughness={.42} />
    </mesh>
    <mesh position={[size[0] / 2 - 1.15, size[1] / 2 + .55, size[2] / 2 - 1.35]} castShadow>
      <boxGeometry args={[.95, .38, .95]} />
      <meshStandardMaterial color="#47565b" metalness={.4} roughness={.36} />
    </mesh>
    <mesh position={[size[0] / 2 - 1.15, size[1] / 2 + .9, size[2] / 2 - 1.35]} castShadow>
      <cylinderGeometry args={[.28, .28, .42, 14]} />
      <meshStandardMaterial color="#39484d" metalness={.5} roughness={.28} />
    </mesh>
  </group>;
}
