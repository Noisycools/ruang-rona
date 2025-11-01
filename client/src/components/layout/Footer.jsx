// `client/src/components/layout/Footer.jsx`
import React from 'react';
import { Divider } from 'primereact/divider';
import { Brain, Heart, Shield } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white">
            <Divider />
            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-primary-500 p-2 rounded-lg">
                                <Brain size={24} color="white" strokeWidth={2} />
                            </div>
                            <span className="text-xl font-bold text-primary-700">Ruang Rona</span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Platform kesehatan mental yang aman, anonim, dan mendukung untuk remaja Indonesia.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-gray-800 font-semibold mb-3">Tautan Cepat</h4>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-2">
                                <a href="#" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">Tentang Kami</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">Cara Kerja</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">Pusat Bantuan</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-gray-600 hover:text-primary-500 text-sm transition-colors">Hubungi Kami</a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Trust */}
                    <div>
                        <h4 className="text-gray-800 font-semibold mb-3">Privasi & Keamanan</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Shield size={20} className="text-green-500" />
                                <span className="text-sm text-gray-600">100% Anonim</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart size={20} className="text-red-500" />
                                <span className="text-sm text-gray-600">Data Terenkripsi</span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <a href="#" className="text-gray-600 hover:text-primary-500 text-sm block mb-1 transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="text-gray-600 hover:text-primary-500 text-sm block transition-colors">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>

                <Divider className="my-4" />

                <div className="text-center">
                    <p className="text-gray-600 text-sm m-0">
                        © {currentYear} Ruang Rona. Dibuat dengan <Heart size={14} className="inline text-red-500" /> untuk kesehatan mental remaja Indonesia.
                    </p>
                </div>
            </div>
        </footer>
    );
}
