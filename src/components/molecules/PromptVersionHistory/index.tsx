import { formatDate } from '@/utils';
import { PromptVersion } from '@/types/Prompt';
import { Badge } from '@/components/atoms/Badge';

interface PromptVersionHistoryProps {
  versions: PromptVersion[];
  selectedVersionIndex: number | null;
  activeVersionIndex: number;
  onVersionSelect: (index: number) => void;
}

export const PromptVersionHistory = ({
  versions,
  selectedVersionIndex,
  activeVersionIndex,
  onVersionSelect,
}: PromptVersionHistoryProps) => {
  const activeVersion = versions[activeVersionIndex];

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm sm:p-6">
      {/* Sección de versión activa */}
      {activeVersionIndex !== -1 && (
        <>
          <h3 className="text-md mb-2 font-medium sm:text-lg">Versión Activa</h3>
          <div className="mb-5">
            <div className="mb-4 rounded-md border border-blue-500 bg-blue-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Versión {activeVersionIndex + 1}</span>
                <Badge>Activa</Badge>
              </div>
              <p className="text-muted mb-2 text-xs">
                Creada: {formatDate(activeVersion.createdAt)}
              </p>
              <p className="line-clamp-3 text-sm whitespace-pre-wrap">{activeVersion.content}</p>
            </div>
          </div>
        </>
      )}

      {/* Separador */}
      <div className="mb-4 border-t border-gray-200"></div>

      {/* Histórico de versiones */}
      <h3 className="text-md mb-2 font-medium sm:text-lg">Histórico de Versiones</h3>
      <div className="max-h-[240px] space-y-4 overflow-y-auto">
        {[...versions].reverse().map((version, index) => {
          const realIndex = versions.length - 1 - index;
          const isActive = version.isActive;
          const isSelected = realIndex === selectedVersionIndex;

          return (
            <div
              key={realIndex}
              onClick={() => onVersionSelect(realIndex)}
              className={`cursor-pointer rounded-md border border-gray-200 p-3 transition-colors ${
                isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              } ${isSelected && !isActive ? 'border-green-500 bg-green-50' : ''}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Versión {versions.length - index}</span>
                {isActive && <Badge>Activa</Badge>}
                {isSelected && !isActive && <Badge variant="selected">Seleccionada</Badge>}
              </div>
              <p className="text-muted mb-2 text-xs">Creada: {formatDate(version.createdAt)}</p>
              <p className="line-clamp-3 text-sm whitespace-pre-wrap">{version.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
