import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
import React from 'react';

import Home from './assets/Home';
import Interact from './assets/Interact/Interact';
import Login from './assets/Login';
import Logout from './assets/Logout';
import Navig from './assets/Navig';
import NotFound from './assets/NotFound';
import Profile from './assets/Profile';
import Admin from './assets/Admin';
import Stat from './assets/Stat';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import withAuthRedirect from './assets/withAuthRedirect';

const InteractWithAuth = withAuthRedirect(Interact);
const ProfileWithAuth = withAuthRedirect(Profile);
const AdminWithAuth = withAuthRedirect(Admin);
const StatWithAuth = withAuthRedirect(Stat);

function App() {
  const url = "http://localhost:3000/";
  const [cookies] = useCookies(["user"]);

  return (
    <CookiesProvider>
      <Router>
        <div className="App">
          <div className="toplb">
            <Navig user={cookies.user} />
          </div>
          
          <div className="content">          
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/interact" element={<InteractWithAuth user={cookies.user} />} />
              <Route path="/login" element={<Login url={url} />} />
              <Route path="/logout" element={<Logout url={url} />} />
              <Route path="/profile" element={<ProfileWithAuth user={cookies.user} url={url} />} />
              <Route path="/admin" element={<AdminWithAuth user={cookies.user} url={url} />} />
              <Route path="/stat" element={<StatWithAuth user={cookies.user} url={url} />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CookiesProvider>
  );
}

export default App;
