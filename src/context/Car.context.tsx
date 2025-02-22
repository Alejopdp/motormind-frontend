// Create a context for the car

import axios from 'axios'
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react'
import { Diagnosis } from '../pages/Diagnosis/Diagnosis'

interface CarContextType {
    car: any
    setCar: (car: any) => void
    isLoadingCar: boolean
    diagnoses: Diagnosis[]
    isLoadingDiagnoses: boolean
}

const CarContext = createContext<CarContextType>({
    car: {},
    setCar: () => {},
    isLoadingCar: true,
    diagnoses: [],
    isLoadingDiagnoses: true,
})

export const CarProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [car, setCar] = useState<any>({})
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])
    const [isLoadingCar, setIsLoadingCar] = useState(true)
    const [isLoadingDiagnoses, setIsLoadingDiagnoses] = useState(true)
    const carId = window.location.pathname.split('/')[2]

    useEffect(() => {
        if (carId === car?._id) return

        const fectchCarById = async () => {
            const res = await axios.get(
                import.meta.env.VITE_API_URL + '/car/' + carId
            )
            if (res.status === 200) {
                setCar(res.data)
                setIsLoadingCar(false)
            }
        }

        const fetchDiagnosesByCarId = async () => {
            setIsLoadingDiagnoses(true)
            const res = await axios.get(
                import.meta.env.VITE_API_URL + '/car/' + carId + '/diagnosis'
            )
            if (res.status === 200) {
                setDiagnoses(res.data)
            }

            setIsLoadingDiagnoses(false)
        }

        fectchCarById()
        fetchDiagnosesByCarId()
    }, [carId])

    return (
        <CarContext.Provider
            value={{ car, setCar, diagnoses, isLoadingCar, isLoadingDiagnoses }}
        >
            {children}
        </CarContext.Provider>
    )
}

export const useCar = () => useContext(CarContext)
