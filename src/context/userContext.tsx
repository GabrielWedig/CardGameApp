'use client';

import { toastError } from '@/lib/toast';
import apiClient from '@/services/apiClient';
import { User } from '@/types/user';
import { createContext, useContext, useEffect, useState } from 'react';

interface ContextProps {
  user?: User;
  setUserData: () => void;
  logout: () => void;
}

interface ProviderProps {
  children: React.ReactNode;
}

export const UserContext = createContext<ContextProps>({} as ContextProps);

export const UserProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setUserData();
    }
  }, []);

  const setUserData = () =>
    apiClient
      .get('auth/me')
      .then((res) => setUser(res.data))
      .catch((err) => toastError(err.response?.data?.message));

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(undefined);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUserData,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
