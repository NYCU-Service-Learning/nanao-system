import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Logout: React.FC<{ url: string }> = ({ url }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
      const logout = async () => {
          try {
              await axios.delete(`${url}auth/logout`, {
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  withCredentials: true
              });
              setUser(null);
              navigate('/home');
          } catch (error) {
              console.error(error);
          }
      };
      logout();
  }, [navigate, url, setUser]);

  return <p>登出中...</p>;
}

export default Logout;