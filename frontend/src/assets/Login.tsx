import './Login.css';
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// 定義 LoginProps 的 interface，指定 url 的類型為 string
interface LoginProps {
  url: string;
}

// 定義 Login component為一個 React Function Component 類型，傳入參數的interface為 LoginProps
const Login: React.FC<LoginProps> = ({ url }) => {

  // useRef 和 useState 是 React Hooks，用於管理 React component 的狀態
  // useRef 和 useState 的差別在於，useState 會觸發 component 的重新渲染，而 useRef 不會
  const userRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useAuth();
  const [ loginUser, setLoginUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // useNavigate 是一個 React Hook，用於導航到其他routes
  const navigate = useNavigate();

  // useEffect 是一個 React Hook，用於在 component render 完成後執行一些副作用的操作
  // 第二個參數為空陣列，表示只在 component render 完成後執行一次。
  useEffect(() => {
    // 這邊做的事情是，當 component render 完成後，會自動聚焦到用戶名稱的輸入框
    userRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // 阻止表單提交的默認行為
    e.preventDefault();
    try {
      // 使用 axios 發送 POST 請求到後端的 /auth/login 路由，並傳入用戶名稱和密碼
      const response = await axios.post(url + 'auth/login', {
        username: loginUser,
        password: pwd
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.status === 201) {
        // setSuccess(true); 
        setUser(response.data);
        navigate('/home');  
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      // 根據不同的錯誤狀態，顯示不同的錯誤訊息
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setErrMsg('用戶不存在');
        } else if (error.response.status === 401) {
          setErrMsg('密碼錯誤');
        } else {
          setErrMsg('登錄失敗，請稍後再試');
        }
      } else {
        setErrMsg('網路錯誤，請檢查您的連接');
      }
    }
  };

  return (
    <div className="container">
      {user ? (
        // 如果已登入，則顯示已登入的畫面
        <div className="logged">
          <div>
            <h1>已登入！</h1>
            <br />
            <p><Link to="/home">回到首頁</Link></p>
          </div>
        </div>
      ) : (
        // 如果未登入，則顯示登入的畫面
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
                onChange={(e) => setLoginUser(e.target.value)}
                value={loginUser}
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
