import React, { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

interface SplashScreenProps {
  onClose: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if this is the user's first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisitedBefore) {
      // Show splash screen for first-time visitors
      setIsVisible(true);
      // Mark that the user has visited
      localStorage.setItem('hasVisitedBefore', 'true');
    } else {
      // Skip splash screen for returning visitors
      onClose();
    }
  }, [onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.splashScreen}>
      <div className={styles.splashContent}>
        <h1>Welcome to GIDE!</h1>
        <p>Your friendly coding companion</p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Learn to Code</h3>
            <p>Start your coding journey with interactive tutorials and examples</p>
          </div>
          <div className={styles.feature}>
            <h3>Creative Projects</h3>
            <p>Create animations, music, drawings, and interactive stories</p>
          </div>
          <div className={styles.feature}>
            <h3>Smart Assistant</h3>
            <p>Get help and hints when you need them</p>
          </div>
        </div>
        <button 
          className={styles.startButton}
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
        >
          Start Coding!
        </button>
      </div>
    </div>
  );
};

export default SplashScreen; 