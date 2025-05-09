import React from 'react';

interface PartDiagramItemProps {
  title: string;
  onClick: () => void;
}

const PartDiagramItem: React.FC<PartDiagramItemProps> = ({ title, onClick }) => (
  <div
    className="border-primary-200 flex cursor-pointer items-center justify-center rounded-lg border bg-white p-4"
    onClick={onClick}
  >
    <div className="flex items-center">
      <span className="mr-2">📄</span>
      <p className="text-primary-400 flex-grow truncate text-sm font-medium">{title}</p>
    </div>
  </div>
);

export default PartDiagramItem;
