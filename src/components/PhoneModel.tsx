import { useRef, useEffect, useState } from 'react';
import { useGLTF, Text, Plane } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshBasicMaterial, Group, Color, Mesh, MeshStandardMaterial, Shape, ExtrudeGeometry, Vector3 } from 'three';
import { colors } from '../styles/theme';
import gsap from 'gsap';

interface ButtonData {
  label: string;
  position: [number, number, number];
}

export default function PhoneModel({ orbitControlsRef }: { orbitControlsRef: any }) {
  // Load the model
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}iphone12pro-white.glb`);
  const phoneRef = useRef<Group>(null);
  
  // For screen glowing effect
  const screenRef = useRef<Mesh<any, MeshStandardMaterial> | null>(null);
  
  // Create materials for UI elements
  const buttonOutlineMaterial = new MeshBasicMaterial({
    color: colors.secondary,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  
  // For animated hover effect on buttons
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  
  // Get camera
  const { camera } = useThree();

  // Center the phone and setup the model
  useEffect(() => {
    if (phoneRef.current) {
      // Rotate to show the screen (front) of the phone
      phoneRef.current.rotation.set(0, 0, 0);
      
      // Make sure position is centered and slightly lower
      phoneRef.current.position.set(0, -3, 0);
      
      // Find the screen mesh to add glow effect
      scene.traverse((child: any) => {
        if (child.isMesh) {
          // Make sure the material is a MeshStandardMaterial for emissive properties
          if (child.material && !Array.isArray(child.material)) {
            // If it's not already a MeshStandardMaterial, create one
            if (!(child.material instanceof MeshStandardMaterial)) {
              const oldMaterial = child.material;
              const newMaterial = new MeshStandardMaterial({
                color: oldMaterial.color,
                map: oldMaterial.map,
                transparent: false,  // Ensure phone model is not transparent
                opacity: 1.0,        // Ensure full opacity
                roughness: 0.5,      // Add some roughness for better material appearance
                metalness: 0.8       // Add some metalness for better material appearance
              });
              child.material = newMaterial;
            }
            
            // Only set screenRef for the screen mesh
            if (child.name.includes('screen')) {
              screenRef.current = child as Mesh<any, MeshStandardMaterial>;
            }
          }
        }
      });
    }
  }, [scene]);
  
  // Function to handle button click
  const handleButtonClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const targetPosition = new Vector3(0, 0, isZoomedIn ? 30 : 15);
    const targetRotation = new Vector3(0, 0, 0);

    // Animate camera position and rotation
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        setIsAnimating(false);
        setIsZoomedIn(!isZoomedIn);
      }
    });

    // Animate phone rotation
    if (phoneRef.current) {
      gsap.to(phoneRef.current.rotation, {
        x: targetRotation.x,
        y: targetRotation.y,
        z: targetRotation.z,
        duration: 1.5,
        ease: "power2.inOut"
      });
    }

    // Disable/Enable controls
    if (orbitControlsRef.current) {
      orbitControlsRef.current.autoRotate = isZoomedIn;
      orbitControlsRef.current.enabled = isZoomedIn;
    }
  };

  // Dynamic animations
  useFrame((state) => {
    if (phoneRef.current && !isZoomedIn && !isAnimating) {
      // Only apply floating and rotation animations when not zoomed in
      phoneRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.8;
      phoneRef.current.position.y = -3 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
  });
  
  // Button hover animation parameters
  const getButtonScale = (index: number) => {
    return hoveredButton === index ? 1.1 : 1.0;
  };
  
  const getButtonColor = (index: number) => {
    return hoveredButton === index ? colors.accent : colors.secondary;
  };
  
  // Create rounded rectangle shape for buttons
  const createRoundedRectShape = (width: number, height: number, radius: number) => {
    const shape = new Shape();
    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    return shape;
  };

  // Create a geometry for rounded rectangle buttons
  const createButtonGeometry = (width: number, height: number, radius: number) => {
    const shape = createRoundedRectShape(width, height, radius);
    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.2,
      bevelEnabled: false
    });
    return geometry;
  };

  // Create a new material for each button to allow individual color changes
  const createButtonMaterial = (index: number) => {
    const color = getButtonColor(index);
    return new MeshBasicMaterial({
      color: color,
      wireframe: false,
      transparent: true,
      opacity: hoveredButton === index ? 0.3 : 0.15  // Lower base opacity, higher on hover
    });
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
      
      {/* 3D Text with neon effect */}
      <Text
        position={[0, 75, 5]}
        fontSize={5}
        color={colors.primary}
        anchorX="center"
        anchorY="middle"
        outlineColor={colors.secondary}
        outlineOpacity={0.4}
        outlineWidth={0.01}
      >
        HELLO! I'M
      </Text>
      <Text
        position={[0, 68, 5]}
        fontSize={7}
        color={colors.secondary}
        anchorX="center"
        anchorY="middle"
        outlineColor={colors.primary}
        outlineOpacity={0.3}
        outlineWidth={0.008}
      >
        YIGIT SERIN
      </Text>
      <Text
        position={[0, 50, 5]}
        fontSize={5}
        color={colors.accent}
        anchorX="center"
        anchorY="middle"
        outlineColor={colors.secondary}
        outlineOpacity={0.4}
        outlineWidth={0.01}
      >
        IOS DEVELOPER
      </Text>
      <Text
        position={[0, 45, 5]}
        fontSize={3}
        color={colors.primary}
        anchorX="center"
        anchorY="middle"
        outlineColor={colors.secondary}
        outlineOpacity={0.4}
        outlineWidth={0.01}
      >
        BASED IN NETHERLANDS
      </Text>
      
      {/* Interactive buttons with neon effect */}
      {buttons.map((button, index) => (
        <group 
          key={index} 
          position={[0, 35 - (index * 10), 5]}
          scale={[getButtonScale(index), getButtonScale(index), 1]}
          onPointerOver={() => setHoveredButton(index)}
          onPointerOut={() => setHoveredButton(null)}
          onClick={handleButtonClick}
        >
          <mesh geometry={createButtonGeometry(25, 7, 1.5)}>
            <primitive object={createButtonMaterial(index)} attach="material" />
          </mesh>
          <Text
            position={button.position}
            fontSize={5}
            color={getButtonColor(index)}
            anchorX="center"
            anchorY="middle"
            outlineColor={colors.primary}
            outlineOpacity={0.3}
            outlineWidth={0.008}
          >
            {button.label}
          </Text>
        </group>
      ))}
    </group>
  );
}