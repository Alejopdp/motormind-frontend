import { BarChartIcon } from 'lucide-react';

export const EstimatedResources = ({
  estimatedResources,
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
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-md bg-green-100 p-2">
          <BarChartIcon className="h-5 w-5 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">PRESUPUESTO ORIENTATIVO / RECURSOS</h2>
      </div>

      <p className="text-muted mb-4 text-sm italic">
        *Estimación basada en tiempos estándar. Verificar precios de repuestos con proveedor y
        aplicar tarifa de mano de obra de cliente.*
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 font-medium text-gray-800">Repuestos Sugeridos</h3>
          <ul className="list-disc space-y-2 pl-6">
            {estimatedResources.parts?.map((part, index) => (
              <li key={index} className="text-gray-700">
                {`${part?.name} ${part?.quality}`}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 font-medium text-gray-800">Mano de Obra Estimada</h3>
          <div className="text-xl font-semibold text-gray-900">
            {estimatedResources.laborHours} Horas
          </div>
          <p className="text-muted mt-2 text-sm">
            Incluye diagnóstico, desmontaje, reemplazo y pruebas finales.
          </p>
        </div>
      </div>
    </div>
  );
};
