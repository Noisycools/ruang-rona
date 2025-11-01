import React, { useState, useEffect } from 'react';
import { Brain, Heart, Users, BookOpen, Smartphone, Sparkles, Clock, Trophy, ChevronRight, X } from 'lucide-react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { exerciseAPI } from '../api/axios.js';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const ExerciseLibrary = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startingId, setStartingId] = useState(null);
    const [progressMap, setProgressMap] = useState({});
    const { user } = useAuthStore();
    const userId = user?.id || 'ada-mock';
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await exerciseAPI.getAll();
                const data = res.data || [];
                const mapped = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description || item.content || '',
                    category: (item.category || item.code || '').toString().split('-')[0] || 'school',
                    duration: item.duration || 'varies',
                    level: item.level || 'Pemula',
                    points: item.points || 50,
                    skills: item.skills || [],
                    modules: (item.modules || []).map(m => (typeof m === 'string' ? m : (m.title || m.content || ''))),
                    raw: item
                }));
                setExercises(mapped);

                try {
                    const p = await exerciseAPI.getProgress(userId);
                    const rows = p.data || [];
                    const map = {};
                    rows.forEach(r => {
                        if (r.exerciseType) map[r.exerciseType] = r;
                    });
                    setProgressMap(map);
                } catch (err) {
                    console.warn('failed to load progress', err);
                }
            } catch (err) {
                console.warn('Exercises API not available, leaving list empty', err);
                setExercises([]);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [userId]);

    const categories = [
        { id: 'all', name: 'Semua', icon: Sparkles, color: 'purple' },
        { id: 'school', name: 'Sekolah', icon: BookOpen, color: 'blue' },
        { id: 'friends', name: 'Teman', icon: Users, color: 'green' },
        { id: 'self', name: 'Diri Sendiri', icon: Heart, color: 'pink' },
        { id: 'online', name: 'Dunia Online', icon: Smartphone, color: 'orange' },
        { id: 'mind', name: 'Pikiran', icon: Brain, color: 'indigo' }
    ];

    const filteredExercises = selectedCategory === 'all'
        ? exercises
        : exercises.filter(ex => ex.category === selectedCategory);

    const getCategoryColor = (category) => {
        const cat = categories.find(c => c.id === category);
        return cat ? cat.color : 'gray';
    };

    const colorClasses = {
        purple: 'bg-purple-50 text-purple-700',
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
        pink: 'bg-pink-50 text-pink-700',
        orange: 'bg-orange-50 text-orange-700',
        indigo: 'bg-indigo-50 text-indigo-700'
    };

    const getBaseCode = (exercise) => {
        const raw = exercise?.raw || {};
        const code = (raw.code || raw.category || exercise.category || '').toString();
        return code;
    };

    const moduleKey = (exercise, idx) => `${getBaseCode(exercise)}#module-${idx + 1}`;

    const startExercise = async (exercise) => {
        const exerciseType = (exercise.raw && (exercise.raw.code || exercise.raw.category)) || exercise.category;
        setStartingId(exercise.id);
        try {
            const payload = {
                userId,
                exerciseType,
                exerciseTitle: exercise.title,
                completed: false,
                streak: (progressMap[exerciseType]?.streak) || 0
            };
            const res = await exerciseAPI.updateProgress(payload);
            if (res?.data) {
                setProgressMap(prev => ({ ...prev, [exerciseType]: res.data }));
            }
            setSelectedExercise(exercise);
        } catch (err) {
            console.error('Failed to update progress', err);
        } finally {
            setStartingId(null);
        }
    };

    const startModule = async (exercise, idx) => {
        const key = moduleKey(exercise, idx);
        try {
            const payload = {
                userId,
                exerciseType: key,
                exerciseTitle: `${exercise.title} — Modul ${idx + 1}`,
                completed: false,
                streak: (progressMap[key]?.streak) || 0
            };
            const res = await exerciseAPI.updateProgress(payload);
            if (res?.data) setProgressMap(prev => ({ ...prev, [key]: res.data }));
        } catch (err) {
            console.warn('failed to create start progress, continuing to navigate', err);
        }
        navigate(`/latihan/${exercise.id}?module=${idx}`);
    };

    const total = exercises.length;
    const byCategory = categories.reduce((acc, c) => {
        acc[c.id] = exercises.filter(e => (e.category || 'school') === c.id).length;
        return acc;
    }, {});

    const dialogFooter = selectedExercise && (
        <Button
            label="Mulai Sekarang"
            icon="pi pi-arrow-right"
            onClick={() => navigate(`/latihan/${selectedExercise.id}?module=0`)}
            className="w-full"
        />
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Perpustakaan Latihan</h1>
                            <p className="mt-1 text-sm text-gray-600">Pilih latihan dan mulai journey-mu menuju well‑being</p>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <div className="text-sm text-gray-500">Total Latihan</div>
                            <Tag value={total} severity="info" className="px-4 py-2" />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = selectedCategory === cat.id;
                            return (
                                <Button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-2 ${
                                        isActive ? colorClasses[cat.color] : 'bg-white text-gray-600'
                                    }`}
                                    outlined={!isActive}
                                    rounded
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{cat.name}</span>
                                    <span className="ml-1 text-xs text-gray-500">({byCategory[cat.id] || 0})</span>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                <main>
                    {loading ? (
                        <div className="py-12 text-center text-gray-500">Memuat latihan...</div>
                    ) : filteredExercises.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">Belum ada latihan untuk kategori ini.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredExercises.map((exercise) => {
                                const categoryInfo = categories.find(c => c.id === exercise.category) || categories[0];
                                const Icon = categoryInfo.icon;
                                const color = getCategoryColor(exercise.category);

                                const totalModules = (exercise.modules || []).length;
                                const completedModules = (exercise.modules || []).reduce((acc, _, idx) => {
                                    const key = moduleKey(exercise, idx);
                                    return acc + (progressMap[key]?.completed ? 1 : 0);
                                }, 0);
                                const progressPercent = totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100);

                                return (
                                    <Card key={exercise.id} className="overflow-hidden">
                                        <div className={`p-4 border-b ${colorClasses[color]}`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white/40 rounded-lg p-2">
                                                        <Icon className="w-7 h-7 text-current" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{exercise.title}</h3>
                                                        <div className="text-xs text-gray-500 mt-1">{exercise.description?.slice(0, 100)}</div>

                                                        <div className="mt-2 w-52">
                                                            <ProgressBar value={progressPercent} showValue={false} style={{ height: '8px' }} />
                                                            <div className="text-xs text-gray-500 mt-1">{completedModules}/{totalModules} modul • {progressPercent}%</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end">
                                                    <div className="text-sm font-semibold text-gray-900">{exercise.points}</div>
                                                    <div className="text-xs text-gray-500">poin</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-3">
                                            <div className="flex items-center justify-between text-xs text-gray-600">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span>{exercise.duration}</span>
                                                    </div>
                                                    <Tag
                                                        value={exercise.level}
                                                        severity={exercise.level === 'Pemula' ? 'success' : 'warning'}
                                                        rounded
                                                    />
                                                </div>
                                                <div className="text-xs text-gray-500">{(exercise.modules || []).length} modul</div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {(exercise.skills || []).slice(0, 3).map((skill, idx) => (
                                                    <Tag key={idx} value={skill} severity="info" rounded />
                                                ))}
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    label={startingId === exercise.id ? 'Memulai...' : 'Mulai Latihan'}
                                                    icon="pi pi-arrow-right"
                                                    onClick={() => startExercise(exercise)}
                                                    disabled={startingId === exercise.id}
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </main>

                <Dialog
                    visible={!!selectedExercise}
                    onHide={() => setSelectedExercise(null)}
                    header={selectedExercise?.title}
                    footer={dialogFooter}
                    style={{ width: '50vw' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                >
                    {selectedExercise && (
                        <div className="space-y-6">
                            <p className="text-gray-700">{selectedExercise.description}</p>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Modul Latihan & Riwayat</h3>
                                <div className="space-y-3">
                                    {(selectedExercise.modules || []).map((module, idx) => {
                                        const key = moduleKey(selectedExercise, idx);
                                        const prog = progressMap[key];
                                        return (
                                            <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-3">
                                                        <Tag value={idx + 1} severity="info" rounded />
                                                        <div>
                                                            <div className="font-medium text-gray-900">{typeof module === 'string' ? module : module.title}</div>
                                                            {prog && (
                                                                <div className="text-xs text-gray-600 mt-1">
                                                                    {prog.completed ? (
                                                                        <span className="text-green-600 font-medium">Selesai • {prog.completedAt ? new Date(prog.completedAt).toLocaleString() : ''}</span>
                                                                    ) : (
                                                                        <span className="text-orange-600">Dimulai • {prog.createdAt ? new Date(prog.createdAt).toLocaleString() : ''}</span>
                                                                    )}
                                                                    {prog.notes && <div className="mt-1">Catatan: <span className="text-gray-700">{prog.notes}</span></div>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end w-40">
                                                    {prog ? (
                                                        prog.completed ? (
                                                            <Tag value="Selesai" severity="success" icon="pi pi-check" />
                                                        ) : (
                                                            <Tag value="Dimulai" severity="warning" icon="pi pi-clock" />
                                                        )
                                                    ) : (
                                                        <Tag value="Belum" severity="secondary" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </Dialog>
            </div>
        </div>
    );
};

export default ExerciseLibrary;
