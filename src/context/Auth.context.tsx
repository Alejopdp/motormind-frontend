// Create a context for the car

import axios from 'axios'
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react'
import { Spinner } from 'react-bootstrap'
import { User } from '../types/User'
import { apiUrl } from '../constants/env'

interface AuthContextType {
    isAuthenticated: boolean
    setIsAuthenticated: (isAuthenticated: boolean) => void
    isVeryfiyingToken: boolean
    user: User
    setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    isVeryfiyingToken: true,
    user: {
        email: '',
        _id: '',
        name: '',
        mechanicId: '',
    },
    setUser: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider: React.FC<PropsWithChildren> = ({
    children,
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isVeryfiyingToken, setIsVeryfiyingToken] = useState(true)
    const [user, setUser] = useState<User>({
        email: '',
        _id: '',
        name: '',
        mechanicId: '',
    })

    useEffect(() => {
        const verifyAuthentication = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                setIsVeryfiyingToken(false)
                return
            }

            try {
                const response = await axios.post(
                    `${apiUrl}/auth/verify-token`,
                    undefined,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                setIsAuthenticated(true)
                setUser(response.data.user)
            } catch (error) {
                console.error(error)
                setIsAuthenticated(false)
                localStorage.removeItem('token')
            } finally {
                setIsVeryfiyingToken(false)
            }
        }

        verifyAuthentication()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                isVeryfiyingToken,
                user,
                setUser,
            }}
        >
            {isVeryfiyingToken ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: '100vh' }}
                >
                    <Spinner
                        className="absolute top-1/2 left-1/2"
                        animation="border"
                    />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}
