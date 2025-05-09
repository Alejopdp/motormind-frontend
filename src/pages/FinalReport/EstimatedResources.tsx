import { BarChartIcon } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import { ResourceLinkItems } from '@/components/atoms/ResourceLinkItems';
import { useApi } from '@/hooks/useApi';
import { FailureDiagram } from '@/types/Diagnosis';

export const EstimatedResources = ({
  estimatedResources,
  diagnosisId,
}: {
  estimatedResources: {
    parts: [
      {
        name: string;
        price: number;
        quality: string;
      },
    ];
    laborHours: number;
  };
  diagnosisId: string;
}) => {
  const [showDiagrams, setShowDiagrams] = useState(false);
  const [diagramResults, setDiagramResults] = useState<{ label: string; url: string }[]>([]);
  const [error, setError] = useState(false);
  const { execute: getDiagrams } = useApi<FailureDiagram[]>(
    'get',
    `/diagnoses/${diagnosisId}/failure-diagrams`,
  );
  const { mutate: fetchDiagrams, isPending } = useMutation({
    mutationFn: async () => {
      setError(false);
      setDiagramResults([]);
      // Ajusta el endpoint según tu backend
      const res = await getDiagrams();

      if (res.status !== 200) throw new Error('No se pudo buscar diagramas');
      const data = res.data;
      // Espera que el backend devuelva un array de { title, link }
      return (
        data.map((doc: FailureDiagram) => ({
          label: doc.title,
          url: doc.link,
        })) || []
      );
    },
    onSuccess: (results) => {
      setDiagramResults(results);
      setShowDiagrams(true);
    },
    onError: () => {
      setError(true);
      setShowDiagrams(true);
    },
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-md bg-green-100 p-2">
          <BarChartIcon className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
        </div>
        <h2 className="text-sm font-semibold sm:text-lg">PRESUPUESTO ORIENTATIVO / RECURSOS</h2>
      </div>

      <p className="text-muted mb-4 text-xs italic sm:text-sm">
        *Estimación basada en tiempos estándar. Verificar precios de repuestos con proveedor y
        aplicar tarifa de mano de obra de cliente.*
      </p>

      <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-2 sm:p-4">
          <h3 className="mb-3 text-sm font-medium sm:text-base">Repuestos Sugeridos</h3>
          <ul className="list-disc space-y-2 pl-4 sm:pl-6">
            {estimatedResources.parts?.map((part, index) => (
              <li key={index} className="text-muted text-xs sm:text-base">
                {`${part?.name} ${part?.quality}`}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-gray-50 p-2 sm:p-4">
          <h3 className="mb-1 text-sm font-medium sm:mb-3 sm:text-base">Mano de Obra Estimada</h3>
          <div className="text-lg font-semibold sm:text-xl">
            {estimatedResources.laborHours} Horas
          </div>
          <p className="text-muted mt-2 text-xs sm:text-sm">
            Incluye diagnóstico, desmontaje, reemplazo y pruebas finales.
          </p>
        </div>
      </div>

      {/* CTA Buscar diagramas */}
      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() => fetchDiagrams()}
          disabled={isPending}
          className="mb-2"
        >
          Buscar diagramas
        </Button>
        <div style={{ minHeight: 32 }}>
          {isPending && <Spinner className="inline-block h-5 w-5 align-middle" />}
          {showDiagrams && !isPending && (error || diagramResults.length === 0) && (
            <div className="text-xs text-gray-500 italic" style={{ fontSize: 14 }}>
              No encontramos manuales para este vehículo.
            </div>
          )}
          {showDiagrams && !isPending && diagramResults.length > 0 && (
            <ResourceLinkItems resources={diagramResults} />
          )}
        </div>
      </div>
    </div>
  );
};
