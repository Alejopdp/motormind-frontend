import { useRef, useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    const [vinCode, setVinCode] = useState('')

    const redirectToCarDetails = (vinCode: string) => {
        // Redirect to /car/:carId
        navigate(`/car/${vinCode}`)
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title as="h3" className="mb-2">
                    Búsqueda de diagnósticos
                </Card.Title>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault()
                        redirectToCarDetails(vinCode)
                    }}
                >
                    <Form.Label className="fw-medium">
                        Número de Bastidor (VIN)
                    </Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Ingrese el VIN"
                            aria-label="Ingrese el VIN"
                            aria-describedby="basic-addon2"
                            value={vinCode}
                            onChange={(e) => setVinCode(e.target.value)}
                        />
                        <Button
                            variant="primary"
                            id="button-addon2"
                            size="lg"
                            disabled={!vinCode}
                            onClick={() => {
                                redirectToCarDetails(vinCode)
                            }}
                        >
                            Buscar diágnosticos
                        </Button>
                    </InputGroup>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default Home
