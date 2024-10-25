import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useCookies } from 'react-cookie';
import axios from 'axios';

const Logout = ({ url }) => {

  // 使用 useNavigate 來獲取 react-router 的導航功能
  const navigate = useNavigate();

  // 使用 useCookies 來取得 cookies 的相關功能
  // 這裡我們需要 removeCookie 來刪除 'user' 的 cookie
  // const [cookies, setCookie, removeCookie] = useCookies(['user']);

  // 當組件(component)被渲染時，或 navigate, removeCookie, url 中任一依賴值改變時，useEffect 會觸發
  useEffect(() => {

    // React 的 useEffect 不能直接接受一個 async 函數作為回調，因此要在內部定義一個普通函數，再將其設為async
    const logout = async () => {
      try {

        // 使用 axios 向後端發送登出請求，通知伺服器移除登入狀態
        await axios.delete(url + 'auth/logout', {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        // 成功登出後，移除 'user' 的 cookie，表示前端不再保存使用者狀態
        removeCookie('user');

        // 登出後，重定向使用者到首頁 '/home'
        navigate('/home');
      } catch (error) {
        console.error(error);
      }
    };

    // 調用自定義的函數
    logout();
  }, [navigate, url]);

  return <p>登出中...</p>;
}

export default Logout;
