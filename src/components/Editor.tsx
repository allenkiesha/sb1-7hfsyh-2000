import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  onCodeChange?: (code: string) => void;
  initialValue?: string;
}

export function CodeEditor({ onCodeChange, initialValue }: CodeEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onCodeChange?.(value);
    }
  };

  return (
    <div className="flex-1 h-full">
      <MonacoEditor
        height="100%"
        defaultLanguage="liquid"
        theme="vs-dark"
        value={initialValue}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}