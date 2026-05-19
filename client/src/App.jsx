import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuthStore } from './store/useAuthStore';

const ProtectedRoute = ({ children }) => {
    const token = useAuthStore(state => state.token);
    if (!token) return <Navigate to="/" replace />;
    return children;
};

const PublicRoute = ({ children }) => {
    const token = useAuthStore(state => state.token);
    if (token) return <Navigate to="/dashboard" replace />;
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PublicRoute><AuthPage /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
