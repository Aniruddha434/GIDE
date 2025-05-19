import React from 'react';
import Tab from './Tab';
import type { OpenFile } from './IDE'; // Assuming OpenFile is exported from IDE.tsx or a types file
import styles from './TabsBar.module.css';

interface TabsBarProps {
  openFiles: OpenFile[];
  activeFileId: string | null;
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
}

const TabsBar: React.FC<TabsBarProps> = ({ openFiles, activeFileId, onSelectTab, onCloseTab }) => {
  if (openFiles.length === 0) {
    return (
      <div className={styles.tabsBarContainer} style={{ paddingLeft: '10px' }}>
        <span className={styles.noFilesMessage}>No files open</span>
      </div>
    );
  }

  return (
    <div className={styles.tabsBarContainer}>
      {openFiles.map(file => (
        <Tab
          key={file.id}
          fileId={file.id}
          fileName={file.name}
          isActive={file.id === activeFileId}
          onClick={onSelectTab}
          onClose={onCloseTab}
        />
      ))}
    </div>
  );
};

export default TabsBar; 