import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Clock, ChevronRight, X } from 'lucide-react';
import { exerciseAPI } from '../api/axios.js';
import useAuthStore from '../store/authStore';

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const userId = user?.id || 'ada-mock';

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState({});
  const [savingModule, setSavingModule] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const m = parseInt(qs.get('module') ?? '0', 10);
    if (!Number.isNaN(m) && m >= 0) setSelectedIdx(m);
  }, [location.search]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await exerciseAPI.getById(id);
        setExercise(res.data);
      } catch (err) {
        console.error('failed to load exercise', err);
      } finally {
        setLoading(false);
      }

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
    }
    load();
  }, [id, userId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat...</div>;
  if (!exercise) return <div className="p-8 text-center text-gray-500">Latihan tidak ditemukan</div>;

  const baseCode = (exercise.code || exercise.category || '').toString();
  const modules = exercise.modules || [];
  const moduleKey = (idx) => `${baseCode}#module-${idx + 1}`;

  const openModule = (idx) => {
    setSelectedIdx(idx);
    // update querystring so direct links work
    navigate(`/latihan/${id}?module=${idx}`, { replace: true });
  };

  const handleStartModule = async (idx) => {
    const key = moduleKey(idx);
    setSavingModule(key);
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
      openModule(idx);
    } catch (err) {
      console.error('failed start module', err);
    } finally {
      setSavingModule(null);
    }
  };

  const handleCompleteModule = async (idx) => {
    const key = moduleKey(idx);
    setSavingModule(key);
    try {
      const payload = {
        userId,
        exerciseType: key,
        exerciseTitle: `${exercise.title} — Modul ${idx + 1}`,
        completed: true,
        streak: ((progressMap[key]?.streak) || 0) + 1
      };
      const res = await exerciseAPI.updateProgress(payload);
      if (res?.data) setProgressMap(prev => ({ ...prev, [key]: res.data }));
    } catch (err) {
      console.error('failed complete module', err);
    } finally {
      setSavingModule(null);
    }
  };

  const selectedModule = modules[selectedIdx];
  const selectedKey = moduleKey(selectedIdx);
  const selectedProg = progressMap[selectedKey];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start gap-6">
          {/* Sidebar: module list (materi template) */}
          <aside className="w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-6 h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Modul</h2>
                <div className="text-xs text-gray-500">{modules.length} modul</div>
              </div>
              <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {modules.map((m, idx) => {
                const key = moduleKey(idx);
                const prog = progressMap[key];
                const isActive = idx === selectedIdx;
                return (
                  <button
                    key={idx}
                    onClick={() => openModule(idx)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition ${
                      isActive ? 'bg-purple-50 ring-1 ring-purple-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold ${isActive ? 'bg-purple-600' : 'bg-gray-300'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 line-clamp-2">{typeof m === 'string' ? m : m.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {prog ? (prog.completed ? 'Selesai' : 'Dimulai') : 'Belum dimulai'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {prog?.streak ? `🔥 ${prog.streak}` : ''}
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 border-t pt-4 text-xs text-gray-600">
              <div className="font-medium text-gray-900">{exercise.title}</div>
              <div className="mt-1 line-clamp-3 text-sm text-gray-700">{exercise.description}</div>
            </div>
          </aside>

          {/* Main content: selected module detail */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{exercise.title}</h1>
                  <div className="text-sm text-gray-500 mt-1">{exercise.description}</div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>{modules.length} modul</div>
                  <div className="mt-2 text-xs">Poin: <span className="font-medium text-gray-900">{exercise.points}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">{selectedIdx + 1}</div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{typeof selectedModule === 'string' ? selectedModule : selectedModule?.title}</div>
                        {typeof selectedModule !== 'string' && selectedModule?.content && (
                          <div className="text-sm text-gray-700 mt-1">{selectedModule.content}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="prose max-w-none text-gray-700 mb-4">
                    {typeof selectedModule === 'string' ? (
                      <p>{selectedModule}</p>
                    ) : (
                      <div>
                        {selectedModule?.content ? <p>{selectedModule.content}</p> : <p>Tidak ada konten modul.</p>}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStartModule(selectedIdx)}
                      disabled={savingModule === selectedKey || (!!selectedProg && !selectedProg?.completed)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium"
                    >
                      {savingModule === selectedKey ? 'Memproses...' : (selectedProg ? (selectedProg.completed ? 'Dimulai' : 'Lanjutkan') : 'Mulai Modul')}
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCompleteModule(selectedIdx)}
                      disabled={savingModule === selectedKey || selectedProg?.completed}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${selectedProg?.completed ? 'bg-gray-300 text-gray-700' : 'bg-green-600 text-white'}`}
                    >
                      {selectedProg?.completed ? 'Sudah Selesai' : 'Tandai Selesai'}
                    </button>
                  </div>

                  <div className="mt-6 text-sm text-gray-600">
                    <div>Status: {selectedProg ? (selectedProg.completed ? 'Selesai' : 'Dimulai') : 'Belum dimulai'}</div>
                    {selectedProg?.createdAt && <div>Dimulai: {new Date(selectedProg.createdAt).toLocaleString()}</div>}
                    {selectedProg?.completedAt && <div>Selesai: {new Date(selectedProg.completedAt).toLocaleString()}</div>}
                    <div>Streak: {selectedProg?.streak ?? 0}</div>
                  </div>
                </div>

                {/* right column: module quick actions / history summary */}
                <aside className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-700 mb-3 font-semibold">Ringkasan Modul</div>
                  <div className="text-xs text-gray-600 mb-3">Progress per modul</div>
                  <div className="space-y-2">
                    {modules.map((m, idx) => {
                      const key = moduleKey(idx);
                      const prog = progressMap[key];
                      return (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-6 text-gray-700">{idx + 1}.</div>
                            <div className="line-clamp-1">{typeof m === 'string' ? m : m.title}</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {prog ? (prog.completed ? '✓' : '•') : '-'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}