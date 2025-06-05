import React from 'react';

interface PartDiagramItemProps {
  title: string;
  onClick: () => void;
}

const PartDiagramItem: React.FC<PartDiagramItemProps> = ({ title, onClick }) => (
  <div
    className="border-primary flex cursor-pointer items-center rounded-lg border bg-white p-4 transition-colors hover:bg-gray-100"
    onClick={onClick}
  >
    <span className="mr-2 flex-shrink-0">📄</span>
    <p className="text-primary min-w-0 truncate text-sm font-medium">{title}</p>
  </div>
);

export default PartDiagramItem;
