import { ReactNode } from 'react';

interface DetailsContainerProps {
  children: ReactNode;
}

const DetailsContainer = ({ children }: DetailsContainerProps) => (
  <div className="mx-auto max-w-4xl space-y-4 px-4 py-3 sm:space-y-6 sm:px-6 sm:py-6">
    {children}
  </div>
);

export default DetailsContainer;
