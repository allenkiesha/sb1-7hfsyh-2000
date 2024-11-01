import React, { useState } from 'react';
import { Sparkles, GraduationCap } from 'lucide-react';
import BuilderAssistant from './ai/BuilderAssistant';
import LearningAssistant from './ai/LearningAssistant';

interface AIAssistantProps {
  onUpdateCode?: (newCode: string) => void;
  currentCode?: string;
}

export default function AIAssistant({ onUpdateCode, currentCode }: AIAssistantProps) {
  const [mode, setMode] = useState<'builder' | 'learning'>('builder');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex border-b border-[#2A2A3C] shrink-0">
        <button
          className={`flex-1 p-2 flex items-center justify-center gap-2 ${
            mode === 'builder' ? 'bg-purple-500 bg-opacity-20' : 'hover:bg-[#2A2A3C]'
          }`}
          onClick={() => setMode('builder')}
        >
          <Sparkles size={16} className="text-purple-400" />
          <span className="text-sm">Builder</span>
        </button>
        <button
          className={`flex-1 p-2 flex items-center justify-center gap-2 ${
            mode === 'learning' ? 'bg-purple-500 bg-opacity-20' : 'hover:bg-[#2A2A3C]'
          }`}
          onClick={() => setMode('learning')}
        >
          <GraduationCap size={16} className="text-purple-400" />
          <span className="text-sm">Learning</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {mode === 'builder' ? (
          <BuilderAssistant onUpdateCode={onUpdateCode} currentCode={currentCode} />
        ) : (
          <LearningAssistant onUpdateCode={onUpdateCode} currentCode={currentCode} />
        )}
      </div>
    </div>
  );
}