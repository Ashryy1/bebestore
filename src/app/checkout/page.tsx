'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, CreditCard, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const { lang, t } = useLanguage();
    const isAr = lang === 'ar';
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        city: '',
    });

    const updateForm = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: form.name,
                    userPhone: form.phone,
                    userId: user?.userId,
                    items: cart.map(item => ({
                        productId: item.id,
                        title: item.title,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image,
                        size: item.size,
                        color: item.color,
                        note: item.note
                    })),
                    totalAmount: totalPrice,
                    shippingDetails: {
                        address: form.address,
                        city: form.city
                    }
                }),
            });

            if (res.ok) {
                const data = await res.json();
                clearCart();
                router.push(`/track?id=${data.order.orderNumber}`);
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Order error:', error);
            alert('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32 px-6">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 rounded-[3rem] bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-8">
                        <ShoppingBag size={40} className="text-slate-200 dark:text-slate-800" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">Your cart is empty</h2>
                    <p className="text-slate-500 mb-10 font-medium">Add some beautiful handmade pieces to your cart first.</p>
                    <Link href="/shop" className="premium-button px-10 py-4 rounded-2xl inline-block font-black uppercase tracking-widest text-sm">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-6 mb-12">
                    <Link
                        href="/shop"
                        className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
                    >
                        <ArrowLeft size={24} className={isAr ? 'rotate-180' : ''} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{isAr ? 'إتمام الشراء' : 'Checkout'}</h1>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">{isAr ? 'يرجى إدخال بيانات الشحن' : 'Enter your shipping global details'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">
                    {/* Shipping Form */}
                    <motion.div
                        className="lg:col-span-7 space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="glass-card rounded-[2.5rem] p-10 border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                                    <Truck size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Shipping Information</h2>
                            </div>

                            <form onSubmit={handlePlaceOrder} className="space-y-6" id="checkout-form">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => updateForm('name', e.target.value)}
                                            className="input-field bg-slate-50 dark:bg-white/5 border-none h-14 px-6 rounded-2xl w-full text-sm font-bold"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Phone</label>
                                        <input
                                            type="tel"
                                            required
                                            value={form.phone}
                                            onChange={(e) => updateForm('phone', e.target.value)}
                                            className="input-field bg-slate-50 dark:bg-white/5 border-none h-14 px-6 rounded-2xl w-full text-sm font-bold"
                                            placeholder="012XXXXXXXX"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Address</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.address}
                                        onChange={(e) => updateForm('address', e.target.value)}
                                        className="input-field bg-slate-50 dark:bg-white/5 border-none h-14 px-6 rounded-2xl w-full text-sm font-bold"
                                        placeholder="Building, Street, Landmark..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City / Region</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.city}
                                        onChange={(e) => updateForm('city', e.target.value)}
                                        className="input-field bg-slate-50 dark:bg-white/5 border-none h-14 px-6 rounded-2xl w-full text-sm font-bold"
                                        placeholder="Cairo, Alexandria..."
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="glass-card rounded-[2.5rem] p-10 bg-indigo-600 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <ShieldCheck size={24} className="text-indigo-200" />
                                    <h3 className="text-xl font-black uppercase tracking-tight">Secure Payment</h3>
                                </div>
                                <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                                    Payments are currently handled via **Cash on Delivery** or **Vodafone Cash**. Our team will contact you on WhatsApp to confirm the order details.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5 space-y-8">
                        <motion.div
                            className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Summary</h3>

                            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/10 flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 dark:text-white text-sm truncate uppercase tracking-tighter">{item.title}</p>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                Qty: {item.quantity}
                                                {item.size && ` • Size: ${item.size}`}
                                                {item.color && ` • Color: ${item.color}`}
                                            </p>
                                            {item.note && <p className="text-[8px] text-indigo-500 italic font-bold truncate">Note: {item.note}</p>}
                                        </div>
                                        <p className="font-black text-sm text-slate-900 dark:text-white">{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">Subtotal</span>
                                    <span className="text-slate-900 dark:text-white font-black">{totalPrice.toLocaleString()} EGP</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">Shipping</span>
                                    <span className="text-indigo-500 font-black">Calculated later</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                    <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Total</span>
                                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalPrice.toLocaleString()} EGP</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="premium-button w-full py-5 rounded-2xl mt-10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save size={22} />
                                )}
                                <span className="text-lg uppercase tracking-[0.2em]">{loading ? 'Processing...' : 'Confirm Order'}</span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
