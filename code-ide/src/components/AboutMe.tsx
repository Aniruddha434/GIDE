import React from 'react';
import styles from './AboutMe.module.css';
import { X } from 'lucide-react';

interface AboutMeProps {
  onClose: () => void;
}

const AboutMe: React.FC<AboutMeProps> = ({ onClose }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton} aria-label="Close about section">
          <X size={24} />
        </button>
        
        <h2>About Me</h2>

        <div className={styles.section}>
          <p>
            Hi! I'm Aniruddha Gayki, a Computer Science Engineering student from Pune, India. 
            I developed this IDE as part of the Skool of Code assessment.
          </p>
        </div>

        <div className={styles.section}>
          <h3>Project Overview</h3>
          <p>
            This custom Integrated Development Environment (IDE) was built from scratch to provide 
            a seamless coding experience for learners. It combines modern web technologies with 
            practical development tools.
          </p>
        </div>

        <div className={styles.section}>
          <h3>Key Features</h3>
          <ul>
            <li><strong>Interactive Development:</strong> Write, run, and debug code directly in the browser</li>
            <li><strong>Smart Assistance:</strong> AI-powered hints and explanations to help learners</li>
            <li><strong>Multi-language Support:</strong> Seamless switching between Python, JavaScript, and Java</li>
            <li><strong>Modern UI/UX:</strong> Clean, intuitive interface with dark/light themes</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Technology Stack</h3>
          <div className={styles.techList}>
            <div>
              <strong>Frontend</strong>
              <ul>
                <li>React with TypeScript</li>
                <li>Monaco Editor for code editing</li>
                <li>CSS Modules for styling</li>
              </ul>
            </div>
            
            <div>
              <strong>Backend</strong>
              <ul>
                <li>Node.js with Express</li>
                <li>Docker for secure code execution</li>
                <li>WebSocket for real-time communication</li>
                <li>Google Gemini AI integration</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Contact Information</h3>
          <div className={styles.contactInfo}>
            <p>
              <a href="tel:8624829427">+91 8624829427</a>
            </p>
            <p>
              <a href="mailto:aniruddhagayki0@gmail.com">aniruddhagayki0@gmail.com</a>
            </p>
            <a 
              href="https://www.linkedin.com/in/aniruddha-gayki-383abb24b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.linkedinLink}
          >
              LinkedIn Profile
          </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe; 