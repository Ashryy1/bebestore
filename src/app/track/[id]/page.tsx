'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Timeline from '@/components/Timeline';
import { ArrowLeft, DollarSign, CheckCircle, MapPin, Clock, Sparkles, Loader2, Send, Package, Truck, Copy, FileText, Phone } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import ImageUpload from '@/components/ImageUpload';
import { ADMIN_WHATSAPP } from '@/lib/utils';
import OrderChat from '@/components/OrderChat';
const allStatuses = ['Pending', 'Reviewing', 'Pricing', 'Processing', 'Shipped', 'Completed'];

export default function TrackPage() {
    const { id } = useParams();
    const { lang } = useLanguage();
    const isAr = lang === 'ar';

    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');

    useEffect(() => {
        if (id) fetchRequest();
    }, [id]);

    const fetchRequest = async () => {
        try {
            const res = await fetch(`/api/custom-requests/${id}`);
            const data = await res.json();
            setRequest(data.request);
            if (data.request?.shippingDetails) {
                setAddress(data.request.shippingDetails.address || '');
                setCity(data.request.shippingDetails.city || '');
            }
            // Clear unread indicator if it exists
            if (data.request?.hasUnreadUpdate) {
                fetch(`/api/custom-requests/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ hasUnreadUpdate: false }),
                }).catch(err => console.error('Error clearing unread:', err));
            }
        } catch (error) {
            console.error('Error fetching request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.trim() || !city.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/custom-requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'Processing',
                    shippingDetails: {
                        address,
                        city,
                        phone: request.userPhone,
                    },
                    timelineNote: isAr ? 'تم تأكيد الطلب وإضافة بيانات الشحن' : 'Order confirmed and shipping details added',
                }),
            });

            if (res.ok) {
                await fetchRequest();
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">{isAr ? 'جاري العثور على طلبك...' : 'Finding your request...'}</p>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 pt-32">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{isAr ? 'لم نعثر على هذا الطلب' : 'Request Not Found'}</h2>
                    <Link href="/track" className="premium-button px-8 py-3 rounded-2xl inline-block">
                        {isAr ? 'العودة للتتبع' : 'Back to Tracking'}
                    </Link>
                </div>
            </div>
        );
    }

    const currentIndex = allStatuses.indexOf(request.status);
    const progressPercent = ((currentIndex + 1) / allStatuses.length) * 100;
    const isPriced = request.status === 'Pricing' && request.adminQuote;
    const isConfirmed = ['Processing', 'Shipped', 'Completed'].includes(request.status);

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
            <div className="orb w-[600px] h-[600px] bg-indigo-500/5 -top-40 -left-40 animate-float" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <Link
                        href="/track"
                        className="inline-flex items-center gap-3 text-slate-400 hover:text-indigo-500 transition-all text-sm font-black uppercase tracking-widest"
                    >
                        <ArrowLeft size={18} className={isAr ? 'rotate-180' : ''} />
                        {isAr ? 'العودة للتتبع' : 'Back to Tracking'}
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                            ID: {request.orderNumber}
                        </span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(request.orderNumber);
                                // Simple feedback alert
                                alert(isAr ? 'تم نسخ المعرف!' : 'ID Copied!');
                            }}
                            className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                            title="Copy ID"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <span className="badge-brand mb-6">
                        <Clock size={14} />
                        {isAr ? 'تتبع تفصيلي' : 'Detail Tracking'}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
                        {isAr ? <>حالة <span className="gradient-text">تصميمك</span></> : <>Design <span className="gradient-text">Status</span></>}
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12">
                        {/* Progress Bar Container */}
                        <motion.div
                            className="glass-card rounded-[2.5rem] p-10 mb-10 overflow-hidden relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="absolute inset-0 bg-indigo-600/5" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white text-lg">{isAr ? 'التقدم الإجمالي' : 'Overall Progress'}</h4>
                                            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{request.status}</p>
                                        </div>
                                    </div>
                                    <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 italic">
                                        {Math.round(progressPercent)}%
                                    </span>
                                </div>
                                <div className="w-full h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-1">
                                    <motion.div
                                        className="h-full bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            {/* Request Info */}
                            <motion.div
                                className="glass-card rounded-[2.5rem] p-10 flex flex-col h-full"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                                    <FileText size={20} className="text-indigo-500" />
                                    {isAr ? 'الوصف' : 'Description'}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1">
                                    {request.description}
                                </p>
                                {request.referenceImages?.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {request.referenceImages.map((img: string, i: number) => (
                                            <img key={i} src={img} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-white/5" />
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Quote & Action Card */}
                            <motion.div
                                className="glass-card rounded-[2.5rem] p-10 h-full flex flex-col border-indigo-500/20"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                                    <DollarSign size={20} className="text-indigo-500" />
                                    {isAr ? 'التكلفة' : 'Cost'}
                                </h3>

                                {request.adminQuote ? (
                                    <div className="mb-0 flex-1 flex flex-col justify-center text-center p-8 rounded-3xl bg-indigo-600/5 ring-1 ring-indigo-600/10">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{isAr ? 'السعر النهائي' : 'FINAL PRICE QUOTE'}</p>
                                        <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-2 truncate">
                                            {request.adminQuote.toLocaleString()} <span className="text-xl font-bold">EGP</span>
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'شامل ضريبة الصناعة اليدوية' : 'Includes handmade tax'}</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl">
                                        <Sparkles size={32} className="text-amber-500 animate-pulse mb-4" />
                                        <p className="font-bold text-slate-900 dark:text-white mb-1">{isAr ? 'جاري الدراسة' : 'Under Study'}</p>
                                        <p className="text-sm text-slate-500">{isAr ? 'سنقوم بوضع السعر المناسب قريباً جداً.' : 'We will set a fair price very soon.'}</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Order Specific Chat Section */}
                        <div className="mb-16">
                            <OrderChat
                                orderId={id as string}
                                isChatOpen={request.isChatOpen}
                                isAdmin={false}
                            />
                        </div>

                        {/* Deposit Request Card */}
                        <AnimatePresence>
                            {request.depositStatus === 'Requested' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="mb-16"
                                >
                                    <div className="glass-card rounded-[2.5rem] p-10 border-amber-500/20 bg-amber-500/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-[100px] -mr-10 -mt-10" />
                                        <div className="flex items-center gap-6 mb-10">
                                            <div className="w-16 h-16 rounded-[2rem] bg-amber-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
                                                <DollarSign size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                                    {isAr ? 'مطلوب عربون' : 'Deposit Required'}
                                                </h3>
                                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                                                    {isAr ? 'مبلغ العربون المستحق:' : 'Required down payment:'} <span className="text-amber-600 ml-1">{request.depositAmount} EGP</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="p-6 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-amber-500/10">
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                                    {isAr ? 'برجاء دفع مبلغ العربون عبر محفظة فودافون كاش أو إنستباي، ورفع لقطة شاشة للإيصال أدناه لتأكيد طلبك.' : 'Please pay the deposit via Vodafone Cash or InstaPay, and upload a screenshot of the receipt below to confirm your order.'}
                                                </p>
                                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                                                        <Phone size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-0.5">{isAr ? 'رقم التحويل' : 'PAYMENT NUMBER'}</p>
                                                        <p className="text-lg font-black text-slate-900 dark:text-white">
                                                            {ADMIN_WHATSAPP.startsWith('20') ? '0' + ADMIN_WHATSAPP.substring(2) : ADMIN_WHATSAPP}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                                                    {isAr ? 'رفع إثبات الدفع' : 'UPLOAD PAYMENT PROOF'}
                                                </p>
                                                <ImageUpload
                                                    images={request.depositScreenshot ? [request.depositScreenshot] : []}
                                                    onChange={async (imgs) => {
                                                        if (imgs.length > 0) {
                                                            const res = await fetch(`/api/custom-requests/${id}`, {
                                                                method: 'PATCH',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ depositScreenshot: imgs[0] })
                                                            });
                                                            if (res.ok) fetchRequest();
                                                        }
                                                    }}
                                                    maxFiles={1}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {request.depositStatus === 'Pending' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-16 p-10 rounded-[3rem] bg-indigo-600/5 border-2 border-dashed border-indigo-600/20 text-center"
                                >
                                    <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-indigo-600/30">
                                        <Clock size={32} className="animate-spin-slow" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
                                        {isAr ? 'جاري مراجعة الدفع' : 'Payment Under Review'}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium">
                                        {isAr ? 'لقد تلقينا إيصال الدفع الخاص بك. سنقوم بمراجعته وتفعيل طلبك في أقرب وقت ممكن.' : 'We have received your payment proof. We will review it and activate your order shortly.'}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Checkout Form for priced items */}
                        <AnimatePresence>
                            {isPriced && !isConfirmed && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-16 overflow-hidden"
                                >
                                    <div className="glass-card rounded-[2.5rem] p-10 border-emerald-500/20 bg-emerald-500/5">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                                                <Truck size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{isAr ? 'تأكيد وشحن' : 'Confirm & Buy'}</h3>
                                                <p className="text-sm text-slate-500 font-medium">{isAr ? 'أدخل بيانات الشحن لإتمام طلبك وبدء التنفيذ.' : 'Enter shipping details to confirm your order.'}</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-1">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">{isAr ? 'المدينة' : 'City'}</label>
                                                <input
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    placeholder={isAr ? "مثلاً: القاهرة" : "e.g. Cairo"}
                                                    required
                                                    className="input-field bg-white/50 dark:bg-slate-950/50 border-slate-100 dark:border-white/5 h-14"
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
                                                <input
                                                    type="text"
                                                    value={request.userPhone}
                                                    disabled
                                                    className="input-field bg-slate-100 dark:bg-white/5 border-none h-14 opacity-50 cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">{isAr ? 'العنوان بالتفصيل' : 'Detailed Address'}</label>
                                                <textarea
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    placeholder={isAr ? "الشارع، المنطقة، رقم المبنى..." : "Street, Area, Building number..."}
                                                    required
                                                    rows={3}
                                                    className="input-field bg-white/50 dark:bg-slate-950/50 border-slate-100 dark:border-white/5 py-4 min-h-[100px]"
                                                />
                                            </div>
                                            <div className="md:col-span-2 mt-4">
                                                <button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="premium-button w-full py-5 rounded-2xl flex items-center justify-center gap-4 text-lg shadow-2xl shadow-indigo-600/20"
                                                >
                                                    {submitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                                    {isAr ? 'تأكيد الطلب وبدء الحياكة 🧶' : 'Confirm & Start Crafting 🧶'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Shipping Details if confirmed */}
                        {isConfirmed && request.shippingDetails && (
                            <motion.div
                                className="glass-card rounded-[2.5rem] p-10 mb-16 border-emerald-500/10"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                                    <MapPin size={20} className="text-emerald-500" />
                                    {isAr ? 'بيانات الشحن' : 'Shipping Info'}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? 'المدينة' : 'CITY'}</p>
                                        <p className="font-bold text-slate-900 dark:text-white uppercase">{request.shippingDetails.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? 'رقم الهاتف' : 'PHONE'}</p>
                                        <p className="font-bold text-slate-900 dark:text-white font-mono">{request.shippingDetails.phone}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? 'العنوان' : 'ADDRESS'}</p>
                                        <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{request.shippingDetails.address}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-4 mb-12">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shadow-inner">
                                    <Clock size={24} className="text-indigo-500" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-widest uppercase">{isAr ? 'الجدول الزمني' : 'Timeline'}</h2>
                            </div>
                            <Timeline entries={request.timeline} currentStatus={request.status} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

