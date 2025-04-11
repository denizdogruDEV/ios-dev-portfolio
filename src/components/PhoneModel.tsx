import { useRef, useEffect } from 'react';
import { useGLTF, Text, Plane } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MeshBasicMaterial, Color } from 'three';

export default function PhoneModel() {
  const { scene } = useGLTF('/iphone12pro.glb');
  const phoneRef = useRef(null);
   // Colors for cyberpunk theme
   const neonPink = '#ff3cb4';
   const neonBlue = '#00e5ff';
   
   // Create dark screen material with blue glow
   const screenMaterial = new MeshBasicMaterial({
     color: new Color('#000000'),
     transparent: true,
     opacity: 0.95
   });
   const buttonOutlineMaterial = new MeshBasicMaterial({
    color: neonBlue,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  // Center the phone and show the screen
  useEffect(() => {
    if (phoneRef.current) {
      // Rotate to show the screen (front) of the phone
      phoneRef.current.rotation.set(0, 0, 0);
      
      // Make sure position is centered and slightly lower
      phoneRef.current.position.set(0, -3, 0);
    }
  }, []);
  
  // Add subtle rotation animation that maintains the front view
  useFrame((state) => {
    if (phoneRef.current) {
      // Very slight rotation that keeps the screen visible
      phoneRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 1;
    }
  });
  
  return (
    <group ref={phoneRef} scale={0.08}>
      <primitive object={scene} />
      
      {/* 3D Text that will move with the phone model */}
      <Text
        position={[0, 75, 5]}
        fontSize={5}
        color={neonPink}
        anchorX="center"
        anchorY="middle"
        background="#00000099"
        padding={[8, 16]}
        borderRadius={4}
      >
        HELLO! I'M
      </Text>
      <Text
        position={[0, 65, 5]}
        fontSize={7}
        color={neonPink}
        anchorX="center"
        anchorY="middle"
        background="#00000099"
        padding={[8, 16]}
        borderRadius={4}
      >
        YIGIT SERIN
      </Text>
      <Text
        position={[0, 50, 5]}
        fontSize={5}
        color={neonPink}
        anchorX="center"
        anchorY="middle"
        background="#00000099"
        padding={[8, 16]}
        borderRadius={4}
      >
        IOS DEVELOPER
      </Text>
      <Text
        position={[0, 45, 5]}
        fontSize={3}
        color={neonPink}
        anchorX="center"
        anchorY="middle"
        background="#00000099"
        padding={[8, 16]}
        borderRadius={4}
      >
        BASED IN NETHERLANDS
      </Text>
      <group position={[0, 35, 5]}>
        <Plane 
          args={[20, 5]} 
          material={buttonOutlineMaterial}
        />
        <Text
          position={[0, 0, 0.1]}
          fontSize={5}
          color={neonBlue}
          anchorX="center"
          anchorY="middle"
        >
          PROFILE
        </Text>
        <Plane
          position={[0, -10, 0.1]}
          args={[20, 5]} 
          material={buttonOutlineMaterial}
        />
        <Text
          position={[0, -10, 0.1]}
          fontSize={5}
          color={neonBlue}
          anchorX="center"
          anchorY="middle"
        >
          WORKS
        </Text>
        <Plane
          position={[0, -20, 0.1]}
          args={[25, 5]} 
          material={buttonOutlineMaterial}
        />
        <Text
          position={[0, -20, 0.1]}
          fontSize={5}
          color={neonBlue}
          anchorX="center"
          anchorY="middle"
        >
          CONTACT
        </Text>
      </group>
    </group>
  );
}