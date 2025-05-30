import React from 'react';
import styles from './Playground.module.css';
import { X } from 'lucide-react';

interface Playground {
  id: string;
  title: string;
  description: string;
  icon: string;
  code: string;
  language: string;
}

const PLAYGROUNDS: Playground[] = [
  {
    id: 'hello_world',
    title: 'Hello World',
    description: 'A simple program to print "Hello, World!"',
    icon: '👋',
    code: 'print("Hello, World!")',
    language: 'python'
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Generate Fibonacci numbers up to n',
    icon: '🔢',
    code: `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=' ')
        a, b = b, a + b

fibonacci(10)`,
    language: 'python'
  },
  {
    id: 'counter',
    title: 'Counter App',
    description: 'A simple counter using JavaScript',
    icon: '🔢',
    code: `let count = 0;

function increment() {
    count++;
    console.log('Count:', count);
}

function decrement() {
    count--;
    console.log('Count:', count);
}

increment();
increment();
decrement();`,
    language: 'javascript'
  },
  {
    id: 'calculator',
    title: 'Simple Calculator',
    description: 'Basic arithmetic operations',
    icon: '🧮',
    code: `def calculator(a, b, operation):
    if operation == '+':
        return a + b
    elif operation == '-':
        return a - b
    elif operation == '*':
        return a * b
    elif operation == '/':
        return a / b if b != 0 else "Error: Division by zero"
    else:
        return "Invalid operation"

# Test the calculator
print(calculator(10, 5, '+'))  # 15
print(calculator(10, 5, '-'))  # 5
print(calculator(10, 5, '*'))  # 50
print(calculator(10, 5, '/'))  # 2.0`,
    language: 'python'
  }
];

interface PlaygroundPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlayground: (playground: Playground) => void;
}

const PlaygroundPanel: React.FC<PlaygroundPanelProps> = ({
  isOpen,
  onClose,
  onSelectPlayground
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Code Playgrounds</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.content}>
          {PLAYGROUNDS.map(playground => (
            <div
              key={playground.id}
              className={styles.playgroundItem}
              onClick={() => onSelectPlayground(playground)}
            >
              <div className={styles.playgroundIcon}>{playground.icon}</div>
              <div className={styles.playgroundInfo}>
                <h3 className={styles.playgroundTitle}>{playground.title}</h3>
                <p className={styles.playgroundDescription}>{playground.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPanel; 