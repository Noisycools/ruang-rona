// src/pages/HistoryJelajah.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <== ini
import useAuthStore from '../store/authStore';
import { getAssessmentHistory, getAssessmentResult } from '../api/assessments';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import styles from './HistoryJelajah.module.css'; 
import { Link } from 'react-router-dom';

const areaColor = (area) => {
    switch ((area || '').toLowerCase()) {
        case 'akademik':
            return 'bg-indigo-100 text-indigo-700';
        case 'sosial':
            return 'bg-pink-100 text-pink-700';
        case 'keluarga':
            return 'bg-amber-100 text-amber-700';
        case 'diri':
            return 'bg-emerald-100 text-emerald-700';
        default:
            return 'bg-slate-100 text-slate-600';
    }
};

const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const HistoryJelajah = () => {
    const navigate = useNavigate();
    const token = useAuthStore((s) => s.token);
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // modal
    const [showModal, setShowModal] = useState(false);
    const [detail, setDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAssessmentHistory(token);
                setHistories(data);
            } catch (err) {
                console.error(err);
                setError('Gagal memuat riwayat');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token]);

    const handleViewSession = async (sessionId) => {
        try {
            setShowModal(true);
            setLoadingDetail(true);
            const res = await getAssessmentResult(token, sessionId);
            const normalized = res?.data ? res.data : res;
            setDetail(normalized);
        } catch (err) {
            console.error(err);
            setDetail(null);
        } finally {
            setLoadingDetail(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setDetail(null);
    };

    return (
        <>
            <nav className="max-w-6xl mx-auto px-6 mt-10 text-sm">
                <ol className="flex gap-3 items-center space-x-2 text-slate-500 list-none">
                    <li>
                        <Link
                            to="/dashboard"
                            className="hover:text-primary-600 transition-colors flex items-center gap-1 no-underline"
                        >
                            <i className="pi pi-home text-xs" />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                    </li>
                    <li className="text-slate-400">›</li>
                    <li>
                        <span className="font-semibold text-slate-700">Jelajah Diri</span>
                    </li>
                </ol>
            </nav>
            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="bg-white/80 rounded-2xl p-5 shadow-sm border border-slate-100">
                    {/* HEADER + CTA */}
                    <div className="flex flex-col gap-4 mb-5 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="text-xs uppercase text-slate-400 tracking-wide">Riwayat</p>
                            <h2 className="text-lg font-semibold text-slate-900">Jelajah Diri kamu</h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Lihat kembali sesi yang pernah kamu isi.
                            </p>
                        </div>

                        {/* CTA ajakan tes lagi */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-400 text-white px-4 py-3 shadow-md flex items-center gap-3 animate-[pulse_4s_ease-in-out_infinite]">
                            {/* bubble dekor */}
                            <div className="absolute -right-6 -top-6 w-16 h-16 bg-white/20 rounded-full"></div>
                            <div className="absolute -right-10 top-6 w-10 h-10 bg-white/10 rounded-full"></div>

                            <div className="flex-1 z-10">
                                <p className="text-[10px] uppercase tracking-wide opacity-80">Tes lagi yuk ✨</p>
                                <p className="text-sm font-semibold leading-tight">Lihat kondisi kamu hari ini</p>
                            </div>
                            <Button
                                label="Mulai"
                                onClick={() => navigate('/jelajah-diri/test')}
                                className="!bg-white !text-indigo-600 !border-none !rounded-full !px-4 !py-2 !text-sm !font-semibold hover:!bg-slate-100 z-10"
                            />
                        </div>
                    </div>

                    {/* jumlah */}
                    <span className="text-xs text-slate-400 mb-3 block">
                        {loading ? 'Memuat…' : `${histories.length} sesi tersimpan`}
                    </span>

                    {loading ? (
                        <p className="text-slate-500 animate-pulse text-sm">Memuat riwayat...</p>
                    ) : error ? (
                        <p className="text-sm text-rose-500">{error}</p>
                    ) : !histories.length ? (
                        <div className="text-center py-6">
                            <p className="text-slate-400 text-sm">Belum ada riwayat jelajah diri.</p>
                            <p className="text-slate-300 text-xs mt-1">Coba isi satu dulu ya ✨</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {histories.map((item, idx) => (
                                <li key={item.id} className="flex gap-3">
                                    {/* timeline bullet */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                                        {idx !== histories.length - 1 && <div className="w-[2px] flex-1 bg-slate-100 mt-1" />}
                                    </div>

                                    {/* card history */}
                                    <div className="flex-1 bg-slate-50/70 hover:bg-slate-50 transition rounded-xl px-4 py-3 border border-slate-100">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-[11px] px-3 py-1 rounded-full capitalize ${areaColor(item.mainArea)}`}
                                                >
                                                    {item.mainArea || 'tanpa label'}
                                                </span>
                                                <span className="text-[10px] text-slate-400">{formatDate(item.createdAt)}</span>
                                            </div>
                                            <Button
                                                label="Lihat"
                                                size="small"
                                                className="!py-1 !h-auto !text-xs"
                                                onClick={() => handleViewSession(item.id)}
                                            />
                                        </div>
                                        {item.previewAnswers?.length ? (
                                            <p className="text-xs text-slate-500">
                                                {item.previewAnswers[0].question} →{' '}
                                                <span className="font-medium text-slate-700">{String(item.previewAnswers[0].answer)}</span>
                                            </p>
                                        ) : (
                                            <p className="text-xs text-slate-400">Jawaban tidak tersedia</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* MODAL */}
            <Dialog
                visible={showModal}
                onHide={closeModal}
                modal
                closable={false}
                className={styles.dialog}
                style={{ width: '40rem', maxWidth: '95vw' }}
            >
                {loadingDetail ? (
                    <div className="flex justify-center py-8">
                        <p className="text-slate-400 text-sm">Memuat...</p>
                    </div>
                ) : detail ? (
                    <div className="w-full bg-white/90 rounded-3xl shadow-xl p-8 border border-white/40 backdrop-blur relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-semibold mb-2 text-slate-900">Hasil Jelajah Diri ✨</h2>
                        <p className="text-slate-500 mb-4 text-sm">
                            Ini hasil sesi yang kamu pilih dari riwayat.
                        </p>

                        <div className="mb-5">
                            <p className="text-xs text-slate-500 mb-1">Area yang lagi berat:</p>
                            <Tag
                                value={detail.mainArea || 'tidak terdeteksi'}
                                rounded
                                className="bg-primary-100 text-primary-700 px-3 py-2 capitalize text-sm"
                            />
                        </div>

                        {detail.recommendation ? (
                            <Link to={`/latihan/${detail.recommendation.id}`}>
                                <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-4 mb-5 border border-primary-100">
                                    <p className="text-xs text-slate-500 mb-1">Latihan yang cocok buat kamu:</p>
                                    <h3 className="text-base font-semibold text-slate-900">{detail.recommendation.title}</h3>
                                    {detail.recommendation.slug ? (
                                        <p className="text-[11px] text-slate-400 mt-1">#{detail.recommendation.slug}</p>
                                    ) : null}
                                </div>
                            </Link>
                        ) : null}

                        {detail.answers?.length ? (
                            <div className="mb-5">
                                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Jawaban kamu</p>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {detail.answers.map((a) => (
                                        <div key={a.questionId} className="bg-slate-50 rounded-2xl px-4 py-3">
                                            <p className="text-sm font-medium text-slate-800">{a.question}</p>
                                            <p className="text-sm text-slate-500 mt-1">{String(a.answer)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        <div className="flex justify-end">
                            <Button
                                label="Tutup"
                                onClick={closeModal}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 text-white font-semibold shadow-md hover:bg-primary-600 active:scale-[.99] transition"
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-400 text-sm">Data tidak ditemukan</p>
                )}
            </Dialog>
        </>
    );
};

export default HistoryJelajah;
