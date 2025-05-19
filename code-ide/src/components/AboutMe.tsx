import React from 'react';
import styles from './AboutMe.module.css';

interface AboutMeProps {
  onClose: () => void;
}

const AboutMe: React.FC<AboutMeProps> = ({ onClose }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
        <h2><span role="img" aria-label="coder">👨‍💻</span> About Me</h2>
        <p>
          Hi there! I'm Aniruddha Gayki, a Computer Science Engineering student from Pune, India <span role="img" aria-label="India flag">🇮🇳</span>. 
          I have a strong passion for developing practical and impactful tech solutions.
        </p>
        <p>
          Recently, I undertook a project as part of the Skool of Code assessment, 
          where I developed and deployed a custom Integrated Development Environment (IDE) from scratch. <span role="img" aria-label="tools">🛠️</span><span role="img" aria-label="laptop">💻</span>
          This IDE enables users to write, run, and test code directly in the browser, 
          providing a seamless coding experience. <span role="img" aria-label="globe">🌐</span>
        </p>
        <p>
          <em>This project, undertaken for Skool Code, was a fantastic learning experience, and I was particularly drawn to Skool Code's mission and innovative approach in the ed-tech space. I am enthusiastic about the possibility of contributing to a company that is shaping the future of coding education.</em>
        </p>
        <h3>Key Highlights of the Project:</h3>
        <ul>
          <li>
            <strong>Frontend Development:</strong> Designed a user-friendly interface using modern web technologies. <span role="img" aria-label="palette">🎨</span><span role="img" aria-label="desktop">🖥️</span>
          </li>
          <li>
            <strong>Backend Integration:</strong> Implemented execution engines to support multiple programming languages. <span role="img" aria-label="link">🔗</span><span role="img" aria-label="gears">⚙️</span>
          </li>
          <li>
            <strong>Deployment:</strong> Successfully hosted the IDE on a live server, ensuring global accessibility and optimal performance. <span role="img" aria-label="earth">🌍</span><span role="img" aria-label="satellite">📡</span>
          </li>
        </ul>
        <h3>Technologies Used:</h3>
        <ul className={styles.techList}>
          <li><strong>Frontend:</strong> React, TypeScript, Vite, Monaco Editor, CSS Modules, HTML5</li>
          <li><strong>Backend:</strong> Node.js, Express.js, Docker, WebSockets</li>
          <li><strong>Key Libraries:</strong> react-resizable-panels, uuid, ws</li>
          <li><strong>API Integration:</strong> Google Gemini (for AI Hints)</li>
        </ul>
        <p>
          This project allowed me to deepen my understanding of web development, 
          code execution environments, and cloud deployment strategies. <span role="img" aria-label="books">📚</span><span role="img" aria-label="cloud">☁️</span>
        </p>
        <p>
          I am highly impressed by the work being done at <strong>Skool Code company</strong> and believe my skills in developing engaging and functional educational tools, as demonstrated by this IDE, would be a great asset. I am eager to contribute to your team and would welcome the opportunity to discuss how I can help Skool Code achieve its goals. <span role="img" aria-label="handshake">🤝</span><span role="img" aria-label="star">✨</span>
        </p>
        <div className={styles.contactInfo}>
          <p>
            <span role="img" aria-label="phone">📞</span> Phone: <a href="tel:8624829427">8624829427</a>
          </p>
          <p>
            <span role="img" aria-label="email">📧</span> Email: <a href="mailto:aniruddhagayki0@gmail.com">aniruddhagayki0@gmail.com</a>
          </p>
        </div>
        <p>
          <a 
            href="https://www.linkedin.com/in/aniruddha-gayki/" // Replace with your actual LinkedIn profile URL
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.linkedinLink}
          >
            <span role="img" aria-label="link">🔗</span> Connect with me on LinkedIn
          </a>
        </p>
      </div>
    </div>
  );
};

export default AboutMe; 