import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/context/Auth.context';
import { apiUrl } from '@/constants/env';
import Spinner from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';

const VerifyLogin = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [isVeryfiyingToken, setIsVeryfiyingToken] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const loadTokenVerification = async () => {
      try {
        const token = search.get('token');

        if (!token) {
          setError(true);
          setIsVeryfiyingToken(false);
          return;
        }

        const res = await verifyToken(token);

        if (res) {
          saveToken(res.token);
          setUser(res.user);
          setIsAuthenticated(true);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }

      setIsVeryfiyingToken(false);
    };

    loadTokenVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const verifyToken = async (token: string) => {
    const res = await axios.post(`${apiUrl}/auth/verify-magic-link?token=${token}`);
    return res.data;
  };

  const saveToken = (token: string) => {
    localStorage.setItem('token', token);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {isVeryfiyingToken && (
        <div className="flex flex-col items-center gap-4">
          <Spinner label="Estamos validando tu inicio de sesión" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-red-100 p-4">
            <div className="mr-2">
              <Info size={16} className="text-destructive" />
            </div>
            <p className="text-destructive text-md m-0 font-medium">
              Al parecer el link ha expirado o es incorrecto. Por favor, intenta nuevamente
            </p>
          </div>
          <Button onClick={() => navigate('/login')}>Iniciar sesión</Button>
        </div>
      )}
    </div>
  );
};

export default VerifyLogin;
