import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold sm:text-6xl">404</h1>
        <h2 className="text-primary mb-2 text-xl font-semibold sm:text-2xl">
          ¡Página no encontrada!
        </h2>
        <p className="text-muted mx-5 mb-6">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="bg-primary inline-block rounded-lg px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-500"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
