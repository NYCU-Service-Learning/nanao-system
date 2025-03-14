import './Home.css';
import React from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

// 定義 Home component為一個 React Function Component
const Home: React.FC = () => {
  // 使用useCookies hook來從cookie中讀取名為'user'的cookie值
  const [cookies] = useCookies(['user']);
  const user = cookies.user;

  const renderButton = () => {
    if (!user) {
      return (
        <Link to="/login">
          <button className="login-button">登入</button>
        </Link>
      )
    }

    if (user === 'admin') {
      return (
        <Link to="/admin">
          <button className="login-button">管理介面</button>
        </Link>
      )
    }

    return (
      <Link to="/interact">
        <button className="login-button">疼痛回報</button>
      </Link>
    )
  }

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
        {renderButton()}
      </div>
    </div>
  );
}

export default Home;
