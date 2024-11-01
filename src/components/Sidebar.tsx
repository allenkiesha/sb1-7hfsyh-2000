import React from 'react';
import { FolderOpen, FileCode, Settings, GitBranch } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-12 bg-[#1E1E2E] border-r border-[#2A2A3C] flex flex-col items-center py-4">
      <div className="flex flex-col gap-4">
        <button className="p-2 text-gray-400 hover:text-white">
          <FolderOpen size={20} />
        </button>
        <button className="p-2 text-gray-400 hover:text-white">
          <FileCode size={20} />
        </button>
        <button className="p-2 text-gray-400 hover:text-white">
          <GitBranch size={20} />
        </button>
        <button className="mt-auto p-2 text-gray-400 hover:text-white">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}