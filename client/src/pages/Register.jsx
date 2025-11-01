import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { Checkbox } from 'primereact/checkbox';
import useAuthStore from '../store/authStore';
import { Heart, Brain, Sparkles, UserPlus, ShieldCheck, Lock } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username harus diisi';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username minimal 3 karakter';
        } else if (formData.username.length > 20) {
            newErrors.username = 'Username maksimal 20 karakter';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username hanya boleh huruf, angka, dan underscore';
        }

        if (!formData.password) {
            newErrors.password = 'Password harus diisi';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password harus diisi';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password tidak cocok';
        }

        if (!agreedToTerms) {
            newErrors.terms = 'Kamu harus menyetujui syarat dan ketentuan';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const result = await register({
            username: formData.username,
            password: formData.password
        });

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

    const passwordHeader = <div className="font-bold mb-3 text-sm">Pilih Password yang Kuat</div>;
    const passwordFooter = (
        <>
            <Divider />
            <p className="mt-2 text-xs font-semibold">Saran:</p>
            <ul className="pl-2 ml-2 mt-1 text-xs space-y-1">
                <li>• Minimal 6 karakter</li>
                <li>• Kombinasi huruf dan angka</li>
                <li>• Hindari informasi pribadi</li>
            </ul>
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-pastel-mint/20 to-pastel-peach/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Illustration Side */}
                    <div className="hidden lg:block bg-gradient-to-br from-green-600 via-green-500 to-teal-600 text-white p-8 lg:p-12 relative overflow-hidden">
                        <div className="relative z-10 h-full flex flex-col justify-center">
                            {/* Floating Icons */}
                            <div className="absolute top-[15%] left-[15%] animate-bounce">
                                <Sparkles size={40} className="opacity-70" />
                            </div>
                            <div className="absolute top-[55%] right-[10%] animate-pulse delay-1500">
                                <Heart size={35} className="opacity-70" />
                            </div>
                            <div className="absolute bottom-[25%] left-[25%] animate-bounce delay-2500">
                                <ShieldCheck size={38} className="opacity-70" />
                            </div>

                            {/* Main Content */}
                            <div className="text-center space-y-6">
                                <div className="inline-block p-4 bg-white/10 rounded-full backdrop-blur-sm">
                                    <UserPlus size={60} strokeWidth={1.5} />
                                </div>

                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-bold mb-3">Mulai Perjalananmu</h1>
                                    <p className="text-lg lg:text-xl opacity-90">
                                        Bergabung dengan ribuan remaja lainnya di Ruang Rona
                                    </p>
                                </div>

                                <div className="w-24 h-1 bg-white/30 mx-auto rounded-full" />

                                {/* Features */}
                                <div className="mt-8 space-y-4 text-left max-w-sm mx-auto">
                                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <Lock size={24} className="flex-shrink-0" />
                                        <span className="text-sm lg:text-base">Registrasi Anonim & Cepat</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <Brain size={24} className="flex-shrink-0" />
                                        <span className="text-sm lg:text-base">Akses Tools Kesehatan Mental</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <Heart size={24} className="flex-shrink-0" />
                                        <span className="text-sm lg:text-base">Komunitas yang Mendukung</span>
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
                    <div className="p-6 sm:p-8 lg:p-12 animate-slideInRight overflow-y-auto max-h-screen lg:max-h-none">
                        <div className="max-w-md mx-auto">
                            {/* Mobile Logo */}
                            <div className="lg:hidden text-center mb-6">
                                <div className="inline-block p-3 bg-green-100 rounded-full mb-3">
                                    <UserPlus size={40} className="text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Ruang Rona</h2>
                            </div>

                            {/* Header */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                                    Daftar Akun Baru
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Cukup username dan password, tanpa data pribadi
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

                            {/* Register Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Username Field */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                        Username <span className="text-red-500">*</span>
                                    </label>
                                    <span className="flex gap-2 w-full">
                                        <i className="pi pi-user" />
                                        <InputText
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Pilih username unik (3-20 karakter)"
                                            className={`w-full ${errors.username ? 'p-invalid' : ''}`}
                                            disabled={isLoading}
                                        />
                                    </span>
                                    {errors.username && (
                                        <small className="text-red-500 text-xs mt-1 block">{errors.username}</small>
                                    )}
                                    <small className="text-gray-500 text-xs mt-1 block">
                                        Username ini akan menjadi identitas anonim kamu
                                    </small>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <Password
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Buat password (min. 6 karakter)"
                                        toggleMask
                                        header={passwordHeader}
                                        footer={passwordFooter}
                                        className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                                        inputClassName="w-full"
                                        disabled={isLoading}
                                    />
                                    {errors.password && (
                                        <small className="text-red-500 text-xs mt-1 block">{errors.password}</small>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Konfirmasi Password <span className="text-red-500">*</span>
                                    </label>
                                    <Password
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Ketik ulang password kamu"
                                        toggleMask
                                        feedback={false}
                                        className={`w-full ${errors.confirmPassword ? 'p-invalid' : ''}`}
                                        inputClassName="w-full"
                                        disabled={isLoading}
                                    />
                                    {errors.confirmPassword && (
                                        <small className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</small>
                                    )}
                                </div>

                                {/* Terms & Conditions */}
                                <div className="pt-2">
                                    <div className="flex items-start gap-2">
                                        <Checkbox
                                            inputId="terms"
                                            checked={agreedToTerms}
                                            onChange={(e) => {
                                                setAgreedToTerms(e.checked);
                                                if (errors.terms) {
                                                    setErrors(prev => ({ ...prev, terms: '' }));
                                                }
                                            }}
                                            className={`mt-0.5 ${errors.terms ? 'p-invalid' : ''}`}
                                            disabled={isLoading}
                                        />
                                        <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700">
                                            Saya setuju dengan{' '}
                                            <a href="#" className="text-green-600 font-medium hover:underline">
                                                Syarat & Ketentuan
                                            </a>{' '}
                                            dan{' '}
                                            <a href="#" className="text-green-600 font-medium hover:underline">
                                                Kebijakan Privasi
                                            </a>
                                        </label>
                                    </div>
                                    {errors.terms && (
                                        <small className="text-red-500 text-xs block mt-1 ml-6">{errors.terms}</small>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    label={isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
                                    icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'}
                                    className="w-full p-button-lg p-button-success mt-4"
                                    disabled={isLoading}
                                />
                            </form>

                            {/* Divider */}
                            <div className="my-5">
                                <Divider>
                                    <span className="text-gray-500 text-xs sm:text-sm px-2">ATAU</span>
                                </Divider>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <p className="text-sm sm:text-base text-gray-600">
                                    Sudah punya akun?{' '}
                                    <Link
                                        to="/login"
                                        className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                                    >
                                        Masuk Sekarang
                                    </Link>
                                </p>
                            </div>

                            {/* Privacy Notice */}
                            <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <div className="flex gap-3">
                                    <i className="pi pi-shield text-green-600 mt-0.5 flex-shrink-0"></i>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-700">
                                            <strong>100% Anonim:</strong> Kami tidak meminta email, nomor HP,
                                            atau data pribadi apapun. Username kamu adalah identitas anonimmu.
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
