import { CircleCheckBig } from 'lucide-react';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/constants/env';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!linkSent) return;

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, linkSent]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSendingMagicLink(true);

    try {
      const res = await axios.post(`${apiUrl}/auth/magic-link`, { email });

      if (res) {
        setLinkSent(true);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Ocurrió un error al enviar el link. Por favor, intenta nuevamente.', {
        variant: 'error',
      });
    } finally {
      setIsSendingMagicLink(false);
    }
  };

  const title = linkSent ? 'Enlace enviado' : 'Accede a tu cuenta';
  const subtitle = linkSent
    ? 'Revisa tu correo electrónico para continuar'
    : 'Te enviaremos un enlace a tu correo para iniciar sesión';
  const content = linkSent ? (
    <>
      <div className="mx-auto flex max-w-[600px] flex-col gap-4">
        <div className="flex items-start gap-2 bg-green-100 p-4">
          <div className="mr-2">
            <CircleCheckBig size={16} color="#4ADE80" />
          </div>
          <p className="mb-0 text-sm font-medium text-green-500">
            Hemos enviado un enlace a tu correo electrónico para que puedas acceder a tu cuenta. Por
            favor, revisa tu bandeja de entrada y sigue las instrucciones para acceder a tu cuenta.
          </p>
        </div>

        <p className="m-0 text-center text-gray-500">¿No encuentras nuestro email?</p>

        <button
          className="font-medium text-gray-900 no-underline hover:underline disabled:text-gray-400"
          onClick={() => {
            handleSubmit();
            setTimer(30);
          }}
          disabled={timer > 0}
        >
          {timer > 0 ? `Reenviar email (${timer}s)` : 'Reenviar email'}
        </button>
      </div>
    </>
  ) : (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="email" className="mb-1 block">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-gray-900 py-2 text-white hover:bg-gray-800 disabled:bg-gray-400"
        disabled={isSendingMagicLink}
      >
        {isSendingMagicLink ? 'Enviando...' : 'Enviar enlace'}
      </button>
    </form>
  );

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gray-100 px-5">
      <div>
        <div className="mb-4 text-center">
          <img src="/logo_motormind.png" alt="Motormind" className="mb-5 w-[200px]" />
          <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
          <p className="text-gray-500">{subtitle}</p>
        </div>
        <div className="mx-auto rounded-lg bg-white p-4 shadow sm:w-1/2">{content}</div>
      </div>
    </div>
  );
};

export default Login;
