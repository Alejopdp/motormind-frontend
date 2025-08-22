import React from 'react';
import { BackendOperation, DamageAction } from '../types';

interface RecommendedOperationCardProps {
  operation: BackendOperation;
  onUpdateOperation: (mappingId: string, newOperation: DamageAction, reason: string) => void;
}

const operationLabels: Record<DamageAction, string> = {
  REPAIR: 'Reparar',
  REPLACE: 'Reemplazar',
  PAINT: 'Pintar',
  POLISH: 'Pulir',
  REPAIR_AND_PAINT: 'Reparar y Pintar',
};

const operationColors: Record<DamageAction, string> = {
  REPAIR: 'bg-blue-100 text-blue-800',
  REPLACE: 'bg-red-100 text-red-800',
  PAINT: 'bg-purple-100 text-purple-800',
  POLISH: 'bg-green-100 text-green-800',
  REPAIR_AND_PAINT: 'bg-orange-100 text-orange-800',
};

const confidenceColors = (confidence: number): string => {
  if (confidence >= 0.8) return 'bg-green-100 text-green-800';
  if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const RecommendedOperationCard: React.FC<RecommendedOperationCardProps> = ({
  operation,
  onUpdateOperation,
}) => {
  // Validar que tenemos una operación efectiva válida
  if (!operation.effectiveOperation) {
    console.error('❌ RecommendedOperationCard: effectiveOperation es undefined', operation);
    return (
      <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
        <div className="text-red-600">
          <h3 className="mb-2 text-lg font-semibold">Error en operación</h3>
          <p className="text-sm">
            No se pudo cargar la información de la operación para: {operation.partName}
          </p>
        </div>
      </div>
    );
  }

  const currentOperation = operation.effectiveOperation.operation;
  const currentReason = operation.effectiveOperation.reason;

  const handleOperationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOperation = event.target.value as DamageAction;
    const reason = operation.hasUserOverride ? 'user_decision' : currentReason;
    onUpdateOperation(operation.mappingId, newOperation, reason);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold text-gray-900">{operation.partName}</h3>
          {operation.partCode && (
            <p className="mb-2 text-sm text-gray-500">Código: {operation.partCode}</p>
          )}
        </div>

        {/* Indicador de override de usuario */}
        {operation.hasUserOverride && (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Editado
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Operación actual */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Operación recomendada
          </label>
          <div className="flex items-center space-x-3">
            <select
              value={currentOperation}
              onChange={handleOperationChange}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {Object.entries(operationLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${operationColors[currentOperation]}`}
            >
              {operationLabels[currentOperation]}
            </span>
          </div>
        </div>

        {/* Información de confianza y fuente */}
        {operation.proposedOperation && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Confianza:</span>
              <span
                className={`ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${confidenceColors(operation.proposedOperation.main.confidence)}`}
              >
                {Math.round(operation.proposedOperation.main.confidence * 100)}%
              </span>
            </div>
            <div>
              <span className="text-gray-500">Fuente:</span>
              <span className="ml-2 text-gray-900 capitalize">
                {operation.proposedOperation.main.source.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}

        {/* Razón de la operación */}
        <div>
          <span className="text-sm text-gray-500">Razón:</span>
          <p className="mt-1 text-sm text-gray-900">{currentReason}</p>
        </div>

        {/* Sub-operaciones */}
        {operation.proposedOperation?.subOperations &&
          operation.proposedOperation.subOperations.length > 0 && (
            <div>
              <span className="text-sm text-gray-500">Sub-operaciones:</span>
              <ul className="mt-1 space-y-1">
                {operation.proposedOperation.subOperations.map((subOp, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-900">
                    <span className="mr-2 h-2 w-2 rounded-full bg-gray-400"></span>
                    {subOp.operation}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
};
