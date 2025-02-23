import { Button, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap'
import { useCar } from '../../../context/Car.context'
import { Diagnosis } from '../../../pages/Diagnosis/Diagnosis'
import { useNavigate } from 'react-router-dom'

const VehicleFaultsHistory = () => {
    const { diagnoses, isLoadingDiagnoses } = useCar()
    const navigate = useNavigate()

    const navigateToDiagnosis = (diagnosis: Diagnosis) => {
        const url = `/car/${diagnosis.carId}/diagnosis/${diagnosis._id}`

        navigate(url)
    }

    const formatToddmmyyyy = (date: Date) => {
        if (!date) return ''
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()

        return `${day}/${month}/${year}`
    }

    return (
        <div>
            <h3 className="mb-4">Historial de averías</h3>

            {isLoadingDiagnoses ? (
                <Spinner className="d-flex mx-auto" />
            ) : (
                <ListGroup>
                    {diagnoses.length === 0 && (
                        <p className="text-center mt-4">
                            No hay ninguna avería registrada
                        </p>
                    )}
                    {diagnoses
                        .sort((a, b) => {
                            return (
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime()
                            )
                        })
                        .map((diagnosis: Diagnosis) => (
                            <ListGroupItem
                                className="d-flex w-100 align-items-center"
                                key={diagnosis._id}
                            >
                                <div className="d-flex flex-column">
                                    <p className="fw-medium fs-6 mb-2">
                                        {diagnosis.fault}
                                    </p>
                                    <p
                                        className="mb-0"
                                        style={{ color: '#808080' }}
                                    >
                                        Fecha:{' '}
                                        {formatToddmmyyyy(
                                            new Date(diagnosis.createdAt)
                                        )}
                                    </p>
                                </div>
                                <Button
                                    className="d-flex"
                                    variant="link"
                                    style={{
                                        marginLeft: 'auto',
                                        textDecoration: 'none',
                                    }}
                                    onClick={() =>
                                        navigateToDiagnosis(diagnosis)
                                    }
                                >
                                    Ver detalles
                                </Button>
                            </ListGroupItem>
                        ))}
                </ListGroup>
            )}
        </div>
    )
}

export default VehicleFaultsHistory
