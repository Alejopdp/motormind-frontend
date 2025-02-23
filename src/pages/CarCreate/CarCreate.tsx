import { Button, Form } from 'react-bootstrap'
import VehicleInformation from '../../components/molecules/VehicleInformation/VehicleInformation'
import { useCar } from '../../context/Car.context'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Spinner from '../../components/atoms/Spinner/Spinner'

const CarCreate = () => {
    const { car } = useCar()
    const [searchParams, setSearchParams] = useSearchParams()
    const [fault, setFault] = useState('')
    const [notes, setNotes] = useState('')
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
            setSearchParams(searchParams, { replace: true })
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
                className="d-flex align-items-center"
                style={{ marginLeft: 'auto', minWidth: '205px', minHeight: 48 }}
                variant="primary"
                type="submit"
                size="lg"
                disabled={!fault}
            >
                {isCreatingQuestions ? <Spinner /> : 'Generar preguntas'}
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
                            <Spinner />
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
                            <Spinner />
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
