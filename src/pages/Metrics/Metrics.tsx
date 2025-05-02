import { useEffect, useState } from 'react';
import Spinner from '@/components/atoms/Spinner';
import MetricsSection from '@/components/molecules/MetricsSection';
import apiService from '@/service/api.service';
import { DiagnosisMetrics } from '@/types/DiagnosisMetrics';

export default function Metrics() {
  const [metrics, setMetrics] = useState<DiagnosisMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await apiService.get<DiagnosisMetrics>('/diagnoses/metrics');
        setMetrics(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar métricas:', err);
        setError('No se pudieron cargar las métricas. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">Error</h2>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No hay datos disponibles</h2>
          <p className="mt-2">No se encontraron métricas para mostrar.</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Métricas de Diagnóstico</h1>

      <MetricsSection title="Uso de Motormind" metrics={usageMetrics} columns={4} />

      <MetricsSection title="Calidad del Modelo" metrics={modelQualityMetrics} columns={3} />
    </div>
  );
}
