import React, { ComponentType, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

interface WithAuthRedirectProps {
  user: string | null;
}

const withAuthRedirect = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ComponentWithAuthRedirect = (props: P & WithAuthRedirectProps) => {
    const [cookies] = useCookies(['user']);
    const navigate = useNavigate();

    useEffect(() => {
      if (!cookies.user) {
        navigate('/home');
      }
    }, [cookies, navigate]);

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuthRedirect;
};

export default withAuthRedirect;
