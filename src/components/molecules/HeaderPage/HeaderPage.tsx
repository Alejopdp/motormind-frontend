import { useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button';
import { ArrowLeftIcon } from 'lucide-react';

interface HeaderPageProps {
  data: {
    title: string;
    description: string;
  };
  onBack?: () => void;
  label?: string;
  headerActions?: React.ReactNode;
}

export default function HeaderPage({ data, onBack, label = '', headerActions }: HeaderPageProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/');
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2 pl-0">
          <ArrowLeftIcon className="text-muted !h-5 !w-5" />
          {label && label}
        </Button>

        <div>
          <h1 className="text-xl font-semibold">{data.title}</h1>
          <p className="text-sm text-gray-500">{data.description}</p>
        </div>
      </div>
      {/* Header actions */}
      <div>{headerActions}</div>
    </div>
  );
}
