import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../components/atoms/Spinner/Spinner'
import VehicleList from '../../components/molecules/VehiceList/VehicleList'
import { useCar } from '../../context/Car.context'
import { useApi } from '../../hooks/useApi'
import { Car } from '../../types/Car'

const Home = () => {
    const { setCar } = useCar()
    const navigate = useNavigate()
    const [vinCode, setVinCode] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [cars, setCars] = useState<Car[]>([])
    const [isLoadingCars, setIsLoadingCars] = useState(true)
    const { enqueueSnackbar } = useSnackbar()
    const { execute } = useApi<Car>('get', '/car/vin-or-plate/:vinCodeOrPlate')
    const { execute: getCarsRequest } = useApi<Car[]>('get', '/car')

    const redirectToCarDetails = (id: string) => {
        navigate(`/car/${id}`)
    }

    const getCarByVinCode = async () => {
        if (isSearching) return

        setIsSearching(true)
        try {
            const res = await execute(undefined, undefined, {
                vinCodeOrPlate: vinCode,
            })

            if (res.status === 200) {
                setCar(res.data)
                redirectToCarDetails(res.data._id)
            }
        } catch {
            enqueueSnackbar(
                'Error al buscar el coche. Asegúrese que la matrícula o el VIN sean correctos.',
                {
                    variant: 'error',
                }
            )
        }

        setIsSearching(false)
    }

    const getCars = async () => {
        setIsLoadingCars(true)
        const res = await getCarsRequest()

        if (res.status === 200) {
            setCars(res.data)
        }

        setIsLoadingCars(false)
    }

    useEffect(() => {
        getCars()
    }, [])

    return (
        <div style={{ paddingBottom: 48 }}>
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
                            Matrícula o Número de Bastidor (VIN)
                        </Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Ingrese la matrícula o el VIN"
                                aria-label="Ingrese la matrícula o el VIN"
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
                <VehicleList cars={cars} />
            )}
        </div>
    )
}

export default Home
