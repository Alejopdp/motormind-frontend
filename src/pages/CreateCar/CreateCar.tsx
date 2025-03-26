import { useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../components/atoms/Spinner/Spinner'
import { useSnackbar } from 'notistack'
import { useApi } from '../../hooks/useApi'
import { Car } from '../../types/Car'

const CreateCar = () => {
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [year, setYear] = useState('')
    const [plate, setPlate] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const { execute } = useApi<Car>('post', '/car')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await execute({
                brand,
                model,
                year,
                plate,
            })

            if (response.status === 200) {
                enqueueSnackbar('Vehículo creado correctamente', {
                    variant: 'success',
                })
                navigate(`/car/${response.data._id}`)
            }
        } catch (error) {
            console.log(error)
            enqueueSnackbar('Error al crear el vehículo', {
                variant: 'error',
            })
            setIsSubmitting(false)
        }
    }

    const isFormValid = brand && model && year && plate

    return (
        <Container className="py-4">
            <h2 className="mb-4">Registrar Nuevo Vehículo</h2>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="brand">
                                    <Form.Label className="fw-medium">
                                        Marca{' '}
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej: Toyota"
                                        value={brand}
                                        onChange={(e) =>
                                            setBrand(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="model">
                                    <Form.Label className="fw-medium">
                                        Modelo{' '}
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej: Corolla"
                                        value={model}
                                        onChange={(e) =>
                                            setModel(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="year">
                                    <Form.Label className="fw-medium">
                                        Año{' '}
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej: 2020"
                                        value={year}
                                        onChange={(e) =>
                                            setYear(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="plate">
                                    <Form.Label className="fw-medium">
                                        Matrícula{' '}
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej: ABC123"
                                        value={plate}
                                        onChange={(e) =>
                                            setPlate(e.target.value)
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate('/')}
                                className="px-4"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={!isFormValid || isSubmitting}
                                style={{ minWidth: '150px' }}
                            >
                                {isSubmitting ? <Spinner /> : 'Guardar'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default CreateCar
