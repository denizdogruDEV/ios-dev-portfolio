import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import PhoneModel from './components/PhoneModel.tsx';
import ThemeToggle from './components/ThemeToggle.tsx';
import './styles/app.css';
import './styles/themes.css';
import { Vector2 } from 'three';

function App() {
  const [theme, setTheme] = useState<'cyberpunk' | 'white'>('cyberpunk');
  
  return (
    <div className={`app ${theme}`}>
      {/* Full-screen canvas as base layer */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 20], fov: 25 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <spotLight
            position={[0, 0, 10]}
            angle={0.6}
            penumbra={0.5}
            intensity={1.5}
          />
          
          <OrbitControls
            enableZoom={true}
            maxDistance={30}
            minDistance={10}
            enablePan={true}
            panSpeed={0.8}
            target={[0, 1, 0]}
          />
          
          <PhoneModel />
          
          {/* Add postprocessing effects for neon glow */}
          <EffectComposer>
  <Bloom 
    intensity={1.5} 
    luminanceThreshold={0.2} 
    luminanceSmoothing={0.9} 
    height={300}
  />
  <ChromaticAberration 
    offset={new Vector2(0.002, 0.002)} 
  />
</EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}

export default App;