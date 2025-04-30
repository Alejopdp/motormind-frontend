import { useEffect, useState } from 'react';
import Spinner from '@/components/atoms/Spinner';
import apiService from '@/service/api.service';

interface DiagnosisMetrics {
  timeToPreliminary: number;
  timeToFinal: number;
  averageTimeToFinal: number;
  averageTimeToRepaired: number;
  totalDiagnoses: number;
  completedDiagnoses: number;
  repairedDiagnoses: number;
  timeSavedInHours: number;
}

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

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Métricas de Diagnóstico</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Tiempo ahorrado */}
        <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-md">
          <h3 className="text-lg font-semibold text-green-700">Tiempo Ahorrado</h3>
          <p className="mt-2 text-4xl font-bold text-green-600">{metrics.timeSavedInHours}</p>
          <p className="mt-2 text-sm text-green-700">horas ahorradas</p>
        </div>

        {/* Total de diagnósticos */}
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-md">
          <h3 className="text-lg font-semibold text-blue-700">Total de Diagnósticos</h3>
          <p className="mt-2 text-4xl font-bold text-blue-600">{metrics.totalDiagnoses}</p>
          <p className="mt-2 text-sm text-blue-700">diagnósticos realizados</p>
        </div>

        {/* Diagnósticos completados */}
        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-md">
          <h3 className="text-lg font-semibold text-purple-700">Diagnósticos Completados</h3>
          <p className="mt-2 text-4xl font-bold text-purple-600">{metrics.completedDiagnoses}</p>
          <p className="mt-2 text-sm text-purple-700">
            {metrics.totalDiagnoses > 0
              ? `${Math.round((metrics.completedDiagnoses / metrics.totalDiagnoses) * 100)}% completados`
              : '0% completados'}
          </p>
        </div>

        {/* Diagnósticos reparados */}
        <div className="rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 p-6 shadow-md">
          <h3 className="text-lg font-semibold text-amber-700">Diagnósticos Reparados</h3>
          <p className="mt-2 text-4xl font-bold text-amber-600">{metrics.repairedDiagnoses}</p>
          <p className="mt-2 text-sm text-amber-700">
            {metrics.totalDiagnoses > 0
              ? `${Math.round((metrics.repairedDiagnoses / metrics.totalDiagnoses) * 100)}% reparados`
              : '0% reparados'}
          </p>
        </div>

        {/* Tiempo hasta informe preliminar */}
        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 shadow-md">
          <h3 className="text-lg font-semibold text-indigo-700">Tiempo hasta Informe Preliminar</h3>
          <p className="mt-2 text-4xl font-bold text-indigo-600">
            {Math.round(metrics.timeToPreliminary)}
          </p>
          <p className="mt-2 text-sm text-indigo-700">minutos promedio</p>
        </div>

        {/* Tiempo hasta informe final */}
        <div className="rounded-lg bg-gradient-to-br from-rose-50 to-rose-100 p-6 shadow-md">
          <h3 className="text-lg font-semibold text-rose-700">Tiempo hasta Informe Final</h3>
          <p className="mt-2 text-4xl font-bold text-rose-600">{Math.round(metrics.timeToFinal)}</p>
          <p className="mt-2 text-sm text-rose-700">minutos promedio</p>
        </div>

        {/* Tiempo promedio total */}
        <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 shadow-md">
          <h3 className="text-lg font-semibold text-cyan-700">Tiempo Promedio Total</h3>
          <p className="mt-2 text-4xl font-bold text-cyan-600">
            {Math.round(metrics.averageTimeToFinal)}
          </p>
          <p className="mt-2 text-sm text-cyan-700">minutos promedio</p>
        </div>

        {/* Tiempo promedio hasta reparación */}
        <div className="rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 p-6 shadow-md">
          <h3 className="text-lg font-semibold text-teal-700">Tiempo hasta Reparación</h3>
          <p className="mt-2 text-4xl font-bold text-teal-600">
            {Math.round(metrics.averageTimeToRepaired)}
          </p>
          <p className="mt-2 text-sm text-teal-700">minutos promedio</p>
        </div>
      </div>
    </div>
  );
}
