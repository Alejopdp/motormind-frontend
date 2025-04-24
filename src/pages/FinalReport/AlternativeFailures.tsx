import { useState } from 'react';
import { ChevronDown, ChevronUp, SearchIcon } from 'lucide-react';

// import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { ResourceLinkItems } from '@/components/atoms/ResourceLinkItems';

export const AlternativeFailures = ({
  alternativeFailures,
}: {
  alternativeFailures: {
    title: string;
    probability: string;
    tests: string[];
    resources: {
      label: string;
      url: string;
    }[];
  }[];
}) => {
  const [isContingencyExpanded, setIsContingencyExpanded] = useState(false);

  if (!alternativeFailures || alternativeFailures.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsContingencyExpanded(!isContingencyExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-amber-100 p-2">
            <SearchIcon className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
          </div>
          <h2 className="text-sm font-semibold sm:text-lg">
            OTRAS POSIBLES AVERÍAS <span className="hidden sm:inline">SI EL PROBLEMA PERSISTE</span>
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
            <div
              key={index}
              className="border-t border-gray-200 pt-3 first:border-t-0 first:pt-0 sm:pt-4"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-semibold sm:text-base">{fault.title}</h3>
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
                  <h4 className="text-sm font-medium sm:text-base">Pasos de reparación:</h4>
                  <ol className="list-decimal space-y-1 pl-4 sm:pl-6">
                    {fault.tests.map((step, idx) => (
                      <li key={idx} className="text-muted text-xs sm:text-base">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <ResourceLinkItems resources={fault.resources} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
