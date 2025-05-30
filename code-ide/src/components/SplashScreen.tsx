import React, { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

interface SplashScreenProps {
  onClose: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show splash screen on every refresh for now
    setIsVisible(true);
    
    // Animate features and button with delay
    setTimeout(() => setShowFeatures(true), 500);
    setTimeout(() => setShowButton(true), 1000);

    // Optional: If you want to show it only on first visit, uncomment this:
    // const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    // if (!hasVisitedBefore) {
    //   setIsVisible(true);
    //   localStorage.setItem('hasVisitedBefore', 'true');
    // } else {
    //   onClose();
    // }
  }, [onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.splashContainer}>
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className={styles.title}>Welcome to SKoolCode!</h1>
          <p className={styles.subtitle}>Your friendly coding companion</p>
        </div>
        
        <div className={styles.loadingContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '100%' }}></div>
          </div>
          <p className={styles.loadingText}>Loading your coding environment...</p>
        </div>

        <button 
          className={`${styles.startButton} ${showButton ? styles.buttonVisible : ''}`}
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