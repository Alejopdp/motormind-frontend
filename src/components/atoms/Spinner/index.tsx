import clsx from 'clsx';

type SpinnerProps = {
  className?: string;
  style?: React.CSSProperties;
};

const Spinner: React.FC<SpinnerProps> = ({ className, style }) => {
  return (
    <div
      className={clsx(
        'inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        className,
      )}
      style={style}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]">
        Cargando...
      </span>
    </div>
  );
};

export default Spinner;
