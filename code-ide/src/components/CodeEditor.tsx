import { useRef } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  code: string;
  theme?: string;
  onChange: (value: string | undefined) => void;
}

const CodeEditor = ({ language, code, theme, onChange }: CodeEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Convert language name to Monaco language identifier
  const getLanguageId = (lang: string): string => {
    switch (lang.toLowerCase()) {
      case 'python':
        return 'python';
      case 'javascript':
        return 'javascript';
      case 'java':
        return 'java';
      default:
        return 'plaintext';
    }
  };

  return (
    <Editor
      height="70vh"
      theme={theme || "vs-dark"}
      language={getLanguageId(language)}
      value={code}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor; 