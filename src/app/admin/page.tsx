'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, MessageSquare, TrendingUp, Users, ArrowUpRight, Clock, Plus, Zap, Activity } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardStats {
    totalProducts: number;
    pendingRequests: number;
    revenue: number;
    totalCustomers: number;
}

const colorConfig: Record<string, string> = {
    indigo: 'bg-indigo-600 shadow-indigo-600/20 text-indigo-600',
    amber: 'bg-amber-500 shadow-amber-500/20 text-amber-500',
    emerald: 'bg-emerald-500 shadow-emerald-500/20 text-emerald-500',
    violet: 'bg-violet-600 shadow-violet-600/20 text-violet-600',
};

export default function AdminDashboard() {
    const { user } = useAuth();
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    fetch('/api/admin/stats'),
                    fetch('/api/orders')
                ]);

                const stats = await statsRes.json();
                const activityData = await activityRes.json();

                setStatsData(stats);
                setRecentActivity(activityData.orders?.slice(0, 5) || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        {
            label: isAr ? 'إجمالي المنتجات' : 'Total Products',
            value: statsData?.totalProducts || 0,
            change: isAr ? 'المخزون الحالي' : 'Live inventory',
            icon: Package,
            color: 'indigo',
            link: '/admin/products'
        },
        {
            label: isAr ? 'الطلبات المعلقة' : 'Pending Orders',
            value: statsData?.pendingRequests || 0,
            change: isAr ? 'في انتظار البدء' : 'Awaiting action',
            icon: MessageSquare,
            color: 'amber',
            link: '/admin/orders'
        },
        {
            label: isAr ? 'إجمالي الأرباح' : 'Total Revenue',
            value: statsData?.revenue?.toLocaleString() || '0',
            change: isAr ? 'صافي الدخل' : 'Net earnings',
            icon: TrendingUp,
            color: 'emerald',
            link: '/admin/finance',
            isCurrency: true
        },
        {
            label: isAr ? 'العملاء' : 'Customers',
            value: statsData?.totalCustomers || 0,
            change: isAr ? 'أعضاء المنصة' : 'Platform members',
            icon: Users,
            color: 'violet',
            link: '/admin/users'
        },
    ];

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="badge-brand mb-4">Admin Overview</span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                        Welcome, <span className="gradient-text">{user?.email?.split('@')[0] || 'Admin'}</span> 👋
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/products/new" className="premium-button px-6 py-3 rounded-2xl flex items-center gap-2">
                        <Plus size={18} />
                        <span className="text-sm font-black uppercase tracking-widest">New Product</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="h-64 rounded-[2rem] bg-slate-100 dark:bg-white/5 animate-pulse" />
                        ))
                    ) : (
                        stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={stat.link} className="block glass-card rounded-[2rem] p-8 group relative overflow-hidden transition-all duration-500 hover:scale-[1.02]">
                                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-10 ${stat.color === 'indigo' ? 'bg-indigo-600' :
                                        stat.color === 'amber' ? 'bg-amber-500' :
                                            stat.color === 'emerald' ? 'bg-emerald-500' : 'bg-violet-600'
                                        }`} />

                                    <div className="flex items-center justify-between mb-8">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl ${colorConfig[stat.color].split(' ')[0]} ${colorConfig[stat.color].split(' ')[1]}`}>
                                            <stat.icon size={24} />
                                        </div>
                                        <div className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors">
                                            <ArrowUpRight size={20} />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {stat.value}
                                            {stat.isCurrency && <span className="text-lg font-bold ml-1 text-slate-400 tracking-normal">EGP</span>}
                                        </p>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${colorConfig[stat.color].split(' ')[2]}`}>
                                            {stat.change}
                                        </span>
                                        <Zap size={14} className="text-slate-200 dark:text-slate-800" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Recent Activity */}
                <motion.div
                    className="lg:col-span-12 glass-card rounded-[2.5rem] p-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                                <Clock size={24} className="text-indigo-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Activity</h2>
                        </div>
                        <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                            View All History
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-24 rounded-[1.5rem] bg-slate-50 dark:bg-white/5 animate-pulse" />
                            ))
                        ) : recentActivity.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 font-bold uppercase text-xs tracking-widest italic">
                                No recent activity found
                            </div>
                        ) : (
                            recentActivity.map((activity, i) => (
                                <motion.div
                                    key={activity._id}
                                    className="flex items-center gap-6 p-6 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300 group ring-1 ring-transparent hover:ring-indigo-500/10 cursor-pointer"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => {
                                        if (activity.source === 'custom') {
                                            window.location.href = `/admin/requests/${activity._id}`;
                                        } else {
                                            window.location.href = `/admin/orders/${activity._id}`;
                                        }
                                    }}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="text-2xl font-black text-indigo-600 italic">
                                            {activity.userName?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="font-black text-slate-900 dark:text-white text-lg truncate">
                                                {activity.source === 'custom' ? 'New Custom Request' : 'New Shop Order'}
                                            </p>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${activity.status === 'Pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                                                }`}>
                                                {activity.status}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{activity.userName} • {activity.userPhone || activity.userEmail}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest shrink-0">
                                        {new Date(activity.createdAt).toLocaleDateString()}
                                    </span>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

