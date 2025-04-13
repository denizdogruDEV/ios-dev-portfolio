import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import PhoneModel from './components/PhoneModel.tsx';
import './styles/app.css';
import './styles/themes.css';
import { Vector2 } from 'three';

function App() {
  // Auto-cycling time of day (0: dawn, 0.3: day, 0.5: sunset, 0.8: night)
  const [timeOfDay, setTimeOfDay] = useState(0.3);
  const timeSpeed = useRef(0.00005); // Speed of time passing (adjust for faster/slower cycles)
  const lastUpdateTime = useRef(Date.now());
  
  // Automatically determine theme based on time of day
  const getThemeFromTime = (time) => {
    if (time > 0.4 && time < 0.6) return 'sunset';
    if (time > 0.6 || time < 0.2) return 'night';
    return 'day';
  };
  
  const [theme, setTheme] = useState(getThemeFromTime(timeOfDay));
  
  // Auto-cycle through time of day
  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      lastUpdateTime.current = now;
      
      // Update time of day, wrapping around at 1.0
      setTimeOfDay(prevTime => {
        const newTime = (prevTime + timeSpeed.current * deltaTime) % 1;
        
        // Update theme based on new time
        setTheme(getThemeFromTime(newTime));
        
        return newTime;
      });
    };
    
    const intervalId = setInterval(updateTime, 16); // ~60fps
    return () => clearInterval(intervalId);
  }, []);
  
  // Cyberpunk color palettes for different times
  const themeColors = {
    day: {
      primary: '#333333',
      secondary: '#666666',
      accent: '#888888',
      background: '#f0f0f0'
    },
    sunset: {
      primary: '#ff7e5f',
      secondary: '#feb47b',
      accent: '#ffcc00',
      background: '#2d0320'
    },
    night: {
      primary: '#08f7fe',
      secondary: '#09fbd3',
      accent: '#fe53bb',
      background: '#000222'
    }
  };

  // Update CSS variables based on current theme
  useEffect(() => {
    const root = document.documentElement;
    const colors = themeColors[theme];
    
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--background-color', colors.background);
  }, [theme]);

  // Calculate sun position based on time of day
  const calculateSunPosition = () => {
    const angle = timeOfDay * Math.PI * 2;
    const radius = 100;
    return [
      0,
      Math.sin(angle) * radius,
      Math.cos(angle) * radius
    ];
  };

  // Determine if it's night time (for stars visibility)
  const isNightTime = timeOfDay > 0.6 || timeOfDay < 0.2;
  
  // Calculate bloom intensity based on time of day
  const calculateBloomIntensity = () => {
    if (timeOfDay > 0.4 && timeOfDay < 0.6) {
      return 1.5; // Sunset: stronger bloom
    } else if (isNightTime) {
      return 2.2; // Night: strongest bloom
    } else {
      return 0.5; // Day: more subtle bloom
    }
  };

  // Calculate sky parameters based on time of day
  const getSkyParams = () => {
    if (timeOfDay > 0.4 && timeOfDay < 0.6) {
      // Sunset
      return {
        turbidity: 6,
        rayleigh: 3,
        mieCoefficient: 0.035,
        mieDirectionalG: 0.8,
        sunPosition: calculateSunPosition()
      };
    } else if (isNightTime) {
      // Night
      return {
        turbidity: 15,
        rayleigh: 0.5,
        mieCoefficient: 0.01,
        mieDirectionalG: 0.95,
        sunPosition: calculateSunPosition()
      };
    } else {
      // Day
      return {
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        sunPosition: calculateSunPosition()
      };
    }
  };

  const skyParams = getSkyParams();
  
  // Get the formatted time display for debugging
  const getTimeDisplay = () => {
    if (isNightTime) return "Night";
    if (timeOfDay > 0.4) return "Sunset";
    return "Day";
  };
  
  return (
    <div className={`app ${theme}`}>
      {/* Time display indicator (can be removed if not needed) */}
      <div className="time-indicator">
        <span>{getTimeDisplay()}</span>
      </div>

      {/* Full-screen canvas as base layer */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 20], fov: 25 }}>
          {/* Lighting adjusts based on time of day */}
          <ambientLight intensity={isNightTime ? 0.3 : 0.7} />
          <directionalLight 
            position={calculateSunPosition()} 
            intensity={isNightTime ? 0.2 : 1} 
            color={timeOfDay > 0.4 && timeOfDay < 0.6 ? '#ff9e7d' : '#ffffff'}
          />
          
          {/* Colored spotlights only at night and sunset */}
          {(isNightTime || timeOfDay > 0.4) && (
            <>
              <spotLight
                position={[10, 5, 5]}
                angle={0.6}
                penumbra={0.5}
                intensity={1.2}
                color={themeColors[theme].primary}
                distance={30}
              />
              <spotLight
                position={[-10, -5, 5]}
                angle={0.6}
                penumbra={0.5}
                intensity={1.2}
                color={themeColors[theme].secondary}
                distance={30}
              />
            </>
          )}
          
          <OrbitControls
            enableZoom={true}
            maxDistance={30}
            minDistance={10}
            enablePan={true}
            panSpeed={0.8}
            target={[0, 1, 0]}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
          
          {/* Sky changes based on time of day */}
          <Sky {...skyParams} />
          
          {/* Stars visible only at night */}
          {isNightTime && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
          
          <PhoneModel timeOfDay={timeOfDay} theme={theme} />
          
          {/* Enhanced postprocessing effects */}
          <EffectComposer>
            <Bloom 
              intensity={calculateBloomIntensity()} 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              height={300}
            />
            <ChromaticAberration 
              offset={new Vector2(isNightTime ? 0.003 : 0.001, isNightTime ? 0.003 : 0.001)} 
            />
            <Vignette
              eskil={false}
              offset={0.1}
              darkness={isNightTime ? 0.8 : 0.3}
            />
          </EffectComposer>
        </Canvas>
      </div>
      
      {/* Cyberpunk grid overlay only at night */}
      {(isNightTime || timeOfDay > 0.4) && <div className={`grid-overlay ${theme}`}></div>}
      
      {/* Animated scanlines only at night */}
      {isNightTime && <div className="scanlines"></div>}
    </div>
  );
}

export default App;