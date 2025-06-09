import { CarIcon, MoreVertical } from 'lucide-react';
import { DamageAssessment } from '@/types/DamageAssessment';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface DamageAssessmentCardProps {
  assessment: DamageAssessment;
}

const stateMap = {
  PENDING_REVIEW: 'Pendiente de Validación',
  DAMAGES_CONFIRMED: 'Daños Confirmados',
};

export const DamageAssessmentCard: React.FC<DamageAssessmentCardProps> = ({ assessment }) => {
  const { car, createdAt, _id, state, damages } = assessment;

  const damagesToShow =
    state === 'DAMAGES_CONFIRMED' ? damages.filter((d) => d.isConfirmed) : damages;

  return (
    <Link to={`/damage-assessments/${_id}`} className="block">
      <div className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-2xs transition-colors duration-200 hover:bg-blue-50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <CarIcon className="text-primary h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {car?.brand} {car?.model}
              </p>
              <p className="text-sm text-gray-500">{car?.plate || car?.vinCode} • Siniestro: -</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-md px-2 py-1 text-xs font-medium ${
                state === 'PENDING_REVIEW'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {stateMap[state]}
            </span>

            <button
              onClick={(e) => {
                e.preventDefault();
                console.log('Open menu');
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3 pl-1">
          <div className="text-sm">
            <span className="text-gray-500">Aseguradora:</span>{' '}
            <span className="text-gray-800">-</span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Daños detectados:</p>
            {damagesToShow.length > 0 ? (
              <ul className="mt-1 ml-5 list-disc space-y-1 text-sm text-gray-800">
                {damagesToShow.slice(0, 2).map((damage) => (
                  <li key={damage._id}>{damage.description}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 ml-5 text-sm text-gray-500">No se detectaron daños.</p>
            )}
            {damagesToShow.length > 2 && (
              <p className="mt-1 ml-5 text-xs text-blue-500">y {damagesToShow.length - 2} más...</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <img src="https://i.pravatar.cc/24" alt="Creator" className="h-6 w-6 rounded-full" />
            <span className="text-sm text-gray-700">Carlos Ruiz</span>
          </div>
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es })
              .charAt(0)
              .toUpperCase() +
              formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es }).slice(1)}
          </span>
        </div>
      </div>
    </Link>
  );
};
