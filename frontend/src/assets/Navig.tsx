import { Link } from "react-router-dom";
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'; // 👈 新增這行

interface NavigProps {
  user: string | null;
}

const Navig: React.FC<NavigProps> = ({ user }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand>疼痛互動系統</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/home">首頁</Nav.Link>

            {user == null || user == '' ? (
              <Nav.Link as={Link} to="/login">登入</Nav.Link>
            ) : (
              <>
                {user === "admin" ? (
                  <Nav.Link as={Link} to="/admin">管理介面</Nav.Link>
                ) : (
                  <>
                    {/* --- 第一組：紀錄類選單 --- */}
                    <NavDropdown title="紀錄回報" id="report-dropdown">
                      <NavDropdown.Item as={Link} to="/interact">疼痛回報</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/mentalform">心理問卷</NavDropdown.Item>
                    </NavDropdown>

                    {/* --- 第二組：分析類選單 --- */}
                    <NavDropdown title="統計分析" id="analysis-dropdown">
                      <NavDropdown.Item as={Link} to="/stat">疼痛統計</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/mentalstat">心理統計</NavDropdown.Item>
                      <NavDropdown.Divider /> {/* 這是分隔線 */}
                      <NavDropdown.Item as={Link} to="/analysis">AI 深度分析</NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}

                {/* --- 用戶資訊選單 --- */}
                <NavDropdown title={user} id="user-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">個人帳號</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/logout">登出</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navig;
