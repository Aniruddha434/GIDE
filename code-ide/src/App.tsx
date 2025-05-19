import { useState, useEffect } from 'react';
import './App.css';
import IDE from './components/IDE';
import CharacterGuide from './components/CharacterGuide';
import AboutMe from './components/AboutMe';
import GuideModal from './components/GuideModal';

export type RobotMood = 'normal' | 'celebrating' | 'sad';
export type Theme = 'light' | 'dark';

function App() {
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

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Effect to apply theme class to body or a root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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

  const handleGetHelp = () => {
    // If there's an error, we'll pass this info implicitly via robotMood being 'sad'
    // Otherwise, it's a general explanation request.
    updateGuide("Let me think about that...", 'normal'); // Robot thinking message
  };

  const handleDismissGuideMessage = () => {
    setGuideMessage(undefined);
    // Optionally, reset mood if a message is dismissed, or let timers handle it
    // setRobotMood('normal'); 
  };

  const toggleAboutMe = () => {
    setShowAboutMe(!showAboutMe);
  };

  const toggleGuideModal = () => {
    setShowGuideModal(!showGuideModal);
  };

  return (
    <div className={appContainerClasses}>
      {/* Pass the message update function to the IDE component */}
      <IDE 
        setGuideAppearance={updateGuide} 
        getAiHint={triggerAiHint} 
        onAiHintProcessed={() => setTriggerAiHint(false)}
        onToggleAboutMe={toggleAboutMe}
        onToggleGuide={toggleGuideModal}
        currentTheme={theme}
        onToggleTheme={toggleTheme}
        onAskAiHint={handleAskAiHint}
      />
      {/* Pass the current message to the CharacterGuide component */}
      <CharacterGuide 
        message={guideMessage} 
        isCelebrating={robotMood === 'celebrating'}
        isSad={robotMood === 'sad'}
        onGetHelpClick={handleGetHelp} // Pass the handler
        onDismissMessage={handleDismissGuideMessage} // Pass the dismiss handler
      />
      {showAboutMe && <AboutMe onClose={toggleAboutMe} />}
      {showGuideModal && <GuideModal onClose={toggleGuideModal} />}
    </div>
  );
}

export default App;
