import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useApi } from '@/hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

interface CreateDiagnosticModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carId?: string;
  className?: string;
}

export const CreateDiagnosticModal = ({
  open,
  onOpenChange,
  carId,
  className,
}: CreateDiagnosticModalProps) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { execute: createDiagnosticRequest } = useApi<{ _id: string }>('post', '/diagnoses');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await createDiagnosticRequest(
        {
          carId,
          description,
        },
        undefined,
        undefined,
      );

      enqueueSnackbar('Diagnóstico creado exitosamente', {
        variant: 'success',
      });

      onOpenChange(false);
      navigate(`/cars/${carId}/diagnosis/${response.data._id}`);
    } catch {
      enqueueSnackbar('Error al crear el diagnóstico', {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6',
            className,
          )}
        >
          <Dialog.Title className="text-lg font-medium">Crear nuevo diagnóstico</Dialog.Title>

          <div className="mt-4">
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
              Descripción del problema
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el problema del vehículo..."
              className="w-full"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !description.trim()}>
              {isSubmitting ? 'Creando...' : 'Crear diagnóstico'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
