import React, { useState, useEffect, useRef } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { v4 as uuidv4 } from 'uuid';
import { HelpCircle } from 'lucide-react';

import CodeEditor from './CodeEditor';
import LanguageSelector from './LanguageSelector';
import FileExplorer from './FileExplorer';
import TabsBar from './TabsBar';
import type { FileSystemNode } from './FileExplorer';
import type { RobotMood, Theme } from '../App';
import useWebSocket, { type WebSocketMessage } from '../hooks/useWebSocket';
import { ThemeToggle } from './ThemeToggle';
import CreateFileModal from './CreateFileModal';
import CharacterGuide from './CharacterGuide';

// Define props interface for IDE
interface IDEProps {
  setGuideAppearance: (message: string | undefined, mood?: RobotMood) => void;
  getAiHint: boolean;
  onAiHintProcessed: () => void;
  onToggleAboutMe: () => void;
  onToggleGuide?: () => void;
  currentTheme: Theme;
  onToggleTheme: () => void;
  onAskAiHint: () => void;
}

// Add onAskAiHint to the component props
type IDEPropsWithAsk = IDEProps & { onAskAiHint: () => void };

const initialFileTree: FileSystemNode[] = [
  {
    id: 'f-1',
    name: 'src',
    type: 'folder',
    children: [
      { id: 'f-1-1', name: 'App.tsx', type: 'file' },
      { id: 'f-1-2', name: 'Main.tsx', type: 'file' },
      {
        id: 'f-1-3',
        name: 'components',
        type: 'folder',
        children: [
          { id: 'f-1-3-1', name: 'IDE.tsx', type: 'file' },
          { id: 'f-1-3-2', name: 'FileExplorer.tsx', type: 'file' },
        ],
      },
    ],
  },
  {
    id: 'f-2',
    name: 'public',
    type: 'folder',
    children: [{ id: 'f-2-1', name: 'index.html', type: 'file' }],
  },
  { id: 'f-3', name: 'README.md', type: 'file' },
  { id: 'f-4', name: 'package.json', type: 'file' },
];

