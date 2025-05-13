export interface DiagnosisMetric {
  title: string;
  value: number;
  unit?: string;
  description?: string;
  percentage?: boolean;
  tooltip?: string;
  isScore?: boolean;
}

export interface MetricsSectionProps {
  title: string;
  metrics: DiagnosisMetric[];
  columns?: number;
}
