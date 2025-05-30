import React from 'react';
import { 
  List, 
  WrapText, 
  Type, 
  Copy, 
  Code, 
  Maximize2, 
  Search,
  FileText,
  Save,
  Plus,
  Minimize2,
  Minus
} from 'lucide-react';
import styles from './EditorToolbar.module.css';

interface EditorToolbarProps {
  showLineNumbers: boolean;
  onToggleLineNumbers: () => void;
  wordWrap: 'on' | 'off';
  onToggleWordWrap: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onCopyCode: () => void;
  onFormatCode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onSearch: () => void;
  onToggleMinimap: () => void;
  onNewFile: () => void;
  onSaveFile: () => void;
  showMinimap: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  showLineNumbers,
  onToggleLineNumbers,
  wordWrap,
  onToggleWordWrap,
  fontSize,
  onFontSizeChange,
  onCopyCode,
  onFormatCode,
  isFullscreen,
  onToggleFullscreen,
  onSearch,
  onToggleMinimap,
  onNewFile,
  onSaveFile,
  showMinimap
}) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarGroup}>
        <button
          onClick={onNewFile}
          className={styles.toolbarButton}
          title="New File"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={onSaveFile}
          className={styles.toolbarButton}
          title="Save File"
        >
          <Save size={16} />
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <button
          onClick={onToggleLineNumbers}
          className={`${styles.toolbarButton} ${showLineNumbers ? styles.active : ''}`}
          title="Toggle Line Numbers"
        >
          <List size={18} />
        </button>
        <button
          onClick={onToggleWordWrap}
          className={`${styles.toolbarButton} ${wordWrap === 'on' ? styles.active : ''}`}
          title="Toggle Word Wrap"
        >
          <WrapText size={18} />
        </button>
        <button
          onClick={onToggleMinimap}
          className={`${styles.toolbarButton} ${showMinimap ? styles.active : ''}`}
          title="Toggle Minimap"
        >
          <FileText size={16} />
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <button
          onClick={() => onFontSizeChange(Math.max(8, fontSize - 1))}
          className={styles.toolbarButton}
          title="Decrease Font Size"
        >
          <Minus size={18} />
        </button>
        <span className={styles.fontSizeDisplay}>
          {fontSize}
          <span className={styles.fontSizeIndicator}>px</span>
        </span>
        <button
          onClick={() => onFontSizeChange(Math.min(32, fontSize + 1))}
          className={styles.toolbarButton}
          title="Increase Font Size"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <button
          onClick={onSearch}
          className={styles.toolbarButton}
          title="Search"
        >
          <Search size={18} />
        </button>
        <button
          onClick={onCopyCode}
          className={styles.toolbarButton}
          title="Copy Code"
        >
          <Copy size={18} />
        </button>
        <button
          onClick={onFormatCode}
          className={styles.toolbarButton}
          title="Format Code"
        >
          <Code size={18} />
        </button>
        <button
          onClick={onSaveFile}
          className={styles.toolbarButton}
          title="Save File"
        >
          <Save size={18} />
        </button>
        <button
          onClick={onToggleFullscreen}
          className={styles.toolbarButton}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar; 