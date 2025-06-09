import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/atoms/Dialog';
import { Damage } from '@/types/DamageAssessment';

interface ConfirmDamagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmedDamageIds: string[]) => void;
  damages: Damage[];
  isLoading: boolean;
}

export const ConfirmDamagesModal = ({
  isOpen,
  onClose,
  onConfirm,
  damages,
  isLoading,
}: ConfirmDamagesModalProps) => {
  const [selectedDamageIds, setSelectedDamageIds] = useState<string[]>([]);

  const handleConfirm = () => {
    onConfirm(selectedDamageIds);
  };

  const handleCheckboxChange = (damageId: string) => {
    setSelectedDamageIds((prev) =>
      prev.includes(damageId) ? prev.filter((id) => id !== damageId) : [...prev, damageId],
    );
  };

  const isFormValid = selectedDamageIds.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmación de daños</DialogTitle>
          <DialogDescription>
            Por favor, selecciona los daños que deseas confirmar.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-2 max-h-[70dvh] space-y-3 overflow-y-auto p-1">
          {damages.map((damage) => (
            <label
              key={damage._id}
              className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-300 p-3 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                id={damage._id}
                checked={selectedDamageIds.includes(damage._id!)}
                onChange={() => handleCheckboxChange(damage._id!)}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium">{damage.description}</span>
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isFormValid || isLoading}
            className="flex items-center gap-2"
          >
            Confirmar daños
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
