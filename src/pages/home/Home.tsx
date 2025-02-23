import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import { useCar } from '../../context/Car.context'
import Spinner from '../../components/atoms/Spinner/Spinner'

const Home = () => {
    const { setCar } = useCar()
    const navigate = useNavigate()
    const [vinCode, setVinCode] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    const redirectToCarDetails = (id: string) => {
        navigate(`/car/${id}`)
    }

    const getCarByVinCode = async () => {
        if (isSearching) return

        setIsSearching(true)
        try {
            const res = await axios.get(
                import.meta.env.VITE_API_URL + '/car/vin/' + vinCode
            )

            if (res.status === 200) {
                setCar(res.data)
                redirectToCarDetails(res.data._id)
            }
        } catch (error) {
            enqueueSnackbar(
                'Error al buscar el coche por el VIN. Asegúrese que el número de VIN sea correcto.',
                {
                    variant: 'error',
                }
            )
        }

        setIsSearching(false)
    }

    return (
        <>
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
                                style={{ minWidth: 214 }}
                                disabled={!vinCode}
                                onClick={() => {
                                    getCarByVinCode()
                                }}
                            >
                                {isSearching ? (
                                    <Spinner />
                                ) : (
                                    'Buscar diagnósticos'
                                )}
                            </Button>
                        </InputGroup>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

export default Home
