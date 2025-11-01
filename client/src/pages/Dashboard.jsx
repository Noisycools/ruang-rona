// `client/src/pages/Dashboard.jsx`
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import useAuthStore from '../store/authStore';
import { Brain, Heart, MessageCircle, TrendingUp, Award, Calendar } from 'lucide-react';
import { getRecentActivities } from '../api/activity';
import { getOverallExerciseProgress } from '../api/exercise';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [activities, setActivities] = useState([]);
    const [loadingActivity, setLoadingActivity] = useState(true);

    const quickActions = [
        {
            title: 'Jelajah Diri',
            description: 'Kenali pola emosi dan stressor kamu',
            icon: <Brain size={40} className="text-blue-600" />,
            path: '/jelajah-diri',
            color: 'bg-blue-50',
            badge: 'Baru'
        },
        {
            title: 'Latihan Harian',
            description: '5 menit meditasi untuk ketenangan',
            icon: <Heart size={40} className="text-red-500" />,
            path: '/latihan',
            color: 'bg-red-50'
        },
        {
            title: 'Dinding Cerita',
            description: 'Baca cerita dari teman sebaya',
            icon: <MessageCircle size={40} className="text-green-500" />,
            path: '/dinding-cerita',
            color: 'bg-green-50',
            badge: '3 Baru'
        }
    ];

    const userStreak = 7; // Example streak days
    const completedExercises = 12;
    const totalExercises = 20;
    const progressPercentage = (completedExercises / totalExercises) * 100;

    const timeAgo = (iso) => {
        if (!iso) return '-';
        const diff = Date.now() - new Date(iso).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1) return 'baru saja';
        if (m < 60) return `${m} menit yang lalu`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h} jam yang lalu`;
        const d = Math.floor(h / 24);
        if (d === 1) return 'Kemarin';
        return `${d} hari yang lalu`;
    };

    useEffect(() => {
        const load = async () => {
            const data = await getRecentActivities();
            setActivities(data);
            setLoadingActivity(false);
        };
        load();
    }, []);

    const activityStyle = {
        exercise: {
            bg: 'bg-blue-50',
            icon: <i className="pi pi-check-circle text-blue-400" style={{ fontSize: '1.5rem' }} />
        },
        story: {
            bg: 'bg-green-50',
            icon: <i className="pi pi-heart text-green-400" style={{ fontSize: '1.5rem' }} />
        },
        assessment: {
            bg: 'bg-purple-50',
            icon: <i className="pi pi-compass text-purple-400" style={{ fontSize: '1.5rem' }} />
        }
    };

    const [overallProgress, setOverallProgress] = React.useState({
        total: 0,
        completed: 0,
        percent: 0,
    });

    React.useEffect(() => {
        const load = async () => {
            const data = await getOverallExerciseProgress();
            setOverallProgress(data);
        };
        load();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-6 py-6">
            {/* Welcome Header */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            Selamat Datang Kembali, {user?.username}! 👋
                        </h1>
                        <p className="text-gray-600 text-lg">Bagaimana perasaanmu hari ini?</p>
                    </div>
                </div>
            </div>

            {/* Progress Card */}
            {/* <Card className="mb-5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <TrendingUp size={24} className="text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-800 m-0">Progress Minggu Ini</h3>
                    </div>
                    <Badge value={`${completedExercises}/${totalExercises}`} severity="info" />
                </div>
                <ProgressBar value={progressPercentage} className="mb-3" />
                <p className="text-gray-600 m-0">
                    Kamu sudah menyelesaikan {completedExercises} dari {totalExercises} latihan minggu ini. Pertahankan! 🎉
                </p>
            </Card> */}

            <Card className="mb-5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <TrendingUp size={24} className="text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-800 m-0">Progress Latihan</h3>
                    </div>
                    <span className="px-4 py-1 rounded-full bg-sky-500 text-white text-sm font-semibold">
                        {overallProgress.completed}/{overallProgress.total}
                    </span>
                </div>

                {/* bar */}
                <div className="w-full bg-slate-200 rounded-full h-5 overflow-hidden mb-3">
                    <div
                        className="h-5 bg-sky-500 text-center text-white text-xs font-semibold flex items-center justify-center transition-all duration-500"
                        style={{ width: `${overallProgress.percent}%` }}
                    >
                        {overallProgress.percent}%
                    </div>
                </div>

                <p className="text-gray-600 m-0">
                    {overallProgress.total === 0
                        ? 'Belum ada latihan yang tercatat. Coba mulai satu latihan hari ini ✨'
                        : `Kamu sudah menyelesaikan ${overallProgress.completed} dari ${overallProgress.total} latihan yang pernah kamu jalani. Mantap! 🎉`}
                </p>
            </Card>

            {/* Quick Actions */}
            <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mulai Hari Ini</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => (
                        <div key={index}>
                            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer rounded-2xl h-full" onClick={() => navigate(action.path)}>
                                <div className="flex flex-col items-center text-center gap-3 p-6">
                                    <div className={`p-3 rounded-xl ${action.color}`}>
                                        {action.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <h4 className="text-xl font-semibold text-gray-800 m-0">{action.title}</h4>
                                            {action.badge && <Badge value={action.badge} severity="success" />}
                                        </div>
                                        <p className="text-gray-600 m-0">{action.description}</p>
                                    </div>
                                    <Button label="Mulai" icon="pi pi-arrow-right" className="p-button-text mt-4" />
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <Card className="rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Aktivitas Terakhir</h3>

                {loadingActivity ? (
                    <p className="text-gray-400 text-sm">Memuat aktivitas...</p>
                ) : !activities.length ? (
                    <div className="text-gray-400 text-sm">Belum ada aktivitas. Coba mulai dari “Jelajah Diri” 🙂</div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {activities.map((act, idx) => {
                            const style = activityStyle[act.type] || {
                                bg: 'bg-slate-50',
                                icon: <i className="pi pi-clock text-slate-400" style={{ fontSize: '1.5rem' }} />
                            };
                            return (
                                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${style.bg}`}>
                                    {style.icon}
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 m-0">{act.title}</p>
                                        <p className="text-sm text-gray-600 m-0">
                                            {act.subtitle} · {timeAgo(act.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}
