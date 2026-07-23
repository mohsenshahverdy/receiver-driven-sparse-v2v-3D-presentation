import { Component, useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ChevronLeft, ChevronRight, Maximize2, Moon, Sun } from 'lucide-react';
import * as THREE from 'three';
import { RoadScene } from './components/RoadScene';
import { CameraController } from './components/CameraController';
import { EvidenceOverlay } from './components/EvidenceOverlay';
import { STEPS } from './data/steps';

function TextOverlay({ step, index }) {
  return <div className="copy" key={index}>
    <div className="eyebrow"><span>{String(index + 1).padStart(2, '0')}</span>{step.eyebrow}</div>
    <h1>{step.title.split('\n').map((x, i) => <span key={i}>{x}</span>)}</h1>
    <p>{step.body.split('\n').map((x, i) => <span key={i}>{x}</span>)}</p>
  </div>;
}

class SceneErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error) { console.error('3D scene failed to render:', error); }
  componentDidUpdate(previousProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) return <div className="scene-error"><strong>3D scene unavailable</strong><span>{this.state.error.message}</span><button onClick={() => location.reload()}>Reload scene</button></div>;
    return this.props.children;
  }
}

export default function App() {
  const [step, setStep] = useState(() => {
    const requested = Number(new URLSearchParams(window.location.search).get('step'));
    return Number.isFinite(requested) ? Math.max(0, Math.min(STEPS.length - 1, requested)) : 0;
  });
  const [theme, setTheme] = useState('day');
  const go = useCallback(d => setStep(s => Math.max(0, Math.min(STEPS.length - 1, s + d))), []);
  useEffect(() => {
    const onKey = e => { if (e.key === 'ArrowRight' || e.key === ' ') go(1); if (e.key === 'ArrowLeft') go(-1); };
    addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey);
  }, [go]);
  return <main>
    <SceneErrorBoundary resetKey={`${step}-${theme}`}>
      <Canvas shadows dpr={[1,1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.05;gl.outputColorSpace=THREE.SRGBColorSpace;gl.shadowMap.type=THREE.PCFSoftShadowMap}} camera={{ position: STEPS[step].camera, fov: 43 }} fallback={<div className="scene-error"><strong>WebGL is unavailable</strong><span>Enable hardware acceleration in your browser and reload.</span></div>}>
        <RoadScene step={step} theme={theme} />
        <CameraController step={STEPS[step]} />
      </Canvas>
    </SceneErrorBoundary>
    <header><div className="mark">V2V<span>/</span>SPARSE</div><div className="top-actions"><div className="thesis">MASTER THESIS · 2026</div><button className="theme-toggle" onClick={() => setTheme(value => value === 'day' ? 'night' : 'day')} aria-label={`Switch to ${theme === 'day' ? 'night' : 'day'} mode`}>{theme === 'day' ? <Moon /> : <Sun />}<span>{theme === 'day' ? 'Night' : 'Day'}</span></button></div></header>
    <TextOverlay step={STEPS[step]} index={step} />
    <EvidenceOverlay visual={STEPS[step].visual} />
    <aside className="rail" aria-label="Presentation sections">
      {STEPS.map((s, i) => <button key={s.label} onClick={() => setStep(i)} className={i === step ? 'active' : ''} aria-label={s.label}><i /> <span>{s.label}</span></button>)}
    </aside>
    <footer>
      <div className="progress"><b>{String(step + 1).padStart(2, '0')}</b><div><i style={{ width: `${(step + 1) / STEPS.length * 100}%` }} /></div><span>{String(STEPS.length).padStart(2, '0')}</span></div>
      <div className="controls"><span>← → keys</span><button onClick={() => go(-1)} disabled={!step}><ChevronLeft /></button><button className="next" onClick={() => go(1)} disabled={step === STEPS.length - 1}><span>Next</span><ChevronRight /></button><button className="fullscreen" onClick={() => document.documentElement.requestFullscreen?.()}><Maximize2 /></button></div>
    </footer>
    <div className="scene-scrim" /><div className="grain" />
  </main>;
}
