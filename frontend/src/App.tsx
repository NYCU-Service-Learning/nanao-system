// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import Home from './assets/Home';
import Interact from './assets/Interact/Interact';
import Login from './assets/Login';
import Logout from './assets/Logout';
import Navig from './assets/Navig';
import NotFound from './assets/NotFound';
import Profile from './assets/Profile';
import Admin from './assets/Admin';
import Setting from './assets/Setting';
import Stat from './assets/Stat';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import withAuthRedirect from './assets/withAuthRedirect';

import { AuthProvider, useAuth } from './context/AuthContext';

const InteractWithAuth = withAuthRedirect(Interact);
const ProfileWithAuth = withAuthRedirect(Profile);
const AdminWithAuth = withAuthRedirect(Admin);
const StatWithAuth = withAuthRedirect(Stat);
const SettingWithAuth = withAuthRedirect(Setting);

function AppRoutes() {
    const { user } = useAuth();
    const url = "http://localhost:3000/";

    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/interact" element={<InteractWithAuth url={url} />} />
            <Route path="/login" element={<Login url={url} />} />
            <Route path="/logout" element={<Logout url={url} />} />
            <Route path="/profile" element={<ProfileWithAuth url={url} user={user ? user.username : null} />} />
            <Route path="/admin" element={<AdminWithAuth url={url} />} />
            <Route path="/setting" element={<SettingWithAuth url={url} />} />
            <Route path="/stat" element={<StatWithAuth url={url} />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <div className="toplb">
                        <Navig />
                    </div>
                    
                    <div className="content">          
                        <AppRoutes />
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
