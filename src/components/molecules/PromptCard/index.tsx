import React from 'react';
import { Link } from 'react-router-dom';

import { formatDate } from '@/utils';
import { Prompt, PromptType } from '@/types/prompt';
import { PromptVersion } from '@/types/prompt';
import { Badge } from '@/components/atoms/Badge';

interface PromptCardProps {
  prompt: Prompt;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const activeVersion = prompt.versions.find((v: PromptVersion) => v.isActive);
  const totalVersions = prompt.versions.length;

  const getTypeVariant = (type?: PromptType): 'tertiary' | 'secondary' | null => {
    if (type === PromptType.SYSTEM) return 'tertiary'; // Purple para system
    if (type === PromptType.USER) return 'secondary'; // Gray para user
    return null; // No mostrar badge si no hay tipo
  };

  const getTypeLabel = (type?: PromptType) => {
    if (type === PromptType.SYSTEM) return 'System';
    if (type === PromptType.USER) return 'User';
    return null;
  };

  return (
    <Link to={`/prompts/${prompt.phase}`}>
      <div className="mb-2 cursor-pointer rounded-lg border border-gray-300 bg-white p-2 transition-colors duration-200 hover:bg-[#EAF2FD] sm:mb-4 sm:p-4">
        <div className="flex flex-col items-start justify-between sm:flex-row">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="sm:text-md text-sm font-semibold">{prompt.phase}</h3>
              {prompt.type && getTypeVariant(prompt.type) && (
                <Badge variant={getTypeVariant(prompt.type)!} className="px-2 py-0.5 text-xs">
                  {getTypeLabel(prompt.type)}
                </Badge>
              )}
            </div>
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
