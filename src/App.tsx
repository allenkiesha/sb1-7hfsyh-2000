import React, { useState } from 'react';
import Split from 'react-split';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import AIAssistant from './components/AIAssistant';
import { CodeEditor } from './components/Editor';
import Preview from './components/Preview';

function App() {
  const [currentFile, setCurrentFile] = useState('index.liquid');
  const [currentCode, setCurrentCode] = useState('');

  const handleFileSelect = (fileName: string) => {
    setCurrentFile(fileName);
    setCurrentCode('// Selected file: ' + fileName);
  };

  return (
    <div className="h-screen flex bg-[#13111C] text-white overflow-hidden">
      <Sidebar />
      <Split 
        className="flex-1 flex"
        sizes={[20, 50, 30]}
        minSize={[200, 400, 300]}
        gutterSize={4}
        gutterStyle={() => ({
          backgroundColor: '#2A2A3C'
        })}
      >
        <FileExplorer onFileSelect={handleFileSelect} currentFile={currentFile} />
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
          <CodeEditor onCodeChange={setCurrentCode} initialValue={currentCode} />
          <Preview code={currentCode} />
        </Split>
        <div className="h-full overflow-hidden">
          <AIAssistant onUpdateCode={setCurrentCode} currentCode={currentCode} />
        </div>
      </Split>
    </div>
  );
}

export default App;