import React from 'react';
import styles from './AchievementPanel.module.css';
import { ACHIEVEMENTS } from '../utils/AchievementManager';
import AchievementManager from '../utils/AchievementManager';

interface AchievementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AchievementPanel: React.FC<AchievementPanelProps> = ({ isOpen, onClose }) => {
  const achievementManager = AchievementManager.getInstance();
  const unlockedAchievements = achievementManager.getUnlockedAchievements();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Achievements</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
            return (
              <div 
                key={achievement.id} 
                className={`${styles.achievementItem} ${isUnlocked ? styles.unlocked : styles.locked}`}
              >
                <div className={styles.achievementIcon}>{achievement.icon}</div>
                <div className={styles.achievementInfo}>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                  {isUnlocked && (
                    <span className={styles.unlockedText}>Unlocked!</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementPanel; 