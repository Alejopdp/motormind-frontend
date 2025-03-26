import { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Spinner from '../../components/atoms/Spinner/Spinner'
import VehicleInformation from '../../components/molecules/VehicleInformation/VehicleInformation'
import { useCar } from '../../context/Car.context'
import { useApi } from '../../hooks/useApi'
import { Diagnosis } from '../../types/Diagnosis'

const CreateCarDiagnosis = () => {
    const { car } = useCar()
    const [searchParams, setSearchParams] = useSearchParams()
    const [fault, setFault] = useState('')
    const [notes, setNotes] = useState('')
    const [isCreatingQuestions, setIsCreatingQuestions] = useState(false)
    const [isCreatingMoreQuestions, setIsCreatingMoreQuestions] =
        useState(false)
    const [questions, setQuestions] = useState<string[]>([])
    const [secondStepNotes, setSecondStepNotes] = useState('')
    const [isCreatingDiagnosis, setIsCreatingDiagnosis] = useState(false)
    const { execute: generateQuestions } = useApi<string[]>(
        'post',
        '/car/:carId/questions'
    )
    const { execute: createDiagnosisRequest } = useApi<Diagnosis>(
        'post',
        '/car/:carId/diagnosis'
    )
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

        const carId = car?._id

        if (!carId) return

        const res = await generateQuestions(
            {
                fault,
                notes,
                questionsToAvoid: questions,
            },
            undefined,
            { carId }
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

        const carId = car?._id

        if (!carId) return

        const res = await generateQuestions(
            {
                fault,
                notes,
                questionsToAvoid: questions,
            },
            undefined,
            { carId }
        )

        if (res.status === 200) {
            setQuestions(res.data)
        }
        setIsCreatingMoreQuestions(false)
    }

    const createDiagnosis = async () => {
        if (isCreatingDiagnosis || isCreatingMoreQuestions) return
        setIsCreatingDiagnosis(true)

        const carId = car?._id

        if (!carId) return

        const res = await createDiagnosisRequest(
            {
                fault,
                notes: secondStepNotes,
            },
            undefined,
            { carId }
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
            <Row className="mb-4">
                <Col xs={12}>
                    <Form.Group controlId="faultDescription">
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
                </Col>
            </Row>

            <Row className="mb-4">
                <Col xs={12}>
                    <Form.Group controlId="additionalNotes">
                        <Form.Label className="fw-medium">
                            Otras notas
                        </Form.Label>
                        <Form.Control
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            as="textarea"
                            rows={5}
                            placeholder="Agrega cualquier otra información relevante"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-grid">
                <Button
                    className="col-12 col-md-4"
                    style={{ marginLeft: 'auto' }}
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={!fault}
                >
                    {isCreatingQuestions ? <Spinner /> : 'Generar preguntas'}
                </Button>
            </div>
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
                <Row className="mb-4">
                    <Col xs={12}>
                        <Form.Group controlId="secondStepNotes">
                            <Form.Label className="fw-medium">
                                Notas relevantes
                            </Form.Label>
                            <Form.Control
                                value={secondStepNotes}
                                onChange={(e) =>
                                    setSecondStepNotes(e.target.value)
                                }
                                as="textarea"
                                rows={5}
                                placeholder="Ingrese notas adicionales relevantes sobre el diagnóstico"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="d-flex justify-content-center justify-content-md-end text-center">
                    <Col xs={12} lg={4} className="mb-3">
                        <Button
                            className="w-100"
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
                    </Col>

                    <Col xs={12} lg={4}>
                        <Button
                            className="w-100"
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
                    </Col>
                </Row>
            </Form>
        </>
    )

    return (
        <Container>
            <VehicleInformation car={car} />
            <h3 className="mt-4 mb-4">
                {titleStepMap[(step ?? '1') as '1' | '2']}
            </h3>
            {step === '1' && firstStep}
            {step === '2' && secondStep}
        </Container>
    )
}

export default CreateCarDiagnosis
