// src/pages/JelajahDiri.jsx
import React, { useEffect, useState } from 'react';
import { getAssessmentQuestions, submitAssessment, getAssessmentResult } from '../api/assessments';
import useAuthStore from '../store/authStore';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const JelajahDiri = () => {
    const token = useAuthStore((state) => state.token);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const q = await getAssessmentQuestions(token);
                setQuestions(q);
            } catch (err) {
                console.error(err);
                setError('Gagal ambil pertanyaan');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token]);

    const handleSelectAnswer = (questionId, answerValue) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerValue,
        }));
    };

    const handleNext = () => {
        const currentQuestion = questions[step];
        if (currentQuestion && !answers[currentQuestion.id]) {
            setError('Jawab dulu pertanyaan ini ya 🙂');
            return;
        }
        setError('');
        setStep((prev) => prev + 1);
    };

    const handlePrev = () => {
        setError('');
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async () => {
        const currentQuestion = questions[step];
        if (currentQuestion && !answers[currentQuestion.id]) {
            setError('Jawab dulu pertanyaan ini ya 🙂');
            return;
        }
        setError('');
        setSubmitting(true);
        try {
            const payload = questions.map((q) => ({
                questionId: q.id,
                answer: answers[q.id],
            }));

            const res = await submitAssessment(token, payload);

            let finalData = res;
            if (res.sessionId) {
                const detail = await getAssessmentResult(token, res.sessionId);
                finalData = {
                    ...res,
                    detail: detail.data,
                };
            }
            setResult(finalData);
        } catch (err) {
            console.error(err);
            setError('Gagal mengirim assessment');
        } finally {
            setSubmitting(false);
        }
    };

    // LOADING
    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-[radial-gradient(circle_at_top,_#eef2ff,_#e2e8f0_50%,_#f8fafc_80%)]">
                <p className="text-slate-500 animate-pulse">Memuat pertanyaan...</p>
            </div>
        );
    }

    // HASIL
    if (result) {
        const area = result.mainArea || result?.detail?.mainArea || 'tidak terdeteksi';
        const rec = result.recommendation || result?.detail?.recommendation || null;

        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-slate-100">
                <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-xl p-8 border border-white/40 backdrop-blur">
                    <h2 className="text-2xl font-semibold mb-2 text-slate-900">Hasil Jelajah Diri ✨</h2>
                    <p className="text-slate-500 mb-4 text-sm">
                        Kita coba rangkumin hal yang lagi kamu rasain.
                    </p>

                    <div className="mb-5">
                        <p className="text-xs text-slate-500 mb-1">Area yang lagi berat:</p>
                        <Tag value={area} rounded className="bg-primary-100 text-primary-700 px-3 py-2 capitalize text-sm" />
                    </div>

                    {rec ? (
                        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-4 mb-5 border border-primary-100">
                            <p className="text-xs text-slate-500 mb-1">Latihan yang cocok buat kamu:</p>
                            <h3 className="text-base font-semibold text-slate-900">{rec.title}</h3>
                            {rec.slug ? <p className="text-[11px] text-slate-400 mt-1">#{rec.slug}</p> : null}
                        </div>
                    ) : (
                        <p className="text-slate-500 mb-5">
                            Belum ada latihan spesifik, tapi kamu bisa mulai dari napas 4-7-8 atau journaling 5 menit.
                        </p>
                    )}

                    {result?.detail?.answers?.length ? (
                        <div className="mb-5">
                            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Jawaban kamu</p>
                            <div className="space-y-2">
                                {result.detail.answers.map((a) => (
                                    <div key={a.questionId} className="bg-slate-50 rounded-2xl px-4 py-3">
                                        <p className="text-sm font-medium text-slate-800">{a.question}</p>
                                        <p className="text-sm text-slate-500 mt-1">{String(a.answer)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <Button
                        label="Jelajah lagi"
                        onClick={() => {
                            setResult(null);
                            setStep(0);
                            setAnswers({});
                        }}
                        className="!bg-slate-900 !border-slate-900 hover:!bg-slate-800"
                    />
                </div>
            </div>
        );
    }

    // NO QUESTION
    if (!questions.length) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <p className="text-slate-500">Belum ada pertanyaan assessment.</p>
            </div>
        );
    }

    const q = questions[step];
    const total = questions.length;
    const isLast = step === total - 1;
    const percent = Math.round(((step + 1) / total) * 100);

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-[radial-gradient(circle_at_top,_#eef2ff,_#e2e8f0_50%,_#f8fafc_80%)] py-10 px-4">
            <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-xl p-8 border border-white/40 backdrop-blur">
                {/* top bar */}
                <div className="flex items-center justify-between mb-6 gap-6">
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Jelajah diri</p>
                        <p className="text-sm text-slate-600">Pertanyaan {step + 1} dari {total}</p>
                    </div>
                    {/* progress */}
                    <div className="w-44">
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-3 bg-gradient-to-r from-primary-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-300"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-right text-slate-400 mt-1">{percent}%</p>
                    </div>

                </div>

                {/* question */}
                <h2 className="text-2xl font-semibold text-slate-900 mb-5 leading-snug">
                    {q.question}
                </h2>

                {/* options */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {(q.options || []).map((opt) => {
                        const active = answers[q.id] === opt;
                        return (
                            <button
                                key={opt}
                                onClick={() => handleSelectAnswer(q.id, opt)}
                                className={[
                                    'px-6 py-3 rounded-2xl transition shadow-sm',
                                    'min-w-[130px] text-left',
                                    active
                                        ? 'bg-primary-100/90 border border-primary-200 text-primary-900 shadow-md'
                                        : 'bg-white/60 border border-slate-100 text-slate-700 hover:bg-white',
                                ].join(' ')}
                            >
                                <span className="font-medium">{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                            </button>
                        );
                    })}
                </div>



                {error ? <p className="text-sm text-rose-500 mb-4">{error}</p> : null}

                {/* actions */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handlePrev}
                        disabled={step === 0}
                        className={
                            step === 0
                                ? 'text-slate-300 font-semibold cursor-not-allowed'
                                : 'text-slate-500 font-semibold hover:text-slate-700 transition'
                        }
                    >
                        Kembali
                    </button>

                    {!isLast ? (
                        <button
                            onClick={handleNext}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 text-white font-semibold shadow-md hover:bg-primary-600 active:scale-[.99] transition"
                        >
                            Lanjut
                            <span className="inline-block bg-white/30 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                →
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold shadow-md transition ${submitting
                                ? 'bg-slate-300 text-slate-500 cursor-wait'
                                : 'bg-emerald-500 text-white hover:bg-emerald-600'
                                }`}
                        >
                            {submitting ? 'Mengirim...' : 'Lihat hasil'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default JelajahDiri;
