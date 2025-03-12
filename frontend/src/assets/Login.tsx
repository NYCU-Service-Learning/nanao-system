import './Login.css';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { API_URL } from '../config';

const Login: React.FC = () => {
  const userRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [cookies, setCookie] = useCookies(['user']);
  const navigate = useNavigate();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  const setUserCookie = useCallback((username: string) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 60 * 60 * 1000);
    setCookie('user', username, {
      path: '/',
      expires,
      sameSite: 'lax',
    });
  }, [setCookie]);

  useEffect(() => {
    const handleOAuthLogin = (loginType: string, failureMessage: string) => {
      const urlParams = new URLSearchParams(window.location.search);
      const loginStatus = urlParams.get(loginType);
      const username = urlParams.get('username');
      if (loginStatus === 'success' && username) {
        setUserCookie(username);
        navigate('/home');
      } else if (loginStatus === 'failed' || loginStatus === 'error') {
        setErrMsg(failureMessage);
      }
    }

    handleOAuthLogin('googleLogin', 'Google 登入失敗，請重試');
    handleOAuthLogin('lineLogin', 'Line 登入失敗，請重試');
  }, [navigate, setUserCookie]);

  // 在組件掛載時檢查狀態
  useEffect(() => {
    // 添加一個狀態檢查函數
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}auth/status`, {
          withCredentials: true
        });

        if (response.data.status === 'success') {
          setUserCookie(response.data.user.username);
          navigate('/home');
        }
      } catch (error) {
        console.error('Auth status check failed:', error);
      }
    };

    checkAuthStatus();
  }, [navigate, setUserCookie]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}auth/login`,
        {
          username: user,
          password: pwd,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setUserCookie(user);
        navigate('/home');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setErrMsg('用戶不存在');
        } else if (error.response.status === 401) {
          setErrMsg('密碼錯誤');
        } else {
          setErrMsg('登錄失敗，請稍後再試');
        }
      } else {
        setErrMsg('網絡錯誤，請檢查您的連接');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}auth/google/login`;
  };

  const handleLineLogin = () => {
    window.location.href = `${API_URL}auth/line/login`;
  };

  return (
    <div className="container">
      {cookies.user ? (
        <div className="logged">
          <div>
            <h1>已登入！</h1>
            <br />
            <p>
              <Link to="/home">回到首頁</Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="center">
          <div className="login">
            <h1>登入</h1>
            <br />
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">帳號：</label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />
              <label htmlFor="password">密碼：</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
              <div
                aria-live="assertive"
                className={errMsg ? 'errmsg' : 'offscreen'}>
                {errMsg}
              </div>
              <button type="submit">送出</button>
            </form>

            <div className="divider">
              <span>或</span>
            </div>

            <button
              className="gsi-material-button"
              onClick={handleGoogleLogin}
              type="button">
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    style={{ display: 'block' }}>
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents">
                  使用 Google 登入
                </span>
              </div>
            </button>
            <button
              className="gsi-material-button"
              onClick={handleLineLogin}
              type="button">
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    style={{ display: 'block' }}>
                    <path
                      fill="#00B900"
                      d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                    />
                  </svg>
                </div>
                <span className="gsi-material-button-contents">
                  使用 Line 登入
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
