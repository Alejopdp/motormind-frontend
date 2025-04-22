import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';

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
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        <h2 className="mb-3 text-xl font-semibold">Observaciones Detalladas</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-md pl-1 text-gray-800">
              Añade tus observaciones detalladas sobre las respuestas a las preguntas anteriores y
              cualquier otra información relevante.
            </p>
            <Textarea
              id="details"
              placeholder="Observaciones del técnico..."
              className="min-h-[150px] resize-none"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              disabled={isLoadingMoreQuestions || isLoadingDiagnosis}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4">
        <Button
          disabled={disableMoreQuestions}
          type="button"
          variant="outline"
          onClick={onGenerateMoreQuestions}
        >
          {isLoadingMoreQuestions ? 'Generando...' : 'Generar Más Preguntas'}
        </Button>
        <Button
          disabled={isLoadingMoreQuestions || isLoadingDiagnosis || details.length === 0}
          type="submit"
        >
          {isLoadingDiagnosis ? 'Generando Informe...' : 'Crear Informe Preliminar'}
        </Button>
      </div>
    </form>
  );
};
