import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { message } from 'antd'; 
import { instance } from '../api/APIUtils';

const AxiosInterceptor = () => {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(['user']);

  useEffect(() => {
    const interceptor = instance.interceptors.response.use(
      (response) => response, 
      (error) => {
        if (error.response) {
          const status = error.response.status;
          
          switch (status) {
            case 401:
              if (!error.config.url.includes('/auth/login')) {
                message.error('登入逾時，請重新登入');
                removeCookie('user', { path: '/' });
                navigate('/login');
              }
              break;
            case 403:
              message.warning('權限不足，無法執行此操作');
              break;
            case 404:
              message.error('找不到請求的資源 (404)');
              break;
            case 500:
              message.error('系統伺服器發生異常，請稍後再試 (500)');
              break;
            default:
              message.error(`發生未知的系統錯誤 (${status})`);
          }
        } else {
          message.error('網路連線失敗，請檢查您的網路狀態或聯絡管理員');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.response.eject(interceptor);
    };
  }, [navigate, removeCookie]);

  return null; 
};

export default AxiosInterceptor;