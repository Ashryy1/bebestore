'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, ArrowLeft, Loader2, RefreshCw, Copy, MessageSquare, Check } from 'lucide-react';
import Link from 'next/link';

export default function UserOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const { lang, t } = useLanguage();
    const isAr = lang === 'ar';
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user) {
            fetchOrders();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Fetch all orders and filter for the current user
            const res = await fetch('/api/orders');
            const data = await res.json();
            const userOrders = data.orders?.filter((o: any) => o.userId === user?.userId) || [];
            setOrders(userOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            console.error('Fetch orders error:', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId: string) => {
        if (!confirm(isAr ? 'هل أنت متأكد من إلغاء الطلب؟' : 'Are you sure you want to cancel?')) return;

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Cancelled' })
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Cancel error:', error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert(isAr ? 'تم نسخ رقم الطلب' : 'Order ID copied');
    };

    const openSupport = (orderId: string) => {
        const msg = isAr
            ? `مرحباً، لدي استفسار بخصوص الطلب رقم #${orderId}`
            : `Hello, I have an inquiry about order #${orderId}`;
        window.dispatchEvent(new CustomEvent('open-support-with-msg', { detail: msg }));
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32 px-6">
                <div className="text-center">
                    <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">{isAr ? 'يجب تسجيل الدخول' : 'Login Required'}</h2>
                    <Link href="/auth/login" className="premium-button px-8 py-3 rounded-2xl inline-block">
                        {isAr ? 'تسجيل الدخول' : 'Login Now'}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <Link href="/shop" className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all">
                            <ArrowLeft size={20} className={isAr ? 'rotate-180' : ''} />
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{isAr ? 'طلباتي' : 'My Orders'}</h1>
                    </div>
                    <button onClick={fetchOrders} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-indigo-600 transition-all">
                        <RefreshCw size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 glass-card rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10">
                            <Package size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" />
                            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">{isAr ? 'لا يوجد طلبات سابقة' : 'No orders found'}</h3>
                        </div>
                    ) : (
                        orders.map((order, idx) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="glass-card rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-black/[0.02]"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${order.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                                            order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' :
                                                order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    'bg-red-500/10 text-red-500'
                                            }`}>
                                            {order.status === 'Pending' ? <Clock size={24} /> :
                                                order.status === 'Completed' ? <CheckCircle size={24} /> :
                                                    <Package size={24} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Order #{order.orderNumber}</p>
                                                <button
                                                    onClick={() => copyToClipboard(order.orderNumber)}
                                                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-indigo-600 transition-all"
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                            <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                                {new Date(order.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 sm:gap-4">
                                        <div className="text-right mr-2 sm:mr-4">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? 'الإجمالي' : 'Total'}</p>
                                            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{order.totalAmount.toLocaleString()} EGP</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => openSupport(order.orderNumber)}
                                                className="p-3 rounded-xl bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                title={isAr ? 'تواصل مع الدعم' : 'Contact Support'}
                                            >
                                                <MessageSquare size={18} />
                                            </button>
                                            {order.status === 'Pending' && (
                                                <button
                                                    onClick={() => cancelOrder(order._id)}
                                                    className="px-6 py-3 rounded-xl bg-red-500/5 text-red-500 font-black uppercase tracking-widest text-[10px] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-sm h-full"
                                                >
                                                    {isAr ? 'إلغاء' : 'Cancel'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5">
                                    <div className="flex flex-wrap gap-4">
                                        {order.items.map((item: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0 pr-2">
                                                    <p className="text-[10px] font-black text-slate-900 dark:text-white truncate max-w-[120px] uppercase tracking-tighter">{item.title}</p>
                                                    <p className="text-[9px] font-bold text-slate-400">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
