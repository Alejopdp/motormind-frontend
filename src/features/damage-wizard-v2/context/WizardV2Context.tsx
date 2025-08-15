import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type WizardV2Status =
  | 'processing'
  | 'detected'
  | 'damages_confirmed'
  | 'operations_defined'
  | 'valuated'
  | 'completed'
  | 'error';

export type WizardV2State = {
  assessmentId?: string;
  status: WizardV2Status;
  plate?: string;
  claimDescription?: string;
  images: string[];
  detectedDamages?: Array<{
    id: string;
    area: string;
    subarea?: string;
    type: 'scratch' | 'dent' | 'crack' | string;
    severity: 'SEV1' | 'SEV2' | 'SEV3' | string;
    notes?: string;
  }>;
  confirmedDamageIds?: string[];
  operations?: Array<{
    mappingId: string;
    partName: string;
    mainOperation?: {
      operation: 'REPAIR' | 'REPLACE' | 'PAINT' | 'POLISH' | string;
      description?: string;
      code?: string;
      complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
    };
    subOperations?: Array<{
      operation: string;
      description?: string;
      code?: string;
      complexity?: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
    }>;
    paint?: {
      apply?: boolean;
      paintType?: 'MONOCOAT' | 'BICOAT' | 'TRICOAT';
      finishType?: 'NEW_PART' | 'REPAIRED_PART';
    };
  }>;
  valuation?: {
    labor: Array<{
      mappingId: string;
      partName: string;
      operation: string;
      hours: number;
      rate: number;
      total: number;
      source: 'autodata' | 'segment_lookup' | 'calc' | 'user_override' | 'no_data';
    }>;
    paint: Array<{
      mappingId: string;
      partName: string;
      job: string;
      paintHours: number;
      paintLaborTotal: number;
      units?: number;
      unitPrice?: number;
      materialsTotal: number;
      total: number;
    }>;
    parts?: Array<{ ref: string; partName: string; unitPrice: number; qty: number; total: number }>;
    totals: {
      labor: number;
      paintLabor: number;
      paintMaterials: number;
      parts: number;
      grandTotal: number;
      currency: string;
    };
  };
  flags?: { usedMockTchek?: boolean; hasNoDataLabor?: boolean };
};

type WizardV2ContextType = {
  state: WizardV2State;
  setState: (updater: (prev: WizardV2State) => WizardV2State) => void;
  reset: () => void;
};

const WizardV2Context = createContext<WizardV2ContextType | undefined>(undefined);

const initialState: WizardV2State = {
  status: 'processing',
  images: [],
};

export const WizardV2Provider = ({ children }: { children: React.ReactNode }) => {
  const [state, internalSetState] = useState<WizardV2State>(initialState);

  const setState = useCallback((updater: (prev: WizardV2State) => WizardV2State) => {
    internalSetState((prev) => updater(prev));
  }, []);

  const reset = useCallback(() => internalSetState(initialState), []);

  const value = useMemo(() => ({ state, setState, reset }), [state, setState, reset]);

  return <WizardV2Context.Provider value={value}>{children}</WizardV2Context.Provider>;
};

export const useWizardV2 = () => {
  const ctx = useContext(WizardV2Context);
  if (!ctx) throw new Error('useWizardV2 must be used within WizardV2Provider');
  return ctx;
};


