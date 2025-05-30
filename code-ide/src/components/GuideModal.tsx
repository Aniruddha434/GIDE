import React from 'react';
import styles from './GuideModal.module.css';
import { X } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton} aria-label="Close guide">
          <X size={24} />
        </button>
        <h2>Welcome to Skool Lab! - A Quick Guide</h2>
        
        <p>Hello young coder! Skool Lab is a place where you can write and run your own computer programs. Here's a quick tour:</p>

        <div className={styles.section}>
          <h3>1. The File Explorer (Left Panel)</h3>
          <p>This is where all your files and folders live. You can:</p>
          <ul>
            <li>Click on a file to open it in the editor</li>
            <li>Click the little triangle next to a folder to see what's inside</li>
            <li>Use the buttons at the top of the explorer to create new files or folders</li>
            <li>Delete files or folders you don't need anymore</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>2. The Code Editor (Center Panel)</h3>
          <p>This is your main workspace! When you open a file, its content will appear here. You can type your code, make changes, and see your creation come to life.</p>
          <ul>
            <li>Select a language (like Python or JavaScript) from the dropdown at the top</li>
            <li>The editor will help you with colors and suggestions as you type</li>
            <li>Use tabs to work on multiple files at once</li>
            <li>Try the Playground button to explore example code</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>3. The Output/Terminal (Bottom Panel)</h3>
          <p>When you run your code, this is where you'll see the results, messages from your program, or any errors if something went wrong.</p>
          <ul>
            <li>Click the "Run Code" button in the header to execute your active file</li>
            <li>For some programs, you can type input directly into the terminal</li>
            <li>Clear the output using the "Clear" button when needed</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>4. Cool Features</h3>
          <ul>
            <li><strong>Achievements:</strong> Earn badges as you learn and code!</li>
            <li><strong>Playground:</strong> Try out example code and learn from it</li>
            <li><strong>Theme Toggle:</strong> Switch between light and dark mode</li>
            <li><strong>Ask Anny:</strong> Get help from our friendly AI assistant</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>5. Anny, Your Helper Robot!</h3>
          <p>See that friendly robot in the corner? That's Anny! Anny will:</p>
          <ul>
            <li>Give you tips and celebrate your successes</li>
            <li>Help you understand errors and fix them</li>
            <li>Guide you through your coding journey</li>
            <li>Celebrate when you unlock achievements!</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Tips for Young Coders:</h3>
          <ul>
            <li><strong>Start Simple:</strong> Try small programs first</li>
            <li><strong>Don't Be Afraid of Errors:</strong> They're just messages telling you what to fix</li>
            <li><strong>Use the Playground:</strong> Learn from example code</li>
            <li><strong>Ask for Help:</strong> Use Anny's help features when stuck</li>
            <li><strong>Have Fun!</strong> Coding is like solving puzzles and building cool things</li>
          </ul>
        </div>

        <button onClick={onClose} className={styles.gotItButton}>
          Got it!
        </button>
      </div>
    </div>
  );
};

export default GuideModal; 