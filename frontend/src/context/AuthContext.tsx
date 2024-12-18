// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthenticatedUser {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthenticatedUser | null>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const url = "http://localhost:3000/";

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get(`${url}auth/verify`, { withCredentials: true });
        console.log('verifyAuth response:', response.data);
        if (response.status === 200 && response.data.id) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Authentication verification failed', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, [url]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
