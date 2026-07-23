import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

export function CameraController({ step }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(...step.target));
  const tweenRef = useRef(null);

  useEffect(() => {
    tweenRef.current?.kill();
    const nextPosition = new THREE.Vector3(...step.camera);
    const nextTarget = new THREE.Vector3(...step.target);
    const travel = camera.position.distanceTo(nextPosition) + targetRef.current.distanceTo(nextTarget);
    const duration = Math.min(2.65, Math.max(1.35, travel * .075));

    const state = {
      px: camera.position.x,
      py: camera.position.y,
      pz: camera.position.z,
      tx: targetRef.current.x,
      ty: targetRef.current.y,
      tz: targetRef.current.z,
    };

    tweenRef.current = gsap.to(state, {
      px: nextPosition.x,
      py: nextPosition.y,
      pz: nextPosition.z,
      tx: nextTarget.x,
      ty: nextTarget.y,
      tz: nextTarget.z,
      duration,
      ease: 'power3.inOut',
      overwrite: true,
      onUpdate: () => {
        camera.position.set(state.px, state.py, state.pz);
        targetRef.current.set(state.tx, state.ty, state.tz);
        camera.lookAt(targetRef.current);
        camera.updateProjectionMatrix();
      },
      onComplete: () => {
        camera.position.copy(nextPosition);
        targetRef.current.copy(nextTarget);
        camera.lookAt(targetRef.current);
      }
    });

    return () => tweenRef.current?.kill();
  }, [camera, step]);
  return null;
}
