import Spinner from '@/components/atoms/Spinner';
import MetricsSection from '@/components/molecules/MetricsSection';
import apiService from '@/service/api.service';
import { DiagnosisMetrics } from '@/types/DiagnosisMetrics';
import { AlertCircle, LineChartIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/atoms/Button';

const defaultMetrics: DiagnosisMetrics = {
  timeSavedInHours: 0,
  totalDiagnoses: 0,
  completedDiagnoses: 0,
  repairedDiagnoses: 0,
  timeToPreliminary: 0,
  timeToFinal: 0,
  averageTimeToFinal: 0,
  averageTimeToRepaired: 0,
  modelQuality: {
    averageScoreByPhase: {
      preliminary: 0,
      final: 0,
    },
    obdCodePercentage: 0,
    videoRecommendationPercentage: 0,
  },
};

export default function Metrics() {
  const {
    data: metrics = defaultMetrics,
    isLoading,
    error,
    refetch,
  } = useQuery<DiagnosisMetrics>({
    queryKey: ['diagnosisMetrics'],
    queryFn: async () => {
      const response = await apiService.get<DiagnosisMetrics>('/diagnoses/metrics');
      return response.data;
    },
  });

  const usageMetrics = [
    {
      title: 'Tiempo Ahorrado',
      value: metrics.timeSavedInHours,
      unit: 'horas ahorradas',
      tooltip:
        'Tiempo total que se ha ahorrado en diagnósticos gracias a Motormind, comparado con el método tradicional.',
    },
    {
      title: 'Total de Diagnósticos',
      value: metrics.totalDiagnoses,
      unit: 'diagnósticos realizados',
      tooltip:
        'Número total de diagnósticos que se han iniciado en la plataforma (no necesariamente completados).',
    },
    {
      title: 'Diagnósticos Completados',
      value: metrics.completedDiagnoses,
      description:
        metrics.totalDiagnoses > 0
          ? `${Math.round((metrics.completedDiagnoses / metrics.totalDiagnoses) * 100)}% respecto al total de diagnósticos`
          : '0%',
      tooltip: 'Cantidad de diagnósticos con informe final generado.',
    },
    {
      title: 'Diagnósticos Reparados',
      value: metrics.repairedDiagnoses,
      description:
        metrics.totalDiagnoses > 0
          ? `${Math.round((metrics.repairedDiagnoses / metrics.totalDiagnoses) * 100)}% respecto al total de diagnósticos`
          : '0%',
      tooltip: 'Cantidad de diagnósticos que se han marcado como reparados.',
    },
    {
      title: 'Tiempo hasta Informe Preliminar',
      value: Math.round(metrics.timeToPreliminary),
      unit: 'minutos',
      tooltip: 'Tiempo promedio que toma generar el primer informe preliminar de diagnóstico',
    },
    {
      title: 'Tiempo hasta Informe Final',
      value: Math.round(metrics.timeToFinal),
      unit: 'minutos',
      tooltip: 'Tiempo promedio que toma completar el informe final de diagnóstico.',
    },
    {
      title: 'Tiempo Promedio Total',
      value: Math.round(metrics.averageTimeToFinal),
      unit: 'minutos',
      tooltip: 'Tiempo promedio total desde que se inicia hasta que se completa un diagnóstico.',
    },
    {
      title: 'Tiempo hasta Reparación',
      value: Math.round(metrics.averageTimeToRepaired),
      unit: 'minutos',
      tooltip:
        'Tiempo promedio que toma desde el inicio del diagnóstico hasta que el vehículo es reparado.',
    },
  ];

  const modelQualityMetrics = [
    {
      title: 'Score Global Preliminar',
      value: metrics.modelQuality.averageScoreByPhase.preliminary,
      tooltip:
        'Calificación promedio de la calidad del diagnóstico preliminar, basada en la precisión y completitud.',
      isScore: true,
    },
    {
      title: 'Score Global Final',
      value: metrics.modelQuality.averageScoreByPhase.final,
      tooltip:
        'Calificación promedio de la calidad del diagnóstico final, basada en la precisión y completitud.',
      isScore: true,
    },
    {
      title: 'Diagnósticos con Código OBD',
      value: metrics.modelQuality.obdCodePercentage,
      percentage: true,
      tooltip:
        'Porcentaje de diagnósticos que incluyen códigos de error OBD identificados automáticamente.',
    },
    {
      title: 'Diagnósticos con Video',
      value: metrics.modelQuality.videoRecommendationPercentage,
      percentage: true,
      tooltip:
        'Porcentaje de diagnósticos que incluyen videos recomendados para ayudar en la reparación.',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner label="Cargando métricas..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <div className="text-destructive flex items-center gap-2 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5" />
          <span>Error al cargar las métricas</span>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="mb-4 rounded-full bg-gray-100 p-4">
          <LineChartIcon className="h-10 w-10 text-gray-500" />
        </div>
        <h3 className="text-muted mb-1 text-lg font-medium">No hay métricas disponibles</h3>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-grow flex-col">
      <div className="sticky top-0 z-10 flex flex-col items-center justify-between bg-white px-6 py-2 shadow-xs sm:flex-row sm:px-8 sm:py-4 lg:flex-row">
        <div className="lg:w-1/3">
          <h1 className="py-0.5 text-xl font-semibold sm:py-0 lg:text-2xl">
            Métricas de Diagnóstico
          </h1>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-8">
        <MetricsSection title="Uso de Motormind" metrics={usageMetrics} columns={4} />
        <MetricsSection title="Calidad del Modelo" metrics={modelQualityMetrics} columns={3} />
      </div>
    </div>
  );
}
