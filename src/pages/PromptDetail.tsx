import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Prompt } from '../types/prompt';
import { promptService } from '../service/prompt.service';
import Spinner from '../components/atoms/Spinner';
import { formatDate } from '../utils';

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Detalle del Prompt</h1>
        <button
          onClick={handleBack}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Volver
        </button>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">{prompt.phase}</h2>
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
                <button
                  onClick={handleUseVersion}
                  disabled={isChangingVersion}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:bg-green-300"
                >
                  {isChangingVersion ? <Spinner /> : 'Usar Versión'}
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSaving ? <Spinner /> : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>

        {/* Panel de histórico de versiones */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-medium text-gray-800">Histórico de Versiones</h3>
          <div className="max-h-[500px] overflow-y-auto">
            {prompt.versions.map((version, index) => {
              const isActive = version.isActive;
              const isSelected = index === selectedVersionIndex;

              return (
                <div
                  key={index}
                  onClick={() => handleVersionSelect(index)}
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
    </div>
  );
};
