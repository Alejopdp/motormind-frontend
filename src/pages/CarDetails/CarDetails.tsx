import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate, useParams } from 'react-router-dom'
import VehicleInformation from '../../components/molecules/VehicleInformation/VehicleInformation'
import { useCar } from '../../context/Car.context'
import VehicleFaultsHistory from '../../components/molecules/VehicleFaultsHistory/VehicleFaultsHistory'

const CarDetails = () => {
    const { car, isLoadingCar } = useCar()
    const params = useParams()
    const navigate = useNavigate()

    const redirectToCreateDiagnostic = () => {
        navigate(`/car/${params.carId}/create`)
    }

    if (!car || isLoadingCar) return <p>Cargando...</p>

    return (
        <>
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title as="h3" className="mb-2">
                        {car.vinCode}
                    </Card.Title>
                    <Button onClick={redirectToCreateDiagnostic}>
                        + Crear nuevo diagnóstico
                    </Button>
                    <VehicleInformation car={car} />
                </Card.Body>
            </Card>

            <VehicleFaultsHistory />
        </>
    )
}

export default CarDetails
