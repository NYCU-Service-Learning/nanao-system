import './Home.css';
import React from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [cookies] = useCookies(['user']);

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
          <Link to="/login">
            <button className="login-button">登入</button>
          </Link>
        ) : (
          <>
            {cookies.user === "admin" ? (
              <Link to="/admin">
                <button className="login-button">管理介面</button>
              </Link>
            ) : (
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
