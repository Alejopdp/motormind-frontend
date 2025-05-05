import { CarIcon, Share2Icon } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { DIAGNOSIS_STATUS } from '@/constants';

interface DiagnosticListItemProps {
  vehicle?: {
    _id: string;
    brand: string;
    model: string;
    plate: string;
    vinCode: string;
  };
  problems: string[];
  questions: string[];
  technician?: {
    name: string;
    avatar?: string;
  };
  status: (typeof DIAGNOSIS_STATUS)[keyof typeof DIAGNOSIS_STATUS];
  timestamp: string;
  className?: string;
  diagnosisLink: string;
}

export const DiagnosticListItem = ({
  vehicle,
  problems,
  questions,
  technician,
  timestamp,
  className,
  diagnosisLink,
  status,
}: DiagnosticListItemProps) => {
  const copyDiagnosis = (link: string) => {
    navigator.clipboard.writeText(link);
    enqueueSnackbar('🔗 Link del diagnóstico copiado', { variant: 'success' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case DIAGNOSIS_STATUS.GUIDED_QUESTIONS:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case DIAGNOSIS_STATUS.PRELIMINARY:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case DIAGNOSIS_STATUS.IN_REPARATION:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case DIAGNOSIS_STATUS.REPAIRED:
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case DIAGNOSIS_STATUS.GUIDED_QUESTIONS:
        return 'Preguntas Guíadas';
      case DIAGNOSIS_STATUS.PRELIMINARY:
        return 'Pre-Diagnóstico';
      case DIAGNOSIS_STATUS.IN_REPARATION:
        return 'En Reparación';
      case DIAGNOSIS_STATUS.REPAIRED:
        return 'Reparado';
      default:
        return status;
    }
  };

  return (
    <Link to={`/cars${diagnosisLink.split('/cars')[1]}`}>
      <div
        className={cn(
          'mb-4 rounded-lg border border-gray-300 bg-white p-4 transition-colors duration-200 hover:bg-[#EAF2FD]',
          className,
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 sm:h-10 sm:w-10">
              <CarIcon className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium sm:text-base">
                {vehicle?.brand} {vehicle?.model}
              </p>
              <p className="text-xs text-gray-500 sm:text-sm">
                {vehicle?.plate || vehicle?.vinCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status && (
              <Badge
                variant="outline"
                className={`${getStatusColor(status)} truncate px-2 py-0.5 text-xs font-medium`}
              >
                {getStatusText(status)}
              </Badge>
            )}
            <Button
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                copyDiagnosis(diagnosisLink);
              }}
            >
              <Share2Icon className="text-primary h-4 w-4" />
            </Button>
          </div>
        </div>

        {status === DIAGNOSIS_STATUS.GUIDED_QUESTIONS ? (
          <div className="mb-3">
            <p className="mb-1 text-xs sm:text-sm">Preguntas guiadas:</p>
            <ul className="space-y-1">
              {questions.map((question, index) => (
                <li key={index} className="text-muted flex items-start">
                  <span className="mr-2 text-xs sm:text-sm">•</span>
                  <span className="text-xs sm:text-sm">{question}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mb-3">
            <p className="mb-1 text-xs sm:text-sm">Problemas detectados:</p>
            <ul className="space-y-1">
              {problems.map((problem, index) => (
                <li key={index} className="text-muted flex items-start">
                  <span className="mr-2 text-xs sm:text-sm">•</span>
                  <span className="text-xs sm:text-sm">{problem}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 sm:h-9 sm:w-9">
              <AvatarImage alt={technician?.name || 'Unknown'} />
              <AvatarFallback className="text-xs sm:text-base">
                {technician?.name ? getInitials(technician.name) : 'NN'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium sm:text-sm">
              {technician?.name || 'Sin asignar'}
            </span>
          </div>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
      </div>
    </Link>
  );
};
