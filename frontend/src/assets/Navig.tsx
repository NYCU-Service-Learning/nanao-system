import { Link } from "react-router-dom";
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

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
            {user == null ? (
              <Nav.Link as={Link} to="/login">登入</Nav.Link>
            ) : (
              <>
                {user === "admin" ? (
                  <Nav.Link as={Link} to="/admin">管理介面</Nav.Link>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/interact">疼痛回報</Nav.Link>
                    <Nav.Link as={Link} to="/stat">疼痛統計</Nav.Link>
                  </>
                )}
                <Nav.Link as={Link} to="/profile">{user}</Nav.Link>
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
