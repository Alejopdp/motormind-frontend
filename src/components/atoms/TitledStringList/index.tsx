import React from 'react';

interface TitledStringListProps {
  title: string;
  items: string[];
}

const maxInitialItems = 7;

const TitledStringList: React.FC<TitledStringListProps> = ({ title, items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-3">
      <p className="mb-1 text-xs sm:text-sm">{title}</p>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-muted flex items-start">
            <span className="mr-2 text-xs sm:text-sm">•</span>
            <span className="text-xs sm:text-sm">{item}</span>
          </li>
        ))}
      </ul>
      {items.length > maxInitialItems && (
        <p className="text-muted mt-4 text-xs italic sm:text-sm">{`Y ${items.length - maxInitialItems} más`}</p>
      )}
    </div>
  );
};

export default TitledStringList;
