'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function BrandIntro() {
    const [isVisible, setIsVisible] = useState(false);
    // Animation stages:
    // 'idle' -> 'snipping' -> 'split' -> 'sewing' -> 'united' -> 'exiting'
    const [phase, setPhase] = useState<'idle' | 'snipping' | 'split' | 'sewing' | 'united' | 'exiting'>('idle');

    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem('biba_zigzag_stitch_v1');
        if (!hasSeenIntro) {
            setIsVisible(true);
            sessionStorage.setItem('biba_zigzag_stitch_v1', 'true');

            // Timeline:
            // 0.3s: Scissors enter and snip
            // 0.9s: Logo splits along zigzag cut
            // 1.2s: Crochet hook & yarn sew the pieces back together
            // 1.8s: Cinch & unite with sparkle burst
            // 2.7s: Smooth unveil into the store
            const t1 = setTimeout(() => setPhase('snipping'), 300);
            const t2 = setTimeout(() => setPhase('split'), 900);
            const t3 = setTimeout(() => setPhase('sewing'), 1200);
            const t4 = setTimeout(() => setPhase('united'), 1800);
            const t5 = setTimeout(() => setPhase('exiting'), 2700);
            const t6 = setTimeout(() => setIsVisible(false), 3300);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
                clearTimeout(t4);
                clearTimeout(t5);
                clearTimeout(t6);
            };
        }
    }, []);

    const dismiss = () => {
        setPhase('exiting');
        setTimeout(() => setIsVisible(false), 400);
    };

    // Zigzag clip paths dividing the emblem into two matching interlocking halves
    const leftZigzagClip = 'polygon(0% 0%, 53% 0%, 47% 20%, 53% 40%, 47% 60%, 53% 80%, 47% 100%, 0% 100%)';
    const rightZigzagClip = 'polygon(53% 0%, 100% 0%, 100% 100%, 47% 100%, 53% 80%, 47% 60%, 53% 40%, 47% 20%)';

    const isSplit = phase === 'split' || phase === 'sewing';
    const isUnited = phase === 'united' || phase === 'exiting';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="zigzag-scissor-intro"
                    initial={{ opacity: 1 }}
                    animate={phase === 'exiting' ? {
                        opacity: 0,
                        scale: 1.04,
                        filter: 'blur(10px)',
                        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                    } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
                    onClick={dismiss}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#070b09]/95 backdrop-blur-2xl overflow-hidden cursor-pointer select-none"
                >
                    {/* Warm Ambient Radial Glows */}
                    <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#859F84]/20 via-[#C1B6D2]/20 to-transparent blur-[120px] pointer-events-none" />

                    {/* Central Stage */}
                    <div className="relative flex flex-col items-center justify-center px-4 max-w-sm w-full text-center z-10">

                        {/* Interactive Cutting & Stitching Arena */}
                        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">

                            {/* Left Half of Logo with Zigzag Cut */}
                            <motion.div
                                animate={
                                    isSplit
                                        ? { x: -14, y: -4, rotate: -4 }
                                        : isUnited
                                            ? { x: 0, y: 0, rotate: 0 }
                                            : { x: 0, y: 0, rotate: 0 }
                                }
                                transition={{
                                    type: 'spring',
                                    damping: isUnited ? 14 : 20,
                                    stiffness: isUnited ? 300 : 200
                                }}
                                style={{ clipPath: leftZigzagClip, WebkitClipPath: leftZigzagClip }}
                                className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-white/[0.02] p-4 border border-white/15 shadow-xl backdrop-blur-xl flex items-center justify-center overflow-hidden"
                            >
                                <img
                                    src="/logo.png"
                                    alt="BibaStore"
                                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
                                />
                            </motion.div>

                            {/* Right Half of Logo with Interlocking Zigzag Cut */}
                            <motion.div
                                animate={
                                    isSplit
                                        ? { x: 14, y: 4, rotate: 4 }
                                        : isUnited
                                            ? { x: 0, y: 0, rotate: 0 }
                                            : { x: 0, y: 0, rotate: 0 }
                                }
                                transition={{
                                    type: 'spring',
                                    damping: isUnited ? 14 : 20,
                                    stiffness: isUnited ? 300 : 200
                                }}
                                style={{ clipPath: rightZigzagClip, WebkitClipPath: rightZigzagClip }}
                                className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-white/[0.02] p-4 border border-white/15 shadow-xl backdrop-blur-xl flex items-center justify-center overflow-hidden"
                            >
                                <img
                                    src="/logo.png"
                                    alt="BibaStore"
                                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
                                />
                            </motion.div>

                            {/* Animated Artisan Scissor Snipping Down */}
                            <AnimatePresence>
                                {(phase === 'snipping' || phase === 'split') && (
                                    <motion.div
                                        initial={{ x: 10, y: -90, opacity: 0, rotate: 25 }}
                                        animate={{
                                            x: [10, 0, -5, -2],
                                            y: [-90, -10, 60, 140],
                                            opacity: [0, 1, 1, 0],
                                            rotate: [25, 18, 12, 5]
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.75, ease: 'easeInOut' }}
                                        className="absolute z-30 pointer-events-none"
                                    >
                                        {/* Stylized Golden Craft Scissor */}
                                        <div className="relative w-12 h-12 flex items-center justify-center">
                                            {/* Upper Blade */}
                                            <motion.div
                                                animate={{ rotate: [-24, 0, -24, 0, -24, 0] }}
                                                transition={{ duration: 0.7, repeat: 1, ease: 'easeInOut' }}
                                                className="absolute w-10 h-2 bg-gradient-to-r from-amber-200 to-amber-400 rounded-full origin-right shadow-md"
                                                style={{ right: '50%', top: '45%' }}
                                            />
                                            {/* Lower Blade */}
                                            <motion.div
                                                animate={{ rotate: [24, 0, 24, 0, 24, 0] }}
                                                transition={{ duration: 0.7, repeat: 1, ease: 'easeInOut' }}
                                                className="absolute w-10 h-2 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full origin-right shadow-md"
                                                style={{ right: '50%', top: '45%' }}
                                            />
                                            {/* Scissor Handles */}
                                            <div className="absolute right-0 w-5 h-5 rounded-full border-2 border-amber-300 bg-amber-500/20 shadow-sm" />
                                            <div className="absolute right-0 -bottom-3 w-5 h-5 rounded-full border-2 border-amber-300 bg-amber-500/20 shadow-sm" />
                                            {/* Center Golden Pivot Screw */}
                                            <div className="absolute right-[46%] w-2 h-2 rounded-full bg-amber-100 shadow" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Animated Crochet Needle & Thread Sewing The Seam */}
                            <AnimatePresence>
                                {(phase === 'sewing' || isUnited) && (
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100">
                                        <defs>
                                            <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#859F84" />
                                                <stop offset="50%" stopColor="#CEC9DB" />
                                                <stop offset="100%" stopColor="#a78bfa" />
                                            </linearGradient>
                                        </defs>

                                        {/* Cross-stitches / Zigzag thread weaving along the seam */}
                                        <motion.path
                                            d="M 50 15 L 43 25 L 57 32 L 43 45 L 57 55 L 43 68 L 57 78 L 50 88"
                                            fill="none"
                                            stroke="url(#threadGradient)"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 0.55, ease: 'easeOut' }}
                                        />

                                        {/* Little Stitch Crosses */}
                                        <motion.g
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 1, 0.8] }}
                                            transition={{ delay: 0.2, duration: 0.4 }}
                                        >
                                            <line x1="45" y1="28" x2="55" y2="36" stroke="#859F84" strokeWidth="1.8" strokeLinecap="round" />
                                            <line x1="45" y1="50" x2="55" y2="58" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" />
                                            <line x1="45" y1="72" x2="55" y2="80" stroke="#CEC9DB" strokeWidth="1.8" strokeLinecap="round" />
                                        </motion.g>
                                    </svg>
                                )}
                            </AnimatePresence>

                            {/* Cinch & Re-unite Sparkle Burst */}
                            <AnimatePresence>
                                {isUnited && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0.8, 1.4, 0], opacity: [0, 1, 0] }}
                                        transition={{ duration: 0.7, ease: 'easeOut' }}
                                        className="absolute inset-0 rounded-full border-2 border-[#859F84]/70 bg-gradient-to-r from-[#859F84]/20 via-[#a78bfa]/20 to-transparent blur-sm pointer-events-none"
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Brand Signature */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={isUnited ? { y: 0, opacity: 1 } : { y: 10, opacity: 0.6 }}
                            transition={{ duration: 0.6 }}
                            className="mt-6 flex flex-col items-center"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-outfit drop-shadow-md">
                                    BibaStore
                                </span>
                                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                            </div>

                            {/* Handcrafted Tagline in Caveat */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={isUnited ? { scale: 1, opacity: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="mt-2.5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md"
                            >
                                <Heart size={14} className="text-[#859F84] fill-[#859F84]" />
                                <span className="text-lg sm:text-xl font-bold text-slate-100 font-caveat tracking-wide">
                                    Cut with care, stitched with love
                                </span>
                            </motion.div>
                        </motion.div>

                        {/* Skip Hint */}
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            className="mt-6 text-[11px] uppercase tracking-widest text-slate-400 font-sans"
                        >
                            Tap anywhere to enter →
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
