import React from 'react';
import { Prompt } from '../../types/prompt';
import { formatDate } from '../../utils';
import { useNavigate } from 'react-router-dom';

interface PromptCardProps {
  prompt: Prompt;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const activeVersion = prompt.versions.find((v) => v.isActive);
  const totalVersions = prompt.versions.length;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/prompts/${prompt.phase}`);
  };

  return (
    <div
      className="w-full cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{prompt.phase}</h3>
          <p className="text-sm text-gray-500">Actualizado: {formatDate(prompt.updatedAt)}</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {totalVersions} versiones
          </span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600">Versión activa: {activeVersion ? 'Sí' : 'No'}</p>
        {activeVersion && (
          <p className="mt-1 text-sm text-gray-500">
            Creada: {formatDate(activeVersion.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
};
