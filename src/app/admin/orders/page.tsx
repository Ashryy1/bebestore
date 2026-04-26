'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Clock, CheckCircle, Package, Search, Filter, Loader2, ChevronRight, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type OrderStatus = 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';

const statusConfig: Record<OrderStatus, { color: string; bg: string; dot: string }> = {
    Pending: { color: 'text-amber-600', bg: 'bg-amber-600/5', dot: 'bg-amber-500' },
    Shipped: { color: 'text-blue-600', bg: 'bg-blue-600/5', dot: 'bg-blue-600' },
    Completed: { color: 'text-emerald-600', bg: 'bg-emerald-600/5', dot: 'bg-emerald-500' },
    Cancelled: { color: 'text-red-600', bg: 'bg-red-600/5', dot: 'bg-red-500' },
};

export default function AdminOrdersPage() {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Fetch orders error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Update status error:', error);
        }
    };

    const filtered = (Array.isArray(orders) ? orders : []).filter((o) => {
        const matchesFilter = filter ? o.status === filter : true;
        const matchesSearch = searchTerm
            ? o.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.userPhone?.includes(searchTerm) ||
            o.source?.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        return matchesFilter && matchesSearch;
    });

    const statusCounts = (Array.isArray(orders) ? orders : []).reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Store Orders</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">Manage your premium shop sales</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Order # or Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field bg-slate-100 dark:bg-white/5 border-none h-14 pl-12 pr-6 rounded-2xl w-64 text-sm focus:ring-2 focus:ring-indigo-500/20 font-bold"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none ring-1 ring-slate-100 dark:ring-white/5 p-2 rounded-[2rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                <button
                    onClick={() => setFilter('')}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${!filter
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-105'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                >
                    All ({orders.length})
                </button>
                {(['Pending', 'Shipped', 'Completed', 'Cancelled'] as OrderStatus[]).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2 ${filter === status
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-105'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'
                            }`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${filter === status ? 'bg-white' : statusConfig[status]?.dot || 'bg-slate-400'}`} />
                        {status} ({statusCounts[status] || 0})
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-40 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 animate-pulse" />
                    ))
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filtered.map((order, i) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 relative group hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-[2rem] bg-indigo-600/5 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                            <ShoppingCart size={32} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">#{order.orderNumber}</h3>
                                                <div className="flex gap-2">
                                                    <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-current ${statusConfig[order.status as OrderStatus]?.bg || 'bg-slate-500/5'} ${statusConfig[order.status as OrderStatus]?.color || 'text-slate-500'}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-current ${order.source === 'custom' ? 'bg-violet-600/5 text-violet-600' : 'bg-blue-600/5 text-blue-600'}`}>
                                                        {order.source === 'custom' ? 'Custom' : 'Shop'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <User size={12} className="text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-500">{order.userName}</span>
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/10" />
                                                <span className="text-xs font-bold text-slate-500">{order.userPhone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{order.totalAmount.toLocaleString()} EGP</p>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                className="bg-slate-100 dark:bg-white/5 border-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:ring-0 cursor-pointer"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            <Link
                                                href={order.source === 'custom' ? `/admin/requests/${order._id}` : `/admin/orders/${order._id}`}
                                                className="text-center text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                                            >
                                                {order.source === 'custom' ? 'View Details' : `View Items (${order.items?.length || 0})`}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {!loading && filtered.length === 0 && (
                <div className="text-center py-24">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-600/5 flex items-center justify-center mx-auto mb-6">
                        <Package size={32} className="text-indigo-600/20" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">No orders found</h3>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Try a different filter</p>
                </div>
            )}
        </div>
    );
}
