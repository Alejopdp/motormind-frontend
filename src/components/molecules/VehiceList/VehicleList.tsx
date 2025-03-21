import { Button, Card, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { Car } from '../../../types/Car'
import { useEffect, useState } from 'react'

interface VehicleListProps {
    cars: Car[]
}

const VehicleList = ({ cars }: VehicleListProps) => {
    const navigate = useNavigate()
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
        window.innerWidth < 576
    )
    const [isMediumScreen, setIsMediumScreen] = useState<boolean>(
        window.innerWidth >= 576 && window.innerWidth < 768
    )

    const redirectToCarDetails = (id: string) => {
        navigate(`/car/${id}`)
    }

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 576)
            setIsMediumScreen(
                window.innerWidth >= 576 && window.innerWidth < 768
            )
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <>
            {isMediumScreen || isSmallScreen ? (
                <div className="d-flex flex-column gap-3">
                    {cars.map((car) => (
                        <Card key={car._id} className="w-100">
                            <Card.Body>
                                <Card.Title>
                                    {car.brand} {car.model}
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Año: {car.year}
                                </Card.Subtitle>
                                <Card.Text>
                                    Matrícula o VIN: {car.vinCode}
                                </Card.Text>
                                <Button
                                    variant="primary"
                                    className="w-100"
                                    onClick={() =>
                                        redirectToCarDetails(car._id)
                                    }
                                >
                                    Ver diagnósticos
                                </Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : (
                <Table>
                    <thead>
                        <tr>
                            <th>Matrícula o VIN</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car) => (
                            <tr key={car._id}>
                                <td>{car.plate ? car.plate : car.vinCode}</td>
                                <td>{car.brand}</td>
                                <td>{car.model}</td>
                                <td>{car.year}</td>
                                <td className="d-flex justify-content-end">
                                    <Button
                                        variant="primary"
                                        className={
                                            isMediumScreen ? 'me-2' : 'w-100'
                                        }
                                        onClick={() =>
                                            redirectToCarDetails(car._id)
                                        }
                                    >
                                        Ver diagnósticos
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default VehicleList
