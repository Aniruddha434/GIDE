import { useRef, useEffect } from 'react';

interface OutputTerminalProps {
  output: string;
}

const OutputTerminal = ({ output }: OutputTerminalProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span>Output</span>
      </div>
      <div className="terminal-body" ref={terminalRef}>
        {output ? (
          <pre>{output}</pre>
        ) : (
          <div className="terminal-placeholder">Run your code to see the output...</div>
        )}
      </div>
    </div>
  );
};

export default OutputTerminal; 