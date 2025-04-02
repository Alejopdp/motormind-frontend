import { Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/Auth.context'
import axios from 'axios'
import { apiUrl } from '../../constants/env'

const VerifyLogin = () => {
    const { isAuthenticated, setIsAuthenticated, setUser } = useAuth()
    const navigate = useNavigate()
    const [search] = useSearchParams()
    const [isVeryfiyingToken, setIsVeryfiyingToken] = useState(false)
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        const loadTokenVerification = async () => {
            try {
                if (isVeryfiyingToken) return
                setIsVeryfiyingToken(true)
                const token = search.get('token')

                if (!token) {
                    setError(true)
                    setIsVeryfiyingToken(false)
                    return
                }

                const res = await verifyToken(token)

                if (res) {
                    saveToken(res.token)
                    setUser(res.user)
                    setIsAuthenticated(true)
                } else {
                    setError(true)
                }
            } catch {
                setError(true)
            }

            setIsVeryfiyingToken(false)
        }

        if (search.get('token')) loadTokenVerification()
    }, [search])

    useEffect(() => {
        if (isAuthenticated) navigate('/')
    }, [isAuthenticated])

    const verifyToken = async (token: string) => {
        const res = await axios.post(
            `${apiUrl}/auth/verify-magic-link?token=${token}`
        )
        return res.data
    }

    const saveToken = (token: string) => {
        localStorage.setItem('token', token)
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            {isVeryfiyingToken && (
                <div className="d-flex flex-column align-items-center gap-4">
                    <Spinner animation="border" />
                    <p>Estamos validando tu inicio de sesión</p>
                </div>
            )}

            {error && (
                <div className="d-flex flex-column align-items-center gap-4">
                    <div className="bg-danger bg-opacity-10 p-4 d-flex align-items-center gap-2">
                        <div className="me-2">
                            <Info size={16} color="#991B1B" />
                        </div>
                        <p className="m-0 text-danger">
                            Al parecer el link ha expirado o es incorrecto. Por
                            favor, intenta nuevamente
                        </p>
                    </div>
                    <Button variant="dark" onClick={() => navigate('/login')}>
                        Iniciar sesión
                    </Button>
                </div>
            )}
        </div>
    )
}

export default VerifyLogin
