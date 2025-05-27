import React, { useState } from 'react';

interface TitledStringListProps {
  title: string;
  items: string[];
  maxInitialItems?: number;
}

const TitledStringList: React.FC<TitledStringListProps> = ({
  title,
  items,
  maxInitialItems = 7,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) {
    return null;
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const itemsToShow = isExpanded ? items : items.slice(0, maxInitialItems);
  const showToggleButton = items.length > maxInitialItems;

  return (
    <div className="mb-3">
      <p className="mb-1 text-xs sm:text-sm">{title}</p>
      <ul className="space-y-1">
        {itemsToShow.map((item, index) => (
          <li key={index} className="text-muted flex items-start">
            <span className="mr-2 text-xs sm:text-sm">•</span>
            <span className="text-xs sm:text-sm">{item}</span>
          </li>
        ))}
        {showToggleButton && !isExpanded && items.length > maxInitialItems && (
          <li className="text-muted flex items-start" />
        )}
      </ul>
      {showToggleButton && (
        <p className="text-muted mt-4 text-xs italic sm:text-sm">{`Y ${items.length - maxInitialItems} más`}</p>
      )}
    </div>
  );
};

export default TitledStringList;
