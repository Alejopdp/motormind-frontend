import { Button } from '@/components/atoms/Button';
import { CircleCheckBig } from 'lucide-react';

interface DamageAssessmentBottomBarProps {
  onConfirm: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const DamageAssessmentBottomBar = ({
  onConfirm,
  isLoading,
  isDisabled,
}: DamageAssessmentBottomBarProps) => {
  return (
    <div className="fixed right-0 bottom-0 left-0 flex flex-col-reverse gap-4 border-t border-gray-200 bg-white p-4 sm:flex-row sm:justify-end sm:gap-3">
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
        <Button
          onClick={onConfirm}
          disabled={isLoading || isDisabled}
          className="w-full sm:w-auto"
          size="lg"
        >
          <CircleCheckBig className="h-4 w-4 sm:mr-2" />
          <span className="sm:hidden">{isLoading ? 'Cargando...' : 'Confirmar Daños'}</span>
          <span className="hidden sm:inline">{isLoading ? 'Cargando...' : 'Confirmar Daños'}</span>
        </Button>
      </div>
    </div>
  );
};