const fileContentsDb: Record<string, string> = {
  'f-1-1': `// src/App.tsx
import React from 'react';
// ... other imports ...
function App() {
  return <div className="App">Hello from App.tsx!</div>;
}
export default App;`, 
  'f-1-2': `// src/Main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`, 
  'f-1-3-1': `// src/components/IDE.tsx
// ... content of IDE.tsx ...
console.log("This is the IDE component code.");`, 
  'f-1-3-2': `// src/components/FileExplorer.tsx
// ... content of FileExplorer.tsx ...
console.log("This is the FileExplorer component code.");`, 
  'f-2-1': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IDE</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`, 
  'f-3': `# My Awesome IDE Project

This project is an online code editor.

- Feature 1
- Feature 2`, 
  'f-4': `{
  "name": "code-ide",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    // ... your dependencies ...
  }
}`,
};

export interface OpenFile {
  id: string;
  name: string;
  language: string;
  content: string;
  isDirty?: boolean;
}

const WEBSOCKET_URL = 'ws://13.231.241.132:5000';

const IDE: React.FC<IDEPropsWithAsk> = ({ 
  setGuideAppearance, 
  getAiHint, 
  onAiHintProcessed,
  onToggleAboutMe,
  onToggleGuide,
  currentTheme,
  onToggleTheme,
  onAskAiHint
}) => {
  const [language, setLanguage] = useState('typescript');
  const [code, setCode] = useState('// Select a file or click a tab to start coding');
  const [output, setOutput] = useState<string[]>(['Welcome to the Interactive Terminal!\n']);
  const [loading, setLoading] = useState(false);
  const [fileTree, setFileTree] = useState<FileSystemNode[]>(initialFileTree);
  const [localFileContentsDb, setLocalFileContentsDb] = useState<Record<string, string>>(fileContentsDb);

  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const { isConnected, sendMessage, addMessageListener, connect, readyState } =
    useWebSocket(WEBSOCKET_URL);

  const [terminalInput, setTerminalInput] = useState('');

  const outputEndRef = useRef<HTMLDivElement>(null);

  const editorTheme = currentTheme === 'light' ? 'vs' : 'vs-dark';

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalType, setCreateModalType] = useState<'file' | 'folder'>('file');
  const [createModalParentId, setCreateModalParentId] = useState<string | null>(null);

  const [guideMessage, setGuideMessage] = useState<string | undefined>();
  const [robotMood, _setRobotMood] = useState<'normal' | 'celebrating' | 'sad'>('normal');

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  useEffect(() => {
    const fetchAiHint = async () => {
      if (getAiHint) {
        setGuideAppearance("Anny is thinking... Please wait.", 'normal');
        try {
          const hasError = output.some(line => line.toLowerCase().startsWith('error:') || line.toLowerCase().includes('failed to run'));
          const hintType = hasError ? 'debug' : 'explain';
          const payload = {
            code,
            language,
            hintType,
            errorOutput: hasError ? output.join('\n') : undefined,
          };
          const response = await fetch('http://13.231.241.132:5000/api/get-gemini-hint', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          const data = await response.json();
          if (data && data.success) {
            setGuideAppearance(data.hint, 'normal');
          } else {
            setGuideAppearance(data.hint || "Sorry, Anny couldn't get a hint right now.", 'sad');
          }
        } catch (err) {
          console.error("Error fetching AI hint:", err);
          setGuideAppearance("Oops! Anny had trouble connecting to the AI service. Try again later?", 'sad');
        }
        onAiHintProcessed();
      }
    };
    fetchAiHint();
  }, [getAiHint, code, language, output, setGuideAppearance, onAiHintProcessed]);

  useEffect(() => {
    if (!addMessageListener) return;

    const unsubscribe = addMessageListener((message: WebSocketMessage) => {
      setOutput(prevOutput => [...prevOutput, message.output || '']);
      
      switch (message.type) {
        case 'status':
          if (message.output?.includes('Connection established')) {
            setLoading(false);
            setGuideAppearance('Connected to execution server. Anny is ready to run your code!', 'normal');
          } else if (message.output?.includes('Preparing to execute')) {
            setLoading(true);
            setGuideAppearance('Anny is executing your code... Hold tight!', 'normal');
          } else if (message.output?.includes('Execution finished')) {
            setLoading(false);
            setGuideAppearance('Code execution finished! Great job, Anny thinks you are awesome!', 'celebrating');
          } else if (message.output?.includes('Connection closed')) {
            setLoading(false);
            setGuideAppearance('Disconnected from execution server. Anny is a bit lonely now.', 'sad');
          }
          break;
        case 'stdout':
          setLoading(false);
          break;
        case 'stderr':
          setLoading(false);
          setGuideAppearance('Oops! Something went wrong during execution. Anny is sad.', 'sad');
          break;
        case 'error':
          setLoading(false);
          setGuideAppearance(`Anny reports an error from server: ${message.output}`, 'sad');
          break;
      default:
          break;
      }
    });
    return unsubscribe;
  }, [addMessageListener, setGuideAppearance]);

  useEffect(() => {
    if (activeFileId) {
      const activeEditorFile = openFiles.find(f => f.id === activeFileId);
      if (activeEditorFile) {
        setCode(activeEditorFile.content);
        setLanguage(activeEditorFile.language);
      } else if (openFiles.length > 0) {
        setActiveFileId(openFiles[openFiles.length - 1].id);
      } else {
        setCode('// Select a file or click a tab to start coding');
        setLanguage('plaintext');
        setActiveFileId(null);
      }
    } else if (openFiles.length > 0) {
        setActiveFileId(openFiles[0].id);
    } else {
        setCode('// Select a file or click a tab to start coding');
        setLanguage('plaintext');
    }
  }, [activeFileId, openFiles]);

  const getLanguageForFile = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py': return 'python';
      case 'js': return 'javascript';
      case 'jsx': return 'javascript';
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'java': return 'java';
      case 'css': return 'css';
      case 'html': return 'html';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  const handleSelectFile = (fileId: string, fileName: string) => {
    const existingFile = openFiles.find(f => f.id === fileId);
    if (existingFile) {
      setActiveFileId(fileId);
    } else {
      const fileLang = getLanguageForFile(fileName);
      const fileContent = localFileContentsDb[fileId] || `// Content for ${fileName} not found`;
      const newOpenFile: OpenFile = { 
        id: fileId, 
        name: fileName, 
        language: fileLang, 
        content: fileContent,
        isDirty: false
      };
      setOpenFiles([...openFiles, newOpenFile]);
      setActiveFileId(fileId);
    }
    setGuideAppearance(`Opened ${fileName}. Ready to code!`, 'normal');
  };
  
  const handleCloseTab = (fileIdToClose: string) => {
    setOpenFiles(prevOpenFiles => prevOpenFiles.filter(f => f.id !== fileIdToClose));
  };

  const handleSetActiveTab = (fileIdToActivate: string) => {
    setActiveFileId(fileIdToActivate);
  };

  const findNodeById = (nodes: FileSystemNode[], nodeId: string): FileSystemNode | null => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }
      if (node.children) {
        const foundInChildren = findNodeById(node.children, nodeId);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }
    return null;
  };

  // Helper function to add a node to a specific parent or to the root
  const addNodeToTree = (
    nodes: FileSystemNode[],
    nodeToAdd: FileSystemNode,
    parentId: string | null
  ): FileSystemNode[] => {
    if (!parentId) {
      // Add to root
      return [...nodes, nodeToAdd];
    }
    // Add to a specific parent
    return nodes.map(node => {
      if (node.id === parentId) {
        if (node.type === 'folder') {
          const updatedChildren = node.children ? [...node.children, nodeToAdd] : [nodeToAdd];
          return { ...node, children: updatedChildren };
        }
        // This case should ideally be prevented by UI logic (e.g., only allowing adding to folders)
        console.error("Attempted to add a child to a non-folder node or parent not found at this level.");
        return node; 
      }
      if (node.children) {
        return { ...node, children: addNodeToTree(node.children, nodeToAdd, parentId) };
      }
      return node;
    });
  };
  
  const removeNodeFromTree = (nodes: FileSystemNode[], nodeId: string): FileSystemNode[] => {
    return nodes.reduce((acc, node) => {
      if (node.id === nodeId) {
        return acc; // Skip the node to delete
      }
      if (node.children) {
        const updatedChildren = removeNodeFromTree(node.children, nodeId);
        // If children array is different or still has items, keep the node with updated children
        if (updatedChildren.length !== node.children.length || updatedChildren.length > 0) {
          acc.push({ ...node, children: updatedChildren });
        } else if (node.type === 'folder' && updatedChildren.length === 0) {
            // If it's a folder and all children were removed (or it had none that matched),
            // push the folder itself but with an empty children array.
            acc.push({ ...node, children: [] }); 
        }
         // If it's a file or a folder whose children didn't change and weren't empty, it means we don't push it here if it wasn't kept above
      } else {
        // Node is a file and not the one to be deleted
        acc.push(node);
      }
      return acc;
    }, [] as FileSystemNode[]);
  };

  const handleDeleteNode = (nodeId: string) => {
    const nodeToDelete = findNodeById(fileTree, nodeId);
    if (!nodeToDelete) {
        setGuideAppearance('Could not find the item to delete.', 'sad');
        return;
    }

    setFileTree(prevTree => removeNodeFromTree(prevTree, nodeId));
    
    // Close tab if it was open
    const wasOpen = openFiles.some(f => f.id === nodeId);
    if (wasOpen) {
      handleCloseTab(nodeId); // handleCloseTab should manage active tab logic
    }

    // Remove from mock DB
    setLocalFileContentsDb(prevDb => {
      const newDb = { ...prevDb };
      delete newDb[nodeId];
      // Potentially recursively delete children contents if it was a folder
      // For now, only direct deletion
      return newDb;
    });
    setGuideAppearance(`${nodeToDelete.name} deleted.`, 'normal');
  };

  const getInitialContent = (fileName: string, fileLang: string): string => {
    switch (fileLang) {
      case 'python':
        return `#!/usr/bin/env python3
"""
File: ${fileName}
Created: ${new Date().toLocaleDateString()}
Description: Python script
"""

def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`;
      case 'javascript':
        return `// ${fileName}
// Created: ${new Date().toLocaleDateString()}

console.log("Hello, World!");`;
      case 'typescript':
        return `// ${fileName}
// Created: ${new Date().toLocaleDateString()}

console.log("Hello, World!");`;
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`;
      case 'css':
        return `/* ${fileName} */
/* Created: ${new Date().toLocaleDateString()} */

body {
    margin: 0;
    padding: 20px;
    font-family: Arial, sans-serif;
}`;
      case 'markdown':
        return `# ${fileName}

Created: ${new Date().toLocaleDateString()}

## Description

Write your markdown content here.`;
      default:
        return `// ${fileName}
// Created: ${new Date().toLocaleDateString()}`;
    }
  };

  const handleCreateNode = (type: 'file' | 'folder', parentId: string | null = null) => {
    setCreateModalType(type);
    setCreateModalParentId(parentId);
    setShowCreateModal(true);
  };

  const handleCreateModalSubmit = (fileName: string) => {
    const fileLang = getLanguageForFile(fileName);
    const newId = uuidv4();
    let newNode: FileSystemNode;

    if (createModalType === 'file') {
      newNode = {
        id: newId,
        name: fileName,
        type: 'file',
      };
      setFileTree(prevTree => addNodeToTree(prevTree, newNode, createModalParentId));

      const initialContent = getInitialContent(fileName, fileLang);
      const newOpenFile: OpenFile = {
        id: newId,
        name: fileName,
        language: fileLang,
        content: initialContent,
        isDirty: true,
      };
      setOpenFiles(prevOpenFiles => [...prevOpenFiles, newOpenFile]);
      setLocalFileContentsDb(prevDb => ({ ...prevDb, [newId]: initialContent }));
      setActiveFileId(newId);
      setGuideAppearance(`File "${fileName}" created with ${fileLang} template!`, 'normal');
    } else {
      newNode = {
        id: newId,
        name: fileName,
        type: 'folder',
        children: [],
      };
      setFileTree(prevTree => addNodeToTree(prevTree, newNode, createModalParentId));
      setGuideAppearance(`Folder "${fileName}" created!`, 'normal');
    }

    setShowCreateModal(false);
  };

  const getExistingNames = (parentId: string | null) => {
    const parent = parentId ? fileTree.find(node => node.id === parentId) : null;
    const siblings = parent?.children || fileTree;
    return siblings.map(node => node.name);
  };

  const handleRunCode = () => {
    if (!activeFileId && openFiles.length === 0 && !code.trim()) {
      setGuideAppearance("There's nothing to run! Try opening a file or writing some code. Anny is waiting!", 'normal');
      return;
    }
    if (!isConnected || readyState !== WebSocket.OPEN) {
      setGuideAppearance('Not connected to execution server. Anny is trying to connect...', 'sad');
      connect();
      return;
    }

    setOutput(['']);
    setLoading(true);
    setGuideAppearance('Anny is sending your code to the server...', 'normal');

    const activeEditorFile = openFiles.find(f => f.id === activeFileId);
    const payload: { type: 'execute'; code: string; language: string; filename?: string } = {
      type: 'execute' as const,
      code: code,
      language: language.toLowerCase()
    };

    if (language.toLowerCase() === 'java' && activeEditorFile) {
      payload.filename = activeEditorFile.name;
    }

    console.log('[IDE.tsx] handleRunCode sending:', payload);
    sendMessage(payload);
  };

  const handleTerminalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerminalInput(e.target.value);
  };

  const handleTerminalInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && terminalInput.trim() !== '') {
      if (isConnected && readyState === WebSocket.OPEN) {
        const messageToSend = { type: 'stdin' as const, data: terminalInput };
        console.log('[IDE.tsx] handleTerminalInputSubmit sending:', messageToSend);
        sendMessage(messageToSend);
        setOutput(prev => [...prev, `> ${terminalInput}\n`]); 
        setTerminalInput('');
      } else {
        setOutput(prev => [...prev, 'Error: Not connected to server. Cannot send input.\n']);
      }
      e.preventDefault();
    }
  };

  // Add handler for guide message dismissal
  const handleDismissGuideMessage = () => {
    setGuideMessage(undefined);
  };

  return (
    <div className="ide-container">
      <div className="ide-header">
        <div className="logo-title-container">
          <span className="header-title-skool">Skool</span>
          <span className="header-title-lab">Lab</span>
        </div>
        <div className="ide-controls">
          <ThemeToggle currentTheme={currentTheme} onToggleTheme={onToggleTheme} />
          <LanguageSelector language={language} onChange={(lang) => setLanguage(lang)} />
          <button 
            className="run-button" 
            onClick={handleRunCode} 
            disabled={loading || !code.trim() || !isConnected} 
          >
            {loading ? 'Running...' : (isConnected ? '▶️ Run Code' : 'Connect')}
          </button>
          <button 
            className="about-button"
            onClick={onToggleAboutMe} 
            title="About Aniruddha Gayki"
          >
            About
          </button>
          <button 
            className="about-button"
            onClick={onAskAiHint}
            title="Ask Anny for a code hint"
          >
            Ask Anny
          </button>
          {onToggleGuide && (
            <button onClick={onToggleGuide} className="about-button" title="Open Guide">
              <HelpCircle size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Guide
            </button>
          )}
        </div>
      </div>
      
      <PanelGroup direction="horizontal" className="ide-body-panels">
        <Panel defaultSize={20} minSize={15} className="file-explorer-panel">
          <FileExplorer 
            fileTree={fileTree} 
            onSelectFile={handleSelectFile} 
            onDeleteNode={handleDeleteNode}
            onCreateFile={() => handleCreateNode('file')}
            onCreateFolder={() => handleCreateNode('folder')}
          />
        </Panel>
        <PanelResizeHandle className="resize-handle-horizontal" />
        <Panel minSize={30}>
          <TabsBar 
            openFiles={openFiles}
            activeFileId={activeFileId}
            onSelectTab={handleSetActiveTab}
            onCloseTab={handleCloseTab}
          />
          <PanelGroup direction="vertical" className="ide-main-panels" style={{height: 'calc(100% - 40px)'}}>
            <Panel defaultSize={70} minSize={20}> 
              <div className="editor-panel-content">
                <CodeEditor 
                  language={language} 
                  code={code} 
                  theme={editorTheme}
                  onChange={(value) => { 
                    const newContent = value || '';
                    setCode(newContent); 
                    if (activeFileId) {
                      const isNowDirty = localFileContentsDb[activeFileId] !== newContent;
                      setOpenFiles(prev => prev.map(f => 
                        f.id === activeFileId 
                          ? {...f, content: newContent, isDirty: isNowDirty } 
                          : f
                      ));
                    }
                  }} 
                />
              </div>
            </Panel>
            <PanelResizeHandle className="resize-handle-vertical" />
            <Panel defaultSize={30} minSize={10}> 
              <div className="output-panel-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--color-bg-secondary)',
                  borderBottom: '1px solid var(--color-border-primary)',
                  padding: '6px 12px',
                  fontWeight: 500,
                  fontSize: '1rem',
                  color: 'var(--color-accent-primary)',
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 6px 0 rgba(0,0,0,0.04)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span role="img" aria-label="output">🖥️</span> Output
                  </span>
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-accent-primary)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      padding: '2px 8px',
                      borderRadius: 4,
                      transition: 'background 0.2s',
                    }}
                    onClick={() => setOutput([])}
                    title="Clear Output"
                  >
                    Clear
                  </button>
                </div>
                <div style={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  background: 'var(--terminal-bg)',
                  color: 'var(--terminal-text)',
                  padding: '12px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  borderBottom: '1px solid var(--color-border-primary)',
                  minHeight: 0,
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 14,
                  position: 'relative',
                }}>
                  {(() => {
                    // Filter out system/status messages and empty lines
                    const statusPatterns = [
                      /connection established/i,
                      /preparing to execute/i,
                      /execution finished/i,
                      /connection closed/i,
                      /anny is/i,
                      /^\s*$/
                    ];
                    const importantLines = output.filter(line =>
                      !statusPatterns.some(pattern => pattern.test(line))
                    );
                    return importantLines.length === 0 ? (
                      <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                        No output yet. Run your code to see results here.
                      </span>
                    ) : (
                      importantLines.map((line, index) => {
                        const isError = line.toLowerCase().includes('error') || line.toLowerCase().includes('failed');
                        return (
                          <div
                            key={index}
                            style={{
                              color: isError ? '#ff4d4f' : 'var(--terminal-text)',
                              fontWeight: isError ? 600 : 400,
                              marginBottom: 2,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            {isError && <span role="img" aria-label="error" style={{ fontSize: 16 }}>❗</span>}
                            <span>{line}</span>
                          </div>
                        );
                      })
                    );
                  })()}
                  <div ref={outputEndRef} />
                </div>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={handleTerminalInputChange}
                  onKeyDown={handleTerminalInputSubmit}
                  placeholder="Type input here and press Enter..."
                  disabled={!isConnected || loading}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: 'none',
                    borderTop: `1px solid var(--color-border-primary)`,
                    background: 'var(--color-bg-tertiary)',
                    color: 'var(--color-text-primary)',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: 14,
                  }}
                />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
      
      <CharacterGuide 
        message={guideMessage} 
        isCelebrating={robotMood === 'celebrating'}
        isSad={robotMood === 'sad'}
        onDismissMessage={handleDismissGuideMessage}
        isModalOpen={showCreateModal}
      />

      {showCreateModal && (
        <CreateFileModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateModalSubmit}
          type={createModalType}
          existingNames={getExistingNames(createModalParentId)}
        />
      )}
    </div>
  );
};

export default IDE; 