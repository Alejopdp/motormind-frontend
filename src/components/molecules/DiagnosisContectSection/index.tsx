import { InfoIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/Dialog';

interface DiagnosticContextSectionProps {
  symptoms: string;
  notes?: string;
  answers?: Array<{
    question: string;
    answer: string;
  }>;
}

export const DiagnosticContextSection = ({
  symptoms,
  notes,
  answers = [],
}: DiagnosticContextSectionProps) => {
  // Create a summary of symptoms (first 60 characters)
  const symptomsSummary = symptoms.length > 60 ? `${symptoms.substring(0, 60)}...` : symptoms;

  return (
    <div className="rounded-md bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 rounded-md bg-blue-100 p-2">
            <InfoIcon className="text-primary h-5 w-5" />
          </div>
          <h2 className="text-lg font-medium">Contexto del Diagnóstico</h2>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link">Ver detalles</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contexto del Diagnóstico</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <h3 className="mb-2 text-base font-medium">Síntomas Reportados</h3>
                <p className="text-muted">{symptoms}</p>
              </div>

              {notes && (
                <div>
                  <h3 className="mb-2 text-base font-medium">Notas Adicionales</h3>
                  <p className="text-muted">{notes}</p>
                </div>
              )}

              {answers.length > 0 && (
                <div>
                  <h3 className="mb-2 text-base font-medium">Respuestas a Preguntas Guiadas</h3>
                  <div className="space-y-3">
                    {answers.map((item, index) => (
                      <div key={index} className="border-b pb-2 last:border-b-0">
                        <p className="font-medium text-gray-800">{item.question}</p>
                        <p className="text-muted">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-muted">
        Síntomas: {symptomsSummary}
        {symptoms.length > 60 && (
          <span className="text-gray-500"> Respuestas a preguntas detalladas disponibles.</span>
        )}
      </p>
    </div>
  );
};
