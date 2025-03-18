import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Form, InputGroup, Table } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import { useCar } from '../../context/Car.context'
import Spinner from '../../components/atoms/Spinner/Spinner'
import { Car } from '../../types/Car'

const Home = () => {
    const { setCar } = useCar()
    const navigate = useNavigate()
    const [vinCode, setVinCode] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [cars, setCars] = useState<Car[]>([])
    const [isLoadingCars, setIsLoadingCars] = useState(true)
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

    const getCars = async () => {
        setIsLoadingCars(true)
        const res = await axios.get(import.meta.env.VITE_API_URL + '/car')

        if (res.status === 200) {
            setCars(res.data)
        }

        setIsLoadingCars(false)
    }

    useEffect(() => {
        getCars()
    }, [])

    return (
        <>
            <h3 className="mt-5">Búsqueda de diagnósticos</h3>
            <Card>
                <Card.Body>
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
                                className="d-none d-md-block"
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
                        <Button
                            className="d-md-none w-100"
                            variant="primary"
                            size="lg"
                            disabled={!vinCode}
                            onClick={() => {
                                getCarByVinCode()
                            }}
                        >
                            {isSearching ? <Spinner /> : 'Buscar diagnósticos'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <h3 className="mt-5">Lista de vehículos</h3>
            {isLoadingCars ? (
                <div className="d-flex justify-content-center align-items-center">
                    <Spinner />
                </div>
            ) : (
                <Card>
                    <Card.Body>
                        <Table>
                            <thead>
                                <tr>
                                    <th>VIN</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Año</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.map((car) => (
                                    <tr key={car._id}>
                                        <td>{car.vinCode}</td>
                                        <td>{car.brand}</td>
                                        <td>{car.model}</td>
                                        <td>{car.year}</td>
                                        <td className="d-flex justify-content-end">
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    redirectToCarDetails(
                                                        car._id
                                                    )
                                                }
                                            >
                                                Ver diagnósticos
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </>
    )
}

export default Home
