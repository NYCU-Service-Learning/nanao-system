import { Link } from "react-router-dom";
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth } from '../context/AuthContext';


// 定義一個 Functional Component（函數式組件）Navig，接收 NavigProps 作為參數
const Navig: React.FC = () => {
  const { user } = useAuth();

  return (

    // 使用 React-Bootstrap 的 Navbar 組件來創建導航欄
    // 詳細可以參考 React-Bootstrap 的官方文件
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand>疼痛互動系統</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/home">首頁</Nav.Link>

            {/* 如果 user 是 null，顯示登入按鈕，否則顯示使用者相關選項 */}
            {!user ? (

              // 未登入時顯示的導航鏈接
              <Nav.Link as={Link} to="/login">登入</Nav.Link>
            ) : (

              // 已登入時顯示的導航鏈接
              <>
                {user?.role === "ADMIN" ? (
                  <Nav.Link as={Link} to="/admin">管理介面</Nav.Link>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/interact">疼痛回報</Nav.Link>
                    <Nav.Link as={Link} to="/stat">疼痛統計</Nav.Link>
                  </>
                )}
                <Nav.Link as={Link} to="/profile">{user?.username}</Nav.Link>
                <Nav.Link as={Link} to="/logout">登出</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navig;
