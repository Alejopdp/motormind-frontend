import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/Dialog';
import { Button } from '@/components/atoms/Button';

interface DeleteDiagnosisModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  diagnosisInfo?: {
    carBrand?: string;
    carModel?: string;
    carPlate?: string;
    fault?: string;
  };
}

export const DeleteDiagnosisModal = ({
  open,
  onClose,
  onConfirm,
  diagnosisInfo,
}: DeleteDiagnosisModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // No cerramos el modal aquí - el componente padre lo cerrará después del refresco
    } catch (error) {
      console.error('Error deleting diagnosis:', error);
      enqueueSnackbar('Error al eliminar el diagnóstico', { variant: 'error' });
      setIsDeleting(false); // Solo reseteamos el loading si hay error
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Eliminar diagnóstico
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-4 text-gray-700">
            ¿Estás seguro que deseas eliminar este diagnóstico? No podrás recuperar los datos.
          </p>

          {diagnosisInfo && (
            <div className="mb-4 rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-900">
                {diagnosisInfo.carBrand} {diagnosisInfo.carModel}
              </p>
              {diagnosisInfo.carPlate && (
                <p className="text-sm text-gray-600">{diagnosisInfo.carPlate}</p>
              )}
              {diagnosisInfo.fault && (
                <p className="mt-1 text-sm text-gray-600">
                  <span className="font-medium">Problema:</span> {diagnosisInfo.fault}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="min-w-[80px]"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="min-w-[80px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
