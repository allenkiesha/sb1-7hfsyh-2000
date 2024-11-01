import React from 'react';
import { FileText } from 'lucide-react';

interface FileItemProps {
  name: string;
  isSelected: boolean;
  onSelect: (fileName: string) => void;
}

export default function FileItem({ name, isSelected, onSelect }: FileItemProps) {
  return (
    <div
      className={`flex items-center gap-2 p-1 rounded cursor-pointer ${
        isSelected ? 'bg-[#2A2A3C]' : 'hover:bg-[#2A2A3C]'
      }`}
      onClick={() => onSelect(name)}
    >
      <FileText size={16} className="text-gray-400" />
      <span>{name}</span>
    </div>
  );
}