import React, { useState } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import FolderItem from './FolderItem';

interface FileData {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileData[];
}

interface FileExplorerProps {
  onFileSelect?: (fileName: string) => void;
  currentFile?: string;
}

export default function FileExplorer({ onFileSelect, currentFile }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['templates', 'sections', 'snippets']);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderName)
        ? prev.filter(name => name !== folderName)
        : [...prev, folderName]
    );
  };

  const handleCreateFile = (folderName: string) => {
    setSelectedFolder(folderName);
    setIsCreatingFile(true);
    setNewItemName('');
  };

  const handleCreateFolder = () => {
    setIsCreatingFolder(true);
    setNewItemName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    setIsCreatingFile(false);
    setIsCreatingFolder(false);
    setNewItemName('');
    setSelectedFolder(null);
  };

  return (
    <div className="w-64 bg-[#1E1E2E] text-gray-300 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">EXPLORER</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCreateFolder}
            className="p-1 hover:bg-[#2A2A3C] rounded"
            title="New Folder"
          >
            <FolderPlus size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {(isCreatingFile || isCreatingFolder) && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={isCreatingFile ? "filename.liquid" : "folder name"}
            className="w-full bg-[#2A2A3C] text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
            autoFocus
          />
        </form>
      )}

      <div className="space-y-2">
        {['templates', 'sections', 'snippets'].map((folder) => (
          <FolderItem
            key={folder}
            folder={{ name: folder, type: 'folder', children: [] }}
            isExpanded={expandedFolders.includes(folder)}
            currentFile={currentFile}
            onToggle={toggleFolder}
            onFileSelect={onFileSelect || (() => {})}
            onCreateFile={() => handleCreateFile(folder)}
          />
        ))}
      </div>
    </div>
  );
}