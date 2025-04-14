import { Text } from '@react-three/drei';
import { colors } from '../styles/theme';
import { Shape, ExtrudeGeometry, MeshBasicMaterial, Mesh, PlaneGeometry } from 'three';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface ContentPageProps {
  isVisible: boolean;
  title: string;
  content: string;
}

export default function ContentPage({ isVisible, title, content }: ContentPageProps) {
  const pageRef = useRef<Mesh>(null);
  const backgroundRef = useRef<Mesh>(null);

  // Create rounded rectangle shape for the page
  const createPageGeometry = () => {
    const width = 1.8;     // Width to match phone screen
    const height = 3.2;    // Height to match phone screen
    const radius = 0.1;    // Adjusted radius
    
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

    return new ExtrudeGeometry(shape, {
      depth: 0.01,
      bevelEnabled: false
    });
  };

  // Create material for the background
  const backgroundMaterial = new MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0,
    side: 2,
    depthTest: false
  });

  // Use useEffect for animations to avoid infinite updates
  useEffect(() => {
    if (backgroundRef.current) {
      gsap.to(backgroundRef.current.position, {
        z: isVisible ? 1 : -10,
        duration: 0.8,
        ease: "power2.inOut",
        delay: isVisible ? 0.7 : 0
      });

      // Animate opacity for background
      gsap.to(backgroundMaterial, {
        opacity: isVisible ? 0.95 : 0,
        duration: 0.3,
        ease: "power2.inOut",
        delay: isVisible ? 0.7 : 0
      });
    }
  }, [isVisible]);

  return (
    <group position={[0, 0, 5]}>
      <mesh 
        ref={backgroundRef}
        geometry={createPageGeometry()}
        material={backgroundMaterial}
        position={[0, 0, -10]}
      >
        <Text
          position={[0, 0.8, 0.1]}
          fontSize={0.15}
          color={colors.secondary}
          anchorX="center"
          anchorY="middle"
          outlineColor={colors.primary}
          outlineOpacity={0.3}
          outlineWidth={0.003}
          visible={isVisible}
        >
          {title}
        </Text>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.12}
          color={colors.primary}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.6}
          textAlign="center"
          visible={isVisible}
        >
          {content}
        </Text>
      </mesh>
    </group>
  );
} 