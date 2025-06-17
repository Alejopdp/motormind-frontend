import React from 'react';
import { FileText, Video } from 'lucide-react';

interface PartDiagramItemProps {
  title: string;
  onClick: () => void;
  type: 'video' | 'document';
}

const PartDiagramItem: React.FC<PartDiagramItemProps> = ({ title, onClick, type }) => (
  <div
    className="border-primary flex cursor-pointer items-center rounded-lg border bg-white p-4 transition-colors hover:bg-gray-100"
    onClick={onClick}
  >
    {type === 'video' ? (
      <Video className="mr-2 h-5 w-5 flex-shrink-0 text-red-500" />
    ) : (
      <FileText className="mr-2 h-5 w-5 flex-shrink-0 text-blue-500" />
    )}
    <p className="text-primary min-w-0 truncate text-sm font-medium">{title}</p>
  </div>
);

export default PartDiagramItem;
