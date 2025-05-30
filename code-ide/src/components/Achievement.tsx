import React, { useEffect, useState } from 'react';
import styles from './Achievement.module.css';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

interface AchievementProps {
  achievement: Achievement;
  onClose: () => void;
}

const Achievement: React.FC<AchievementProps> = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start entrance animation
    setIsVisible(true);

    // Start exit animation after 3 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    // Remove component after exit animation
    const removeTimer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  return (
    <div 
      className={`${styles.achievementContainer} ${isVisible ? styles.visible : ''} ${isExiting ? styles.exiting : ''}`}
    >
      <div className={styles.achievementContent}>
        <div className={styles.achievementIcon}>{achievement.icon}</div>
        <div className={styles.achievementInfo}>
          <h3 className={styles.achievementTitle}>{achievement.title}</h3>
          <p className={styles.achievementDescription}>{achievement.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Achievement; 