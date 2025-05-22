import React from 'react';
// Import the new image, adjusting the path based on component location
import RobotImagePath from '../assets/vecteezy_playful-futuristic-robot-character-with-adorable-advanced_55442672.png';
import styles from './CharacterGuide.module.css'; // Import the CSS module

interface CharacterGuideProps {
  message?: string;
  isCelebrating?: boolean; // New prop for celebration state
  isSad?: boolean; // New prop for sad state
  onDismissMessage?: () => void; // New prop to handle message dismissal
  isModalOpen?: boolean;  // Add new prop
}

const CharacterGuide: React.FC<CharacterGuideProps> = ({ 
  message, 
  isCelebrating, 
  isSad, 
  onDismissMessage,
  isModalOpen = false  // Default to false
}) => {
  if (!message || isModalOpen) return null;  // Hide when modal is open

  let robotStateClass = styles.robotImage;
  if (isCelebrating) {
    robotStateClass = `${styles.robotImage} ${styles.robotDancing}`;
  } else if (isSad) {
    robotStateClass = `${styles.robotImage} ${styles.robotSad}`;
  }

  const currentMessage = message || "Hello! I'm here to help you.";

  // Log props and applied classes
  console.log('[CharacterGuide.tsx] Props received:', { message, isCelebrating, isSad });
  console.log('[CharacterGuide.tsx] Applied robot class:', robotStateClass);

  return (
    <div className={styles.guideContainer}> {/* Use a class for the main container */}
      {/* Message Bubble: Order can be changed with CSS for visual appearance */}
      <div className={styles.speechBubble}>
        <p>{currentMessage}</p>
        {onDismissMessage && (
          <button 
            onClick={onDismissMessage} 
            className={styles.dismissButton}
            title="Dismiss message"
            aria-label="Dismiss message"
          >
            ×
          </button>
        )}
      </div>
      <img 
        src={RobotImagePath} 
        alt="Character Guide" 
        className={robotStateClass}
      />
    </div>
  );
};

export default CharacterGuide; 