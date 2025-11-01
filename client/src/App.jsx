// `client/src/App.jsx`
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JelajahDiri from './pages/JelajahDiri';
import Exercises from './pages/Exercises';
import DindingCerita from './pages/DindingCerita';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/jelajah-diri"
                            element={
                                <PublicRoute>
                                    <JelajahDiri />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/latihan"
                            element={
                                <ProtectedRoute>
                                    <Exercises />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dinding-cerita"
                            element={
                                <ProtectedRoute>
                                    <DindingCerita />
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
