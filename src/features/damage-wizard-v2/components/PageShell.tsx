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
    <div className="bg-background min-h-screen pb-32">
      {/* Header slot (WizardStepper) - will be rendered by parent */}
      {header}

      {/* Main content */}
      <div className={`${maxWidth} mx-auto p-4`}>
        {/* Title section */}
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h1 className="text-foreground mb-2 text-3xl font-bold">{title}</h1>}
            {subtitle && <p className="text-muted">{subtitle}</p>}
          </div>
        )}

        {/* Content slot */}
        <div className="space-y-8">{content}</div>
      </div>

      {/* Footer slot (sticky toolbar) */}
      {footer && (
        <div className="bg-card border-border fixed right-0 bottom-0 left-0 z-50 border-t shadow-lg">
          <div className={`${maxWidth} mx-auto p-4`}>{footer}</div>
        </div>
      )}
    </div>
  );
};
