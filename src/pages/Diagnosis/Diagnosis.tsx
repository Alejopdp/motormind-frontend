import { useEffect, useState } from 'react'
import VehicleInformation from '../../components/molecules/VehicleInformation/VehicleInformation'
import { useCar } from '../../context/Car.context'
import { Spinner } from 'react-bootstrap'
import axios from 'axios'
import { useParams } from 'react-router-dom'

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
    diagnosis: string
    createdAt: Date
    updatedAt: Date
}

const DiagnosisPage = () => {
    const params = useParams()
    const [isLoadingDiagnosis, setIsLoadingDiagnosis] = useState(true)
    const [diagnosis, setDiagnosis] = useState<Diagnosis | undefined>(undefined)
    const { car } = useCar()

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
                </>
            ) : (
                <></>
            )}
        </>
    )
}

export default DiagnosisPage
