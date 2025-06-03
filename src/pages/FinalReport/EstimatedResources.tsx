import { BarChartIcon } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { DocumentLink } from '@/types/Diagnosis';
import PartDiagramItem from '@/components/molecules/PartDiagramItem';
import { useAuth } from '@/context/Auth.context';
import { SearchResourceButton } from '@/components/atoms/SearchResourceButton';
import { ApiService } from '@/service/api.service';

const diagramLoadingMessages = [
  'Buscando diagramas... esta operación puede tardar varios segundos',
  'Accediendo a documentación técnica del fabricante...',
  'Analizando la avería y localizando diagramas relevantes...',
  'Explorando secciones técnicas en busca de esquemas de piezas...',
  'Preparando recursos visuales para facilitar la reparación...',
];

type EstimatedResourcesProps = {
  estimatedResources: {
    parts: [
      {
        name: string;
        price: number;
        quality: string;
      },
    ];
    laborHours: number;
    partsDiagrams?: DocumentLink[];
  };
  diagnosisId: string;
};

export const EstimatedResources = ({
  estimatedResources,
  diagnosisId,
}: EstimatedResourcesProps) => {
  const { user } = useAuth();
  const apiService = ApiService.getInstance();

  const [diagramResults, setDiagramResults] = useState<DocumentLink[] | null>(
    estimatedResources.partsDiagrams || null,
  );

  const fetchDiagramsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiService.get<DocumentLink[]>(
        `/diagnoses/${diagnosisId}/failure-diagrams`,
      );
      if (res.status !== 200) throw new Error('No se pudo buscar diagramas');
      return res.data || [];
    },
    onSuccess: (data) => {
      setDiagramResults(data);
    },
    onError: (error) => {
      console.error('Error fetching diagrams:', error);
      setDiagramResults([]);
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

      <div className="mt-8">
        <SearchResourceButton
          buttonText="Buscar diagramas de piezas"
          resourceName="diagramas"
          loadingMessages={diagramLoadingMessages}
          onClick={() => fetchDiagramsMutation.mutate()}
          isLoading={fetchDiagramsMutation.isPending}
          resultsData={diagramResults}
          userHasVendorResources={user.hasVendorResources}
          renderItem={(item: DocumentLink) => (
            <PartDiagramItem
              key={item.label + item.url}
              title={item.label}
              onClick={() => window.open(item.url, '_blank')}
            />
          )}
        />
      </div>
    </div>
  );
};
