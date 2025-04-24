import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { VoiceTextInput } from '@/components/VoiceTextInput';

interface SymptomInputFormProps {
  initialSymptoms?: string;
  initialNotes?: string;
  licensePlate?: string;
  isLoading?: boolean;
  onSubmit: (data: { symptoms: string; notes: string }) => void;
}

export default function SymptomInputForm({
  initialSymptoms = '',
  initialNotes = '',
  licensePlate,
  onSubmit,
  isLoading,
}: SymptomInputFormProps) {
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [notes, setNotes] = useState(initialNotes);
  const [showNotes, setShowNotes] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ symptoms, notes });

    // If licensePlate is provided, navigate to guided questions
    if (licensePlate) {
      navigate(`/guided-questions/${licensePlate}`, {
        state: { symptoms, notes },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-4 sm:p-6">
        <h2 className="text-md mb-2 font-semibold sm:mb-3 sm:text-xl">Síntomas y Observaciones</h2>

        <div className="space-y-4">
          <div className="mb-2 space-y-2">
            <p className="sm:text-md text-sm">Describe los síntomas que presenta el vehículo</p>
            <VoiceTextInput
              placeholder="Síntomas..."
              className="min-h-[120px]"
              value={symptoms}
              onChange={setSymptoms}
              disabled={isLoading}
              // required
            />
          </div>

          <div>
            <Button
              type="button"
              variant="ghost"
              className="text-primary h-auto !p-0"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? (
                <>
                  <ChevronUpIcon className="h-4 w-4" />
                  Ocultar notas adicionales
                </>
              ) : (
                <>
                  <ChevronDownIcon className="h-4 w-4" />
                  Añadir notas adicionales
                </>
              )}
            </Button>

            {showNotes && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium sm:text-base">Notas Adicionales</p>
                <VoiceTextInput
                  placeholder="Añade cualquier información adicional relevante..."
                  className="min-h-[100px]"
                  value={notes}
                  onChange={setNotes}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4">
        <Button type="submit" disabled={isLoading || symptoms.length === 0}>
          {isLoading ? 'Generando Preguntas...' : 'Continuar a Preguntas Guiadas'}
        </Button>
      </div>
    </form>
  );
}
