import './Home.css';
import React from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

// 定義 Home component為一個 React Function Component
const Home: React.FC = () => {
  // 使用useCookies hook來從cookie中讀取名為'user'的cookie值
  const [cookies] = useCookies(['user']);
  const user = cookies.user;

  //frontendfrohome.tsx

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

    //導覽入口->連接到其他功能
    const features = [
      { title: "疼痛回報", path: "/interact", icon: "📝" },
      { title: "數據統計", path: "/stat", icon: "📊" },
      { title: "心理問卷", path: "/mentalform", icon: "🧠" },
      { title: "心理統計", path: "/mentalstat", icon: "📈" },
      { title: "AI 分析", path: "/analysis", icon: "🤖" },
      { title: "個人資料", path: "/profile", icon: "👤" }
    ];

    return (
      <div className="container mt-4" style={{ maxWidth: '900px' }}>
        <div className="row justify-content-center">
          {features.map((item, index) => (
            <div key={index} className="col-6 col-md-4 mb-4">
              <Link to={item.path} style={{ textDecoration: 'none' }}>
                <div className="feature-card-simple text-center p-3" style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: '0.3s'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>{item.title}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 返回TSX，渲染Home頁面的結構和內容
  return (
    <div className="home">
      <div className="overlay">
        <div className="content-wrapper">
          <h1 className="title">疼痛互動系統</h1>
          <br />
          <h2 className="subtitle">
            <strong>疼痛互動系統</strong>是由陽明交通大學學生開發的一個平台
            <br />旨在協助用戶有效地管理和記錄疼痛資料
          </h2>
          
        </div>
        {renderButton()}
      </div>
    </div>
  );
}

export default Home;
