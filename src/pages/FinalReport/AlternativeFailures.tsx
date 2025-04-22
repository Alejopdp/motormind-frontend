import { useState } from 'react';
import { ChevronDown, ChevronUp, SearchIcon } from 'lucide-react';

// import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';

export const AlternativeFailures = ({
  alternativeFailures,
}: {
  alternativeFailures: [
    {
      title: string;
      probability: string;
      tests: string[];
      resources: {
        label: string;
        url: string;
      }[];
    },
  ];
}) => {
  const [isContingencyExpanded, setIsContingencyExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsContingencyExpanded(!isContingencyExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-amber-100 p-2">
            <SearchIcon className="h-5 w-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            OTRAS POSIBLES AVERÍAS SI EL PROBLEMA PERSISTE
          </h2>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          {isContingencyExpanded ? (
            <ChevronUp className="!h-5 !w-5" />
          ) : (
            <ChevronDown className="!h-5 !w-5" />
          )}
        </Button>
      </div>

      {isContingencyExpanded && (
        <div className="mt-4 space-y-6">
          {alternativeFailures.map((fault, index) => (
            <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900">{fault.title}</h3>
                {/* <Badge
                  variant="outline"
                  className={`px-3 py-1 font-medium ${
                    fault.probability === 'Media'
                      ? 'border-orange-200 bg-orange-100 text-orange-800'
                      : 'border-yellow-200 bg-yellow-100 text-yellow-800'
                  }`}
                >
                  Probabilidad: {fault.probability}
                </Badge> */}
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Pasos de reparación:</h4>
                  <ol className="list-decimal space-y-1 pl-6">
                    {fault.tests.map((step, idx) => (
                      <li key={idx} className="text-muted">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Recursos:</h4>
                  <ul className="text-primary list-disc space-y-1 pl-6">
                    {fault.resources.map((resource, idx) => (
                      <li key={idx}>
                        <a
                          href={resource?.url}
                          className="text-primary"
                          target="_blank"
                          rel="video_reference"
                        >
                          {resource?.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
