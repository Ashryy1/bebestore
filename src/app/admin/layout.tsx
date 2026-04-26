'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, MessageSquare, Tag, Users as UsersIcon, DollarSign, ArrowLeft, LogOut, Menu, X, ShieldCheck, ChevronRight, MessageCircle } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, loading, logout } = useAuth();
    const { lang, t } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAr = lang === 'ar';

    const sidebarLinks = [
        { href: '/admin', icon: LayoutDashboard, label: t('dashboard') },
        { href: '/admin/products', icon: Package, label: t('products') },
        { href: '/admin/categories', icon: Tag, label: t('sections') },
        { href: '/admin/requests', icon: MessageSquare, label: t('requests') },
        { href: '/admin/support', icon: MessageCircle, label: isAr ? 'الدعم' : 'Support' },
        { href: '/admin/users', icon: UsersIcon, label: t('users') },
        { href: '/admin/finance', icon: DollarSign, label: t('finance') },
    ];

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user || user.role !== 'admin') return null;

    const isRtl = lang === 'ar';

    return (
        <div className="min-h-screen flex bg-slate-50/50 dark:bg-slate-950 transition-colors duration-500">
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex w-80 flex-col fixed top-0 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'} bottom-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-slate-200/50 dark:border-white/5`}>
                {/* Logo Section */}
                <div className="p-8 pb-10">
                    <Link href="/admin" className="flex items-center gap-4">
                        <div className="w-16 h-16 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white leading-none">BIBASTORE</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">{t('masterControl')}</span>
                        </div>
                    </Link>
                </div>

                {/* Primary Nav */}
                <nav className="flex-1 px-4 space-y-2">
                    <div className="px-4 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('navigation')}</span>
                    </div>
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all duration-500 group relative overflow-hidden ${isActive
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                <link.icon size={20} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                                {link.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className={`absolute ${isRtl ? 'left-4' : 'right-4'} w-1.5 h-1.5 rounded-full bg-white`}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-6 mt-auto space-y-4">
                    <div className="p-4 rounded-[1.5rem] bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{t('admin')}</p>
                                <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('store')}</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500"
                        >
                            <LogOut size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('exit')}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className={`lg:hidden fixed top-0 left-0 right-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-b border-slate-100 dark:border-white/5 px-6 py-4 flex items-center justify-between`}>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white active:scale-95 transition-all"
                >
                    <Menu size={20} />
                </button>
                <span className="font-black tracking-tighter text-xl uppercase italic">BibaStore Admin</span>
                <div className="w-14 h-14 flex items-center justify-center"><img src="/logo.png" className="w-full h-full object-contain" /></div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-[200]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: isRtl ? '100%' : '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: isRtl ? '100%' : '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={`absolute ${isRtl ? 'right-0' : 'left-0'} top-0 bottom-0 w-80 bg-white dark:bg-slate-950 p-8 flex flex-col shadow-2xl overflow-hidden`}
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 flex items-center justify-center"><img src="/logo.png" className="w-full h-full object-contain" /></div>
                                    <span className="font-black text-xl tracking-tighter uppercase">{t('adminMenu')}</span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 flex items-center justify-center active:scale-90 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-3 overflow-y-auto pr-2">
                                {sidebarLinks.map((link) => {
                                    const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${isActive
                                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                                : 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 border border-transparent hover:border-indigo-600/10'
                                                }`}
                                        >
                                            <link.icon size={20} />
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="pt-8 border-t border-slate-100 dark:border-white/5 space-y-4">
                                <div className="flex items-center gap-4 px-4">
                                    <div className="w-14 h-14 flex items-center justify-center"><img src="/logo.png" className="w-full h-full object-contain" /></div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white leading-none">Admin</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/"
                                        className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 font-extrabold uppercase tracking-widest text-xs hover:text-indigo-600 transition-colors"
                                    >
                                        <ArrowLeft size={18} />
                                        {t('store')}
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 text-red-500 font-extrabold uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all duration-300"
                                    >
                                        <LogOut size={18} />
                                        {t('exit')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-80 min-h-screen">
                <div className="pt-24 lg:pt-12 px-6 lg:px-12 pb-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

