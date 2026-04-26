'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
    Menu, X, User, LogOut, LayoutDashboard, Settings,
    Moon, Sun, ChevronRight, ShoppingBag,
    Globe, Smartphone, Search, Heart,
    Scissors, Palette, Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const { lang, setLang, t, theme, toggleTheme, isDark } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLang = () => {
        setLang(lang === 'en' ? 'ar' : 'en');
    };

    const navLinks = [
        { href: '/', label: t('home'), icon: Smartphone },
        { href: '/shop', label: t('shop'), icon: ShoppingBag },
        { href: '/custom', label: t('custom'), icon: Palette },
        { href: '/track', label: t('track'), icon: Truck },
    ];

    const sidebarVariants = {
        closed: {
            x: lang === 'ar' ? '-100%' : '100%',
            opacity: 0,
            transition: { type: 'spring', damping: 40, stiffness: 400 }
        },
        open: {
            x: 0,
            opacity: 1,
            transition: { type: 'spring', damping: 40, stiffness: 400, staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        closed: { x: lang === 'ar' ? -20 : 20, opacity: 0 },
        open: { x: 0, opacity: 1 }
    };

    return !isAdmin ? (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
                    ? 'py-2 bg-[var(--sh-bg)]/80 backdrop-blur-2xl border-b border-[var(--sh-border)] shadow-xl'
                    : 'py-4 bg-transparent backdrop-blur-[2px]'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="relative w-14 h-14 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500">
                                <img src="/logo.png" alt="BibaStore" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-0" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-[var(--sh-fg)] leading-tight transition-colors duration-500">BibaStore</span>
                                <span className="text-[10px] text-[var(--sh-primary)] font-bold -mt-0.5 tracking-widest uppercase leading-none">Made with Love</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/40 rounded-2xl p-1 backdrop-blur-sm">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${pathname === link.href
                                        ? 'text-[var(--sh-primary)] bg-[var(--sh-bg)] shadow-sm'
                                        : 'text-[var(--sh-fg)] opacity-60 hover:opacity-100 hover:text-[var(--sh-primary)]'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Actions Area */}
                        <div className="flex items-center gap-4">
                            {/* Settings Pill */}
                            <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100/10 dark:bg-black/40 rounded-2xl border border-slate-200/50 dark:border-white/5">
                                <button
                                    onClick={toggleLang}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black text-[var(--sh-fg)] opacity-60 hover:text-[var(--sh-primary)] hover:bg-[var(--sh-bg)] transition-all uppercase tracking-[0.1em]"
                                >
                                    <Globe size={14} className="text-[var(--sh-primary)] opacity-60" />
                                    {lang === 'en' ? 'Arabic' : 'English'}
                                </button>

                                <div className="w-px h-5 bg-slate-200 dark:bg-white/5 mx-1" />

                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-xl text-[var(--sh-fg)] opacity-60 hover:text-[var(--sh-primary)] hover:bg-[var(--sh-bg)] transition-all shadow-sm"
                                >
                                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                                </button>
                            </div>

                            {user ? (
                                <div className="flex items-center gap-2 p-1 bg-slate-100/50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/30">
                                    <Link href="/settings" className="flex items-center gap-3 px-3 py-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
                                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-500/20 overflow-hidden">
                                            {user.image ? (
                                                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="hidden lg:block truncate max-w-[100px]">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none mb-0.5">
                                                {user.role === 'admin' ? t('admin') : 'Member'}
                                            </p>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-none truncate opacity-80">
                                                {user.name || user.email.split('@')[0]}
                                            </p>
                                        </div>
                                    </Link>

                                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700/50 mx-1" />

                                    <div className="flex items-center gap-1 pr-1">
                                        {user.role === 'admin' && (
                                            <Link href="/admin" className="p-2 text-indigo-500 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
                                                <LayoutDashboard size={18} />
                                            </Link>
                                        )}
                                        <button
                                            onClick={logout}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                        >
                                            <LogOut size={18} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/auth/login" className="premium-button text-sm py-2.5 px-6">
                                    <User size={16} className={`${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                                    {t('login')}
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all active:scale-90"
                        >
                            <Menu size={24} className={`transition-all duration-300 ${isOpen ? 'rotate-90 scale-0' : ''}`} />
                            <X size={24} className={`absolute transition-all duration-300 ${isOpen ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[200] md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            variants={sidebarVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'} top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-950 shadow-2xl overflow-hidden`}
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="p-8 pt-12 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-4">
                                        <div className="w-20 h-20 flex items-center justify-center text-white font-black text-2xl">
                                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-none">BibaStore</h2>
                                            <p className="text-xs text-indigo-500 font-bold uppercase tracking-[0.2em] mt-2">Premium Handmade</p>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-12 h-12 rounded-[1.25rem] bg-slate-100 dark:bg-white/5 text-slate-500 flex items-center justify-center active:scale-90 transition-all hover:bg-slate-200 dark:hover:bg-white/10"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <div className="flex-1 p-8 space-y-10 overflow-y-auto">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Navigation</p>
                                        <div className="grid gap-3">
                                            {navLinks.map((link) => (
                                                <motion.div key={link.href} variants={itemVariants}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={`flex items-center gap-4 px-6 py-5 rounded-[2rem] font-black transition-all ${pathname === link.href
                                                            ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20'
                                                            : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-transparent hover:border-indigo-600/20'
                                                            }`}
                                                    >
                                                        <link.icon size={22} />
                                                        <span className="text-sm uppercase tracking-widest">{link.label}</span>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Settings</p>
                                        <motion.div variants={itemVariants} className="p-2 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] space-y-2">
                                            <button onClick={toggleLang} className="flex items-center justify-between w-full p-5 rounded-[2rem] hover:bg-white dark:hover:bg-white/5 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                        <Globe size={20} />
                                                    </div>
                                                    <span className="font-bold text-slate-700 dark:text-slate-200">{lang === 'ar' ? 'اللغة' : 'Language'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{lang === 'ar' ? 'العربية' : 'English'}</span>
                                                    <ChevronRight size={16} className={`text-slate-300 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                                </div>
                                            </button>
                                            <button onClick={toggleTheme} className="flex items-center justify-between w-full p-5 rounded-[2rem] hover:bg-white dark:hover:bg-white/5 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                                                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                                                    </div>
                                                    <span className="font-bold text-slate-700 dark:text-slate-200">{lang === 'ar' ? 'المظهر' : 'Appearance'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{isDark ? 'Dark' : 'Light'}</span>
                                                    <ChevronRight size={16} className={`text-slate-300 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                                </div>
                                            </button>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Footer User Section */}
                                <div className="p-8 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
                                    {user ? (
                                        <motion.div variants={itemVariants} className="flex items-center justify-between">
                                            <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-black overflow-hidden">
                                                    {user.image ? (
                                                        <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        (user.name || user.email).charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.name || user.email.split('@')[0]}</p>
                                                    <button onClick={logout} className="text-[10px] text-red-500 font-black uppercase tracking-widest">Sign Out</button>
                                                </div>
                                            </Link>
                                            <div className="flex items-center gap-2">
                                                <Link href="/settings" onClick={() => setIsOpen(false)} className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-slate-500">
                                                    <Settings size={18} />
                                                </Link>
                                                {user.role === 'admin' && (
                                                    <Link href="/admin" onClick={() => setIsOpen(false)} className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                                                        <LayoutDashboard size={18} />
                                                    </Link>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div variants={itemVariants}>
                                            <Link
                                                href="/auth/login"
                                                onClick={() => setIsOpen(false)}
                                                className="premium-button w-full h-16 rounded-[2rem] flex items-center justify-center uppercase tracking-[0.2em] font-black"
                                            >
                                                Get Started
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    ) : null;
}

