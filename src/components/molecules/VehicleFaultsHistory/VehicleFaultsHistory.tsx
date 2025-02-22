import { Button, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap'
import { useCar } from '../../../context/Car.context'
import { Diagnosis } from '../../../pages/Diagnosis/Diagnosis'

const VehicleFaultsHistory = () => {
    const { diagnoses, isLoadingDiagnoses } = useCar()
    console.log({ diagnoses })

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
                    {diagnoses.map((diagnosis: Diagnosis) => (
                        <ListGroupItem
                            className="w-100 align-items-center"
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
                                    Fecha: {diagnosis.createdAt.toString()}
                                </p>
                            </div>
                            <Button
                                className="d-flex"
                                variant="link"
                                style={{
                                    marginLeft: 'auto',
                                    textDecoration: 'none',
                                }}
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
