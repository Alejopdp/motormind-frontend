import { useState, useEffect, ReactNode } from 'react';
import { Button } from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import { DocumentLink } from '@/types/Diagnosis';

interface SearchResourceButtonProps {
  buttonText: string;
  resourceName: string; // e.g., "diagramas" o "manuales"
  loadingMessages: string[];
  renderItem: (item: DocumentLink) => ReactNode;
  onClick: () => void; // Función que maneja el fetch y la actualización del estado padre
  isLoading: boolean; // Estado de carga pasado desde el padre
  resultsData: DocumentLink[] | null; // Datos de resultados pasados desde el padre
  userHasVendorResources?: boolean; // Para controlar si se muestra el botón basado en permisos/configuración
  // diagnosisId y fetchEndpoint ya no son necesarios aquí
}

export const SearchResourceButton = ({
  buttonText,
  resourceName,
  loadingMessages,
  renderItem,
  onClick,
  isLoading,
  resultsData,
  userHasVendorResources = true,
}: SearchResourceButtonProps) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const hasSearched = resultsData !== null;
  const displayableResults = resultsData;
  console.log({ displayableResults });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, loadingMessages.length]);

  if (!userHasVendorResources && resourceName === 'diagramas') {
    return null;
  }

  return (
    <div style={{ minHeight: 40 }} className="relative mb-4">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={isLoading}
        className="mb-2 min-h-12 w-full"
        style={{ display: isLoading || hasSearched ? 'none' : 'block' }}
      >
        {buttonText}
      </Button>
      <div className="absolute inset-x-0 top-0 w-full">
        {isLoading && (
          <div className="flex h-12 flex-col items-center justify-center gap-2">
            <Spinner className="h-5 w-5" label={loadingMessages[currentMessage]} />
          </div>
        )}
        {!isLoading && hasSearched && displayableResults && displayableResults.length === 0 && (
          <div className="py-3 text-center text-xs text-gray-500 italic" style={{ fontSize: 14 }}>
            No encontramos {resourceName} para este vehículo.
          </div>
        )}
      </div>

      {!isLoading && hasSearched && displayableResults && displayableResults.length > 0 && (
        <>
          <h3 className="mb-3 text-sm font-medium sm:text-base">
            {resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} encontrados:
          </h3>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {displayableResults.map((result, index) => (
              <div key={result.url || index}>{renderItem(result)}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
