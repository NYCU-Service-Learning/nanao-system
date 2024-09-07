import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Logout = ({ url }) => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.delete(url + 'auth/logout', {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        removeCookie('user');
        navigate('/home');
      } catch (error) {
        console.error(error);
      }
    };

    logout();
  }, [navigate, removeCookie, url]);

  return <p>登出中...</p>;
}

export default Logout;
