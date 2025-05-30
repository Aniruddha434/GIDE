import { useRef, useEffect, useState } from 'react';
import styles from './OutputTerminal.module.css';

interface OutputTerminalProps {
  output: string;
  onInput?: (input: string) => void;
  isRunning?: boolean;
}

const OutputTerminal = ({ output, onInput, isRunning = false }: OutputTerminalProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onInput) {
      onInput(inputValue);
      setInputValue('');
    }
  };

  const formatOutput = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.toLowerCase().includes('error:')) {
        return <span key={i} className={styles.errorLine}>{line}</span>;
      }
      if (line.toLowerCase().includes('warning:')) {
        return <span key={i} className={styles.warningLine}>{line}</span>;
      }
      return <span key={i}>{line}</span>;
    });
  };

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalTitle}>
          <span className={styles.terminalIcon}>⚡</span>
          <span>Output</span>
        </div>
        <div className={styles.terminalControls}>
          <button 
            className={styles.terminalButton}
            onClick={() => {
              if (terminalRef.current) {
                terminalRef.current.scrollTop = 0;
              }
            }}
            title="Scroll to top"
          >
            ↑
          </button>
          <button 
            className={styles.terminalButton}
            onClick={() => {
              if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
              }
            }}
            title="Scroll to bottom"
          >
            ↓
          </button>
        </div>
      </div>
      <div className={styles.terminalBody} ref={terminalRef}>
        {output ? (
          <pre className={styles.outputContent}>
            {formatOutput(output)}
          </pre>
        ) : (
          <div className={styles.terminalPlaceholder}>
            {isRunning ? (
              <div className={styles.runningIndicator}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                Running...
              </div>
            ) : (
              'Run your code to see the output...'
            )}
          </div>
        )}
        {onInput && (
          <div className={styles.inputContainer}>
            <span className={styles.prompt}>&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputSubmit}
              placeholder="Type input here..."
              className={styles.terminalInput}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputTerminal; 