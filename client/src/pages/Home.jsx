// `client/src/pages/Home.jsx`
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Brain, Heart, Users, Shield, Sparkles, MessageCircle } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Shield size={48} className="text-primary-500" />,
            title: '100% Anonim',
            description: 'Tidak perlu email, nomor HP, atau data pribadi. Username adalah identitasmu.'
        },
        {
            icon: <Brain size={48} className="text-purple-500" />,
            title: 'Jelajah Diri',
            description: 'Kenali pola emosi dan stressor dalam hidupmu dengan assessment interaktif.'
        },
        {
            icon: <Heart size={48} className="text-red-500" />,
            title: 'Latihan Praktis',
            description: 'Tools berbasis CBT, mindfulness, dan teknik pernapasan untuk mengelola stres.'
        },
        {
            icon: <MessageCircle size={48} className="text-green-500" />,
            title: 'Dinding Cerita',
            description: 'Berbagi dan baca cerita dari teman sebaya dalam ruang yang aman.'
        },
        {
            icon: <Users size={48} className="text-orange-500" />,
            title: 'Komunitas Suportif',
            description: 'Kamu tidak sendirian. Bergabung dengan ribuan remaja lainnya.'
        },
        {
            icon: <Sparkles size={48} className="text-yellow-500" />,
            title: 'Gamifikasi',
            description: 'Kumpulkan poin dan lencana sambil membangun resiliensi mental.'
        }
    ];

    const stats = [
        { value: '15.5 Juta', label: 'Remaja Indonesia Butuh Bantuan' },
        { value: '34.9%', label: 'Mengalami Masalah Mental' },
        { value: '2.6%', label: 'Yang Mencari Bantuan' }
    ];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                                Ruang Aman untuk <span className="text-primary-500">Kesehatan Mentalmu</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                Platform anonim yang membantu remaja Indonesia mengelola stres,
                                kecemasan, dan menemukan kembali kebahagiaan mereka.
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <Button
                                    label="Mulai Sekarang"
                                    icon="pi pi-arrow-right"
                                    className="p-button-lg p-button-primary"
                                    onClick={() => navigate('/register')}
                                />
                                <Button
                                    label="Pelajari Lebih Lanjut"
                                    icon="pi pi-info-circle"
                                    className="p-button-lg p-button-outlined"
                                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                />
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="relative">
                                <Brain size={200} className="text-primary-500" strokeWidth={1} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-8 bg-primary-500 text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        {stats.map((stat, index) => (
                            <div key={index}>
                                <h2 className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</h2>
                                <p className="text-sm opacity-90">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Kenapa Memilih Ruang Rona?</h2>
                        <p className="text-lg text-gray-600">Platform lengkap untuk mendukung kesehatan mental remaja</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="h-full rounded-2xl p-6">
                                <div className="text-center">
                                    <div className="mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 bg-gradient-to-r from-primary-500 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai Perjalananmu?</h2>
                    <p className="text-lg mb-6 opacity-90">Bergabunglah dengan ribuan remaja yang sudah menemukan dukungan di Ruang Rona</p>
                    <Button
                        label="Daftar Gratis Sekarang"
                        icon="pi pi-user-plus"
                        className="p-button-lg p-button-warning p-button-raised"
                        onClick={() => navigate('/register')}
                    />
                    <p className="mt-3 text-sm opacity-80">
                        Sudah punya akun?{' '}
                        <a
                            href="/login"
                            className="text-white font-semibold underline hover:opacity-80"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/login');
                            }}
                        >
                            Masuk di sini
                        </a>
                    </p>
                </div>
            </section>
        </div>
    );
}
