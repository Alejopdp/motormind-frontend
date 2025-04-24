import { ThumbsDown } from 'lucide-react';
import BodyText from '@/components/atoms/BodyText';
import { ThumbsUp } from 'lucide-react';

type RateDiagnosisProps = {
  rateDiagnosis: (wasUseful: boolean) => void;
};

export const RateDiagnosis = ({ rateDiagnosis }: RateDiagnosisProps) => {
  return (
    <div className="sticky top-0 z-50 flex w-full items-center justify-center gap-4 bg-white py-3 shadow-md">
      <BodyText fontSize={18} fontWeight={'normal'}>
        ¿Este diagnóstico te ayudó a resolver el problema?
      </BodyText>
      <div className="flex gap-2">
        <button
          className="flex items-center gap-2 rounded border border-gray-300 px-3 py-1 text-black hover:bg-gray-100"
          onClick={() => rateDiagnosis(true)}
        >
          <ThumbsUp size={16} fill="black" />
          Sí
        </button>
        <button
          className="flex items-center gap-2 rounded border border-gray-300 px-3 py-1 text-black hover:bg-gray-100"
          onClick={() => rateDiagnosis(false)}
        >
          <ThumbsDown size={16} fill="black" />
          No
        </button>
      </div>
    </div>
  );
};
