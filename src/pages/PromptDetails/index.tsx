import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Prompt, PromptVersion } from '@/types/prompt';
import { promptService } from '@/service/prompt.service';
import Spinner from '@/components/atoms/Spinner';
import { formatDate } from '@/utils';
import { Button } from '@/components/atoms/Button';
import HeaderPage from '@/components/molecules/HeaderPage';
import { PromptVariables } from '@/components/molecules/PromptVariables';
import { PromptWarningModal } from '@/components/molecules/PromptWarningModal';
import { PromptVersionHistory } from '@/components/molecules/PromptVersionHistory';
import { usePromptVariables } from '@/hooks/usePromptVariables';
import { Textarea } from '@/components/atoms/Textarea';

const PromptDetail: React.FC = () => {
  const { phase } = useParams<{ phase: string }>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number | null>(null);
  const [isChangingVersion, setIsChangingVersion] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [saveCountdown, setSaveCountdown] = useState(5);
  const [countdownActive, setCountdownActive] = useState(false);

  // Custom hook para manejar las variables
  const { inputVariables, hasVariablesChanged } = usePromptVariables(
    activeContent,
    originalContent,
  );

  // Detectar si hay cambios en el contenido
  const hasContentChanged = useMemo(() => {
    return originalContent !== activeContent;
  }, [originalContent, activeContent]);

  // Manejar el countdown del modal
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdownActive && saveCountdown > 0) {
      timer = setTimeout(() => {
        setSaveCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdownActive, saveCountdown]);

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!phase) return;

      try {
        const data = await promptService.getPromptByPhase(phase);
        setPrompt(data);
        const activeVersionIndex = data.versions.findIndex((v: PromptVersion) => v.isActive);
        if (activeVersionIndex !== -1) {
          const activeVersion = data.versions[activeVersionIndex];
          setActiveContent(activeVersion.content);
          setOriginalContent(activeVersion.content);
          setSelectedVersionIndex(activeVersionIndex);
        }
      } catch (err) {
        setError('Error al cargar el prompt');
        console.error('Error fetching prompt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [phase]);

  const handleSave = async () => {
    if (!phase || !activeContent) return;

    setIsSaving(true);
    try {
      await promptService.createPromptVersion(phase, activeContent);
      const updatedPrompt = await promptService.getPromptByPhase(phase);
      setPrompt(updatedPrompt);
      setSelectedVersionIndex(updatedPrompt.versions.length - 1);
      setOriginalContent(activeContent);
    } catch (err) {
      setError('Error al guardar el prompt');
      console.error('Error saving prompt:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVersionSelect = (index: number) => {
    if (!prompt) return;

    setSelectedVersionIndex(index);
    const version = prompt.versions[index];
    setActiveContent(version.content);
    setOriginalContent(version.content);
  };

  const handleUseVersion = async () => {
    if (!phase || selectedVersionIndex === null || !prompt) return;

    setIsChangingVersion(true);
    try {
      await promptService.changeActiveVersion(phase, selectedVersionIndex);
      const updatedPrompt = await promptService.getPromptByPhase(phase);
      setPrompt(updatedPrompt);
    } catch (err) {
      setError('Error al cambiar la versión activa');
      console.error('Error changing active version:', err);
    } finally {
      setIsChangingVersion(false);
    }
  };

  const handleBack = () => {
    navigate('/prompts');
  };

  const handleSaveClick = () => {
    if (hasVariablesChanged) {
      setShowWarningModal(true);
      setCountdownActive(true);
    } else {
      handleSave();
    }
  };

  const handleModalClose = () => {
    setShowWarningModal(false);
    setCountdownActive(false);
    setSaveCountdown(5);
  };

  const handleModalSave = async () => {
    handleModalClose();
    await handleSave();
  };

  const handleRevertChanges = () => {
    setActiveContent(originalContent);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="p-4 text-center text-red-600">
        {error || 'Prompt no encontrado'}
        <button onClick={handleBack} className="ml-4 text-blue-600 hover:text-blue-800">
          Volver
        </button>
      </div>
    );
  }

  const activeVersionIndex = prompt.versions.findIndex((v) => v.isActive);
  const isViewingActiveVersion = selectedVersionIndex === activeVersionIndex;

  return (
    <div className="bg-background flex h-screen flex-grow flex-col">
      <HeaderPage
        data={{
          title: 'Detalle del Prompt',
          description: prompt.phase,
        }}
        onBack={handleBack}
      />
      <div className="container mx-auto px-4 py-2 sm:px-8 sm:py-4">
        <div className="mb-4">
          <p className="text-muted text-xs sm:text-sm">
            Actualizado: {formatDate(prompt.updatedAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Panel principal con el editor */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm sm:p-6">
              <h3 className="text-md mb-4 font-medium sm:text-lg">Editor de Prompt</h3>
              <Textarea
                value={activeContent}
                onChange={(e) => setActiveContent(e.target.value)}
                placeholder="Contenido del prompt..."
                className="min-h-[250px]"
                disabled={isChangingVersion}
              />

              <div className="flex justify-end gap-2">
                {!isViewingActiveVersion && (
                  <Button
                    onClick={handleUseVersion}
                    disabled={isChangingVersion || isSaving}
                    variant="outline"
                    className="mt-4"
                  >
                    {isChangingVersion ? 'Cambiando...' : 'Usar Versión'}
                  </Button>
                )}
                {hasContentChanged && (
                  <Button onClick={handleRevertChanges} variant="outline" className="mt-4">
                    Descartar cambios
                  </Button>
                )}
                <Button
                  className="mt-4"
                  onClick={handleSaveClick}
                  disabled={isSaving || !hasContentChanged}
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </div>

            {/* Variables Input */}
            <PromptVariables variables={inputVariables} className="mt-4" />
          </div>

          {/* Panel de histórico de versiones */}
          <div className="lg:col-span-1">
            <PromptVersionHistory
              versions={prompt.versions}
              selectedVersionIndex={selectedVersionIndex}
              activeVersionIndex={activeVersionIndex}
              onVersionSelect={handleVersionSelect}
            />
          </div>
        </div>

        {/* Modal de advertencia */}
        <PromptWarningModal
          open={showWarningModal}
          onClose={handleModalClose}
          onConfirm={handleModalSave}
          countdown={saveCountdown}
        />
      </div>
    </div>
  );
};

export default PromptDetail;
