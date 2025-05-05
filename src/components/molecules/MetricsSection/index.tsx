import React from 'react';
import MetricItem from '../MetricItem';
import { DiagnosisMetric } from '../../../types/DiagnosisMetric';

interface MetricsSectionProps {
  title: string;
  metrics: DiagnosisMetric[];
  columns?: number;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ title, metrics, columns = 4 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className="mb-12">
      <h2 className="text-primary mb-6 text-2xl font-semibold">{title}</h2>
      <div className={`grid gap-6 ${gridCols[columns as keyof typeof gridCols]}`}>
        {metrics.map((metric, index) => (
          <MetricItem
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            description={metric.description}
            percentage={metric.percentage}
            tooltip={metric.tooltip}
            isScore={metric.isScore}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricsSection;
