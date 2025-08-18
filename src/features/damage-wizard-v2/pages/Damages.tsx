import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Zap, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useWizardV2 } from '../hooks/useWizardV2';
import { PageShell } from '../components/PageShell';
import { WizardStepper } from '../components/WizardStepper';
import { DamageCard } from '../components/DamageCard';
import { ProgressCard } from '../components/ProgressCard';
import { adaptBackendDamagesResponse, BackendDamagesResponse } from '../adapters/damageAdapter';
import { mapFrontendIdsToBackendIds } from '../utils/damageMapping';
import { BackendDamage } from '../types/backend.types';

import damagesMock from '../mocks/damages.json';

const Damages = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { state, confirmDamages } = useWizardV2();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDamages, setSelectedDamages] = useState<string[]>([]);
  const [showOnlyConfident, setShowOnlyConfident] = useState(false);

  // Manejar estado de procesamiento
  useEffect(() => {
    console.log('🔄 Damages useEffect - Estado actual:', {
      detectedDamages: !!state.detectedDamages,
      damagesCount: state.detectedDamages?.detectedDamages?.length || 0,
      status: state.status,
      isProcessing,
    });

    // Si ya tenemos datos de daños, no mostrar spinner
    if (
      state.detectedDamages &&
      state.detectedDamages.detectedDamages &&
      state.detectedDamages.detectedDamages.length > 0
    ) {
      setIsProcessing(false);
      setProgress(100);
      return;
    }

    // Si el estado es 'processing', mostrar spinner
    if (state.status === 'processing') {
      setIsProcessing(true);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    }

    // Si no hay datos y no está procesando, mostrar spinner temporal
    if (!state.detectedDamages) {
      setIsProcessing(true);
      setProgress(0);
    }
  }, [state.detectedDamages, state.status, isProcessing]);

  const toggleDamage = (id: string) => {
    setSelectedDamages((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const confirmAll = () => {
    const allIds = damagesData.map((d) => d.id);
    setSelectedDamages(allIds);
  };

  const confirmSelected = async () => {
    try {
      // Si tenemos metadatos del backend, usar mapeo correcto
      if (adaptedDamagesWithMeta) {
        const backendIds = mapFrontendIdsToBackendIds(selectedDamages, adaptedDamagesWithMeta);
        console.log('🔄 IDs finales para enviar al backend:', backendIds);
        await confirmDamages(backendIds);
      } else {
        // Fallback para datos mock
        await confirmDamages(selectedDamages);
      }

      setParams({ step: 'operations' });
      navigate(`?step=operations`, { replace: true });
    } catch (error) {
      console.error('Error confirming damages:', error);
      // En caso de error, seguimos adelante para no bloquear el flujo
      console.warn('Fallback: navegando a operations después de error');
      setParams({ step: 'operations' });
      navigate(`?step=operations`, { replace: true });
    }
  };

  // Usar datos reales del backend si están disponibles, sino usar mock
  const { damagesData, adaptedDamagesWithMeta } = (() => {
    // Si tenemos datos del backend, adaptarlos
    if (
      state.detectedDamages &&
      state.detectedDamages.detectedDamages &&
      state.detectedDamages.detectedDamages.length > 0
    ) {
      // state.detectedDamages contiene la respuesta completa del backend
      const backendResponse = state.detectedDamages as BackendDamagesResponse;
      const adaptedDamagesRaw = adaptBackendDamagesResponse(backendResponse);

      // Aplicar estados de selección con tipado correcto
      const damagesData = adaptedDamagesRaw.map((damage) => ({
        id: damage.id,
        zone: damage.zone,
        subzone: damage.subzone,
        type: damage.type,
        severity: damage.severity,
        confidence: damage.confidence,
        imageUrl: damage.imageUrl,
        status: (selectedDamages.includes(damage.id) ? 'confirmed' : 'pending') as
          | 'confirmed'
          | 'pending',
      }));

      // Convertir a formato esperado por mapFrontendIdsToBackendIds
      const adaptedDamagesWithMeta = adaptedDamagesRaw.map((damage) => ({
        id: damage.id,
        __originalData: damage.__originalData as BackendDamage,
      }));

      return { damagesData, adaptedDamagesWithMeta };
    }

    // Fallback a datos mock
    const damagesData = damagesMock.damages.map((d) => ({
      id: d.id,
      zone: d.title,
      subzone: d.subtitle,
      type: 'Daño detectado',
      severity: d.severity as 'leve' | 'medio' | 'grave',
      confidence: d.confidencePct || 85,
      imageUrl: d.imageUrl,
      status: (selectedDamages.includes(d.id) ? 'confirmed' : 'pending') as 'confirmed' | 'pending',
    }));

    return { damagesData, adaptedDamagesWithMeta: null };
  })();

  const filteredDamages = showOnlyConfident
    ? damagesData.filter((d) => d.confidence && d.confidence > 85)
    : damagesData;

  // Si está procesando, mostrar ProgressCard como contenido del layout
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
      subtitle="Seleccioná los daños que se detectaron en las imágenes."
      content={
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDamages.map((damage) => (
            <DamageCard
              key={damage.id}
              damage={damage}
              onStatusChange={(id, status) => {
                if (status === 'confirmed') {
                  toggleDamage(id);
                } else {
                  // Remove from selected if rejected
                  setSelectedDamages((prev) => prev.filter((selectedId) => selectedId !== id));
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
            {selectedDamages.length} de {damagesData.length} confirmados
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
