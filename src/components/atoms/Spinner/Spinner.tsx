import clsx from 'clsx'
import BootstrapSpinner from 'react-bootstrap/Spinner'

type SpinnerProps = {
    className?: string
    style?: React.CSSProperties
}

const Spinner: React.FC<SpinnerProps> = ({ className, style }) => {
    return (
        <BootstrapSpinner
            className={clsx('mx-auto align-self-center', className)}
            style={{
                width: 20,
                height: 20,
                borderWidth: 2,
                ...style,
            }}
        />
    )
}

export default Spinner
