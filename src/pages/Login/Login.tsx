import { CircleCheckBig } from 'lucide-react'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import axios from 'axios'
import { apiUrl } from '../../constants/env'

const Login: React.FC = () => {
    const [email, setEmail] = useState('')
    const [isSendingMagicLink, setIsSendingMagicLink] = useState(false)
    const [linkSent, setLinkSent] = useState(false)
    const [timer, setTimer] = useState(30)
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (!linkSent) return

        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [timer, linkSent])

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        setIsSendingMagicLink(true)

        try {
            const res = await axios.post(`${apiUrl}/auth/magic-link`, { email })

            if (res) {
                setLinkSent(true)
            }
        } catch (error) {
            console.error(error)
            enqueueSnackbar(
                'Ocurrió un error al enviar el link. Por favor, intenta nuevamente.',
                {
                    variant: 'error',
                }
            )
        } finally {
            setIsSendingMagicLink(false)
        }
    }

    const title = linkSent ? 'Enlace enviado' : 'Accede a tu cuenta'
    const subtitle = linkSent
        ? 'Revisa tu correo electrónico para continuar'
        : 'Te enviaremos un enlace a tu correo para iniciar sesión'
    const content = linkSent ? (
        <>
            <div className="d-flex flex-column gap-4 w-sm-25 mx-auto">
                <div className="d-flex align-items-start gap-2 bg-success bg-opacity-10 p-4">
                    <div className="me-2">
                        <CircleCheckBig size={16} color="#4ADE80" />
                    </div>
                    <p className="fw-medium text-sm text-success mb-0">
                        Hemos enviado un enlace mágico a tu correo electrónico.
                        Por favor, revisa tu bandeja de entrada y sigue las
                        instrucciones para acceder a tu cuenta.
                    </p>
                </div>

                <p className="text-center m-0 text-muted">
                    ¿No encuentras nuestro email?
                </p>

                <Button
                    variant="link"
                    className="fw-medium text-dark text-decoration-none"
                    onClick={() => {
                        handleSubmit()
                        setTimer(30)
                    }}
                    disabled={timer > 0}
                >
                    {timer > 0
                        ? `Reenviar email (${timer}s)`
                        : 'Reenviar email'}
                </Button>
            </div>
        </>
    ) : (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                />
            </Form.Group>

            <Button
                variant="dark"
                type="submit"
                className="w-full py-2 rounded-lg w-100"
                disabled={isSendingMagicLink}
            >
                {isSendingMagicLink ? 'Enviando...' : 'Enviar enlace mágico'}
            </Button>
        </Form>
    )

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light px-5 overflow-hidden">
            <div className="">
                <div className="text-center mb-4">
                    <h1 className="h2 fw-semibold mb-2">{title}</h1>
                    <p className="text-muted">{subtitle}</p>
                </div>
                <Card className="p-4 w-sm-50 mx-auto">{content}</Card>
            </div>
        </div>
    )
}

export default Login
