import './Home.css';
import React from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

// 定義 Home component為一個 React Function Component
const Home: React.FC = () => {
  // 使用useCookies hook來從cookie中讀取名為'user'的cookie值
  const [cookies] = useCookies(['user']);

  // 返回TSX，渲染Home頁面的結構和內容
  return (
    <div className="home">
      <div className="overlay">
        <div className="content-wrapper">
          <h1 className="title">疼痛互動系統</h1>
          <br />
          <br />
          <h2 className="subtitle">
            <strong>疼痛互動系統</strong>是由陽明交通大學學生開發的一個平台，旨在協助用戶有效地管理和記錄疼痛資料。
          </h2>
        </div>
        {!cookies.user ? (
          // 如果沒有'user' cookie，則顯示登入按鈕，並連到/login頁面
          <Link to="/login">
            <button className="login-button">登入</button>
          </Link>
        ) : (
          <>
            {cookies.user === "admin" ? (
              // 如果有'user' cookie，且值為'admin'，顯示管理介面按鈕
              <Link to="/admin">
                <button className="login-button">管理介面</button>
              </Link>
            ) : (
              // 否則顯示疼痛回報按鈕，並連到interact頁面
              <Link to="/interact">
                <button className="login-button">疼痛回報</button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
