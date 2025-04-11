import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export default function PhoneModel() {
  const { scene } = useGLTF('/iphone12pro.glb');
  const phoneRef = useRef<Group>(null);
  
  // Center the phone and show the screen
  useEffect(() => {
    if (phoneRef.current) {
      // Rotate to show the screen (front) of the phone
      // Adjusted rotation values to show the front screen
      phoneRef.current.rotation.set(0, 0, 0);
      
      // Make sure position is centered and slightly lower
      phoneRef.current.position.set(0, -3, 0);
    }
  }, []);
  
  // Add subtle rotation animation that maintains the front view
  useFrame((state) => {
    if (phoneRef.current) {
      // Very slight rotation that keeps the screen visible
      // Starting from 0 and applying small variations
      phoneRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 1;
    }
  });
  
  return (
    <group ref={phoneRef} scale={0.08}>
      <primitive object={scene} />
    </group>
  );
}