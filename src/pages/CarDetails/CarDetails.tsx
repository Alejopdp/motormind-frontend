import axios from 'axios'
import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate, useParams } from 'react-router-dom'
import VehicleInformation from '../../components/molecules/VehicleInformation/VehicleInformation'
import { useCar } from '../../context/Car.context'

const CarDetails = () => {
    const [isLoading, setIsLoading] = useState(true)
    const { car, setCar } = useCar()
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const carId = params.carId

        if (car && carId === car._id) return

        const fectchCarById = async () => {
            const res = await axios.get(
                import.meta.env.VITE_API_URL + '/car/' + carId
            )
            if (res.status === 200) {
                setCar(res.data)
                setIsLoading(false)
            }
        }

        fectchCarById()
    }, [])

    const redirectToCreateDiagnostic = () => {
        navigate(`/car/${params.carId}/create`)
    }

    if (!car || isLoading) return <p>Cargando...</p>

    return (
        <Card>
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
    )
}

export default CarDetails
