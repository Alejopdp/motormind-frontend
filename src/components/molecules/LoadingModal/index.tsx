import { Dialog, DialogContent } from '@/components/atoms/Dialog';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
  subtitle?: string;
}

export const LoadingModal = ({
  isOpen,
  message = 'Cargando...',
  subtitle = 'Por favor espere mientras procesamos su solicitud',
}: LoadingModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" closeButton={false}>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-8 w-40">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative animate-bounce">
                <img
                  src="/logo_motormind.png"
                  alt="MotorMind"
                  className="h-full w-full animate-pulse rounded-md object-contain"
                />
              </div>
            </div>
          </div>
          <p className="text-primary animate-pulse text-lg font-medium">{message}</p>
          <p className="text-muted text-md m-0 p-0 text-center">{subtitle}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
