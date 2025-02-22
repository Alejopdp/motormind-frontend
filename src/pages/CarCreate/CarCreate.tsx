import { Button, Form, Spinner } from 'react-bootstrap'
import VehicleInformation from '../../components/molecules/VehicleInformation/VehicleInformation'
import { useCar } from '../../context/Car.context'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const CarCreate = () => {
    const { car } = useCar()
    const [searchParams, setSearchParams] = useSearchParams()
    const [fault, setFault] = useState(
        'Se ha parado en carretera y lo arranca y se para.'
    )
    const [notes, setNotes] = useState(
        'El cliente indica que hace un mes se cambió la batería, ya que la anterior fallaba al encender por las mañanas. No ha hecho ningún otro mantenimiento reseñable en los últimos seis meses.El cliente asegura que no notó pérdida de potencia significativa ni tirones antes de que empezara a apagarse. Señala que todo sucedió de forma repentina hace unos días.El cliente dice que no percibe ningún ruido metálico ni vibraciones fuertes; simplemente el motor “baja de revoluciones” muy rápido y se detiene. El único sonido que escucha es el normal del motor al arrancar.'
    )
    const [isCreatingQuestions, setIsCreatingQuestions] = useState(false)
    const [isCreatingMoreQuestions, setIsCreatingMoreQuestions] =
        useState(false)
    const [questions, setQuestions] = useState([])
    const [secondStepNotes, setSecondStepNotes] = useState('')
    const [isCreatingDiagnosis, setIsCreatingDiagnosis] = useState(false)
    const step = searchParams.get('step')
    const navigate = useNavigate()

    useEffect(() => {
        if (!searchParams.get('step')) {
            searchParams.set('step', '1')
            setSearchParams(searchParams)
        }
    }, [])

    const createQuestions = async () => {
        if (isCreatingQuestions) return
        setIsCreatingQuestions(true)
        const carId = car._id

        const res = await axios.post(
            import.meta.env.VITE_API_URL + '/car/' + carId + '/questions',
            {
                fault,
                notes,
                questionsToAvoid: questions,
            }
        )

        if (res.status === 200) {
            setQuestions(res.data)
            searchParams.set('step', '2')
            setSearchParams(searchParams)
        }

        setIsCreatingQuestions(false)
    }

    const createMoreQuestions = async () => {
        if (isCreatingMoreQuestions || isCreatingDiagnosis) return
        setIsCreatingMoreQuestions(true)
        const carId = car._id

        const res = await axios.post(
            import.meta.env.VITE_API_URL + '/car/' + carId + '/questions',
            {
                fault,
                notes,
                questionsToAvoid: questions,
            }
        )

        if (res.status === 200) {
            setQuestions(res.data)
        }
        setIsCreatingMoreQuestions(false)
    }

    const createDiagnosis = async () => {
        if (isCreatingDiagnosis || isCreatingMoreQuestions) return
        setIsCreatingDiagnosis(true)
        const carId = car._id

        const res = await axios.post(
            import.meta.env.VITE_API_URL + '/car/' + carId + '/diagnosis',
            {
                fault,
                notes: secondStepNotes,
            }
        )

        if (res.status === 200) {
            navigate(`/car/${carId}/diagnosis/${res.data._id}`)
        }

        setIsCreatingDiagnosis(false)
    }

    if (!car) return null

    const titleStepMap = {
        '1': 'Diagnóstico del vehículo',
        '2': 'Cuestionario de diagnóstico',
    }

    const firstStep = (
        <Form
            onSubmit={(ev) => {
                ev.preventDefault()
                createQuestions()
            }}
        >
            <Form.Group
                className="mb-4"
                controlId="exampleForm.ControlTextarea1"
            >
                <Form.Label className="fw-medium">
                    ¿Cuál es tu avería?
                </Form.Label>
                <Form.Control
                    value={fault}
                    onChange={(e) => setFault(e.target.value)}
                    as="textarea"
                    rows={5}
                    placeholder="Describe detalladamente la avería que presenta el vehículo"
                />
            </Form.Group>
            <Form.Group
                className="mb-4 fw-medium"
                controlId="exampleForm.ControlTextarea1"
            >
                <Form.Label>Otras notas</Form.Label>
                <Form.Control
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    as="textarea"
                    rows={5}
                    placeholder="Agrega cualquier otra información que creas relevante para crear un diagnóstico"
                />
            </Form.Group>
            <Button
                className="d-flex"
                style={{ marginLeft: 'auto', minWidth: '205px' }}
                variant="primary"
                type="submit"
                size="lg"
            >
                {isCreatingQuestions ? (
                    <Spinner
                        className="mx-auto"
                        style={{ width: 20, height: 20, borderWidth: 2 }}
                    />
                ) : (
                    'Generar preguntas'
                )}
            </Button>
        </Form>
    )

    const secondStep = (
        <>
            {questions.map((question, index) => (
                <p key={question}>
                    {index + 1}. {question}
                </p>
            ))}
            <Form>
                <Form.Group
                    className="mb-4"
                    controlId="exampleForm.ControlTextarea1"
                >
                    <Form.Label className="fw-medium">
                        Notas relevantes
                    </Form.Label>
                    <Form.Control
                        value={secondStepNotes}
                        onChange={(e) => setSecondStepNotes(e.target.value)}
                        as="textarea"
                        rows={5}
                        placeholder="Ingrese notas adicionales y relevantes sobre el diagnóstico"
                    />
                </Form.Group>
                <div
                    className="d-flex justify-content-end gap-4"
                    style={{ marginLeft: 'auto' }}
                >
                    <Button
                        className="d-flex align-items-center"
                        style={{ minWidth: '262px' }}
                        variant="secondary"
                        size="lg"
                        onClick={createMoreQuestions}
                    >
                        {isCreatingMoreQuestions ? (
                            <Spinner
                                className="mx-auto"
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderWidth: 2,
                                }}
                            />
                        ) : (
                            '+ Generar más preguntas'
                        )}
                    </Button>
                    <Button
                        className="d-flex"
                        style={{ minWidth: '210px' }}
                        variant="primary"
                        size="lg"
                        onClick={
                            isCreatingDiagnosis ? () => '' : createDiagnosis
                        }
                    >
                        {isCreatingDiagnosis ? (
                            <Spinner
                                className="mx-auto"
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderWidth: 2,
                                }}
                            />
                        ) : (
                            'Ver / Crear informe'
                        )}
                    </Button>
                </div>
            </Form>
        </>
    )

    return (
        <>
            <VehicleInformation car={car} />
            <h3 className="mt-4 mb-4">
                {titleStepMap[(step ?? '1') as keyof typeof titleStepMap]}
            </h3>
            {step === '1' && firstStep}
            {step === '2' && secondStep}
        </>
    )
}

export default CarCreate
