import { Link } from 'react-router-dom';
import { Diagnosis } from '@/types/Diagnosis';
import { useSymptom } from '@/hooks/useSymptom';
import { diagnosisLink, formatToddmmyyyy } from '@/utils';

interface FaultsHistoryItemProps {
  diagnosis: Diagnosis;
  index: number;
}

export const FaultsHistoryItem = ({ diagnosis, index }: FaultsHistoryItemProps) => {
  const { symptom } = useSymptom(diagnosis);

  return (
    <Link to={diagnosisLink(diagnosis)}>
      <div
        key={diagnosis._id}
        className={`border-b last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition-colors duration-200 hover:bg-[#EAF2FD]`}
      >
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <p className="text-muted text-xs sm:text-sm">
              Fecha:{' '}
              {diagnosis.createdAt ? formatToddmmyyyy(new Date(diagnosis.createdAt)) || '-' : '-'}
            </p>
          </div>
          <p className="text-sm font-medium sm:text-base">{symptom}</p>
        </div>
      </div>
    </Link>
  );
};
