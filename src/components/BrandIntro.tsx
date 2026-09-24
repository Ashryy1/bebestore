'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function BrandIntro() {
    const [isVisible, setIsVisible] = useState(false);
    const [stage, setStage] = useState<'weaving' | 'revealed' | 'exiting'>('weaving');

    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem('bibastore_craft_intro');
        if (!hasSeenIntro) {
            setIsVisible(true);
            sessionStorage.setItem('bibastore_craft_intro', 'true');

            // Sequence timing:
            // 0s: Yarn thread sweeps & weaves
            // 0.6s: 3D Emblem & Logo Reveal with light sweep
            // 1.8s: Morph & unveil into the live store
            const t1 = setTimeout(() => setStage('revealed'), 600);
            const t2 = setTimeout(() => setStage('exiting'), 2100);
            const t3 = setTimeout(() => setIsVisible(false), 2700);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
            };
        }
    }, []);

    const dismiss = () => {
        setStage('exiting');
        setTimeout(() => setIsVisible(false), 500);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="biba-cinema-intro"
                    initial={{ opacity: 1 }}
                    animate={stage === 'exiting' ? {
                        opacity: 0,
                        y: '-100%',
                        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
                    } : { opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '-100%', transition: { duration: 0.6 } }}
                    onClick={dismiss}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#070b09] overflow-hidden cursor-pointer select-none"
                    style={{ perspective: 1200 }}
                >
                    {/* Ambient Glows */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.3 }}
                        animate={{ scale: [0.9, 1.15, 1], opacity: [0.35, 0.6, 0.4] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#859F84]/25 via-[#a78bfa]/20 to-transparent blur-[120px] pointer-events-none"
                    />

                    {/* Subtle Tactile Yarn Texture Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #859F84 1.5px, transparent 0)`,
                            backgroundSize: '28px 28px'
                        }}
                    />

                    {/* Floating Silk Micro-Particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: (i % 2 === 0 ? -1 : 1) * (100 + i * 40),
                                y: 50 + i * 30,
                                opacity: 0,
                                scale: 0.5
                            }}
                            animate={{
                                y: -120 - i * 20,
                                opacity: [0, 0.8, 0],
                                scale: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 2.2 + (i * 0.2),
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: 'easeOut'
                            }}
                            className="absolute w-2 h-2 rounded-full bg-[#C1B6D2]/60 blur-[1px] pointer-events-none"
                        />
                    ))}

                    {/* Center Core Showcase */}
                    <div className="relative flex flex-col items-center justify-center px-6 text-center z-20">

                        {/* Animated Silken Yarn Path */}
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full pointer-events-none -rotate-45" viewBox="0 0 120 120">
                                <defs>
                                    <linearGradient id="silkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#859F84" />
                                        <stop offset="50%" stopColor="#CEC9DB" />
                                        <stop offset="100%" stopColor="#a78bfa" />
                                    </linearGradient>
                                    <filter id="yarnGlow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#859F84" floodOpacity="0.6" />
                                    </filter>
                                </defs>

                                {/* Background Guide Thread */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="52"
                                    fill="none"
                                    stroke="rgba(255, 255, 255, 0.08)"
                                    strokeWidth="1.5"
                                />

                                {/* Organic Crochet Loop Weave */}
                                <motion.circle
                                    cx="60"
                                    cy="60"
                                    r="52"
                                    fill="none"
                                    stroke="url(#silkGradient)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray="327"
                                    initial={{ strokeDashoffset: 327 }}
                                    animate={{ strokeDashoffset: 0 }}
                                    transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                                    filter="url(#yarnGlow)"
                                />

                                {/* Delicate Crochet Stitch Marks */}
                                <motion.circle
                                    cx="60"
                                    cy="60"
                                    r="56"
                                    fill="none"
                                    stroke="rgba(193, 182, 210, 0.4)"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 8"
                                    initial={{ rotate: 0, opacity: 0 }}
                                    animate={{ rotate: 360, opacity: 0.9 }}
                                    transition={{
                                        rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                                        opacity: { duration: 0.8 }
                                    }}
                                />
                            </svg>

                            {/* 3D Glass Emblem & Logo */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0, rotateY: -25, rotateX: 10 }}
                                animate={stage !== 'weaving' ? {
                                    scale: 1,
                                    opacity: 1,
                                    rotateY: 0,
                                    rotateX: 0
                                } : {}}
                                transition={{
                                    type: 'spring',
                                    damping: 15,
                                    stiffness: 180,
                                    delay: 0.1
                                }}
                                className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-white/15 via-white/[0.04] to-black/30 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(133,159,132,0.3)] p-4 flex items-center justify-center overflow-hidden"
                            >
                                <img
                                    src="/logo.png"
                                    alt="BibaStore"
                                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                                />

                                {/* Dynamic Light Glint Reflection */}
                                <motion.div
                                    initial={{ x: '-150%', y: '-150%' }}
                                    animate={stage !== 'weaving' ? { x: '180%', y: '180%' } : {}}
                                    transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.3 }}
                                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent rotate-45 pointer-events-none"
                                />
                            </motion.div>
                        </div>

                        {/* Handcrafted Brand Signature */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={stage !== 'weaving' ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            className="mt-6 flex flex-col items-center"
                        >
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-outfit drop-shadow-md">
                                    BibaStore
                                </h1>
                                <Sparkles className="w-5 h-5 text-[#C1B6D2] animate-pulse" />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={stage !== 'weaving' ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="mt-2.5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-sm"
                            >
                                <Heart size={14} className="text-[#859F84] fill-[#859F84]" />
                                <span className="text-base sm:text-lg font-bold text-slate-200 tracking-wide font-caveat">
                                    Crafted stitch by stitch, just for you
                                </span>
                            </motion.div>
                        </motion.div>

                        {/* Tap to enter hint */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            className="mt-8 text-xs uppercase tracking-widest text-slate-400 font-sans"
                        >
                            Click anywhere to enter →
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
