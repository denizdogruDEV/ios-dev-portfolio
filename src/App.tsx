import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import PhoneModel from './components/PhoneModel';
import './styles/app.css';
import './styles/fonts.css';
import { Vector2 } from 'three';

function App() {
  return (
    <div className="app">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 30], fov: 20 }}>
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
            enableZoom={true}
            maxDistance={40}
            minDistance={15}
            enablePan={true}
            panSpeed={0.8}
            target={[0, 1, 0]}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
          
          <PhoneModel />
          
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