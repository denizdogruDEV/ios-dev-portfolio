import { useRef, useEffect, useState } from 'react';
import { useGLTF, Text, Plane } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MeshBasicMaterial, Group, Color, Mesh, MeshStandardMaterial } from 'three';

// Define the props type with timeOfDay
interface PhoneModelProps {
  timeOfDay?: number;
  theme?: 'day' | 'sunset' | 'night';
}

interface ButtonData {
  label: string;
  position: [number, number, number];
}

export default function PhoneModel({ timeOfDay = 0.3, theme = 'day' }: PhoneModelProps) {
  // Determine if it's night time (for model selection)
  const isNightTime = timeOfDay > 0.6 || timeOfDay < 0.2;
  
  // Select phone model based on time of day
  const modelTheme = isNightTime ? 'black' : 'white';
  const modelPath = `${import.meta.env.BASE_URL}iphone12pro-${modelTheme}.glb`;
  
  // Load the model
  const { scene } = useGLTF(modelPath);
  const phoneRef = useRef<Group>(null);
  
  // For screen glowing effect
  const screenRef = useRef<Mesh<any, MeshStandardMaterial> | null>(null);
  
  // Colors based on selected theme
  const getThemeColors = () => {
    switch(theme) {
      case 'sunset':
        return {
          primary: '#ff7e5f',
          secondary: '#feb47b',
          accent: '#ffcc00'
        };
      case 'night':
        return {
          primary: '#08f7fe',
          secondary: '#09fbd3',
          accent: '#fe53bb'
        };
      case 'day':
      default:
        return {
          primary: '#333333',
          secondary: '#666666',
          accent: '#888888'
        };
    }
  };
  
  const colors = getThemeColors();
  
  // Create materials for UI elements
  const buttonOutlineMaterial = new MeshBasicMaterial({
    color: colors.secondary,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  
  // For animated hover effect on buttons
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  
  // Center the phone and setup the model
  useEffect(() => {
    if (phoneRef.current) {
      // Rotate to show the screen (front) of the phone
      phoneRef.current.rotation.set(0, 0, 0);
      
      // Make sure position is centered and slightly lower
      phoneRef.current.position.set(0, -3, 0);
      
      // Find the screen mesh to add glow effect
      scene.traverse((child: any) => {
        if (child.isMesh && child.name.includes('screen')) {
          // Make sure the material is a MeshStandardMaterial for emissive properties
          if (child.material && !Array.isArray(child.material)) {
            // If it's not already a MeshStandardMaterial, create one
            if (!(child.material instanceof MeshStandardMaterial)) {
              const oldMaterial = child.material;
              const newMaterial = new MeshStandardMaterial({
                color: oldMaterial.color,
                map: oldMaterial.map,
                transparent: oldMaterial.transparent,
                opacity: oldMaterial.opacity
              });
              child.material = newMaterial;
            }
            screenRef.current = child as Mesh<any, MeshStandardMaterial>;
          }
        }
      });
    }
  }, [scene]);
  
  // Dynamic animations
  useFrame((state) => {
    if (phoneRef.current) {
      // Smooth rotation that keeps the screen visible
      phoneRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.8;
      
      // Add subtle floating movement
      phoneRef.current.position.y = -3 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
      
      // Make screen glow effect pulse based on time
      if (screenRef.current && isNightTime) {
        const intensity = Math.sin(state.clock.getElapsedTime() * 2) * 0.15 + 0.85;
        screenRef.current.material.emissive = new Color(colors.secondary);
        screenRef.current.material.emissiveIntensity = intensity;
      }
    }
  });
  
  // Button hover animation parameters
  const getButtonScale = (index: number) => {
    return hoveredButton === index ? 1.1 : 1.0;
  };
  
  const getButtonColor = (index: number) => {
    return hoveredButton === index ? colors.accent : colors.secondary;
  };
  
  // Button data with explicitly typed positions
  const buttons: ButtonData[] = [
    { label: "PROFILE", position: [0, 0, 0.1] },
    { label: "WORKS", position: [0, 0, 0.1] },
    { label: "CONTACT", position: [0, 0, 0.1] }
  ];
  
  return (
    <group ref={phoneRef} scale={0.08}>
      <primitive object={scene} />
      
      {/* 3D Text that will move with the phone model */}
      <Text
        position={[0, 75, 5]}
        fontSize={5}
        color={colors.secondary}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineOpacity={0.6}
        outlineWidth={0.05}
      >
        HELLO! I'M
      </Text>
      <Text
        position={[0, 68, 5]}
        fontSize={7}
        color={colors.secondary}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineOpacity={0.6}
        outlineWidth={0.05}
      >
        YIGIT SERIN
      </Text>
      <Text
        position={[1, 50, 5]}
        fontSize={5}
        color={colors.primary}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineOpacity={0.6}
        outlineWidth={0.05}
      >
        IOS DEVELOPER
      </Text>
      <Text
        position={[1.5, 45, 5]}
        fontSize={3}
        color={colors.primary}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineOpacity={0.6}
        outlineWidth={0.05}
      >
        BASED IN NETHERLANDS
      </Text>
      
      {/* Interactive buttons */}
      <group position={[0, 35, 5]}>
        {buttons.map((button, index) => (
          <group 
            key={index} 
            position={[0, -10 * index, 0]}
            scale={[getButtonScale(index), getButtonScale(index), 1]}
            onPointerOver={() => setHoveredButton(index)}
            onPointerOut={() => setHoveredButton(null)}
          >
            <Plane 
              args={[25, 7]} 
              material={buttonOutlineMaterial.clone()}
              position={[0, 0, 0]}
            >
              {/* We need to modify the material for each button */}
              <meshBasicMaterial 
                attach="material" 
                color={getButtonColor(index)} 
                wireframe={true} 
                transparent={true} 
                opacity={0.8} 
              />
            </Plane>
            <Text
              position={button.position}
              fontSize={5}
              color={getButtonColor(index)}
              anchorX="center"
              anchorY="middle"
            >
              {button.label}
            </Text>
          </group>
        ))}
      </group>
      
      {/* Add floating particles around the phone for night mode */}
      {isNightTime && Array.from({ length: 20 }).map((_, i) => (
        <mesh 
          key={i}
          position={[
            Math.sin(i * 0.5) * 15,
            Math.cos(i * 0.3) * 20,
            Math.sin(i * 0.7) * 5
          ]}
        >
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? colors.primary : colors.secondary} 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      ))}
    </group>
  );
}