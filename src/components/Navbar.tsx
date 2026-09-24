'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
    Menu, X, User, LayoutDashboard, Settings,
    Moon, Sun, ShoppingBag, Smartphone, Palette, Truck, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const { toggleTheme, isDark } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const { totalItems } = useCart();
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

    const navLinks = [
        { href: '/', label: 'Home', icon: Smartphone },
        { href: '/shop', label: 'Shop', icon: ShoppingBag },
        { href: '/custom', label: 'Custom Order', icon: Palette },
        { href: '/track', label: 'Track Order', icon: Truck },
        ...(user ? [{ href: '/orders', label: 'My Orders', icon: Package }] : []),
    ];

    if (isAdmin) return null;

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${scrolled
                    ? 'bg-[var(--sh-bg)]/95 backdrop-blur-md border-b border-[var(--sh-border)] shadow-sm'
                    : 'bg-[var(--sh-bg)]/75 backdrop-blur-sm border-b border-[var(--sh-border)]/50'
                    }`}
            >
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

                    {/* Left: Brand Identity */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="w-11 h-11 rounded-2xl bg-[var(--sh-card)] border border-[var(--sh-border)] p-1.5 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                            <img
                                src="/logo.png"
                                alt="BibaStore"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-[var(--sh-fg)] font-outfit leading-none">
                                BibaStore
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--sh-primary)] mt-1 leading-none">
                                Handmade Crochet
                            </span>
                        </div>
                    </Link>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1.5 bg-[var(--sh-card)]/80 border border-[var(--sh-border)] px-2.5 py-1.5 rounded-2xl shadow-sm">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                                        ? 'bg-[var(--sh-primary)] text-white shadow-sm font-bold'
                                        : 'text-[var(--sh-fg)]/70 hover:text-[var(--sh-fg)] hover:bg-[var(--sh-hover)]/30'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Actions Controls (Unified 40px Height) */}
                    <div className="flex items-center gap-2.5 shrink-0">

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-xl bg-[var(--sh-card)]/80 border border-[var(--sh-border)] text-[var(--sh-fg)]/80 hover:text-[var(--sh-fg)] hover:bg-[var(--sh-hover)]/40 flex items-center justify-center shadow-sm transition-all active:scale-95"
                            aria-label="Toggle Theme"
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Cart Button */}
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative h-10 px-3.5 rounded-xl bg-[var(--sh-card)]/80 border border-[var(--sh-border)] text-[var(--sh-fg)] hover:bg-[var(--sh-hover)]/40 flex items-center gap-2 shadow-sm transition-all active:scale-95 font-semibold text-sm"
                            aria-label="View Cart"
                        >
                            <ShoppingBag size={18} className="text-[var(--sh-primary)]" />
                            <span className="hidden sm:inline">Cart</span>
                            {totalItems > 0 && (
                                <span className="w-5 h-5 -mr-1 rounded-full bg-[var(--sh-primary)] text-white text-[11px] font-bold flex items-center justify-center shadow-sm animate-in zoom-in">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* User Profile / Login */}
                        {user ? (
                            <Link
                                href="/settings"
                                className="h-10 px-3 rounded-xl bg-[var(--sh-card)]/80 border border-[var(--sh-border)] flex items-center gap-2.5 text-[var(--sh-fg)] hover:bg-[var(--sh-hover)]/40 shadow-sm transition-all active:scale-95 group"
                            >
                                <div className="w-7 h-7 rounded-lg bg-[var(--sh-primary)] text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden shrink-0">
                                    {user.image ? (
                                        <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        (user.name || user.email).charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span className="text-xs font-semibold max-w-[85px] truncate hidden sm:inline">
                                    {user.name ? user.name.split(' ')[0] : 'Account'}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="h-10 px-4 rounded-xl bg-[var(--btn-gradient)] hover:brightness-105 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                            >
                                <User size={15} />
                                <span>Sign In</span>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden w-10 h-10 rounded-xl bg-[var(--sh-card)]/80 border border-[var(--sh-border)] text-[var(--sh-fg)] flex items-center justify-center shadow-sm active:scale-95 transition-all"
                            aria-label="Navigation Menu"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[var(--sh-bg)] border-l border-[var(--sh-border)] shadow-2xl flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-[var(--sh-border)] flex items-center justify-between">
                                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--sh-card)] border border-[var(--sh-border)] p-1.5 flex items-center justify-center">
                                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[var(--sh-fg)] leading-none font-outfit">BibaStore</h2>
                                        <p className="text-[10px] text-[var(--sh-primary)] font-bold tracking-wider uppercase mt-1">Handmade Crochet</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 rounded-xl bg-[var(--sh-card)] border border-[var(--sh-border)] text-[var(--sh-fg)] flex items-center justify-center active:scale-90 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Drawer Links */}
                            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--sh-fg)]/50 ml-1">Menu</p>
                                    <div className="grid gap-2">
                                        {navLinks.map((link) => {
                                            const isActive = pathname === link.href;
                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${isActive
                                                        ? 'bg-[var(--sh-primary)] text-white shadow-sm font-bold'
                                                        : 'bg-[var(--sh-card)] text-[var(--sh-fg)] hover:bg-[var(--sh-hover)]/30 border border-[var(--sh-border)]/50'
                                                        }`}
                                                >
                                                    <link.icon size={18} />
                                                    <span>{link.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Appearance Row */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--sh-fg)]/50 ml-1">Theme</p>
                                    <button
                                        onClick={toggleTheme}
                                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[var(--sh-card)] border border-[var(--sh-border)]/50 text-[var(--sh-fg)] hover:bg-[var(--sh-hover)]/30 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--sh-primary)]/15 text-[var(--sh-primary)] flex items-center justify-center">
                                                {isDark ? <Sun size={17} /> : <Moon size={17} />}
                                            </div>
                                            <span className="font-semibold text-sm">Mode</span>
                                        </div>
                                        <span className="text-xs font-bold uppercase text-[var(--sh-primary)]">
                                            {isDark ? 'Dark' : 'Light'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-6 bg-[var(--sh-card)]/50 border-t border-[var(--sh-border)]">
                                {user ? (
                                    <div className="flex items-center justify-between">
                                        <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--sh-primary)] text-white flex items-center justify-center font-bold overflow-hidden shadow-sm">
                                                {user.image ? (
                                                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    (user.name || user.email).charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-[var(--sh-fg)] truncate">{user.name || user.email.split('@')[0]}</p>
                                                <button onClick={logout} className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Sign Out</button>
                                            </div>
                                        </Link>
                                        <div className="flex items-center gap-2">
                                            <Link href="/settings" onClick={() => setIsOpen(false)} className="w-9 h-9 bg-[var(--sh-card)] border border-[var(--sh-border)] rounded-xl flex items-center justify-center text-[var(--sh-fg)]">
                                                <Settings size={16} />
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link href="/admin" onClick={() => setIsOpen(false)} className="w-9 h-9 bg-[var(--sh-primary)] text-white rounded-xl flex items-center justify-center shadow-sm">
                                                    <LayoutDashboard size={16} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setIsOpen(false)}
                                        className="w-full h-11 rounded-xl bg-[var(--btn-gradient)] text-white font-bold flex items-center justify-center text-sm shadow-md"
                                    >
                                        Sign In / Register
                                    </Link>
                                )}
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
}
