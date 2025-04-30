import { formatDate } from '@/utils';
import { PromptVersion } from '@/types/prompt';

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
                Creada: {formatDate(activeVersion.createdAt)}
              </p>
              <p className="line-clamp-3 text-sm whitespace-pre-wrap text-gray-700">
                {activeVersion.content}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Separador */}
      <div className="mb-6 border-t border-gray-200"></div>

      {/* Histórico de versiones */}
      <h3 className="mb-4 text-lg font-medium text-gray-800">Histórico de Versiones</h3>
      <div className="max-h-[500px] space-y-4 overflow-y-auto">
        {[...versions].reverse().map((version, index) => {
          const realIndex = versions.length - 1 - index;
          const isActive = version.isActive;
          const isSelected = realIndex === selectedVersionIndex;

          return (
            <div
              key={realIndex}
              onClick={() => onVersionSelect(realIndex)}
              className={`cursor-pointer rounded-md border p-3 transition-colors ${
                isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              } ${isSelected && !isActive ? 'border-green-500 bg-green-50' : ''}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Versión {versions.length - index}
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
              <p className="mb-2 text-xs text-gray-500">Creada: {formatDate(version.createdAt)}</p>
              <p className="line-clamp-3 text-sm whitespace-pre-wrap text-gray-700">
                {version.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
