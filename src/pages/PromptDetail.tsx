import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Prompt } from '../types/prompt';
import { promptService } from '../service/prompt.service';
import Spinner from '../components/atoms/Spinner';
import { formatDate } from '../utils';
import { Button } from '../components/atoms/Button';
import HeaderPage from '../components/molecules/HeaderPage/HeaderPage';
import { cn } from '../utils/cn';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/atoms/Dialog';
import { AlertTriangleIcon } from 'lucide-react';

export const PromptDetail: React.FC = () => {
  const { phase } = useParams<{ phase: string }>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number | null>(null);
  const [isChangingVersion, setIsChangingVersion] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [saveCountdown, setSaveCountdown] = useState(5);
  const [countdownActive, setCountdownActive] = useState(false);
  const [originalContent, setOriginalContent] = useState<string>('');

  // Extraer variables input del contenido activo
  const inputVariables = useMemo(() => {
    const matches = activeContent.match(/{[^}]+}/g) || [];
    return [...new Set(matches)].map((match) => match.slice(1, -1));
  }, [activeContent]);

  // Extraer variables input de la versión activa
  const activeVersionVariables = useMemo(() => {
    if (!prompt?.versions[selectedVersionIndex ?? -1]?.content) return [];
    const matches = prompt.versions[selectedVersionIndex ?? -1].content.match(/{[^}]+}/g) || [];
    return [...new Set(matches)].map((match: string) => match.slice(1, -1));
  }, [prompt, selectedVersionIndex]);

  // Detectar cambios en variables input
  const hasInputVariablesChanged = useMemo(() => {
    const currentVars = new Set(inputVariables);
    const previousVars = new Set(activeVersionVariables);

    if (currentVars.size !== previousVars.size) return true;
    return [...currentVars].some((v) => !previousVars.has(v));
  }, [inputVariables, activeVersionVariables]);

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
      // Asegurarse de que los saltos de línea se guarden correctamente
      const contentToSave = activeContent;
      await promptService.createPromptVersion(phase, contentToSave);
      // Recargar el prompt para actualizar la lista de versiones
      const updatedPrompt = await promptService.getPromptByPhase(phase);
      setPrompt(updatedPrompt);

      // Actualizar el índice seleccionado a la nueva versión (la última)
      setSelectedVersionIndex(updatedPrompt.versions.length - 1);
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
      // Recargar el prompt para actualizar la lista de versiones
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
    if (hasInputVariablesChanged) {
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
          {/* Panel principal con el prompt activo */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-medium text-gray-800">
                {isViewingActiveVersion ? 'Prompt Activo' : 'Visualizando Versión'}
              </h3>
              <textarea
                value={activeContent}
                onChange={(e) => setActiveContent(e.target.value)}
                className="mb-4 h-64 w-full rounded-md border border-gray-300 p-3 font-mono text-sm whitespace-pre-wrap"
                placeholder="Contenido del prompt..."
              />
              <div className="flex justify-end gap-2">
                {!isViewingActiveVersion && (
                  <Button
                    onClick={handleUseVersion}
                    disabled={isChangingVersion}
                    variant="secondary"
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
            {inputVariables.length > 0 && (
              <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-4 text-lg font-medium text-gray-800">Variables Input</h3>
                <div className="flex flex-wrap gap-2">
                  {inputVariables.map((variable, index) => (
                    <div
                      key={index}
                      className={cn(
                        'rounded-md border px-3 py-1.5',
                        'border-blue-200 bg-blue-50',
                        'font-mono text-sm text-blue-700',
                      )}
                    >
                      {variable}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel de histórico de versiones */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            {/* Sección de versión activa */}
            {activeVersionIndex !== -1 && (
              <>
                <h3 className="mb-4 text-lg font-medium text-gray-800">Versión Activa</h3>
                <div className="mb-6">
                  <div className="mb-4 rounded-md border border-blue-500 bg-blue-50 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Versión {activeVersionIndex + 1}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Activa
                      </span>
                    </div>
                    <p className="mb-2 text-xs text-gray-500">
                      Creada: {formatDate(prompt.versions[activeVersionIndex].createdAt)}
                    </p>
                    <div className="max-h-[150px] overflow-y-auto">
                      <p className="text-sm whitespace-pre-wrap text-gray-700">
                        {prompt.versions[activeVersionIndex].content}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Separador */}
            <div className="mb-6 border-t border-gray-200"></div>

            {/* Histórico de versiones */}
            <h3 className="mb-4 text-lg font-medium text-gray-800">Histórico de Versiones</h3>
            <div className="max-h-[500px] overflow-y-auto">
              {[...prompt.versions].reverse().map((version, index) => {
                const isActive = version.isActive;
                const isSelected = prompt.versions.length - 1 - index === selectedVersionIndex;

                return (
                  <div
                    key={prompt.versions.length - 1 - index}
                    onClick={() => handleVersionSelect(prompt.versions.length - 1 - index)}
                    className={`mb-4 cursor-pointer rounded-md border p-3 transition-colors ${
                      isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } ${isSelected && !isActive ? 'border-green-500 bg-green-50' : ''}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Versión {prompt.versions.length - index}
                      </span>
                      {isActive && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          Activa
                        </span>
                      )}
                      {isSelected && !isActive && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Seleccionada
                        </span>
                      )}
                    </div>
                    <p className="mb-2 text-xs text-gray-500">
                      Creada: {formatDate(version.createdAt)}
                    </p>
                    <p className="line-clamp-3 text-sm whitespace-pre-wrap text-gray-700">
                      {version.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal de advertencia */}
        <Dialog open={showWarningModal} onOpenChange={handleModalClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-amber-600">
                <AlertTriangleIcon className="h-5 w-5" />
                Variables input modificadas
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">
                Has agregado o quitado variables input. Antes de continuar, asegúrate que la
                variable esté mapeada en el código, de lo contrario, el sistema podría fallar.
              </p>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleModalClose}>
                Cancelar
              </Button>
              <Button onClick={handleModalSave} disabled={saveCountdown > 0}>
                {saveCountdown > 0 ? `Guardar cambios (${saveCountdown}s)` : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
