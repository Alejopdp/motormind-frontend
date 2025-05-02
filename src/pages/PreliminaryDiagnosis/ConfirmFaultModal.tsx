import { useState } from 'react';
import { FileTextIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Diagnosis } from '@/types/Diagnosis';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/atoms/Dialog';
import { Input } from '@/components/atoms/Input';

interface ConfirmFaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedFault: string, reasonId?: string) => void;
  possibleReasons: Diagnosis['preliminary']['possibleReasons'];
}

export const ConfirmFaultModal = ({
  isOpen,
  onClose,
  onConfirm,
  possibleReasons,
}: ConfirmFaultModalProps) => {
  const [selectedFault, setSelectedFault] = useState<string>('');
  const [selectedReasonId, setSelectedReasonId] = useState<string>('');
  const [customFault, setCustomFault] = useState<string>('');
  const [isCustomFault, setIsCustomFault] = useState<boolean>(false);

  const handleConfirm = () => {
    onConfirm(isCustomFault ? customFault : selectedFault, selectedReasonId);
    setSelectedFault('');
    setSelectedReasonId('');
    setCustomFault('');
    setIsCustomFault(false);
  };

  const isFormValid = isCustomFault ? customFault.length >= 15 : selectedFault !== '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent closeButton={false}>
        <DialogHeader>
          <DialogTitle>Seleccionar Avería</DialogTitle>
          <DialogDescription>
            Por favor, selecciona la avería que deseas confirmar o ingresa una nueva.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-2 space-y-3">
          {possibleReasons.map((fault, index) => (
            <label
              key={index}
              className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-300 p-3 hover:bg-gray-50"
            >
              <input
                type="radio"
                name="fault"
                value={fault.title}
                checked={!isCustomFault && selectedFault === fault.title}
                onChange={(e) => {
                  setSelectedFault(e.target.value);
                  setSelectedReasonId(fault._id);
                  setIsCustomFault(false);
                }}
                className="text-primary h-4 w-4 cursor-pointer"
              />
              <span className="text-sm font-medium">{fault.title}</span>
            </label>
          ))}
          <label className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-300 p-3 hover:bg-gray-50">
            <input
              type="radio"
              name="fault"
              checked={isCustomFault}
              onChange={() => {
                setIsCustomFault(true);
                setSelectedFault('');
                setSelectedReasonId('');
              }}
              className="text-primary h-4 w-4 cursor-pointer"
            />
            <span className="text-sm font-medium">Otra avería</span>
          </label>
          {isCustomFault && (
            <div className="mt-2">
              <Input
                placeholder="Describe la avería"
                value={customFault}
                onChange={(e) => setCustomFault(e.target.value)}
                className="w-full"
              />
              <p className="p-1 text-xs text-gray-400">Mínimo 15 caracteres</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isFormValid}
            className="flex items-center gap-2"
          >
            <FileTextIcon className="h-4 w-4" />
            Confirmar y Generar Informe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
