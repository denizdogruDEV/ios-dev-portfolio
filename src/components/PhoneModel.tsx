import { useRef, useEffect } from 'react';
import { useGLTF, Text, Plane } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MeshBasicMaterial, Group } from 'three';

export default function PhoneModel() {
  const modelPath = `${import.meta.env.BASE_URL}iphone12pro.glb`;
  const { scene } = useGLTF(modelPath);
  const phoneRef = useRef<Group>(null);
  
  // Colors for cyberpunk theme
  const neonPink = '#ff3cb4';
  const neonBlue = '#00e5ff';
  
  // Enhanced button outline with stronger glow
  const buttonOutlineMaterial = new MeshBasicMaterial({
    color: neonBlue,
    wireframe: true,
    transparent: true,
    opacity: 0.8
    // Note: emissive is removed as it's not valid for MeshBasicMaterial
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
        color={neonBlue}
        anchorX="center"
        anchorY="middle"
        // Using outlineColor and outlineWidth instead of background
        outlineColor="#000000"
        outlineOpacity={0.6}
        outlineWidth={0.05}
        // Removed padding
      >
        HELLO! I'M
      </Text>
      <Text
        position={[0, 68, 5]}
        fontSize={7}
        color={neonBlue}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineOpacity={0.6}
        outlineWidth={0.05}
      >
        YIGIT SERIN
      </Text>
      <Text
        position={[0, 50, 5]}
        fontSize={5}
        color={neonPink}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineOpacity={0.6}
        outlineWidth={0.05}
      >
        IOS DEVELOPER
      </Text>
      <Text
        position={[0, 45, 5]}
        fontSize={3}
        color={neonPink}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineOpacity={0.6}
        outlineWidth={0.05}
      >
        BASED IN NETHERLANDS
      </Text>
      <group position={[0, 35, 5]}>
        <Plane 
          args={[25, 7]} 
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
          args={[25, 7]} 
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
          args={[25, 7]} 
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