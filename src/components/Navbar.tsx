'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
    Menu, X, User, LogOut, LayoutDashboard, Settings,
    Moon, Sun, ShoppingBag, Smartphone, Palette, Truck, Package, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const { t, toggleTheme, isDark } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const { totalItems } = useCart();
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 15);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Balanced navigation links for all visitors + personalized for members
    const navLinks = [
        { href: '/', label: 'Home', icon: Smartphone },
        { href: '/shop', label: 'Shop', icon: ShoppingBag },
        { href: '/custom', label: 'Custom Order', icon: Palette },
        { href: '/track', label: 'Track Order', icon: Truck },
        ...(user ? [{ href: '/orders', label: 'My Orders', icon: Package }] : []),
    ];

    const sidebarVariants = {
        closed: {
            x: '100%',
            opacity: 0,
            transition: { type: 'spring', damping: 35, stiffness: 350 }
        },
        open: {
            x: 0,
            opacity: 1,
            transition: { type: 'spring', damping: 35, stiffness: 350, staggerChildren: 0.08, delayChildren: 0.15 }
        }
    };

    const itemVariants = {
        closed: { x: 20, opacity: 0 },
        open: { x: 0, opacity: 1 }
    };

    return !isAdmin ? (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
                    ? 'h-16 md:h-18 bg-white/85 dark:bg-[#070c09]/90 backdrop-blur-2xl border-b border-slate-200/60 dark:border-white/10 shadow-sm'
                    : 'h-18 md:h-20 bg-white/40 dark:bg-black/20 backdrop-blur-md border-b border-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

                    {/* Left: Brand Identity */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0">
                        <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-[#859F84]/20 to-[#a78bfa]/20 p-1 flex items-center justify-center border border-white/20 dark:border-white/10 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                            <img
                                src="/logo.png"
                                alt="BibaStore"
                                className="w-full h-full object-contain filter drop-shadow-sm"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none font-outfit">
                                    BibaStore
                                </span>
                            </div>
                            <span className="text-[10px] text-[#859F84] dark:text-[#a78bfa] font-bold tracking-widest uppercase mt-0.5 leading-none">
                                Handmade Crochet
                            </span>
                        </div>
                    </Link>

                    {/* Center: Desktop Navigation Island */}
                    <nav className="hidden md:flex items-center p-1.5 rounded-full bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 backdrop-blur-md shadow-inner">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${isActive
                                        ? 'text-white dark:text-white shadow-sm'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNavPill"
                                            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#859F84] to-[#708970] dark:from-[#859F84] dark:to-[#a78bfa]"
                                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Unified Action Controls (All strictly h-10) */}
                    <div className="flex items-center gap-2.5 shrink-0">

                        {/* Theme Switcher */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/10 transition-all active:scale-95 shadow-sm"
                            aria-label="Toggle Theme"
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDark ? <Sun size={17} /> : <Moon size={17} />}
                        </button>

                        {/* Cart Trigger */}
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative h-10 px-3.5 rounded-full flex items-center gap-2 bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/10 transition-all active:scale-95 shadow-sm"
                            aria-label="View Cart"
                        >
                            <ShoppingBag size={18} className="text-[#859F84] dark:text-[#a78bfa]" />
                            <span className="text-xs font-bold hidden sm:inline">Cart</span>
                            {totalItems > 0 && (
                                <span className="w-5 h-5 -mr-1 rounded-full bg-gradient-to-r from-[#859F84] to-[#a78bfa] text-white text-[10px] font-black flex items-center justify-center shadow-md animate-in zoom-in">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* User Account / Login */}
                        {user ? (
                            <Link
                                href="/settings"
                                className="h-10 pl-1.5 pr-3.5 rounded-full flex items-center gap-2.5 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/10 transition-all active:scale-95 shadow-sm group"
                            >
                                <div className="w-7 h-7 rounded-full bg-[#859F84] text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden shrink-0">
                                    {user.image ? (
                                        <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        (user.name || user.email).charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[80px] truncate hidden sm:inline">
                                    {user.name ? user.name.split(' ')[0] : 'Account'}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="h-10 px-4 rounded-full flex items-center gap-2 bg-gradient-to-r from-[#859F84] to-[#a78bfa] text-white text-xs font-bold shadow-md hover:shadow-lg hover:brightness-105 transition-all active:scale-95"
                            >
                                <User size={15} />
                                <span>Sign In</span>
                            </Link>
                        )}

                        {/* Mobile Menu Hamburger */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/10 transition-all active:scale-95 shadow-sm"
                            aria-label="Open Navigation Menu"
                        >
                            <Menu size={19} />
                        </button>
                    </div>

                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[200] md:hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Drawer Body */}
                        <motion.div
                            variants={sidebarVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-[#0c120f] shadow-2xl overflow-hidden flex flex-col border-l border-slate-200/60 dark:border-white/10"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#859F84]/20 p-1 flex items-center justify-center border border-white/10">
                                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-none font-outfit">BibaStore</h2>
                                        <p className="text-[10px] text-[#859F84] dark:text-[#a78bfa] font-bold tracking-widest uppercase mt-1">Handmade Crochet</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 flex items-center justify-center active:scale-90 transition-all hover:bg-slate-200 dark:hover:bg-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Drawer Navigation Links */}
                            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Menu</p>
                                    <div className="grid gap-2">
                                        {navLinks.map((link) => {
                                            const isActive = pathname === link.href;
                                            return (
                                                <motion.div key={link.href} variants={itemVariants}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${isActive
                                                            ? 'bg-gradient-to-r from-[#859F84] to-[#a78bfa] text-white shadow-md'
                                                            : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                                                            }`}
                                                    >
                                                        <link.icon size={18} />
                                                        <span>{link.label}</span>
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Appearance Switch */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Theme</p>
                                    <motion.div variants={itemVariants} className="p-1 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                        <button
                                            onClick={toggleTheme}
                                            className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                                                    {isDark ? <Sun size={17} /> : <Moon size={17} />}
                                                </div>
                                                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">Mode</span>
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#859F84] dark:text-[#a78bfa]">
                                                {isDark ? 'Dark' : 'Light'}
                                            </span>
                                        </button>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Drawer Footer Account Section */}
                            <div className="p-6 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5">
                                {user ? (
                                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                                        <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#859F84] text-white flex items-center justify-center font-bold overflow-hidden shadow-sm">
                                                {user.image ? (
                                                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    (user.name || user.email).charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name || user.email.split('@')[0]}</p>
                                                <button onClick={logout} className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Sign Out</button>
                                            </div>
                                        </Link>
                                        <div className="flex items-center gap-2">
                                            <Link href="/settings" onClick={() => setIsOpen(false)} className="w-9 h-9 bg-slate-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-slate-500">
                                                <Settings size={16} />
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link href="/admin" onClick={() => setIsOpen(false)} className="w-9 h-9 bg-[#859F84] text-white rounded-xl flex items-center justify-center shadow-md">
                                                    <LayoutDashboard size={16} />
                                                </Link>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div variants={itemVariants}>
                                        <Link
                                            href="/auth/login"
                                            onClick={() => setIsOpen(false)}
                                            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#859F84] to-[#a78bfa] text-white font-bold flex items-center justify-center text-sm shadow-md"
                                        >
                                            Sign In / Register
                                        </Link>
                                    </motion.div>
                                )}
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    ) : null;
}
