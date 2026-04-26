'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, User, Phone, MapPin, Calendar, CreditCard, ShoppingBag, Clock, CheckCircle, Truck, XCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders`);
            const data = await res.json();
            const found = data.orders.find((o: any) => o._id === id);
            setOrder(found);
        } catch (error) {
            console.error('Fetch order error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    if (!order) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-black mb-4">Order not found</h2>
            <button onClick={() => router.back()} className="premium-button px-8 py-3">Go Back</button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex items-center gap-6">
                <button onClick={() => router.back()} className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all">
                    <ArrowLeft size={24} className={isAr ? 'rotate-180' : ''} />
                </button>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Order #{order.orderNumber}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Placed on {new Date(order.createdAt).toLocaleString()}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/10" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{order.status}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                            <ShoppingBag className="text-slate-400" size={20} />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Order Items</h2>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {order.items.map((item: any, i: number) => (
                                <div key={i} className="py-6 first:pt-0 last:pb-0 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs font-bold text-slate-400">Qty: {item.quantity}</span>
                                                {item.size && (
                                                    <>
                                                        <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/10" />
                                                        <span className="text-xs font-black text-indigo-500 uppercase">Size: {item.size}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">{(item.price * item.quantity).toLocaleString()} <span className="text-[10px] font-bold">EGP</span></p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CreditCard className="text-slate-400" size={20} />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Total Calculation</h2>
                        </div>
                        <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{order.totalAmount.toLocaleString()} <span className="text-sm font-bold uppercase">EGP</span></p>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-6">
                    <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <User className="text-slate-400" size={18} />
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Customer</h2>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{order.userName}</h3>
                            <div className="flex items-center gap-3 mt-2 text-slate-500">
                                <Phone size={14} />
                                <span className="text-sm font-bold">{order.userPhone}</span>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="text-slate-400" size={18} />
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Shipping</h2>
                            </div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                {order.shippingDetails?.address}
                            </p>
                            <p className="text-sm font-black text-slate-900 dark:text-white mt-1 uppercase tracking-widest">{order.shippingDetails?.city}</p>
                        </div>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-slate-400" size={18} />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Status History</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-emerald-500">
                                <CheckCircle size={16} />
                                <p className="text-[10px] font-black uppercase tracking-widest">Order Confirmed</p>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <Truck size={16} />
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Pending Shipment</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
