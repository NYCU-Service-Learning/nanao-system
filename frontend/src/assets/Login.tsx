import './Login.css';
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import axios from 'axios';

interface LoginProps {
  url: string;
}

const Login: React.FC<LoginProps> = ({ url }) => {
  const userRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [cookies, setCookie] = useCookies(['user']);
  const navigate = useNavigate();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    if (success) {
      const expires = new Date();
      expires.setTime(expires.getTime() + 60 * 60 * 1000); 
      setCookie("user", user, { path: "/", expires });
      navigate('/home');  
    }
  }, [success, user, navigate, setCookie]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + 'auth/login', {
        username: user,
        password: pwd
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.status === 201) {
        setSuccess(true); 
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

      setSuccess(false); 
    }
  };

  return (
    <div className="container">
      {cookies.user ? (
        <div className="logged">
          <div>
            <h1>已登入！</h1>
            <br />
            <p><Link to="/home">回到首頁</Link></p>
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
              <div aria-live="assertive" className={errMsg ? "errmsg" : "offscreen"}>
                {errMsg}
              </div>
              <button type="submit">送出</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
