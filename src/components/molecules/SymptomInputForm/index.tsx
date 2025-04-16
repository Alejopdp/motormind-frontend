import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';

interface SymptomInputFormProps {
  initialSymptoms?: string;
  initialNotes?: string;
  licensePlate?: string;
  onSubmit: (data: { symptoms: string; notes: string }) => void;
}

export default function SymptomInputForm({
  initialSymptoms = '',
  initialNotes = '',
  licensePlate,
  onSubmit,
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
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Síntomas y Observaciones</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-base font-medium">Síntomas Reportados</p>
            <Textarea
              id="symptoms"
              placeholder="Describe los síntomas que presenta el vehículo..."
              className="min-h-[120px] resize-none"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>

          <div>
            <button
              type="button"
              className="flex items-center text-sm font-medium text-[#2A7DE1] hover:text-[#2468BE]"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? (
                <>
                  <ChevronUpIcon className="mr-1 h-4 w-4" />
                  Ocultar notas adicionales
                </>
              ) : (
                <>
                  <ChevronDownIcon className="mr-1 h-4 w-4" />
                  Añadir notas adicionales
                </>
              )}
            </button>

            {showNotes && (
              <div className="mt-4 space-y-2">
                <p className="text-base font-medium">Notas Adicionales</p>
                <Textarea
                  id="notes"
                  placeholder="Añade cualquier información adicional relevante..."
                  className="min-h-[100px] resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4">
        <Button type="submit">Continuar a Preguntas Guiadas</Button>
      </div>
    </form>
  );
}
