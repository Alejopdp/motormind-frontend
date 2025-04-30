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
        <div className="flex flex-col items-center justify-center py-10">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-20 w-20 animate-bounce">
                <img
                  src="/logo.png"
                  alt="MotorMind"
                  className="h-full w-full animate-pulse rounded-md object-contain"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 mb-1 flex items-center gap-1.5">
            <span className="bg-primary/90 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.2s]"></span>
            <span className="bg-primary/90 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]"></span>
            <span className="bg-primary/90 h-1.5 w-1.5 animate-bounce rounded-full"></span>
          </div>
          <p className="text-primary animate-pulse text-lg font-medium">{message}</p>
          <p className="text-muted text-md m-0 p-0">{subtitle}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
