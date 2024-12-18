// src/assets/withAuthRedirect.tsx
import React, { ComponentType, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ClipLoader } from "react-spinners";

interface WithAuthRedirectProps {
  url: string;
}

const withAuthRedirect = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ComponentWithAuthRedirect = (props: P & WithAuthRedirectProps) => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const url = props.url || "http://localhost:3000/";

    useEffect(() => {
      const verifyAuth = async () => {
        try {
          const response = await axios.get(`${url}auth/verify`, { withCredentials: true });
          if (response.status === 200) {
            setUser(response.data);
            setAuthenticated(true);
          }
        } catch (error) {
          console.error('Authentication verification failed', error);
          setAuthenticated(false);
          navigate('/home');
        }
      };
      verifyAuth();
    }, [navigate, url, setUser]);

    if (authenticated === null) {
      return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <ClipLoader color="#36D7B7" size={50} />
          </div>
      );
  }

    if (authenticated) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  return ComponentWithAuthRedirect;
};

export default withAuthRedirect;
