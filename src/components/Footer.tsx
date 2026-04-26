'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Instagram, MessageCircle, Send, ShoppingBag, ArrowUp, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const { lang, t } = useLanguage();
    const pathname = usePathname();
    const isAr = lang === 'ar';
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const isAdmin = pathname?.startsWith('/admin');

    useEffect(() => {
        if (isAdmin) return;
        const handleScroll = () => setShowTopBtn(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);

        // Fetch real categories
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data.slice(0, 4));
            })
            .catch(err => console.error('Footer categories fetch error:', err));

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isAdmin) return null;

    return (
        <footer className="relative bg-[var(--sh-bg)] border-t border-[var(--sh-border)] transition-colors duration-500 overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--sh-primary)]/5 blur-[120px] pointer-events-none ltr-only" />
            <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-[var(--sh-accent)]/5 blur-[150px] pointer-events-none" />

            {/* Back to Top */}
            <AnimatePresence>
                {showTopBtn && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-[90] w-14 h-14 rounded-2xl bg-[var(--sh-primary)] text-white shadow-2xl shadow-[var(--sh-primary)]/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"
                        aria-label="Back to top"
                    >
                        <ArrowUp size={24} />
                    </motion.button>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
                    {/* Brand Section */}
                    <div className="md:col-span-5">
                        <Link href="/" className="flex items-center gap-4 mb-8 group focus:outline-none">
                            <div className="relative w-24 h-24 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                <img src="/logo.png" alt="BibaStore" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-[var(--sh-fg)] leading-tight">BibaStore</h3>
                                <p className="text-xs text-[var(--sh-primary)] font-bold uppercase tracking-[0.2em] mt-1">Made with Love</p>
                            </div>
                        </Link>
                        <p className="text-[var(--sh-fg)] opacity-60 text-lg leading-relaxed max-w-sm font-medium italic mb-10">
                            {isAr
                                ? 'نصنع الجمال في كل غرزة. منتجات كروشيه يدوية فاخرة مصممة خصيصاً لتناسب ذوقك الرفيع.'
                                : 'Beauty in every stitch. Premium handmade crochet pieces designed specifically for your sophisticated taste.'}
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, href: "https://www.facebook.com/share/18RFEXTeHZ/", color: "hover:text-[#1877F2] hover:border-[#1877F2]/30" },
                                { icon: Instagram, href: "https://www.instagram.com/hossam_ashourr?igsh=MXd3aG9henhrb2g3ZQ==", color: "hover:text-[#E4405F] hover:border-[#E4405F]/30" },
                                {
                                    icon: ({ size }: { size: number }) => (
                                        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.559 4.191 1.619 6.007L0 24l6.135-1.61a11.83 11.83 0 005.91 1.592h.005c6.637 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.535-8.414" />
                                        </svg>
                                    ),
                                    href: "https://wa.me/201101925305",
                                    color: "hover:text-[#25D366] hover:border-[#25D366]/30"
                                },
                                { icon: Send, href: "#support", isSupport: true, color: "hover:text-indigo-400 hover:border-indigo-500/30" }
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    target={item.isSupport ? undefined : "_blank"}
                                    rel={item.isSupport ? undefined : "noopener noreferrer"}
                                    onClick={item.isSupport ? (e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-support')); } : undefined}
                                    className={`w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 ${item.color} hover:scale-110 transition-all duration-300 shadow-inner group/icon`}
                                >
                                    {(() => {
                                        const Icon = item.icon;
                                        return <Icon size={20} className="transition-transform group-hover/icon:rotate-6" />;
                                    })()}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10">{isAr ? 'روابط سريعة' : 'Quick Links'}</h4>
                        <ul className="flex flex-col gap-6">
                            {[
                                { href: '/shop', label: t('shop') },
                                { href: '/custom', label: t('custom') },
                                { href: '/track', label: t('track') },
                            ].map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-slate-400 font-bold hover:text-indigo-400 transition-colors flex items-center group">
                                        <span className={`w-1.5 h-1.5 rounded-full bg-indigo-500 ${isAr ? 'ml-3' : 'mr-3'} scale-0 group-hover:scale-100 transition-transform`} />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories Link Section */}
                    <div className="md:col-span-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10">{isAr ? 'الأقسام' : 'Categories'}</h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {categories.length > 0 ? (
                                categories.map(cat => (
                                    <Link key={cat._id} href={`/shop?category=${cat.name}`} className="text-slate-400 font-bold hover:text-indigo-400 transition-colors flex items-center group">
                                        <div className={`w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 ${isAr ? 'ml-3' : 'mr-3'} flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all`}>
                                            <ShoppingBag size={14} />
                                        </div>
                                        <span className="truncate">{cat.name}</span>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-2 text-slate-600 text-[10px] font-black uppercase tracking-widest italic">
                                    {isAr ? 'لا يوجد أقسام مضافة' : 'No sections added yet'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-10 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-slate-500 text-sm font-bold tracking-tight">© 2026 BibaStore. All rights reserved.</p>
                    <div className="flex items-center gap-6 text-slate-500 font-bold text-sm tracking-tight">
                        <div className="flex items-center gap-3">
                            <span>Developed by</span>
                            <span className="text-[var(--sh-fg)] font-black">Hossam Ashour</span>
                        </div>
                        <div className="w-px h-4 bg-slate-800" />
                        <div className="flex items-center gap-4">
                            {[
                                { icon: Facebook, href: "https://www.facebook.com/share/18RFEXTeHZ/", color: "hover:text-[#1877F2]" },
                                { icon: Instagram, href: "https://www.instagram.com/hossam_ashourr?igsh=MXd3aG9henhrb2g3ZQ==", color: "hover:text-[#E4405F]" },
                                {
                                    icon: ({ size }: { size: number }) => (
                                        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.559 4.191 1.619 6.007L0 24l6.135-1.61a11.83 11.83 0 005.91 1.592h.005c6.637 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.535-8.414" />
                                        </svg>
                                    ),
                                    href: "https://wa.me/201101925305",
                                    color: "hover:text-[#25D366]"
                                }
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`transition-all duration-300 hover:scale-125 ${item.color}`}
                                >
                                    {(() => {
                                        const Icon = item.icon;
                                        return <Icon size={18} />;
                                    })()}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
