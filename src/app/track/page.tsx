'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Phone, Clock, ChevronRight, MessageCircle, Sparkles, Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

type Status = 'Pending' | 'Reviewing' | 'Pricing' | 'Processing' | 'Shipped' | 'Completed' | 'Returned';

const statusConfig: Record<Status, { color: string; bg: string; dot: string }> = {
    Pending: { color: 'text-slate-500', bg: 'bg-slate-100/50', dot: 'bg-slate-400' },
    Reviewing: { color: 'text-indigo-600', bg: 'bg-indigo-600/5', dot: 'bg-indigo-600' },
    Pricing: { color: 'text-amber-600', bg: 'bg-amber-600/5', dot: 'bg-amber-500' },
    Processing: { color: 'text-purple-600', bg: 'bg-purple-600/5', dot: 'bg-purple-600' },
    Shipped: { color: 'text-blue-600', bg: 'bg-blue-600/5', dot: 'bg-blue-600' },
    Completed: { color: 'text-emerald-600', bg: 'bg-emerald-600/5', dot: 'bg-emerald-500' },
    Returned: { color: 'text-red-600', bg: 'bg-red-600/5', dot: 'bg-red-500' },
};

export default function TrackRequestsPage() {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';

    const [phone, setPhone] = useState('');
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/custom-requests/track?q=${encodeURIComponent(phone)}`);
            const data = await res.json();
            setRequests(data.all || []);
            setSearched(true);
        } catch (error) {
            console.error('Track error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden bg-[var(--sh-bg)] transition-colors duration-500">
            {/* Ambient Background */}
            <div className="orb w-[600px] h-[600px] bg-indigo-500/5 -top-20 -right-20 animate-float" />
            <div className="orb w-[500px] h-[500px] bg-purple-500/5 bottom-0 -left-20 animate-float-delayed" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="badge-brand mb-6">
                        <Clock size={14} />
                        {isAr ? 'تتبع طلبك' : 'Track Order'}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-normal overflow-visible text-[var(--sh-fg)] leading-[1.1]">
                        {isAr ? <>أين <span className="gradient-text">غرزتك</span> الآن؟</> : <>Where is your <span className="gradient-text">Stitch</span>?</>}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg font-medium">
                        {isAr
                            ? 'أدخل رقم الهاتف الذي استخدمته عند الطلب لمتابعة حالة تصميمك الخاص.'
                            : 'Enter the phone number used during checkout to track your custom request status.'}
                    </p>
                </motion.div>

                {/* Search Box */}
                <motion.div
                    className="max-w-xl mx-auto mb-20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--sh-fg)] opacity-40 group-focus-within:text-[var(--sh-primary)] transition-colors">
                            <Phone size={24} />
                        </div>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={isAr ? "رقم الهاتف أو رقم الطلب (مثال: KR-XXXXX)" : "Phone or Order ID (e.g. KR-XXXXX)"}
                            required
                            className="w-full h-20 pl-16 pr-24 rounded-3xl bg-[var(--sh-card)] border-none text-xl font-bold placeholder:text-[var(--sh-fg)] opacity-40 focus:ring-4 focus:ring-[var(--sh-primary)]/10 transition-all text-[var(--sh-fg)]"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-3 top-3 bottom-3 px-8 rounded-2xl bg-[var(--sh-primary)] text-white font-black uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[var(--sh-primary)]/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : (isAr ? 'بحث' : 'Search')}
                        </button>
                    </form>
                </motion.div>

                {/* Results */}
                <div className="space-y-8">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center py-20"
                            >
                                <Loader2 size={48} className="text-[var(--sh-primary)] animate-spin mb-4" />
                                <p className="text-[var(--sh-fg)] opacity-40 font-black uppercase text-xs tracking-widest">{isAr ? 'جاري البحث في الأرشيف...' : 'Searching archives...'}</p>
                            </motion.div>
                        ) : searched && requests.length > 0 ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 gap-6"
                            >
                                {requests.map((req, i) => (
                                    <motion.div
                                        key={req._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            href={req.description ? `/track/${req._id}` : `/orders/${req._id}`}
                                            className="block glass-card rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all duration-500 group relative overflow-hidden"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-white/5">
                                                        {req.referenceImages?.[0] ? (
                                                            <img src={req.referenceImages[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <ShoppingBag size={32} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-current ${statusConfig[req.status as Status]?.bg} ${statusConfig[req.status as Status]?.color}`}>
                                                                {req.status}
                                                            </span>
                                                            <span className="text-[10px] font-black text-[var(--sh-fg)] opacity-40 uppercase tracking-widest">
                                                                {req.orderNumber} • {new Date(req.createdAt).toLocaleDateString()}
                                                            </span>
                                                            {req.hasUnreadUpdate && (
                                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                            )}
                                                        </div>
                                                        <h3 className="text-xl font-black text-[var(--sh-fg)] line-clamp-1 group-hover:text-[var(--sh-primary)] transition-colors">
                                                            {req.description || (req.items?.length > 0 ? req.items[0].title : 'Order')}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 pt-6 md:pt-0 md:pl-8">
                                                    {req.adminQuote ? (
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-[var(--sh-fg)] opacity-40 uppercase tracking-widest mb-1">{isAr ? 'السعر المقترح' : 'QUOTED PRICE'}</p>
                                                            <p className="text-2xl font-black text-[var(--sh-primary)]">
                                                                {req.adminQuote.toLocaleString()} <span className="text-xs font-bold">EGP</span>
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-amber-500">
                                                            <Sparkles size={16} />
                                                            <span className="text-xs font-black uppercase tracking-widest">{isAr ? 'بانتظار التسعير' : 'Wait Pricing'}</span>
                                                        </div>
                                                    )}
                                                    <div className="w-12 h-12 rounded-2xl bg-[var(--sh-bg)] flex items-center justify-center text-[var(--sh-fg)] opacity-40 group-hover:bg-[var(--sh-primary)] group-hover:text-white transition-all">
                                                        <ChevronRight size={24} className={isAr ? 'rotate-180' : ''} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : searched ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20"
                            >
                                <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600/5 flex items-center justify-center mx-auto mb-8">
                                    <Search size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{isAr ? 'لم نجد أي طلبات' : 'No requests found'}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{isAr ? 'تأكد من رقم الهاتف الذي أدخلته أو قم بعمل طلب جديد.' : 'Double check the phone number or start a new request.'}</p>
                                <Link href="/custom" className="premium-button mt-8 px-10 py-4 rounded-2xl inline-flex gap-3">
                                    <Sparkles size={20} />
                                    {isAr ? 'طلب تصميم جديد' : 'Request New Design'}
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="initial"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <div className="glass-card rounded-[2.5rem] p-12 max-w-sm mx-auto border-indigo-500/10">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/20">
                                        <MessageCircle size={32} className="text-white" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{isAr ? 'تواصل مرن' : 'Easy Access'}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        {isAr ? 'نستخدم الواتساب لتأكيد التفاصيل النهائية بمجرد مراجعة طلبك.' : 'We use WhatsApp to confirm the final details once your request is reviewed.'}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
