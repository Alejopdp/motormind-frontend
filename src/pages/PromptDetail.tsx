import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Prompt } from '../types/prompt';
import { promptService } from '../service/prompt.service';
import Spinner from '../components/atoms/Spinner';
import { formatDate } from '../utils';
import { Button } from '../components/atoms/Button';
import HeaderPage from '../components/molecules/HeaderPage/HeaderPage';
import { PromptVariables } from '../components/molecules/PromptVariables';
import { PromptWarningModal } from '../components/molecules/PromptWarningModal';
import { PromptVersionHistory } from '../components/molecules/PromptVersionHistory';
import { usePromptVariables } from '../hooks/usePromptVariables';

export const PromptDetail: React.FC = () => {
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
        const activeVersionIndex = data.versions.findIndex((v) => v.isActive);
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
    <div>
      <HeaderPage
        data={{
          title: 'Detalle del Prompt',
          description: prompt.phase,
        }}
        onBack={handleBack}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Actualizado: {formatDate(prompt.updatedAt)}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Panel principal con el editor */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-medium text-gray-800">Editor de Prompt</h3>
              <textarea
                value={activeContent}
                onChange={(e) => setActiveContent(e.target.value)}
                className="mb-4 h-64 w-full rounded-md border border-gray-300 p-3 font-mono text-sm"
                placeholder="Contenido del prompt..."
              />
              <div className="flex justify-end gap-2">
                {!isViewingActiveVersion && (
                  <Button
                    onClick={handleUseVersion}
                    disabled={isChangingVersion}
                    variant="outline"
                    className="min-w-[120px]"
                  >
                    {isChangingVersion ? <Spinner className="h-5 w-5" /> : 'Usar Versión'}
                  </Button>
                )}
                {hasContentChanged && (
                  <Button onClick={handleRevertChanges} variant="outline" className="min-w-[120px]">
                    Descartar cambios
                  </Button>
                )}
                <Button
                  onClick={handleSaveClick}
                  disabled={isSaving || !hasContentChanged}
                  className="min-w-[120px]"
                >
                  {isSaving ? <Spinner className="h-5 w-5" /> : 'Guardar Cambios'}
                </Button>
              </div>
            </div>

            {/* Variables Input */}
            <PromptVariables variables={inputVariables} className="mt-6" />
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
