import React, { useState, useEffect } from 'react'
import { useMechanic } from '../../context/Mechanic.context'
import { useSnackbar } from 'notistack'
import BodyText from '../../components/atoms/BodyText/BodyText'
import { Button, Form, InputGroup } from 'react-bootstrap'
import Spinner from '../../components/atoms/Spinner/Spinner'

const ConfiguracionPage = () => {
    const [newPricePerHour, setNewPricePerHour] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { pricePerHour, updatePricePerHour } = useMechanic()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (pricePerHour !== undefined) {
            const eurosValue = (pricePerHour / 100).toFixed(2)
            setNewPricePerHour(eurosValue)
        }
    }, [pricePerHour])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(',', '.')

        if (newPricePerHour === '0' && value === '00') {
            return
        }

        if (
            newPricePerHour === '' &&
            (e.target.value.includes('.') || e.target.value.includes(','))
        ) {
            return
        }

        if (value === '' || /^(\d*\.?\d{0,2})$/.test(value)) {
            setNewPricePerHour(value)
        }
    }

    const isSubmitDisabled = () => {
        const numValue = parseFloat(newPricePerHour)
        const currentValueInCents = pricePerHour || 0
        const newValueInCents = Math.round(numValue * 100)

        return (
            isSubmitting ||
            newPricePerHour === '' ||
            isNaN(numValue) ||
            numValue <= 0 ||
            newValueInCents === currentValueInCents
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const valueInCents = Math.round(parseFloat(newPricePerHour) * 100)
            const res = await updatePricePerHour(valueInCents)

            if (res.status === 200) {
                enqueueSnackbar('Cambios guardados correctamente', {
                    variant: 'success',
                })
            } else {
                enqueueSnackbar('No se pudieron guardar los cambios', {
                    variant: 'error',
                })
            }
        } catch (error) {
            console.error('Error al guardar la tarifa:', error)
            enqueueSnackbar('No se pudieron guardar los cambios', {
                variant: 'error',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="font-bold mb-6">Configuración</h2>
            <BodyText>
                Administra tus preferencias de precios y configuración de tarifa
                por hora
            </BodyText>

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg shadow p-4 mb-8">
                    <h3 className="font-semibold mb-2" style={{ fontSize: 18 }}>
                        Tarifa por Hora
                    </h3>
                    <BodyText>
                        Establece tu tarifa por hora predeterminada para las
                        reparaciones
                    </BodyText>

                    <Form.Group controlId="pricePerHour">
                        <Form.Label
                            className="fw-medium fs-6"
                            style={{ fontSize: 14 }}
                        >
                            Tarifa actual
                        </Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="bg-transparent">
                                €
                            </InputGroup.Text>
                            <Form.Control
                                value={newPricePerHour}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="3.50"
                                className="no-spinner"
                                required
                            />
                        </InputGroup>
                    </Form.Group>
                </div>
                <div className="d-flex justify-content-end w-100">
                    <Button
                        type="submit"
                        disabled={isSubmitDisabled()}
                        className="bg-black text-white px-4 py-2 rounded-md mt-4"
                        style={{
                            minWidth: 172,
                        }}
                    >
                        {isSubmitting ? <Spinner /> : 'Guardar cambios'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ConfiguracionPage
