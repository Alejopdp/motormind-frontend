import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <Link className="navbar-brand" to="/">
                    Motormind
                </Link>
            </nav>
            <div className="container mt-4">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
