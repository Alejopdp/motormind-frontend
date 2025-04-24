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
  logout: () => Promise<void>;
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
  logout: async () => {},
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

  const logout = async () => {
    try {
      await axios.post(`${apiUrl}/auth/logout`, undefined, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser({
        email: '',
        _id: '',
        name: '',
        mechanicId: '',
        role: UserRole.USER,
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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
        logout,
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
