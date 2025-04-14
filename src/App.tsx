import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import PhoneModel from './components/PhoneModel';
import ContentPage from './components/ContentPage';
import './styles/app.css';
import './styles/fonts.css';
import { Vector2 } from 'three';

// Content data for each button
const pageContents = [
  {
    title: "About Me",
    content: "I'm a passionate iOS developer with expertise in Swift, SwiftUI, and UIKit. I love creating beautiful and functional mobile experiences."
  },
  {
    title: "My Projects",
    content: "Explore my portfolio of iOS applications, from consumer apps to enterprise solutions. Each project demonstrates my commitment to quality and user experience."
  },
  {
    title: "Get in Touch",
    content: "Let's work together! Reach out to discuss your project ideas or potential collaborations."
  }
];

function App() {
  const orbitControlsRef = useRef<any>(null);
  const [activePageIndex, setActivePageIndex] = useState<number | null>(null);

  return (
    <div className="app">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 30], fov: 35 }}>
          {/* Scene background */}
          <color attach="background" args={["#000222"]} />
          
          {/* Ambient light for base illumination */}
          <ambientLight intensity={0.3} />
          
          {/* Main directional light */}
          <directionalLight 
            position={[0, 10, 10]} 
            intensity={1} 
            color="#ffffff"
          />
          
          {/* Neon colored spotlights */}
          <spotLight
            position={[10, 5, 5]}
            angle={0.6}
            penumbra={0.5}
            intensity={1.2}
            color="#08f7fe"
            distance={30}
          />
          <spotLight
            position={[-10, -5, 5]}
            angle={0.6}
            penumbra={0.5}
            intensity={1.2}
            color="#fe53bb"
            distance={30}
          />
          
          <OrbitControls
            ref={orbitControlsRef}
            enableZoom={true}
            maxDistance={40}
            minDistance={15}
            enablePan={true}
            panSpeed={0.8}
            target={[0, 1, 0]}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
          
          <PhoneModel 
            orbitControlsRef={orbitControlsRef}
            onPageChange={setActivePageIndex}
          />

          {/* Content Pages */}
          {pageContents.map((page, index) => (
            <ContentPage
              key={index}
              isVisible={activePageIndex === index}
              title={page.title}
              content={page.content}
            />
          ))}
          
          <EffectComposer>
            <Bloom 
              intensity={0.8}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.7}
              height={300}
            />
            <ChromaticAberration 
              offset={new Vector2(0.002, 0.002)}
            />
            <Vignette
              eskil={false}
              offset={0.1}
              darkness={0.5}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}

export default App;