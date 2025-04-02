import { Link, Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { useAuth } from './context/Auth.context'
import { Settings } from 'lucide-react'
import { UserRole } from './types/User'
const Layout = () => {
    const { isAuthenticated, user } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <Link className="navbar-brand" to="/">
                        <img
                            src="/logo_motormind.png"
                            alt="Motormind"
                            style={{ width: '150px' }}
                        />
                    </Link>
                    <div>
                        {(user.role === UserRole.ADMIN ||
                            user.role === UserRole.SUPER_ADMIN) && (
                            <Link
                                to="/configuration"
                                className="btn btn-light d-flex align-items-center gap-2"
                            >
                                <Settings size={16} /> Configuración
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
