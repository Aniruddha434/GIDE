import React, { useState } from 'react';
import styles from './CreativeTools.module.css';

interface CreativeToolsProps {
  onSelectTemplate: (template: string) => void;
}

const CreativeTools: React.FC<CreativeToolsProps> = ({ 
  onSelectTemplate
}) => {
  const [_activeTab, _setActiveTab] = useState<'animations' | 'music' | 'drawing' | 'stories'>('animations');

  return (
    <div className={styles.creativeToolsContainer}>
      <div className={styles.toolsHeader}>
        <h2>Creative Tools</h2>
      </div>
      
      <div className={styles.templatesGrid}>
        <button
          className={styles.templateCard}
          onClick={() => onSelectTemplate('draw_circle')}
        >
          <span className={styles.templateIcon}>⭕</span>
          <span className={styles.templateName}>Draw Circle</span>
        </button>
        <button
          className={styles.templateCard}
          onClick={() => onSelectTemplate('draw_square')}
        >
          <span className={styles.templateIcon}>⬛</span>
          <span className={styles.templateName}>Draw Square</span>
        </button>
        <button
          className={styles.templateCard}
          onClick={() => onSelectTemplate('draw_triangle')}
        >
          <span className={styles.templateIcon}>▲</span>
          <span className={styles.templateName}>Draw Triangle</span>
        </button>
        <button
          className={styles.templateCard}
          onClick={() => onSelectTemplate('draw_star')}
        >
          <span className={styles.templateIcon}>⭐</span>
          <span className={styles.templateName}>Draw Star</span>
        </button>
      </div>
    </div>
  );
};

export default CreativeTools; 