'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
    const { lang, t } = useLanguage();
    const isAr = lang === 'ar';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: isAr ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: isAr ? '-100%' : '100%' }}
                        transition={{ type: 'spring', damping: 40, stiffness: 400 }}
                        className={`absolute ${isAr ? 'left-0' : 'right-0'} top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl flex flex-col`}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                                    <ShoppingBag size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                        {isAr ? 'سلة التسوق' : 'Shopping Cart'}
                                    </h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        {totalItems} {isAr ? 'منتجات' : 'Items'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-all font-black"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6">
                                        <ShoppingBag size={32} className="text-slate-200 dark:text-slate-800" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                        {isAr ? 'السلة فارغة' : 'Your cart is empty'}
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="mt-4 text-indigo-500 font-black text-xs uppercase tracking-widest hover:underline"
                                    >
                                        {isAr ? 'ابدأ التسوق' : 'Start Shopping'}
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-slate-900 dark:text-white text-sm truncate uppercase tracking-tighter mb-1">
                                                {item.title}
                                            </h4>
                                            {item.size && (
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Size: {item.size}</p>
                                            )}
                                            <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 mb-4">
                                                {item.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-black text-slate-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.size)}
                                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {isAr ? 'المجموع الإجمالي' : 'Subtotal'}
                                    </span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                                        {totalPrice.toLocaleString()} <span className="text-xs opacity-50">{isAr ? 'ج.م' : 'EGP'}</span>
                                    </span>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    className="premium-button w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg"
                                >
                                    <span className="uppercase tracking-[0.2em]">{isAr ? 'إتمام الشراء' : 'Checkout'}</span>
                                    <ArrowRight size={20} className={`${isAr ? 'rotate-180' : ''}`} />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
