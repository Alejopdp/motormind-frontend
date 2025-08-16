import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Zap, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useWizardV2 } from '../hooks/useWizardV2';
import { PageShell } from '../components/PageShell';
import { WizardStepper } from '../components/WizardStepper';
import { DamageCard } from '../components/DamageCard';
import { ProgressCard } from '../components/ProgressCard';

import damagesMock from '../mocks/damages.json';

const Damages = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { state, confirmDamages } = useWizardV2();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDamages, setSelectedDamages] = useState<string[]>([]);
  const [showOnlyConfident, setShowOnlyConfident] = useState(false);



  // Simulate processing on mount
  useEffect(() => {
    if (!state.detectedDamages || state.detectedDamages.length === 0) {
      setIsProcessing(true);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            // Mock damages loading completed (handled by hook now)
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [state.detectedDamages]);

  const toggleDamage = (id: string) => {
    setSelectedDamages((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const confirmAll = () => {
    const allIds = damagesMock.damages.map((d) => d.id);
    setSelectedDamages(allIds);
  };

  const confirmSelected = async () => {
    try {
      await confirmDamages(selectedDamages);
      setParams({ step: 'operations' });
      navigate(`?step=operations`, { replace: true });
    } catch (error) {
      console.error('Error confirming damages:', error);
    }
  };

  const filteredDamages = showOnlyConfident
    ? damagesMock.damages.filter((d) => d.confidencePct && d.confidencePct > 85)
    : damagesMock.damages;

  if (isProcessing) {
    return (
      <PageShell
        header={<WizardStepper currentStep="damages" completedSteps={['intake']} />}
        content={
          <ProgressCard
            title="Detectando daños"
            description="Estamos procesando las imágenes... esto puede tardar unos minutos."
            progress={progress}
          />
        }
      />
    );
  }

  return (
    <PageShell
      header={<WizardStepper currentStep="damages" completedSteps={['intake']} />}
      title="Verificación de Daños"
      subtitle="SDCSDC"
      content={
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDamages.map((damage) => (
            <DamageCard
              key={damage.id}
              damage={{
                id: damage.id,
                zone: damage.title,
                subzone: damage.subtitle,
                type: 'Daño detectado',
                severity: damage.severity as 'leve' | 'medio' | 'grave',
                confidence: damage.confidencePct || 85,
                imageUrl: damage.imageUrl,
                status: selectedDamages.includes(damage.id) ? 'confirmed' : 'pending'
              }}
              onStatusChange={(id, status) => {
                if (status === 'confirmed') {
                  toggleDamage(id);
                } else {
                  // Remove from selected if rejected
                  setSelectedDamages(prev => prev.filter(selectedId => selectedId !== id));
                }
              }}
            />
          ))}
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-between" role="toolbar">
          {/* Left side - Counter */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="h-4 w-4 text-blue-500" />
            {selectedDamages.length} de {damagesMock.damages.length} confirmados
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Plus className="mr-1 h-4 w-4" />+ Añadir daño
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOnlyConfident(!showOnlyConfident)}
              className={showOnlyConfident ? 'border-blue-200 bg-blue-50' : ''}
            >
              <Zap className="mr-1 h-4 w-4" />
              Solo seguros &gt;85%
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={confirmAll}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-1 h-4 w-4" />
              Confirmar Todos
            </Button>
            <Button onClick={confirmSelected} disabled={selectedDamages.length === 0} size="sm">
              Continuar
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default Damages;
