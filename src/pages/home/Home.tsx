import axios from 'axios'
import { useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import { useCar } from '../../context/Car.context'

const Home = () => {
    const { setCar } = useCar()
    const navigate = useNavigate()
    const [vinCode, setVinCode] = useState('')

    const redirectToCarDetails = (id: string) => {
        navigate(`/car/${id}`)
    }

    const getCarByVinCode = async () => {
        const res = await axios.get(
            import.meta.env.VITE_API_URL + '/car/vin/' + vinCode
        )

        if (res.status === 200) {
            setCar(res.data)
            redirectToCarDetails(res.data._id)
        }
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
                        getCarByVinCode()
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
                                getCarByVinCode()
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
