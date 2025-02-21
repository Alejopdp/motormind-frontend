// Create a context for the car

import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useState,
} from 'react'

interface CarContextType {
    car: any
    setCar: (car: any) => void
}

const CarContext = createContext<CarContextType>({
    car: {},
    setCar: () => {},
})

export const CarProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [car, setCar] = useState<any>({})

    return (
        <CarContext.Provider value={{ car, setCar }}>
            {children}
        </CarContext.Provider>
    )
}

export const useCar = () => useContext(CarContext)
