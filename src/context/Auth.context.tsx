// Create a context for the car

import axios from 'axios';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { User, UserRole } from '@/types/User';
import { apiUrl } from '@/constants/env';
import Spinner from '@/components/atoms/Spinner';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isVeryfiyingToken: boolean;
  user: User;
  setUser: (user: User) => void;
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
    role: UserRole.USER,
  },
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVeryfiyingToken, setIsVeryfiyingToken] = useState(true);
  const [user, setUser] = useState<User>({
    email: '',
    _id: '',
    name: '',
    mechanicId: '',
    role: UserRole.USER,
  });

  useEffect(() => {
    const verifyAuthentication = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsVeryfiyingToken(false);
        return;
      }

      try {
        const response = await axios.post(`${apiUrl}/auth/verify-token`, undefined, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      } finally {
        setIsVeryfiyingToken(false);
      }
    };

    verifyAuthentication();
  }, []);

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
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
