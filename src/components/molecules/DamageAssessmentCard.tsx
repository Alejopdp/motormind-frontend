import { CarIcon, ImageIcon } from 'lucide-react';
import { DamageAssessment } from '@/types/DamageAssessment';
import { Link } from 'react-router-dom';

interface DamageAssessmentCardProps {
  assessment: DamageAssessment;
}

export const DamageAssessmentCard: React.FC<DamageAssessmentCardProps> = ({ assessment }) => {
  const { car, description, images, createdAt, _id } = assessment;
  return (
    <Link to={`/damage-assessments/${_id}`}>
      {' '}
      {/* Futuro detalle */}
      <div className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-4 transition-colors duration-200 hover:bg-[#EAF2FD]">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100">
              <CarIcon className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {car?.brand} {car?.model}
              </p>
              <p className="text-xs text-gray-500">{car?.plate || car?.vinCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <ImageIcon className="h-4 w-4" />
              {images.length}
            </div>
          </div>
        </div>
        <div className="mb-2 line-clamp-2 min-h-[1.5em] text-xs text-gray-700">
          {description || <span className="text-gray-400 italic">Sin descripción</span>}
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-400">
            Creado: {new Date(createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
};
