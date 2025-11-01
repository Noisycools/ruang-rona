import React from 'react';
import {useNavigate, Link, useLocation} from 'react-router-dom';
import {Menubar} from 'primereact/menubar';
import {Button} from 'primereact/button';
import {Avatar} from 'primereact/avatar';
import {Badge} from 'primereact/badge';
import useAuthStore from '../../store/authStore';
import {Brain} from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const {isAuthenticated, user, logout} = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Menu items untuk authenticated users
    const authenticatedItems = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => navigate('/dashboard'),
            className: location.pathname === '/dashboard' ? 'active-menu-item' : ''
        },
        {
            label: 'Jelajah Diri',
            icon: 'pi pi-compass',
            command: () => navigate('/jelajah-diri'),
            className: location.pathname === '/jelajah-diri' ? 'active-menu-item' : ''
        },
        {
            label: 'Latihan',
            icon: 'pi pi-heart',
            command: () => navigate('/latihan'),
            className: location.pathname === '/latihan' ? 'active-menu-item' : ''
        },
        {
            label: 'Dinding Cerita',
            icon: 'pi pi-comments',
            command: () => navigate('/dinding-cerita'),
            className: location.pathname === '/dinding-cerita' ? 'active-menu-item' : '',
            badge: '3' // Contoh notifikasi
        }
    ];

    // Logo/Brand
    const start = (
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-1 no-underline mr-3">
            <div className="p-2 border-round-lg">
                <Brain size={28} color="#0369a1" strokeWidth={2}/>
            </div>
            <span className="text-2xl font-bold text-primary-700">Ruang Rona</span>
        </Link>
    );

    // Right side content
    const end = (
        <div className="flex items-center gap-2">
            {isAuthenticated ? (
                <>
                    <div className="flex items-center gap-2 mr-3 p-2 bg-primary-50 border-round-lg">
                        <Avatar
                            label={user?.username?.charAt(0).toUpperCase()}
                            className="bg-primary-500 text-white"
                            shape="circle"
                            size="normal"
                        />
                        <span className="font-medium text-gray-800 hidden sm:block">
              {user?.username}
            </span>
                    </div>
                    <Button
                        label="Keluar"
                        icon="pi pi-sign-out"
                        className="p-button-outlined p-button-danger"
                        onClick={handleLogout}
                    />
                </>
            ) : (
                <>
                    <Button
                        label="Masuk"
                        icon="pi pi-sign-in"
                        className="p-button-outlined p-button-primary mr-2"
                        onClick={() => navigate('/login')}
                    />
                    <Button
                        label="Daftar"
                        icon="pi pi-user-plus"
                        className="p-button-primary"
                        onClick={() => navigate('/register')}
                    />
                </>
            )}
        </div>
    );

    return (
        <Menubar
            model={isAuthenticated ? authenticatedItems : []}
            start={start}
            end={end}
            className="border-none shadow-2 border-round-lg"
            style={{background: 'white'}}
        />
    );
}
