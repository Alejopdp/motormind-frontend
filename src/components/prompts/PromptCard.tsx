import React from 'react';
import { Link } from 'react-router-dom';

import { formatDate } from '@/utils';
import { Prompt } from '@/types/prompt';
import { Badge } from '@/components/atoms/Badge';

interface PromptCardProps {
  prompt: Prompt;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const activeVersion = prompt.versions.find((v) => v.isActive);
  const totalVersions = prompt.versions.length;

  return (
    <Link to={`/prompts/${prompt.phase}`}>
      <div className="mb-2 cursor-pointer rounded-lg border border-gray-300 bg-white p-2 transition-colors duration-200 hover:bg-[#EAF2FD] sm:mb-4 sm:p-4">
        <div className="flex flex-col items-start justify-between sm:flex-row">
          <div>
            <h3 className="sm:text-md text-sm font-semibold">{prompt.phase}</h3>
            <p className="text-muted text-xs sm:text-sm">
              Actualizado: {formatDate(prompt.updatedAt)}
            </p>
          </div>
          <div className="text-right">
            <Badge className="px-3 py-1 shadow-sm" variant="outline">
              {totalVersions} versiones
            </Badge>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium sm:text-sm">
            Versión activa: {activeVersion ? 'Sí' : 'No'}
          </p>
          {activeVersion && (
            <p className="text-muted mt-1 text-xs sm:text-sm">
              Creada: {formatDate(activeVersion.createdAt)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
