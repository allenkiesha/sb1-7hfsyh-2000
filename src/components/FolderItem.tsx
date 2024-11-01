import React from 'react';
import { Folder, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import FileItem from './FileItem';
import { FileData } from './FileExplorer';

interface FolderItemProps {
  folder: FileData;
  isExpanded: boolean;
  currentFile?: string;
  onToggle: (folderName: string) => void;
  onFileSelect: (fileName: string) => void;
  onCreateFile: () => void;
}

export default function FolderItem({ 
  folder, 
  isExpanded, 
  currentFile, 
  onToggle, 
  onFileSelect,
  onCreateFile
}: FolderItemProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between group">
        <div 
          className="flex items-center gap-2 hover:bg-[#2A2A3C] p-1 rounded cursor-pointer flex-1"
          onClick={() => onToggle(folder.name)}
        >
          {isExpanded ? (
            <ChevronDown size={16} className="text-gray-400" />
          ) : (
            <ChevronRight size={16} className="text-gray-400" />
          )}
          <Folder size={16} className="text-blue-400" />
          <span>{folder.name}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateFile();
          }}
          className="p-1 hover:bg-[#2A2A3C] rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="New File"
        >
          <Plus size={16} className="text-gray-400" />
        </button>
      </div>
      {isExpanded && folder.children && (
        <div className="ml-4 space-y-1">
          {folder.children.map((child) => (
            <FileItem
              key={`${folder.name}/${child.name}`}
              name={child.name}
              isSelected={currentFile === child.name}
              onSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}