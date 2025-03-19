import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import Spinner from '../../components/atoms/Spinner/Spinner'
import VehicleInformation from '../../components/molecules/VehicleInformation/VehicleInformation'
import { useCar } from '../../context/Car.context'
import { useApi } from '../../hooks/useApi'

export interface Diagnosis {
    _id?: string
    carId: string
    fault: string
    notes: string
    preliminary: {
        possibleReasons: {
            title: string
            probability: string
            reasonDetails: string
        }[]
        fixSteps: {
            title: string
            procedure: string
            tools: string
        }[]
    }
    finalNotes: string
    diagnosis: string
    createdAt: Date
    updatedAt: Date
}

const DiagnosisPage = () => {
    const params = useParams()
    const [isLoadingDiagnosis, setIsLoadingDiagnosis] = useState(true)
    const [diagnosis, setDiagnosis] = useState<Diagnosis | undefined>(undefined)
    const [technicalNotes, setTechnicalNotes] = useState('')
    const [isCreatingFinalDiagnosis, setIsCreatingFinalDiagnosis] =
        useState(false)
    const [isUpdatingDiagnosis, setIsUpdatingDiagnosis] = useState(false)
    const { car, diagnoses, setDiagnoses } = useCar()
    const [finalNotes, setFinalNotes] = useState(diagnosis?.finalNotes ?? '')
    const { execute: getDiagnosisById } = useApi<Diagnosis>(
        'get',
        '/car/diagnosis/:diagnosisId'
    )
    const { execute: createDiagnosis } = useApi<Diagnosis>(
        'post',
        '/car/:carId/diagnosis/:diagnosisId/final'
    )
    const { execute: updateDiagnosisRequest } = useApi<Diagnosis>(
        'put',
        '/car/:carId/diagnosis/:diagnosisId'
    )
    useEffect(() => {
        const diagnosisId = params.diagnosisId
        if (!diagnosisId) return

        const getDiagnosis = async () => {
            const res = await getDiagnosisById(undefined, undefined, {
                diagnosisId,
            })
            if (res.status === 200) {
                setDiagnosis(res.data)
                setIsLoadingDiagnosis(false)
            }
        }

        getDiagnosis()
    }, [])

    useEffect(() => {
        setFinalNotes(diagnosis?.finalNotes ?? finalNotes ?? '')
    }, [diagnosis])

    const createFinalDiagnosis = async () => {
        setIsCreatingFinalDiagnosis(true)
        const carId = car?._id ?? ''
        const diagnosisId = diagnosis?._id ?? ''

        const res = await createDiagnosis({ technicalNotes }, undefined, {
            carId,
            diagnosisId,
        })

        if (res.status === 200) {
            setDiagnosis(res.data)
            setDiagnoses([...diagnoses, res.data])
        }
        setIsCreatingFinalDiagnosis(false)
    }

    const updateDiagnosis = async () => {
        if (isUpdatingDiagnosis) return
        const carId = car?._id ?? ''
        const diagnosisId = diagnosis?._id ?? ''

        setIsUpdatingDiagnosis(true)

        const res = await updateDiagnosisRequest({ finalNotes }, undefined, {
            carId,
            diagnosisId,
        })

        if (res.status === 200) {
            setDiagnosis(res.data)
            setDiagnoses(
                diagnoses.map((d) => (d._id === diagnosis?._id ? res.data : d))
            )
        }
        setIsUpdatingDiagnosis(false)
    }

    const copyDiagnosis = () => {
        navigator.clipboard.writeText(diagnosis?.diagnosis ?? '')
        enqueueSnackbar('Diagnóstico copiado al portapapeles', {
            variant: 'success',
        })
    }

    if (!car) return null

    return (
        <Container style={{ paddingBottom: 48 }}>
            <VehicleInformation car={car} />
            {isLoadingDiagnosis || !diagnosis ? (
                <Spinner className="d-flex mx-auto mt-4" />
            ) : !diagnosis.diagnosis ? (
                <>
                    <h2 className="my-4">Informe de diagnóstico preliminar</h2>
                    <h5 className="mb-3">Posibles Causas del Problema</h5>
                    {diagnosis.preliminary.possibleReasons.map(
                        (reason, index) => (
                            <div key={index}>
                                <h6>
                                    <strong>
                                        {index + 1}. {reason.title}
                                    </strong>
                                </h6>
                                <ul>
                                    <li>
                                        <strong>Probabilidad:</strong>{' '}
                                        {reason.probability}
                                    </li>
                                    <li>
                                        <strong>Razonamiento:</strong>{' '}
                                        {reason.reasonDetails}
                                    </li>
                                </ul>
                            </div>
                        )
                    )}
                    <h5 className="mb-3">Pasos para Diagnosticar y Reparar</h5>
                    {diagnosis.preliminary.fixSteps.map((step, index) => (
                        <div key={index}>
                            <h6>
                                <strong>
                                    {index + 1}. {step.title}
                                </strong>
                            </h6>
                            <ul>
                                <li>
                                    <strong>Procedimiento:</strong>{' '}
                                    {step.procedure}
                                </li>
                                <li>
                                    <strong>Herramientas:</strong> {step.tools}
                                </li>
                            </ul>
                        </div>
                    ))}
                    <Form>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-medium">
                                Información del técnico
                            </Form.Label>
                            <Form.Control
                                value={technicalNotes}
                                onChange={(e) =>
                                    setTechnicalNotes(e.target.value)
                                }
                                as="textarea"
                                rows={5}
                                placeholder="Ingrese notas adicionales y relevantes sobre el diagnóstico"
                            />
                        </Form.Group>
                        <Row className="d-flex justify-content-end text-center">
                            <Col xs={12} lg={4}>
                                <Button
                                    className="w-100"
                                    variant="primary"
                                    size="lg"
                                    onClick={createFinalDiagnosis}
                                >
                                    {isCreatingFinalDiagnosis ? (
                                        <Spinner />
                                    ) : (
                                        'Crear diagnóstico final'
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </>
            ) : (
                <>
                    <h2 className="my-4">Informe de Diagnóstico</h2>
                    <div className="prose lg:prose-lg">
                        <ReactMarkdown>{diagnosis.diagnosis}</ReactMarkdown>
                    </div>
                    <Form>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-medium">
                                Información relevante
                            </Form.Label>
                            <Form.Control
                                value={finalNotes}
                                onChange={(e) => setFinalNotes(e.target.value)}
                                as="textarea"
                                rows={5}
                                placeholder="Incluir más información"
                            />
                        </Form.Group>
                        <Row className="d-flex justify-content-end text-center">
                            <Col xs={12} lg={4} className="mb-3">
                                <Button
                                    className="w-100"
                                    variant="secondary"
                                    size="lg"
                                    onClick={copyDiagnosis}
                                >
                                    Copiar diagnóstico
                                </Button>
                            </Col>
                            <Col xs={12} lg={4}>
                                <Button
                                    className="w-100"
                                    variant="primary"
                                    size="lg"
                                    onClick={updateDiagnosis}
                                >
                                    {isUpdatingDiagnosis ? (
                                        <Spinner />
                                    ) : (
                                        'Actualizar diagnóstico'
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </>
            )}
        </Container>
    )
}

export default DiagnosisPage
