'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function BrandIntro() {
    const [isVisible, setIsVisible] = useState(false);
    const [stage, setStage] = useState<'playing' | 'exiting'>('playing');

    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem('biba_craft_intro_v2');
        if (!hasSeenIntro) {
            setIsVisible(true);
            sessionStorage.setItem('biba_craft_intro_v2', 'true');

            // Play for 4.5 seconds then smoothly unveil into the store
            const t1 = setTimeout(() => setStage('exiting'), 4500);
            const t2 = setTimeout(() => setIsVisible(false), 5200);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        }
    }, []);

    const dismiss = () => {
        setStage('exiting');
        setTimeout(() => setIsVisible(false), 400);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="biba-video-intro"
                    initial={{ opacity: 1 }}
                    animate={stage === 'exiting' ? {
                        opacity: 0,
                        scale: 1.04,
                        filter: 'blur(8px)',
                        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                    } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                    onClick={dismiss}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#070b09] overflow-hidden cursor-pointer select-none"
                >
                    {/* Ambient Glows */}
                    <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#859F84]/20 via-[#a78bfa]/20 to-transparent blur-[120px] pointer-events-none" />

                    {/* Main Video & Craft Stage */}
                    <div className="relative flex flex-col items-center justify-center px-4 max-w-lg w-full text-center z-10">

                        {/* Hand Crochet Video with Soft Radial Blend Mask (No rectangular borders) */}
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center overflow-hidden"
                            style={{
                                maskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)',
                                WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)'
                            }}
                        >
                            <video
                                src="/crochet-video.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover scale-110 pointer-events-none rotate-180"
                            />
                        </motion.div>

                        {/* Floating Brand Badge & Logo */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-2 flex flex-col items-center"
                        >
                            {/* Brand Name */}
                            <div className="flex items-center gap-2">
                                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-outfit drop-shadow-lg">
                                    BibaStore
                                </span>
                                <Sparkles className="w-5 h-5 text-[#C1B6D2] animate-pulse" />
                            </div>

                            {/* Handcrafted Tagline in Caveat */}
                            <div className="mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md shadow-sm">
                                <Heart size={14} className="text-[#859F84] fill-[#859F84]" />
                                <span className="text-lg sm:text-xl font-bold text-slate-100 font-caveat tracking-wide">
                                    Crafted stitch by stitch, with love
                                </span>
                            </div>
                        </motion.div>

                        {/* Fast Skip / Enter Indicator */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            whileHover={{ opacity: 1 }}
                            onClick={dismiss}
                            className="mt-6 text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-all font-sans"
                        >
                            Enter Store →
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
