import { ThumbsDown } from 'lucide-react'
import { Button } from 'react-bootstrap'
import BodyText from '../../atoms/BodyText/BodyText'
import { ThumbsUp } from 'lucide-react'

type RateDiagnosisProps = {
    rateDiagnosis: (wasUseful: boolean) => void
}

export const RateDiagnosis = ({ rateDiagnosis }: RateDiagnosisProps) => {
    return (
        <div
            className="d-flex align-items-center gap-4 w-100 justify-content-center bg-white py-3"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
        >
            <BodyText fontSize={18} fontWeight={'normal'}>
                ¿Este diagnóstico te ayudó a resolver el problema?
            </BodyText>
            <div className="d-flex gap-2">
                <Button
                    className="d-flex align-items-center gap-2 border"
                    variant="outline-light"
                    style={{ color: 'black' }}
                    onClick={() => rateDiagnosis(true)}
                >
                    <ThumbsUp size={16} fill="black" />
                    Sí
                </Button>
                <Button
                    className="d-flex align-items-center gap-2 border"
                    variant="outline-light"
                    style={{ color: 'black' }}
                    onClick={() => rateDiagnosis(false)}
                >
                    <ThumbsDown size={16} fill="black" />
                    No
                </Button>
            </div>
        </div>
    )
}
