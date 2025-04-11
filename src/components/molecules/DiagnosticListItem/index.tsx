import { CarIcon, MoreVerticalIcon, EyeIcon, CopyIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { Dropdown } from '@/components/atoms/Dropdown';
import { cn } from '@/utils/cn';

interface DiagnosticListItemProps {
  id: string;
  carId: string;
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
  diagnosis: string;
}

export const DiagnosticListItem = ({
  id,
  carId,
  vehicle,
  problems,
  technician,
  timestamp,
  className,
  diagnosis,
}: DiagnosticListItemProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/car/${carId}/diagnosis/${id}`);
  };

  const copyDiagnosis = (diagnoses: string) => {
    navigator.clipboard.writeText(diagnoses ?? '');
    enqueueSnackbar('Diagnóstico copiado al portapapeles', {
      variant: 'success',
    });
  };

  return (
    <div
      className={cn(
        'cursor-default rounded-lg border border-gray-300 bg-white p-4 transition-colors duration-200 hover:bg-[#EAF2FD]',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <CarIcon className="text-primary h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">
              {vehicle?.brand} {vehicle?.model}
            </h3>
            <p className="text-sm text-gray-500">{vehicle?.plate || vehicle?.vinCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <Badge className={cn('font-normal', getStatusStyles())}>{status}</Badge>
          {priority && (
            <Badge variant="outline" className={cn('font-normal', getPriorityStyles())}>
              {priority}
            </Badge>
          )} */}
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <MoreVerticalIcon className="h-4 w-4" />
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
              >
                <EyeIcon className="text-primary mr-2 h-4 w-4" />
                Ver detalle
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(e) => {
                  e.stopPropagation();
                  copyDiagnosis(diagnosis);
                }}
              >
                <CopyIcon className="text-primary mr-2 h-4 w-4" />
                Copiar diagnóstico
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-1 text-sm text-gray-500">Problemas detectados:</p>
        <ul className="space-y-1 text-sm">
          {problems.map((problem, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              {problem}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between">
        {technician ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={technician.avatar} alt={technician.name} />
              <AvatarFallback>{technician.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{technician.name}</span>
          </div>
        ) : (
          <div />
        )}
        <span className="text-xs text-gray-500">{timestamp}</span>
      </div>
    </div>
  );
};
