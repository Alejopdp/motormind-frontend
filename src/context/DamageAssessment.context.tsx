import { createContext, useContext, useState, ReactNode } from 'react';

interface DamageAssessmentData {
  images: File[];
  details: string;
}

interface DamageAssessmentContextType {
  data: DamageAssessmentData;
  setImages: (images: File[]) => void;
  setDetails: (details: string) => void;
  reset: () => void;
}

const DamageAssessmentContext = createContext<DamageAssessmentContextType | undefined>(undefined);

export const DamageAssessmentProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DamageAssessmentData>({ images: [], details: '' });

  const setImages = (images: File[]) => setData((d) => ({ ...d, images }));
  const setDetails = (details: string) => setData((d) => ({ ...d, details }));
  const reset = () => setData({ images: [], details: '' });

  return (
    <DamageAssessmentContext.Provider value={{ data, setImages, setDetails, reset }}>
      {children}
    </DamageAssessmentContext.Provider>
  );
};

export const useDamageAssessment = () => {
  const ctx = useContext(DamageAssessmentContext);
  if (!ctx) throw new Error('useDamageAssessment debe usarse dentro de DamageAssessmentProvider');
  return ctx;
};
