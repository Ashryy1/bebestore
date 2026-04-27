'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Clock, Package, Truck, CheckCircle, Copy, Loader2, MessageCircle, DollarSign, Upload, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ADMIN_WHATSAPP } from '@/lib/utils';
import OrderChat from '@/components/OrderChat';
import ImageUpload from '@/components/ImageUpload';

export default function OrderDetailPage() {
    const { id } = useParams();
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            if (data.order) {
                setOrder(data.order);
                // Clear unread indicator if it exists
                if (data.order.hasUnreadUpdate) {
                    fetch(`/api/orders/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ hasUnreadUpdate: false }),
                    }).catch(err => console.error('Error clearing unread:', err));
                }
            }
        } catch (error) {
            console.error('Fetch order error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadReceipt = async (image: string) => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ depositScreenshot: image }),
            });
            if (res.ok) fetchOrder();
        } catch (error) {
            console.error('Upload receipt error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 size={48} className="text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-32 text-center px-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                    {isAr ? 'الطلب غير موجود' : 'Order Not Found'}
                </h2>
                <Link href="/track" className="text-indigo-600 font-bold underline">
                    {isAr ? 'العودة للتتبع' : 'Back to Tracking'}
                </Link>
            </div>
        );
    }

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
                            ID: {order.orderNumber}
                        </span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(order.orderNumber);
                                alert(isAr ? 'تم نسخ المعرف!' : 'ID Copied!');
                            }}
                            className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>

                <motion.div
                    className="glass-card rounded-[3rem] p-8 md:p-12 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div>
                            <span className="badge-brand mb-4">{isAr ? 'طلب منتج' : 'Shop Order'}</span>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                {isAr ? 'حالة الطلب' : 'Order Status'}
                            </h1>
                        </div>
                        <div className={`px-8 py-4 rounded-3xl border-2 flex items-center gap-3 ${order.status === 'Completed' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' : 'border-indigo-500/20 bg-indigo-500/5 text-indigo-500'}`}>
                            <div className={`w-3 h-3 rounded-full animate-pulse ${order.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                            <span className="text-lg font-black uppercase tracking-widest">{order.status}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                    <p className="text-sm text-slate-500 font-medium">
                                        {isAr ? 'الكمية:' : 'Qty:'} {item.quantity}
                                        {item.size && ` • ${isAr ? 'المقاس:' : 'Size:'} ${item.size}`}
                                        {item.color && ` • ${isAr ? 'اللون:' : 'Color:'} ${item.color}`}
                                        • {item.price} ج.م
                                    </p>
                                    {item.note && (
                                        <p className="text-[10px] text-slate-400 italic mt-1">
                                            {isAr ? 'ملاحظة:' : 'Note:'} {item.note}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                                        {(item.price * item.quantity).toLocaleString()} <span className="text-xs">EGP</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-between items-center p-8 rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{isAr ? 'إجمالي الطلب' : 'TOTAL AMOUNT'}</p>
                            <p className="text-4xl font-black">{order.totalAmount.toLocaleString()} <span className="text-sm opacity-70">EGP</span></p>
                        </div>
                        <ShoppingBag size={40} className="opacity-20" />
                    </div>
                </motion.div>

                {/* Deposit Tracker */}
                {order.depositStatus !== 'None' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-[3rem] p-8 md:p-12 mb-8 border-l-4 border-amber-500"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">
                                    {isAr ? 'تأكيد العربون' : 'Deposit Confirmation'}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                    {isAr ? 'حالة الدفع:' : 'Payment Status:'} {order.depositStatus}
                                </p>
                            </div>
                        </div>

                        {order.depositStatus === 'Requested' && (
                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl bg-amber-500/5 text-amber-700 text-sm font-bold">
                                    {isAr ? (
                                        `يرجى تحويل ${order.depositAmount} ج.م إلى رقم محفظة فودافون كاش الخاص بنا، ثم قم برفع لقطة شاشة للتحويل هنا.`
                                    ) : (
                                        `Please transfer EGP ${order.depositAmount} to our Vodafone Cash wallet, then upload the translation screenshot here.`
                                    )}
                                </div>
                                <ImageUpload
                                    images={[]}
                                    onChange={(images) => images[0] && handleUploadReceipt(images[0])}
                                    maxFiles={1}
                                />
                            </div>
                        )}

                        {order.depositStatus === 'Pending' && (
                            <div className="flex items-center gap-4 p-6 rounded-2xl bg-indigo-500/5 text-indigo-600 font-bold">
                                <Clock size={20} className="animate-spin" />
                                <span>{isAr ? 'جاري مراجعة إيصال الدفع من قبل الإدارة...' : 'Reviewing payment proof by administration...'}</span>
                            </div>
                        )}

                        {order.depositStatus === 'Paid' && (
                            <div className="flex items-center gap-4 p-6 rounded-2xl bg-emerald-500/5 text-emerald-600 font-bold">
                                <ShieldCheck size={20} />
                                <span>{isAr ? 'تم تأكيد دفع العربون بنجاح!' : 'Deposit payment confirmed successfully!'}</span>
                            </div>
                        )}

                        {order.depositStatus === 'Rejected' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-6 rounded-2xl bg-red-500/5 text-red-600 font-bold">
                                    <X size={20} />
                                    <span>{isAr ? 'عذراً، تم رفض الإيصال. يرجى المحاولة مرة أخرى أو التواصل معنا.' : 'Sorry, the proof was rejected. Please try again or contact us.'}</span>
                                </div>
                                <ImageUpload
                                    images={[]}
                                    onChange={(images) => images[0] && handleUploadReceipt(images[0])}
                                    maxFiles={1}
                                />
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Specific Order Chat */}
                <div className="mb-8">
                    <OrderChat orderId={id as string} isChatOpen={order.isChatOpen} isAdmin={false} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card rounded-[2.5rem] p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock size={20} className="text-slate-400" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{isAr ? 'معلومات العميل' : 'CUSTOMER INFO'}</h3>
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">{order.userName}</p>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{order.userPhone}</p>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <MessageCircle size={20} className="text-slate-400" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{isAr ? 'تواصل معنا' : 'STAY CONNECTED'}</h3>
                        </div>
                        <button
                            onClick={() => window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(`مرحباً، أستفسر عن طلبي رقم #${order.orderNumber}`)}`, '_blank')}
                            className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                        >
                            <MessageCircle size={16} />
                            {isAr ? 'تواصل عبر واتساب' : 'WhatsApp Us'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
