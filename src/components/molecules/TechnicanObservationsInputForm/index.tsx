import { Button } from '@/components/atoms/Button';
import { VoiceTextInput } from '@/components/molecules/VoiceTextInput';
import { useState } from 'react';
import { LoadingModal } from '../LoadingModal';

interface TechnicanObservationsInputFormProps {
  initialDetails?: string;
  onSubmit: (details: string) => void;
  onGenerateMoreQuestions: () => void;
  disableMoreQuestions?: boolean;
  isLoadingMoreQuestions?: boolean;
  isLoadingDiagnosis?: boolean;
}

export const TechnicanObservationsInputForm = ({
  initialDetails = '',
  onSubmit,
  onGenerateMoreQuestions,
  disableMoreQuestions = false,
  isLoadingMoreQuestions = false,
  isLoadingDiagnosis = false,
}: TechnicanObservationsInputFormProps) => {
  const [details, setDetails] = useState(initialDetails);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-gray-200 bg-white shadow-sm"
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-md mb-3 font-semibold sm:text-xl">Observaciones Detalladas</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="sm:text-md pl-1 text-sm">
                Añade tus observaciones detalladas sobre las respuestas a las preguntas anteriores y
                cualquier otra información relevante.
              </p>
              <VoiceTextInput
                placeholder="Observaciones del técnico..."
                className="min-h-[150px]"
                value={details}
                onChange={setDetails}
                disabled={isLoadingMoreQuestions || isLoadingDiagnosis}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 rounded-b-lg border-t border-gray-200 bg-gray-50 p-4 sm:flex-row sm:flex-wrap sm:justify-end sm:px-6 sm:py-4">
          {!disableMoreQuestions && (
            <Button
              type="button"
              variant="outline"
              onClick={onGenerateMoreQuestions}
              disabled={isLoadingMoreQuestions}
              className="w-full sm:w-auto"
              size="lg"
            >
              {isLoadingMoreQuestions ? (
                'Generando...'
              ) : (
                <>
                  <span>Generar Más Preguntas</span>
                </>
              )}
            </Button>
          )}
          <Button
            disabled={isLoadingMoreQuestions || isLoadingDiagnosis || details.length === 0}
            type="submit"
            className="w-full sm:w-auto"
            size="lg"
          >
            {isLoadingDiagnosis ? (
              'Creando...'
            ) : (
              <>
                <span className="sm:hidden">Crear Informe Preliminar</span>
                <span className="hidden sm:inline">Crear Informe Preliminar</span>
              </>
            )}
          </Button>
        </div>
      </form>

      <LoadingModal isOpen={isLoadingDiagnosis} message="Generando informe preliminar" />
    </>
  );
};
