import { IonIcon, IonToggle } from '@ionic/react';
import { sunny, moon } from 'ionicons/icons';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';
import { useEffect } from 'react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
useEffect(() => {
  document.body.classList.remove('light-theme', 'dark-theme');
  document.body.classList.add(`${theme}-theme`);
  localStorage.setItem('app-theme', theme);
}, [theme]);
  return (
    <div className="theme-toggle-wrapper">
      <IonIcon icon={sunny} className="toggle-icon" />
      <IonToggle
        checked={theme === 'dark'}
        onIonChange={toggleTheme}
      />
      <IonIcon icon={moon} className="toggle-icon" />
    </div>
  );
};

export default ThemeToggle;