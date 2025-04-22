import { WrenchIcon } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge';
import { ResourceLinkItems } from '@/components/atoms/ResourceLinkItems';

export const PrimaryRepairSection = ({
  confirmedFailures,
}: {
  confirmedFailures: {
    title: string;
    steps: string[];
    tools: string[];
    resources: {
      label: string;
      url: string;
    }[];
  }[];
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-md bg-blue-100 p-2">
          <WrenchIcon className="text-primary h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">PASOS PARA REPARAR</h2>
      </div>

      <div className="space-y-6">
        {confirmedFailures.map((fault, index) => (
          <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-gray-900">{fault.title}</h3>
              <Badge
                variant="outline"
                className="border-red-200 bg-red-100 px-3 py-1 font-medium text-red-800"
              >
                Confirmado
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Pasos de reparación:</h4>
                <ol className="list-decimal space-y-1 pl-6">
                  {fault.steps.map((step, idx) => (
                    <li key={idx} className="text-muted">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Herramientas:</h4>
                <ul className="text-primary list-disc space-y-1 pl-6">
                  {fault.tools.map((resource, idx) => (
                    <li key={idx} className="text-muted">
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>

              <ResourceLinkItems resources={fault.resources} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
