import React, { ComponentType, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

interface WithAuthRedirectProps {
  user: string | null;
}

// 定義一個高階的componenet(HOC)，用於當沒有使用者資訊時，重新導向到指定路徑
const withAuthRedirect = <P extends object>(WrappedComponent: ComponentType<P>) => {

  // 定義component，這個component會檢查是否存在 cookie 中的使用者資訊
  const ComponentWithAuthRedirect = (props: P & WithAuthRedirectProps) => {

    // 使用 useCookies 來取得 'user' 這個 cookie 的值
    const [cookies] = useCookies(['user']);

    // 使用 useNavigate 來獲取 react-router 的導航功能
    const navigate = useNavigate();

    // 當組件被渲染時，檢查 cookie 中是否存在使用者資訊，如果不存在則重定向到 '/home'
    // cookies, navigate變數的改變，都會使useEffect觸發從而檢查cookies是否存在使用者資訊
    useEffect(() => {
      if (!cookies.user) {
        navigate('/home');
      }
    }, [cookies, navigate]);

    // 如果使用者已登入（有 cookie 資訊），則渲染被包裹的元件
    return <WrappedComponent {...props} />;
  };

  // 返回帶有重新導向邏輯的component
  return ComponentWithAuthRedirect;
};

export default withAuthRedirect;
