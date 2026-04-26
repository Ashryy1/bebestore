'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, User, Phone, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { lang, t } = useLanguage();
    const router = useRouter();

    const isAr = lang === 'ar';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(name, email, phone, password);
        if (result.success) {
            router.push('/');
        } else {
            setError(result.error || (isAr ? 'فشل إنشاء الحساب' : 'Registration failed'));
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--sh-bg)] transition-colors duration-700">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[var(--sh-primary)]/20 to-[var(--sh-accent)]/10 blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                        opacity: [0.05, 0.15, 0.05]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[var(--sh-accent)]/10 to-[var(--sh-primary)]/10 blur-[100px]"
                />
            </div>

            <motion.div
                className="w-full max-w-xl relative z-10"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <motion.div
                        className="w-28 h-28 transition-transform duration-500 hover:scale-110 relative mx-auto mb-8"
                    >
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </motion.div>
                    <motion.h1
                        className="text-5xl font-black text-[var(--sh-fg)] mb-4 tracking-tight"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {isAr ? 'انضم لعائلة بيبا أستور' : 'Join BibaStore'}
                    </motion.h1>
                    <motion.p
                        className="text-[var(--sh-fg)] opacity-60 font-bold text-xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {isAr ? 'حيث تلتقي الفخامة بالغرز المتقنة' : 'Where luxury meets every stitch'}
                    </motion.p>
                </div>

                {/* Glassmorphism Card */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--sh-primary)]/20 via-[var(--sh-accent)]/20 to-[var(--sh-primary)]/20 rounded-[3.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                    <div className="glass-card relative rounded-[3rem] p-10 lg:p-14 border border-white/20 dark:border-white/5 shadow-2xl backdrop-blur-3xl">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <motion.div
                                    className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-black text-center flex items-center justify-center gap-3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Name Field */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 px-2 flex items-center justify-between">
                                        {t('fullName')}
                                        <User size={12} className="opacity-40" />
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={isAr ? 'خالد محمد' : 'John Doe'}
                                        required
                                        className="w-full bg-slate-500/5 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500/30 dark:focus:border-white/10 rounded-2xl h-16 px-6 text-lg font-bold text-slate-900 dark:text-white transition-all outline-none placeholder:opacity-30"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 px-2 flex items-center justify-between">
                                        {t('email')}
                                        <Mail size={12} className="opacity-40" />
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={isAr ? 'example@gmail.com' : 'example@gmail.com'}
                                        required
                                        className="w-full bg-slate-500/5 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500/30 dark:focus:border-white/10 rounded-2xl h-16 px-6 text-lg font-bold text-slate-900 dark:text-white transition-all outline-none placeholder:opacity-30"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Phone Field */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 px-2 flex items-center justify-between">
                                        {isAr ? 'رقم الهاتف' : 'Phone'}
                                        <Phone size={12} className="opacity-40" />
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="0123456789"
                                        required
                                        className="w-full bg-slate-500/5 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500/30 dark:focus:border-white/10 rounded-2xl h-16 px-6 text-lg font-bold text-slate-900 dark:text-white transition-all outline-none placeholder:opacity-30"
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 px-2 flex items-center justify-between">
                                        {t('password')}
                                        <Lock size={12} className="opacity-40" />
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-slate-500/5 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500/30 dark:focus:border-white/10 rounded-2xl h-16 px-6 text-lg font-bold text-slate-900 dark:text-white transition-all outline-none placeholder:opacity-30"
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className="premium-button w-full h-20 text-xl font-black rounded-3xl flex items-center justify-center gap-6 group relative overflow-hidden"
                            >
                                {loading ? (
                                    <div className="w-8 h-8 border-[5px] border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10">{isAr ? 'إنشاء حسابي' : 'Create My Account'}</span>
                                        <div className={`relative z-10 transition-transform duration-500 group-hover:translate-x-2 ${isAr ? 'rotate-180 group-hover:-translate-x-2' : ''}`}>
                                            <ArrowRight size={24} />
                                        </div>
                                    </>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                        </form>

                        <div className="mt-12 pt-10 border-t border-[var(--sh-border)] flex flex-col sm:flex-row items-center justify-center gap-4">
                            <span className="text-[var(--sh-fg)] opacity-40 font-bold text-lg">{t('alreadyHaveAccount')}</span>
                            <Link href="/auth/login" className="flex items-center gap-2 text-[var(--sh-primary)] font-black text-lg hover:underline group">
                                {t('login')}
                                <div className={`transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`}>
                                    <ChevronRight size={20} />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Social Proof / Security */}
                <div className="mt-12 grid grid-cols-2 gap-8 px-6 text-slate-400">
                    <div className="flex items-center gap-4 group">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Secure & Encrypted Sessions</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                        <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                            <Sparkles size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Handcrafted with Love</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

