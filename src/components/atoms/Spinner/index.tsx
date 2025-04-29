import clsx from 'clsx';

type SpinnerProps = {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ className, style, label }) => {
  if (label) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className={clsx(
            'text-primary inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
            className,
          )}
          style={style}
          role="status"
        ></div>
        <span className="text-primary">{label}</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-current motion-reduce:animate-[spin_1.5s_linear_infinite]',
        className,
      )}
      style={style}
      role="status"
    ></div>
  );
};

export default Spinner;
