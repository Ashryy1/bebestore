'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User as UserIcon, Lock, Mail, Phone, Camera,
    Save, Loader2, ArrowLeft, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function SettingsPage() {
    const { user, updateUser } = useAuth();
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        image: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                image: user.image || ''
            }));
        }
    }, [user]);

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    image: formData.image
                }),
            });

            const data = await res.json();

            if (res.ok) {
                updateUser({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    image: formData.image
                });
                setMessage({ type: 'success', text: isAr ? 'تم تحديث البيانات بنجاح' : 'Profile updated successfully' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Update failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: isAr ? 'كلمات المرور غير متطابقة' : 'Passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: formData.newPassword,
                    currentPassword: formData.currentPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
                setMessage({ type: 'success', text: isAr ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Update failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--sh-bg)] py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <Link
                    href={user?.role === 'admin' ? '/admin' : '/'}
                    className="inline-flex items-center gap-2 text-[var(--sh-fg)] opacity-60 hover:text-[var(--sh-primary)] transition-colors mb-8 font-bold"
                >
                    <ArrowLeft size={20} />
                    {isAr ? 'العودة' : 'Back'}
                </Link>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* Sidebar / Tabs */}
                    <div className="w-full md:w-64 space-y-2">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${activeTab === 'info'
                                ? 'bg-[var(--sh-primary)] text-white shadow-lg shadow-[var(--sh-primary)]/20'
                                : 'bg-[var(--sh-card)] text-[var(--sh-fg)] opacity-60 hover:bg-[var(--sh-hover)]'
                                }`}
                        >
                            <UserIcon size={20} />
                            {isAr ? 'المعلومات الأساسية' : 'Basic Info'}
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${activeTab === 'security'
                                ? 'bg-[var(--sh-primary)] text-white shadow-lg shadow-[var(--sh-primary)]/20'
                                : 'bg-[var(--sh-card)] text-[var(--sh-fg)] opacity-60 hover:bg-[var(--sh-hover)]'
                                }`}
                        >
                            <Lock size={20} />
                            {isAr ? 'الأمان' : 'Security'}
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-10 rounded-[2.5rem] border border-[var(--sh-border)] shadow-2xl"
                        >
                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                            }`}
                                    >
                                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {activeTab === 'info' ? (
                                <form onSubmit={handleUpdateInfo} className="space-y-8">
                                    <h2 className="text-2xl font-black text-[var(--sh-fg)] mb-6 uppercase tracking-tight">
                                        {isAr ? 'تعديل البيانات' : 'Update Profile'}
                                    </h2>

                                    {/* Avatar Upload */}
                                    <div className="flex flex-col items-center gap-6 p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-32 h-32 rounded-full overflow-hidden bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl relative">
                                                {formData.image ? (
                                                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <UserIcon size={48} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full max-w-sm">
                                            <ImageUpload
                                                images={formData.image ? [formData.image] : []}
                                                onChange={(imgs) => setFormData({ ...formData, image: imgs[0] || '' })}
                                                maxFiles={1}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                                {isAr ? 'الاسم بالكامل' : 'Full Name'}
                                            </label>
                                            <div className="relative">
                                                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--sh-fg)] opacity-40" size={18} />
                                                <input
                                                    type="text"
                                                    required
                                                    className="input-field w-full h-16 pl-14 pr-6 bg-[var(--sh-bg)] border-none rounded-2xl font-bold"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--sh-fg)] opacity-40" size={18} />
                                                <input
                                                    type="email"
                                                    required
                                                    className="input-field w-full h-16 pl-14 pr-6 bg-[var(--sh-bg)] border-none rounded-2xl font-bold"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 col-span-full">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                                {isAr ? 'رقم الهاتف' : 'Phone Number'}
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--sh-fg)] opacity-40" size={18} />
                                                <input
                                                    type="tel"
                                                    className="input-field w-full h-16 pl-14 pr-6 bg-[var(--sh-bg)] border-none rounded-2xl font-bold"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="premium-button w-full h-16 rounded-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                        <span className="font-black uppercase tracking-widest text-[10px]">
                                            {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                                        </span>
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleUpdatePassword} className="space-y-8">
                                    <h2 className="text-2xl font-black text-[var(--sh-fg)] mb-6 uppercase tracking-tight">
                                        {isAr ? 'تغيير كلمة المرور' : 'Change Password'}
                                    </h2>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                                {isAr ? 'كلمة المرور الحالية' : 'Current Password'}
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--sh-fg)] opacity-40" size={18} />
                                                <input
                                                    type="password"
                                                    required
                                                    className="input-field w-full h-16 pl-14 pr-6 bg-[var(--sh-bg)] border-none rounded-2xl font-bold"
                                                    value={formData.currentPassword}
                                                    onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                                {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--sh-fg)] opacity-40" size={18} />
                                                <input
                                                    type="password"
                                                    required
                                                    minLength={6}
                                                    className="input-field w-full h-16 pl-14 pr-6 bg-[var(--sh-bg)] border-none rounded-2xl font-bold"
                                                    value={formData.newPassword}
                                                    onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                                {isAr ? 'تأكيد كلمة المرور' : 'Confirm New Password'}
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--sh-fg)] opacity-40" size={18} />
                                                <input
                                                    type="password"
                                                    required
                                                    className="input-field w-full h-16 pl-14 pr-6 bg-[var(--sh-bg)] border-none rounded-2xl font-bold"
                                                    value={formData.confirmPassword}
                                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="premium-button w-full h-16 rounded-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                        <span className="font-black uppercase tracking-widest text-[10px]">
                                            {isAr ? 'تحديث كلمة المرور' : 'Update Password'}
                                        </span>
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
