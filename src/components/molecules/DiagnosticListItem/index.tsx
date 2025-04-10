import { CarIcon, MoreVerticalIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

interface DiagnosticListItemProps {
  vehicle: {
    make: string;
    model: string;
    plate: string;
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
  onClick?: () => void;
}

export const DiagnosticListItem = ({
  vehicle,
  problems,
  technician,
  timestamp,
  className,
  onClick,
}: DiagnosticListItemProps) => {
  return (
    <div
      className={cn(
        'cursor-pointer rounded-lg border border-gray-300 bg-white p-4 transition-colors duration-200 hover:bg-[#EAF2FD]',
        className,
      )}
      onClick={onClick}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <CarIcon className="text-primary h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-500">{vehicle.plate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <Badge className={cn('font-normal', getStatusStyles())}>{status}</Badge>
          {priority && (
            <Badge variant="outline" className={cn('font-normal', getPriorityStyles())}>
              {priority}
            </Badge>
          )} */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            // onClick={(e) => {
            //   e.stopPropagation();
            // }}
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
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
