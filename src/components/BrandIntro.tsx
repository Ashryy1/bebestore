'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function BrandIntro() {
    const [isVisible, setIsVisible] = useState(false);
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
        // Run intro only once per browser session for optimal UX
        const hasSeenIntro = sessionStorage.getItem('biba_intro_seen');
        if (!hasSeenIntro) {
            setIsVisible(true);
            sessionStorage.setItem('biba_intro_seen', 'true');

            // Sequence timing:
            // 0: Yarn stitching starts
            // 1: Logo blossoms in
            // 2: Tagline reveals
            // 3: Unveil into the store
            const t1 = setTimeout(() => setAnimationStep(1), 400);
            const t2 = setTimeout(() => setAnimationStep(2), 1000);
            const t3 = setTimeout(() => setAnimationStep(3), 2000);
            const t4 = setTimeout(() => setIsVisible(false), 2600);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
                clearTimeout(t4);
            };
        }
    }, []);

    const handleSkip = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="brand-intro"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.04,
                        filter: 'blur(10px)',
                        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                    }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#070b09] overflow-hidden select-none"
                >
                    {/* Ambient Handcrafted Glows */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0.2, 0.4, 0.25], scale: [0.9, 1.1, 1] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#859F84]/20 via-[#a78bfa]/15 to-transparent blur-3xl pointer-events-none"
                    />

                    {/* Subtle Crochet Grid Texture */}
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
                            backgroundSize: '24px 24px'
                        }}
                    />

                    {/* Main Stage */}
                    <div className="relative flex flex-col items-center justify-center px-6 text-center z-10">

                        {/* Animated Crochet Thread / Stitch Ring */}
                        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                                {/* Background Thread Guide */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill="none"
                                    stroke="rgba(255, 255, 255, 0.05)"
                                    strokeWidth="1.5"
                                />

                                {/* Weaving Yarn Stroke */}
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill="none"
                                    stroke="url(#yarnGradient)"
                                    strokeWidth="2.5"
                                    strokeDasharray="276"
                                    strokeDashoffset="276"
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: 276 }}
                                    animate={{ strokeDashoffset: 0 }}
                                    transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
                                />

                                {/* Decorative Stitches */}
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="48"
                                    fill="none"
                                    stroke="rgba(167, 139, 250, 0.3)"
                                    strokeWidth="1"
                                    strokeDasharray="3 7"
                                    initial={{ opacity: 0, rotate: 0 }}
                                    animate={{ opacity: 0.7, rotate: 360 }}
                                    transition={{ opacity: { duration: 0.8 }, rotate: { duration: 8, repeat: Infinity, ease: 'linear' } }}
                                />

                                <defs>
                                    <linearGradient id="yarnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#859F84" />
                                        <stop offset="50%" stopColor="#CEC9DB" />
                                        <stop offset="100%" stopColor="#a78bfa" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Center Logo with Pulse & Shimmer */}
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0, filter: 'blur(8px)' }}
                                animate={animationStep >= 1 ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}}
                                transition={{ type: 'spring', damping: 18, stiffness: 220 }}
                                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/[0.04] p-3 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(133,159,132,0.25)] flex items-center justify-center overflow-hidden group"
                            >
                                <img
                                    src="/logo.png"
                                    alt="BibaStore Brand"
                                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
                                />

                                {/* Shimmer Sweeping Light */}
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={animationStep >= 2 ? { x: '200%' } : {}}
                                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                                />
                            </motion.div>
                        </div>

                        {/* Brand Name Typography */}
                        <motion.div
                            initial={{ y: 15, opacity: 0 }}
                            animate={animationStep >= 1 ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                            className="mt-6 flex flex-col items-center"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-outfit">
                                    BibaStore
                                </span>
                                <motion.div
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Sparkles className="w-4 h-4 text-[#a78bfa]" />
                                </motion.div>
                            </div>

                            {/* Handcrafted Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={animationStep >= 2 ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5 }}
                                className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10"
                            >
                                <Heart size={12} className="text-[#859F84] fill-[#859F84]" />
                                <span className="text-xs tracking-[0.2em] uppercase font-semibold text-slate-300 font-caveat text-sm">
                                    Crafted Stitch by Stitch
                                </span>
                            </motion.div>
                        </motion.div>

                        {/* Skip Button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            whileHover={{ opacity: 1 }}
                            onClick={handleSkip}
                            className="mt-8 text-[11px] uppercase tracking-widest text-slate-400 hover:text-white transition-all underline underline-offset-4"
                        >
                            Skip Intro →
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
