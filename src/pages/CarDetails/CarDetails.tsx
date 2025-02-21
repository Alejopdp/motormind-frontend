import axios from 'axios'
import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useParams } from 'react-router-dom'

const CarDetails = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [car, setCar] = useState<any>({})
    const params = useParams()

    useEffect(() => {
        const carId = params.carId

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

    if (!car || isLoading) return <p>Cargando...</p>

    return (
        <Card>
            <Card.Body>
                <Card.Title as="h3" className="mb-2">
                    {car.vinCode}
                </Card.Title>
                <Button>+ Crear nuevo diagnóstico</Button>
                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title className="mb-2">
                            Información del vehículo
                        </Card.Title>
                        <Container>
                            <Row className="p-0">
                                <Col className="p-0">
                                    <p
                                        className="mb-0 text-muted"
                                        style={{ fontSize: 14 }}
                                    >
                                        Marca
                                    </p>
                                    <p>{car.brand}</p>
                                </Col>
                                <Col className="p-0">
                                    <p
                                        className="mb-0 text-muted"
                                        style={{ fontSize: 14 }}
                                    >
                                        Modelo
                                    </p>
                                    <p>{car.model}</p>
                                </Col>
                            </Row>
                            <Row className="p-0">
                                <Col className="p-0">
                                    <p
                                        className="mb-0 text-muted"
                                        style={{ fontSize: 14 }}
                                    >
                                        Año
                                    </p>
                                    <p>{car.year}</p>
                                </Col>
                                <Col className="p-0">
                                    <p
                                        className="mb-0 text-muted"
                                        style={{ fontSize: 14 }}
                                    >
                                        VIN
                                    </p>
                                    <p>{car.vinCode}</p>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            </Card.Body>
        </Card>
    )
}

export default CarDetails
