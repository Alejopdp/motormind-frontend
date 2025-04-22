import { CarIcon, MoreVerticalIcon, EyeIcon, CopyIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { Dropdown } from '@/components/atoms/Dropdown';
import { cn } from '@/utils/cn';

interface DiagnosticListItemProps {
  vehicle?: {
    _id: string;
    brand: string;
    model: string;
    plate: string;
    vinCode: string;
  };
  problems: string[];
  technician?: {
    name: string;
    avatar?: string;
  };
  // status: 'Pendiente' | 'En Progreso' | 'Completado';
  // priority?: 'Baja' | 'Media' | 'Alta';
  timestamp: string;
  className?: string;
  diagnosisLink: string;
}

export const DiagnosticListItem = ({
  vehicle,
  problems,
  technician,
  timestamp,
  className,
  diagnosisLink,
}: DiagnosticListItemProps) => {
  const navigate = useNavigate();

  const copyDiagnosis = (link: string) => {
    navigator.clipboard.writeText(link);
    enqueueSnackbar('Link copiado al portapapeles', { variant: 'success' });
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-300 bg-white p-4 transition-colors duration-200 hover:bg-[#EAF2FD]',
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 sm:h-10 sm:w-10">
            <CarIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium sm:text-base">
              {vehicle?.brand} {vehicle?.model}
            </p>
            <p className="text-xs text-gray-500 sm:text-sm">{vehicle?.plate || vehicle?.vinCode}</p>
          </div>
        </div>

        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <MoreVerticalIcon className="h-4 w-4" />
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item
              onClick={(e) => {
                e.stopPropagation();
                const path = diagnosisLink.split('/cars')[1];
                navigate(`/cars${path}`);
              }}
            >
              <EyeIcon className="text-primary mr-2 h-4 w-4" />
              <span className="text-sm">Ver detalle</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                e.stopPropagation();
                copyDiagnosis(diagnosisLink);
              }}
            >
              <CopyIcon className="text-primary mr-2 h-4 w-4" />
              <span className="text-sm">Copiar link del diagnóstico</span>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>

      <div className="mb-3">
        <p className="mb-1 text-xs text-gray-500 sm:text-sm">Problemas detectados:</p>
        <ul className="space-y-1">
          {problems.map((problem, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 text-xs sm:text-sm">•</span>
              <span className="text-xs sm:text-sm">{problem}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
            <AvatarImage alt={technician?.name || 'Unknown'} />
            <AvatarFallback>{technician?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium sm:text-sm">{technician?.name || 'NN'}</span>
        </div>
        <span className="text-xs text-gray-500">{timestamp}</span>
      </div>
    </div>
  );
};
