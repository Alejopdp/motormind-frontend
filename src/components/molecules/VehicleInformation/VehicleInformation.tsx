import { Card, Col, Container, Row } from 'react-bootstrap'

type VehicleInformationProps = {
    car: {
        brand: string
        model: string
        year: number
        vinCode: string
        plate: string
    }
}

const VehicleInformation: React.FC<VehicleInformationProps> = ({ car }) => {
    return (
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
                            <p className="fw-medium">{car.brand}</p>
                        </Col>
                        <Col className="p-0">
                            <p
                                className="mb-0 text-muted"
                                style={{ fontSize: 14 }}
                            >
                                Modelo
                            </p>
                            <p className="fw-medium">{car.model}</p>
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
                            <p className="fw-medium">{car.year}</p>
                        </Col>
                        <Col className="p-0">
                            <p
                                className="mb-0 text-muted"
                                style={{ fontSize: 14 }}
                            >
                                {car.plate ? 'Matrícula' : 'VIN'}
                            </p>
                            <p className="fw-medium">
                                {car.plate ? car.plate : car.vinCode}
                            </p>
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    )
}

export default VehicleInformation
