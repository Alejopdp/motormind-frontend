type BodyTextProps = {
  children: React.ReactNode;
  className?: string;
  fontWeight?: 'normal' | 'medium' | 'bold';
  fontSize?: number;
  fontStyle?: 'normal' | 'italic';
};

const BodyText = ({
  children,
  className,
  fontWeight = 'normal',
  fontSize = 14,
  fontStyle = 'normal',
}: BodyTextProps) => {
  return (
    <p
      style={{
        color: '#4B5563',
        fontSize,
        fontWeight,
        marginBottom: 0,
        fontStyle,
      }}
      className={className}
    >
      {children}
    </p>
  );
};

export default BodyText;
