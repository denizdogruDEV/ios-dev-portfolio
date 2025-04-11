interface ThemeToggleProps {
    currentTheme: 'cyberpunk' | 'white';
    setTheme: (theme: 'cyberpunk' | 'white') => void;
  }
  
  export default function ThemeToggle({ currentTheme, setTheme }: ThemeToggleProps) {
    return (
      <button
        className="theme-toggle"
        onClick={() => setTheme(currentTheme === 'cyberpunk' ? 'white' : 'cyberpunk')}
      >
        Switch to {currentTheme === 'cyberpunk' ? 'White' : 'Cyberpunk'} Mode
      </button>
    );
  }
  