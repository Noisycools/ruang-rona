import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import useAuthStore from '../store/authStore';
import { Heart, Brain, Sparkles, ShieldCheck } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username harus diisi';
        }

        if (!formData.password) {
            newErrors.password = 'Password harus diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const result = await login(formData);

        if (result.success) {
            navigate('/dashboard');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        clearError();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-pastel-blue/20 to-pastel-lavender/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Illustration Side */}
                    <div className="hidden lg:block bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white p-8 lg:p-12 relative overflow-hidden">
                        <div className="relative z-10 h-full flex flex-col justify-center">
                            {/* Floating Icons */}
                            <div className="absolute top-[10%] left-[10%] animate-bounce">
                                <Heart size={40} className="opacity-70" />
                            </div>
                            <div className="absolute top-[60%] right-[15%] animate-pulse delay-1000">
                                <Sparkles size={35} className="opacity-70" />
                            </div>
                            <div className="absolute bottom-[20%] left-[20%] animate-bounce delay-2000">
                                <Brain size={38} className="opacity-70" />
                            </div>

                            {/* Main Content */}
                            <div className="text-center space-y-6">
                                <div className="inline-block p-4 bg-white/10 rounded-full backdrop-blur-sm">
                                    <Brain size={60} strokeWidth={1.5} />
                                </div>

                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-bold mb-3">Ruang Rona</h1>
                                    <p className="text-lg lg:text-xl opacity-90">
                                        Tempat Aman untuk Kesehatan Mentalmu
                                    </p>
                                </div>

                                <div className="w-24 h-1 bg-white/30 mx-auto rounded-full" />

                                {/* Features */}
                                <div className="mt-8 space-y-4 text-left max-w-sm mx-auto">
                                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <ShieldCheck size={24} className="flex-shrink-0" />
                                        <span className="text-sm lg:text-base">100% Anonim & Privat</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <Heart size={24} className="flex-shrink-0" />
                                        <span className="text-sm lg:text-base">Dukungan Emosional 24/7</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <Sparkles size={24} className="flex-shrink-0" />
                                        <span className="text-sm lg:text-base">Latihan & Tools Interaktif</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-6 sm:p-8 lg:p-12 animate-slideInRight">
                        <div className="max-w-md mx-auto">
                            {/* Mobile Logo */}
                            <div className="lg:hidden text-center mb-6">
                                <div className="inline-block p-3 bg-primary-100 rounded-full mb-3">
                                    <Brain size={40} className="text-primary-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Ruang Rona</h2>
                            </div>

                            {/* Header */}
                            <div className="text-center mb-6 lg:mb-8">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                                    Selamat Datang Kembali
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Masuk ke akunmu untuk melanjutkan perjalanan
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <Message
                                    severity="error"
                                    text={error}
                                    className="w-full mb-4"
                                />
                            )}

                            {/* Login Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Username Field */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <span className="flex items-center gap-2 w-full">
                                        <i className="pi pi-user" />
                                        <InputText
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Masukkan username kamu"
                                            className={`w-full ${errors.username ? 'p-invalid' : ''}`}
                                            disabled={isLoading}
                                        />
                                    </span>
                                    {errors.username && (
                                        <small className="text-red-500 text-xs mt-1 block">{errors.username}</small>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div class="w-full">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <Password
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Masukkan password kamu"
                                        toggleMask
                                        feedback={false}
                                        className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                                        inputClassName="w-full"
                                        disabled={isLoading}
                                    />
                                    {errors.password && (
                                        <small className="text-red-500 text-xs mt-1 block">{errors.password}</small>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="text-center bg-primary-500">
                                <Button
                                    type="submit"
                                    label={isLoading ? 'Memproses...' : 'Masuk'}
                                    icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
                                    className="p-button-lg p-button-primary mt-6"
                                    disabled={isLoading}
                                />
                                </div>
                            </form>

                            {/* Divider */}
                            <div className="my-6">
                                <Divider>
                                    <span className="text-gray-500 text-xs sm:text-sm px-2">ATAU</span>
                                </Divider>
                            </div>

                            {/* Register Link */}
                            <div className="text-center">
                                <p className="text-sm sm:text-base text-gray-600">
                                    Belum punya akun?{' '}
                                    <Link
                                        to="/register"
                                        className="text-primary-500 font-semibold hover:text-primary-700 transition-colors"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-primary-500">
                                <div className="flex gap-3">
                                    <i className="pi pi-info-circle text-primary-500 mt-0.5 flex-shrink-0"></i>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-700">
                                            <strong>Privasi Terjamin:</strong> Kami tidak akan pernah membagikan
                                            informasi akunmu. Username kamu sepenuhnya anonim.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
