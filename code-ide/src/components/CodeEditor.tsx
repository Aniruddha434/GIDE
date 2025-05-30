import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import EditorToolbar from './EditorToolbar';
import styles from './CodeEditor.module.css';

interface CodeEditorProps {
  code: string;
  language: string;
  theme: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const CodeEditor = ({ code, language, theme, onChange, readOnly = false }: CodeEditorProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('off');
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentFileHandle, setCurrentFileHandle] = useState<FileSystemFileHandle | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: code,
        language,
        theme,
        automaticLayout: true,
        minimap: { enabled: true },
        lineNumbers: showLineNumbers ? 'on' : 'off',
        wordWrap: wordWrap,
        fontSize: fontSize,
        fontFamily: 'JetBrains Mono, monospace',
        scrollBeyondLastLine: false,
        readOnly,
        tabSize: 2,
        renderWhitespace: 'selection',
        contextmenu: true,
        formatOnPaste: true,
        formatOnType: true,
      });

      editorRef.current.onDidChangeModelContent(() => {
        onChange(editorRef.current?.getValue() || '');
      });

      return () => {
        editorRef.current?.dispose();
      };
    }
  }, [language, theme]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        lineNumbers: showLineNumbers ? 'on' : 'off',
        wordWrap: wordWrap,
        fontSize: fontSize,
      });
    }
  }, [showLineNumbers, wordWrap, fontSize]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleFormatCode = async () => {
    if (editorRef.current) {
      try {
        await editorRef.current.getAction('editor.action.formatDocument')?.run();
      } catch (error) {
        console.error('Error formatting code:', error);
      }
    }
  };

  const handleSearch = () => {
    if (editorRef.current) {
      editorRef.current.getAction('actions.find')?.run();
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSaveFile = async () => {
    try {
      const content = editorRef.current?.getValue() || code;
      if (!content) {
        console.error('No content to save');
        return;
      }

      if (!currentFileHandle) {
        // If no file handle exists, show save dialog
        const handle = await window.showSaveFilePicker({
          suggestedName: 'untitled.txt',
          types: [{
            description: 'Text Files',
            accept: {
              'text/plain': ['.txt'],
              'text/javascript': ['.js'],
              'text/typescript': ['.ts'],
              'text/html': ['.html'],
              'text/css': ['.css'],
              'text/json': ['.json'],
              'text/python': ['.py'],
              'text/java': ['.java'],
            },
          }],
        });
        setCurrentFileHandle(handle);
      }

      if (currentFileHandle) {
        const writable = await currentFileHandle.createWritable();
        await writable.write(content);
        await writable.close();
      }
    } catch (error) {
      console.error('Error saving file:', error);
      // Fallback to traditional download if File System Access API is not supported
      const content = editorRef.current?.getValue() || code;
      if (!content) {
        console.error('No content to save');
        return;
      }
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'untitled.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className={`${styles.editorContainer} ${isFullscreen ? styles.fullscreen : ''}`}>
      <EditorToolbar
        showLineNumbers={showLineNumbers}
        onToggleLineNumbers={() => setShowLineNumbers(!showLineNumbers)}
        wordWrap={wordWrap}
        onToggleWordWrap={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onCopyCode={handleCopyCode}
        onFormatCode={handleFormatCode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onSearch={handleSearch}
        onSaveFile={handleSaveFile}
      />
      <div ref={containerRef} className={styles.editor} />
    </div>
  );
};

export default CodeEditor; 