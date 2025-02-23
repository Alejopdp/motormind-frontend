import { useEffect, useState } from 'react'
import VehicleInformation from '../../components/molecules/VehicleInformation/VehicleInformation'
import { useCar } from '../../context/Car.context'
import { Button, Form } from 'react-bootstrap'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { enqueueSnackbar } from 'notistack'
import Spinner from '../../components/atoms/Spinner/Spinner'

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
    const [techincalNotes, setTechnicalNotes] = useState('')
    const [isCreatingFinalDiagnosis, setIsCreatingFinalDiagnosis] =
        useState(false)
    const [isUpdatingDiagnosis, setIsUpdatingDiagnosis] = useState(false)
    const { car, diagnoses, setDiagnoses } = useCar()
    const [finalNotes, setFinalNotes] = useState(diagnosis?.finalNotes ?? '')

    useEffect(() => {
        const diagnosisId = params.diagnosisId

        if (!diagnosisId) return

        const getDiagnosis = async () => {
            const res = await axios.get(
                import.meta.env.VITE_API_URL + '/car/diagnosis/' + diagnosisId
            )
            if (res.status === 200) {
                setDiagnosis(res.data)
                setIsLoadingDiagnosis(false)
            }
            setIsLoadingDiagnosis(false)
        }

        getDiagnosis()
    }, [])

    useEffect(() => {
        setFinalNotes(diagnosis?.finalNotes ?? finalNotes ?? '')
    }, [diagnosis])

    const createFinalDiagnosis = async () => {
        setIsCreatingFinalDiagnosis(true)
        const carId = car._id
        const res = await axios.post(
            import.meta.env.VITE_API_URL +
                '/car/' +
                carId +
                '/diagnosis/' +
                diagnosis?._id +
                '/final',
            {
                techincalNotes,
            }
        )

        if (res.status === 200) {
            setDiagnosis(res.data)
            setDiagnoses([...diagnoses, res.data])
        }

        setIsCreatingFinalDiagnosis(false)
    }

    const updateDiagnosis = async () => {
        if (isUpdatingDiagnosis) return
        setIsUpdatingDiagnosis(true)
        const res = await axios.put(
            import.meta.env.VITE_API_URL +
                '/car/' +
                car._id +
                '/diagnosis/' +
                diagnosis?._id,
            {
                finalNotes,
            }
        )

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
        <>
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
                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label className="fw-medium">
                                Información del técnico
                            </Form.Label>
                            <Form.Control
                                value={techincalNotes}
                                onChange={(e) =>
                                    setTechnicalNotes(e.target.value)
                                }
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
                                className="d-flex"
                                style={{ minWidth: '210px', minHeight: 48 }}
                                variant="primary"
                                size="lg"
                                onClick={
                                    isCreatingFinalDiagnosis
                                        ? () => ''
                                        : createFinalDiagnosis
                                }
                            >
                                {isCreatingFinalDiagnosis ? (
                                    <Spinner />
                                ) : (
                                    'Crear diagnóstico final'
                                )}
                            </Button>
                        </div>
                    </Form>
                </>
            ) : (
                <>
                    <h2 className="my-4">Informe de Diagnóstico</h2>
                    <div className="prose lg:prose-lg">
                        <ReactMarkdown>{diagnosis.diagnosis}</ReactMarkdown>
                    </div>

                    <Form>
                        <Form.Group
                            className="mb-4"
                            controlId="exampleForm.ControlTextarea1"
                        >
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
                        <div
                            className="d-flex justify-content-end gap-4"
                            style={{ marginLeft: 'auto' }}
                        >
                            <Button
                                className="d-flex"
                                style={{ minWidth: '210px' }}
                                variant="secondary"
                                size="lg"
                                onClick={copyDiagnosis}
                            >
                                Copiar diagnóstico
                            </Button>
                            <Button
                                className="d-flex"
                                style={{ minWidth: '210px' }}
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
                        </div>
                    </Form>
                </>
            )}
        </>
    )
}

export default DiagnosisPage
