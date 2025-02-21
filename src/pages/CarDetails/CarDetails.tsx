import { Col, Container, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

const CarDetails = () => {
    return (
        <Card>
            <Card.Body>
                <Card.Title as="h3" className="mb-2">
                    1HGCM826633A123456
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
                                    <p>Toyota</p>
                                </Col>
                                <Col className="p-0">
                                    <p
                                        className="mb-0 text-muted"
                                        style={{ fontSize: 14 }}
                                    >
                                        Modelo
                                    </p>
                                    <p>Corolla</p>
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
                                    <p>2020</p>
                                </Col>
                                <Col className="p-0">
                                    <p
                                        className="mb-0 text-muted"
                                        style={{ fontSize: 14 }}
                                    >
                                        VIN
                                    </p>
                                    <p>1HGCM826633A123456</p>
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
