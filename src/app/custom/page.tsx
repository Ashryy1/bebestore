'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import ImageUpload from '@/components/ImageUpload';
import { Send, Sparkles, CheckCircle, FileText, Image as ImageIcon, ArrowRight, Lock, Wand2, Info, User, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function CustomRequestPage() {
    const { user } = useAuth();
    const { lang, t } = useLanguage();
    const isAr = lang === 'ar';

    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [userName, setUserName] = useState(user?.name || '');
    const [userPhone, setUserPhone] = useState(user?.phone || '');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    // Sync user data when it loads
    useEffect(() => {
        if (user) {
            setUserName(user.name || '');
            if (user.phone) setUserPhone(user.phone);
        }
    }, [user]);

    const steps = [
        { label: isAr ? 'البيانات' : 'Details', icon: User },
        { label: isAr ? 'الوصف' : 'Describe', icon: FileText },
        { label: isAr ? 'الصور' : 'Upload', icon: ImageIcon },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim() || !userPhone.trim() || !userName.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/custom-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    referenceImages: images,
                    userName,
                    userPhone,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setOrderNumber(data.customRequest?.orderNumber || '');
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <motion.div
                    className="glass-card rounded-[3rem] p-12 text-center max-w-xl relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="absolute inset-0 bg-emerald-500/5" />
                    <motion.div
                        className="w-24 h-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <CheckCircle size={44} className="text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-black mb-4 text-slate-900 dark:text-white">
                        {isAr ? 'تم استلام طلبك! 🎉' : 'Request Submitted! 🎉'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg font-medium leading-relaxed">
                        {isAr
                            ? 'سنقوم بمراجعة تصميمك والرد عليك بتسعيرة في أقرب وقت ممكن.'
                            : 'We\'ll review your design and get back to you with a quote soon.'}
                    </p>
                    <div className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-600/10 mb-10 text-center">
                        <p className="text-sm font-bold text-indigo-600 mb-2">{isAr ? 'تتبع طلبك' : 'Track your request'}</p>
                        {orderNumber && (
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <span className="text-2xl font-black text-slate-900 dark:text-white px-6 py-2 bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 tracking-widest">
                                    {orderNumber}
                                </span>
                            </div>
                        )}
                        <p className="text-xs text-slate-500">{isAr ? 'استخدم رقم هاتفك أو رقم الطلب أعلاه للمتابعة في أي وقت.' : 'Use your phone or the ID above to follow up anytime on the tracking page.'}</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Link href="/track" className="premium-button px-10 py-4 rounded-2xl">
                            {isAr ? 'تتبع طلبي' : 'Track My Request'}
                        </Link>
                        <Link href="/" className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-indigo-500 transition-colors">
                            {isAr ? 'العودة للرئيسية' : 'Back to Home'}
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden bg-[var(--sh-bg)] transition-colors duration-500">
            <div className="orb w-[800px] h-[800px] bg-indigo-500/5 -bottom-40 -left-40 animate-float" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="badge-brand mb-6">
                        <Sparkles size={14} />
                        {isAr ? 'طلب خاص للجميع' : 'Custom Order for Everyone'}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-normal overflow-visible text-[var(--sh-fg)] leading-[1.1]">
                        {isAr ? <>حوّل <span className="gradient-text">خيالك</span> لواقع</> : <>Bring Your <span className="gradient-text">Imagination</span> to Life</>}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-xl font-medium">
                        {isAr
                            ? 'اطلب تصميمك الخاص الآن بدون تسجيل دخول، وسنتواصل معك عبر واتساب.'
                            : 'Order your custom design now without signing in. We\'ll contact you via WhatsApp!'}
                    </p>
                </motion.div>

                {/* Info Card */}
                <motion.div
                    className="bg-[var(--sh-primary)]/5 border border-[var(--sh-primary)]/10 rounded-3xl p-6 mb-10 flex gap-4 items-start"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="w-10 h-10 rounded-xl bg-[var(--sh-primary)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--sh-primary)]/20">
                        <MessageCircle size={20} className="text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-[var(--sh-fg)] mb-1">{isAr ? 'تواصل مباشر' : 'Direct Contact'}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{isAr
                            ? 'سنستخدم رقم هاتفك للتواصل معك عبر واتساب لمناقشة التفاصيل والأسعار.'
                            : 'We will use your phone number to contact you via WhatsApp to discuss details and pricing.'}</p>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {/* User Info Card */}
                    <div className="glass-card rounded-[2.5rem] p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                                <User size={18} className="text-indigo-500" />
                                {isAr ? 'الاسم بالكامل' : 'Full Name'}
                            </label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder={isAr ? "اكتب اسمك هنا" : "Your name"}
                                required
                                className="input-field bg-[var(--sh-bg)] border-none h-16 px-6 font-bold"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                                <Phone size={18} className="text-emerald-500" />
                                {isAr ? 'رقم الهاتف (واتساب)' : 'Phone (WhatsApp)'}
                            </label>
                            <input
                                type="tel"
                                value={userPhone}
                                onChange={(e) => setUserPhone(e.target.value)}
                                placeholder={isAr ? "رقمك للمتابعة" : "Phone for updates"}
                                required
                                className="input-field bg-[var(--sh-bg)] border-none h-16 px-6 font-bold"
                            />
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className="glass-card rounded-[2.5rem] p-10">
                        <label className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400 mb-6">
                            <FileText size={18} className="text-indigo-500" />
                            {isAr ? 'وصف طلبك الخاص' : 'Describe your custom request'}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={isAr ? "مثلاً: أريد دب كروشيه بلون وردي فاتح وعيون زرقاء، بطول ٢٠ سم..." : "I'd love a crochet amigurumi cat in pastel pink with blue eyes, about 20cm tall..."}
                            rows={6}
                            required
                            className="input-field bg-[var(--sh-bg)] border-none resize-none text-lg p-6 focus:ring-2 focus:ring-[var(--sh-primary)]/20"
                        />
                    </div>

                    {/* Reference Images Card */}
                    <div className="glass-card rounded-[2.5rem] p-10">
                        <label className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400 mb-6 font-medium">
                            <ImageIcon size={18} className="text-indigo-500" />
                            {isAr ? 'صور توضيحية' : 'Reference Images'}
                            <span className="text-slate-300 dark:text-slate-600 lowercase font-bold">{isAr ? '(اختياري)' : '(optional)'}</span>
                        </label>
                        <ImageUpload images={images} onChange={setImages} maxFiles={5} />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting || !description.trim() || !userPhone.trim() || !userName.trim()}
                        className="premium-button w-full py-6 text-xl disabled:opacity-50 disabled:cursor-not-allowed rounded-[1.5rem] flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl shadow-indigo-600/20"
                    >
                        {submitting ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send size={24} />
                        )}
                        {submitting ? (isAr ? 'جاري الإرسال...' : 'Submitting...') : (isAr ? 'إرسال الطلب' : 'Submit Request')}
                    </button>

                    <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {isAr ? 'بالنقر على إرسال، فإنك توافق على شروط الطلب الخاص' : 'By clicking submit, you agree to our Custom Order terms'}
                    </p>
                </motion.form>
            </div>
        </div>
    );
}

