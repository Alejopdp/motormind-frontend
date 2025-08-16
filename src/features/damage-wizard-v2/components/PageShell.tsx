import { ReactNode } from 'react';

type PageShellProps = {
  header?: ReactNode;
  title?: string;
  subtitle?: string;
  content: ReactNode;
  footer?: ReactNode;
  /** Use smaller max-width for forms/single column layouts */
  narrow?: boolean;
};

export const PageShell = ({
  header,
  title,
  subtitle,
  content,
  footer,
  narrow = false,
}: PageShellProps) => {
  const maxWidth = narrow ? 'max-w-4xl' : 'max-w-7xl';
  
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header slot (WizardStepper) - will be rendered by parent */}
      {header}

      {/* Main content */}
      <div className={`${maxWidth} mx-auto p-4`}>
        {/* Title section */}
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content slot */}
        <div className="space-y-8">{content}</div>
      </div>

      {/* Footer slot (sticky toolbar) */}
      {footer && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
          <div className={`${maxWidth} mx-auto p-4`}>
            {footer}
          </div>
        </div>
      )}
    </div>
  );
};
