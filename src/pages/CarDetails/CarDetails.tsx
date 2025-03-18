import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate, useParams } from 'react-router-dom'
import VehicleInformation from '../../components/molecules/VehicleInformation/VehicleInformation'
import { useCar } from '../../context/Car.context'
import VehicleFaultsHistory from '../../components/molecules/VehicleFaultsHistory/VehicleFaultsHistory'
import { Spinner } from 'react-bootstrap'

const CarDetails = () => {
    const { car, isLoadingCar } = useCar()
    const params = useParams()
    const navigate = useNavigate()

    const redirectToCreateDiagnostic = () => {
        navigate(`/car/${params.carId}/create?step=1`)
    }
    if (!car || isLoadingCar)
        return <Spinner className="d-flex position-absolute top-50 start-50" />

    return (
        <>
            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between">
                        <Card.Title as="h3" className="mb-2">
                            {car.vinCode}
                        </Card.Title>
                        <Button onClick={redirectToCreateDiagnostic}>
                            + Crear nuevo diagnóstico
                        </Button>
                    </div>
                    <VehicleInformation car={car} />
                </Card.Body>
            </Card>

            <VehicleFaultsHistory />
        </>
    )
}

export default CarDetails
