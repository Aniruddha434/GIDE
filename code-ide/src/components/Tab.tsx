import React from 'react';
import styles from './Tab.module.css';

interface TabProps {
  fileId: string;
  fileName: string;
  isActive: boolean;
  isDirty?: boolean;
  onClick: (fileId: string) => void;
  onClose: (fileId: string) => void;
}

const Tab: React.FC<TabProps> = ({ fileId, fileName, isActive, isDirty, onClick, onClose }) => {
  const handleTabClick = () => {
    onClick(fileId);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onClick on tab itself when closing
    onClose(fileId);
  };

  return (
    <div
      className={`${styles.tab} ${isActive ? styles.active : ''} ${isDirty ? styles.dirty : ''}`}
      onClick={handleTabClick}
      title={fileName}
    >
      {isDirty && <span className={styles.dirtyIndicator} title="Unsaved changes">•</span>}
      <span className={styles.fileName}>{fileName}</span>
      <button
        className={styles.closeButton}
        onClick={handleCloseClick}
        title={`Close ${fileName}`}
      >
        &times;
      </button>
    </div>
  );
};

export default Tab;