import { AlertTriangleIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/atoms/Dialog';

interface PromptWarningModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  countdown: number;
}

export const PromptWarningModal = ({
  open,
  onClose,
  onConfirm,
  countdown,
}: PromptWarningModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangleIcon className="h-5 w-5" />
            Variables input modificadas
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600">
            Has agregado o quitado variables input. Antes de continuar, asegúrate que la variable
            esté mapeada en el código, de lo contrario, el sistema podría fallar.
          </p>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={countdown > 0}>
            {countdown > 0 ? `Guardar cambios (${countdown}s)` : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
