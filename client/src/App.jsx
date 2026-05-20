import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';

const ProtectedRoute = ({ children }) => {
    const token = useAuthStore(state => state.token);
    if (!token) return <Navigate to="/login" replace />;
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
            <AppLayout>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                </Routes>
            </AppLayout>
        </BrowserRouter>
    );
}

export default App;
