import React, { useState, useEffect } from 'react';
import './App.css';
import IDE from './components/IDE';
import CharacterGuide from './components/CharacterGuide';
import AboutMe from './components/AboutMe';
import GuideModal from './components/GuideModal';
import SplashScreen from './components/SplashScreen';

export type RobotMood = 'normal' | 'celebrating' | 'sad';
export type Theme = 'light' | 'dark';

const App: React.FC = () => {
  // State for the character guide's message
  const [guideMessage, setGuideMessage] = useState<string | undefined>(
    "Welcome to the Code IDE! I'm here to help you get started."
  );
  const [robotMood, setRobotMood] = useState<RobotMood>('normal');
  const [triggerAiHint, setTriggerAiHint] = useState<boolean>(false);
  const [showAboutMe, setShowAboutMe] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [appContainerClasses, setAppContainerClasses] = useState<string>('app-container');
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Effect for entry animation
  useEffect(() => {
    const hasAnimatedInSession = sessionStorage.getItem('skoolLabEntryAnimated');
    if (!hasAnimatedInSession) {
      setAppContainerClasses('app-container app-container-play-entry-animation');
      sessionStorage.setItem('skoolLabEntryAnimated', 'true');
    } else {
      setAppContainerClasses('app-container'); // Default if already animated
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to apply theme class to body or a root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Function to handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Function to handle guide updates including celebration
  const updateGuide = (newMessage: string | undefined, mood: RobotMood = 'normal') => {
    setGuideMessage(newMessage);
    setRobotMood(mood);
  };

  // Add a new function to trigger AI hint
  const handleAskAiHint = () => {
    setTriggerAiHint(true);
  };

  // Effect to turn off celebration after animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (robotMood === 'celebrating' || robotMood === 'sad') {
      // Duration for animations
      // Celebrate: 0.5s * 3 = 1.5s. Sad: 0.7s * 2 = 1.4s
      const duration = robotMood === 'celebrating' ? 1700 : 1600; // Give a bit of buffer
      timer = setTimeout(() => {
        setRobotMood('normal');
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [robotMood]);

  const handleDismissGuideMessage = () => {
    setGuideMessage(undefined);
  };

  const toggleAboutMe = () => {
    setShowAboutMe(!showAboutMe);
  };

  const toggleGuideModal = () => {
    setShowGuideModal(!showGuideModal);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <div className="app" data-theme={theme}>
      {isLoading ? (
        <SplashScreen onClose={() => setIsLoading(false)} />
      ) : (
        <div className={appContainerClasses}>
          <IDE 
            setGuideAppearance={updateGuide} 
            getAiHint={triggerAiHint} 
            onAiHintProcessed={() => setTriggerAiHint(false)}
            onToggleAboutMe={toggleAboutMe}
            onToggleGuide={toggleGuideModal}
            currentTheme={theme}
            onToggleTheme={handleThemeChange}
            onAskAiHint={handleAskAiHint}
          />
          <CharacterGuide 
            message={guideMessage} 
            isCelebrating={robotMood === 'celebrating'}
            isSad={robotMood === 'sad'}
            onDismissMessage={handleDismissGuideMessage}
          />
          {showAboutMe && <AboutMe onClose={toggleAboutMe} />}
          {showGuideModal && <GuideModal onClose={toggleGuideModal} />}
        </div>
      )}
    </div>
  );
};

export default App;
