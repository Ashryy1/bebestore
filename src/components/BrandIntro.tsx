'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function BrandIntro() {
    const [isVisible, setIsVisible] = useState(false);
    const [stage, setStage] = useState<'enter' | 'glint' | 'exit'>('enter');

    useEffect(() => {
        // Run once per browsing session
        const hasSeenIntro = sessionStorage.getItem('biba_intro_calm_v1');
        if (!hasSeenIntro) {
            setIsVisible(true);
            sessionStorage.setItem('biba_intro_calm_v1', 'true');

            // Quick, calm, 2-second experience:
            // 0.4s: Gentle glint passes across logo
            // 1.8s: Smooth veil dissolves into the store
            const t1 = setTimeout(() => setStage('glint'), 400);
            const t2 = setTimeout(() => setStage('exit'), 1800);
            const t3 = setTimeout(() => setIsVisible(false), 2400);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
            };
        }
    }, []);

    const dismiss = () => {
        setStage('exit');
        setTimeout(() => setIsVisible(false), 350);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="biba-calm-intro"
                    initial={{ opacity: 1 }}
                    animate={stage === 'exit' ? {
                        opacity: 0,
                        scale: 1.03,
                        filter: 'blur(12px)',
                        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                    } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.03, filter: 'blur(12px)' }}
                    onClick={dismiss}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#070b09]/95 backdrop-blur-2xl overflow-hidden cursor-pointer select-none"
                >
                    {/* Calm Ambient Bokeh Lights */}
                    <motion.div
                        initial={{ opacity: 0.3, scale: 0.8 }}
                        animate={{ opacity: [0.3, 0.55, 0.35], scale: [0.95, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#859F84]/20 via-[#C1B6D2]/20 to-transparent blur-[100px] pointer-events-none"
                    />

                    {/* Minimal Core Badge */}
                    <div className="relative flex flex-col items-center justify-center px-6 text-center z-10">

                        {/* Floating Glass Emblem with Logo */}
                        <motion.div
                            initial={{ scale: 0.75, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 200, duration: 0.8 }}
                            className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-b from-white/10 to-white/[0.02] p-4 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(133,159,132,0.2)] backdrop-blur-xl flex items-center justify-center overflow-hidden"
                        >
                            <img
                                src="/logo.png"
                                alt="BibaStore"
                                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
                            />

                            {/* Calm Shimmer Sweep */}
                            <motion.div
                                initial={{ x: '-150%' }}
                                animate={stage !== 'enter' ? { x: '180%' } : {}}
                                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
                            />
                        </motion.div>

                        {/* Brand Signature */}
                        <motion.div
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="mt-6 flex flex-col items-center"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-outfit drop-shadow-md">
                                    BibaStore
                                </span>
                                <Sparkles className="w-4 h-4 text-[#C1B6D2]" />
                            </div>

                            {/* Warm Handmade Tagline in Caveat */}
                            <div className="mt-2.5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md">
                                <Heart size={14} className="text-[#859F84] fill-[#859F84]" />
                                <span className="text-lg sm:text-xl font-bold text-slate-200 font-caveat tracking-wide">
                                    Handmade crochet with love
                                </span>
                            </div>
                        </motion.div>

                        {/* Subtle tap hint */}
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.35 }}
                            className="mt-6 text-[11px] uppercase tracking-widest text-slate-400 font-sans"
                        >
                            Tap anywhere to enter
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
