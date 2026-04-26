'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Eye, Tag, ShoppingBag, ArrowRight, Heart, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
}

export default function ProductCard({ id, title, price, images, category, stock }: ProductCardProps) {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const [isWishlisted, setIsWishlisted] = useState(false);
    const hasImage = images && images.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group"
        >
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-premium-lg group-hover:shadow-indigo-500/10 transition-all duration-700 hover:-translate-y-3 relative">
                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsWishlisted(!isWishlisted);
                    }}
                    className={`absolute top-5 ${isAr ? 'left-5' : 'right-5'} z-20 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 backdrop-blur-md border ${isWishlisted
                        ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                        : 'bg-white/80 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/10 hover:text-rose-500'
                        }`}
                >
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "animate-pulse" : ""} />
                </button>

                <Link href={`/shop/${id}`} className="block">
                    {/* Image Wrapper */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-950">
                        {hasImage ? (
                            <img
                                src={images[0]}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full shimmer flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                                <ShoppingBag size={48} className="text-slate-300 dark:text-slate-700 opacity-50" />
                            </div>
                        )}

                        {/* Overlay with staggered elements */}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileHover={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white">
                                                <Star size={8} fill="currentColor" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Top Rated Item</span>
                                </div>
                                <span className="premium-button w-full py-3.5 rounded-2xl text-xs bg-white text-indigo-950 border-none shadow-none hover:bg-white/90">
                                    {isAr ? 'عرض التفاصيل' : 'Quick View'}
                                    <ArrowRight size={14} className={`${isAr ? 'mr-2 rotate-180' : 'ml-2'}`} />
                                </span>
                            </motion.div>
                        </div>

                        {/* Badges */}
                        <div className={`absolute top-5 ${isAr ? 'right-5' : 'left-5'} flex flex-col gap-2 pointer-events-none`}>
                            <div className="badge-brand">
                                {category}
                            </div>
                            {stock === 0 ? (
                                <div className="px-3 py-1 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                                    {isAr ? 'نفذت' : 'Out of Stock'}
                                </div>
                            ) : stock <= 3 ? (
                                <div className="px-3 py-1 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                                    {isAr ? `باقي ${stock} فقط` : `${stock} Left`}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-8">
                        <div className="flex items-start justify-between mb-3 gap-4">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                {title}
                            </h3>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? 'السعر' : 'Price'}</span>
                                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                    {price.toLocaleString()} <span className="text-sm font-bold opacity-70">{isAr ? 'ج.م' : 'EGP'}</span>
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                <ShoppingBag size={20} />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </motion.div>
    );
}

