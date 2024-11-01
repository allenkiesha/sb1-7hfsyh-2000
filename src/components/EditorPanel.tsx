import React from 'react';
import Split from 'react-split';
import { CodeEditor } from './Editor';
import Preview from './Preview';

interface EditorPanelProps {
  code: string;
  onCodeChange: (code: string) => void;
}

function EditorPanel({ code, onCodeChange }: EditorPanelProps) {
  return (
    <Split
      className="flex-1"
      direction="vertical"
      sizes={[60, 40]}
      minSize={[200, 200]}
      gutterSize={4}
      gutterStyle={() => ({
        backgroundColor: '#2A2A3C'
      })}
    >
      <CodeEditor onCodeChange={onCodeChange} initialValue={code} />
      <Preview code={code} />
    </Split>
  );
}

export default EditorPanel;