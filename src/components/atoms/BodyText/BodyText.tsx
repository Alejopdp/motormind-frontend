type BodyTextProps = {
    children: React.ReactNode
    className?: string
    fontWeight?: 'regular' | 'medium' | 'bold'
    fontSize?: number
}

const BodyText = ({
    children,
    className,
    fontWeight = 'regular',
    fontSize = 14,
}: BodyTextProps) => {
    return (
        <p
            className={className}
            style={{ color: '#4B5563', fontSize, fontWeight }}
        >
            {children}
        </p>
    )
}

export default BodyText
