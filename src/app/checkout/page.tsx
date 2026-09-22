'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ShoppingBag,
    ShieldCheck,
    Truck,
    Banknote,
    Smartphone,
    Copy,
    Check,
    Upload,
    X,
    Save,
    MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form inputs
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        city: '',
    });

    // Payment method state
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vodafone_cash' | 'instapay'>('cod');
    const [copiedWallet, setCopiedWallet] = useState(false);
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const [isWhatsAppConfirm, setIsWhatsAppConfirm] = useState(true);

    const walletNumber = process.env.NEXT_PUBLIC_VODAFONE_CASH_NUMBER || '01026040854';
    const instapayHandle = process.env.NEXT_PUBLIC_INSTAPAY_USERNAME || 'bibastore@instapay';

    const updateForm = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleCopyWallet = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedWallet(true);
        setTimeout(() => setCopiedWallet(false), 2200);
    };

    const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview via FileReader
        const reader = new FileReader();
        reader.onloadend = () => {
            setReceiptPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeReceipt = () => {
        setReceiptPreview(null);
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
                    },
                    paymentMethod,
                    paymentReceipt: receiptPreview || undefined,
                    isWhatsAppOrder: isWhatsAppConfirm,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                clearCart();
                router.push(`/track?id=${data.order.orderNumber}`);
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(errData.error || (isAr ? 'فشل إتمام الطلب، يرجى المحاولة مرة أخرى.' : 'Failed to place order. Please try again.'));
            }
        } catch (error) {
            console.error('Order error:', error);
            alert(isAr ? 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.' : 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32 px-6">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 rounded-[3rem] bg-rose-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-8 text-rose-500">
                        <ShoppingBag size={42} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        {isAr ? 'سلة المشتريات فارغة' : 'Your cart is empty'}
                    </h2>
                    <p className="text-slate-500 mb-10 font-medium">
                        {isAr ? 'أضف بعض القطع الفنية والكروشيه المصنوعة بحب إلى سلتك أولاً.' : 'Add some beautiful handmade crochet pieces to your cart first.'}
                    </p>
                    <Link
                        href="/shop"
                        className="premium-button px-10 py-4 rounded-2xl inline-block font-black uppercase tracking-wider text-sm shadow-xl shadow-indigo-600/20"
                    >
                        {isAr ? 'تصفح المتجر الآن' : 'Start Shopping'}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-5 mb-10">
                    <Link
                        href="/shop"
                        className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all border border-slate-200/60 dark:border-white/5"
                    >
                        <ArrowLeft size={22} className={isAr ? 'rotate-180' : ''} />
                    </Link>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isAr ? 'إتمام الشراء والدفع' : 'Checkout & Payment'}
                        </h1>
                        <p className="text-slate-400 font-semibold text-xs tracking-wider mt-1 uppercase">
                            {isAr ? 'بيانات الشحن وطريقة الدفع المحلية' : 'Shipping details & local payment'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left Column: Shipping & Payment Method */}
                    <motion.div
                        className="lg:col-span-7 space-y-8"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* 1. Shipping Details Card */}
                        <div className="glass-card rounded-[2rem] p-7 sm:p-9 border border-slate-200/70 dark:border-white/5 shadow-xl shadow-black/5">
                            <div className="flex items-center gap-3.5 mb-8">
                                <div className="w-11 h-11 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                                    <Truck size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                        {isAr ? '1. بيانات التوصيل والشحن' : '1. Shipping Information'}
                                    </h2>
                                    <p className="text-xs text-slate-400 font-medium">
                                        {isAr ? 'سيتواصل معك مندوب التوصيل على هذا الرقم' : 'Our courier will contact you on this number'}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handlePlaceOrder} className="space-y-5" id="checkout-form">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                                            {isAr ? 'الاسم الكامل' : 'Full Name'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => updateForm('name', e.target.value)}
                                            className="input-field bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 h-13 px-5 rounded-2xl w-full text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                            placeholder={isAr ? 'مثال: سارة أحمد' : 'e.g. Sarah Ahmed'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                                            {isAr ? 'رقم الهاتف (واتساب)' : 'WhatsApp Phone'}
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={form.phone}
                                            onChange={(e) => updateForm('phone', e.target.value)}
                                            className="input-field bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 h-13 px-5 rounded-2xl w-full text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                            placeholder="010XXXXXXXX"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                                        {isAr ? 'المحافظة / المدينة' : 'City / Region'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.city}
                                        onChange={(e) => updateForm('city', e.target.value)}
                                        className="input-field bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 h-13 px-5 rounded-2xl w-full text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                        placeholder={isAr ? 'القاهرة، الجيزة، الإسكندرية...' : 'Cairo, Giza, Alexandria...'}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                                        {isAr ? 'العنوان بالتفصيل' : 'Detailed Address'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.address}
                                        onChange={(e) => updateForm('address', e.target.value)}
                                        className="input-field bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 h-13 px-5 rounded-2xl w-full text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                        placeholder={isAr ? 'رقم العمارة، اسم الشارع، علامة مميزة' : 'Building, Street, Landmark...'}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* 2. Payment Method Selector */}
                        <div className="glass-card rounded-[2rem] p-7 sm:p-9 border border-slate-200/70 dark:border-white/5 shadow-xl shadow-black/5">
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="w-11 h-11 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                                    <Banknote size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                        {isAr ? '2. طريقة الدفع' : '2. Payment Method'}
                                    </h2>
                                    <p className="text-xs text-slate-400 font-medium">
                                        {isAr ? 'اختر الطريقة الأنسب لك (بدون أي رسوم إضافية)' : 'Choose your preferred payment method'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Option A: Cash on Delivery */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`p-5 rounded-2xl border-2 text-start transition-all flex flex-col justify-between relative overflow-hidden ${
                                        paymentMethod === 'cod'
                                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-4 ring-indigo-600/10'
                                            : 'border-slate-200/80 dark:border-white/10 hover:border-slate-300 bg-white/40 dark:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-3 w-full">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                                            <Banknote size={20} />
                                        </div>
                                        {paymentMethod === 'cod' && (
                                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                                <Check size={14} />
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white text-sm">
                                            {isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                                            {isAr ? 'ادفع نقداً لمندوب الشحن عند وصول القطع لباب بيتك.' : 'Pay securely in cash when your handmade items arrive.'}
                                        </p>
                                    </div>
                                </button>

                                {/* Option B: Vodafone Cash / InstaPay */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('vodafone_cash')}
                                    className={`p-5 rounded-2xl border-2 text-start transition-all flex flex-col justify-between relative overflow-hidden ${
                                        paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay'
                                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 ring-4 ring-indigo-600/10'
                                            : 'border-slate-200/80 dark:border-white/10 hover:border-slate-300 bg-white/40 dark:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-3 w-full">
                                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                                            <Smartphone size={20} />
                                        </div>
                                        {(paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay') && (
                                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                                <Check size={14} />
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white text-sm">
                                            {isAr ? 'فودافون كاش / إنستاباي' : 'Vodafone Cash & InstaPay'}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                                            {isAr ? 'تحويل سريع عبر المحفظة أو إنستاباي مع إرفاق الإيصال.' : 'Instant transfer via wallet or InstaPay with receipt upload.'}
                                        </p>
                                    </div>
                                </button>
                            </div>

                            {/* Electronic Wallet Transfer Details Box */}
                            <AnimatePresence>
                                {(paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay') && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 pt-6 border-t border-slate-200/70 dark:border-white/10 space-y-4"
                                    >
                                        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-200/60 dark:border-white/10">
                                            <div className="flex items-center justify-between flex-wrap gap-3">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg">
                                                        {isAr ? 'رقم المحفظة للتحويل' : 'Transfer Wallet Number'}
                                                    </span>
                                                    <p className="text-xl font-black text-slate-900 dark:text-white tracking-wider mt-2 dir-ltr">
                                                        {walletNumber}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        InstaPay: <span className="font-bold text-slate-700 dark:text-slate-300">{instapayHandle}</span>
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyWallet(walletNumber)}
                                                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-2 border border-slate-200/80 dark:border-white/10 shadow-sm transition-all active:scale-95"
                                                >
                                                    {copiedWallet ? (
                                                        <>
                                                            <Check size={16} className="text-emerald-500" />
                                                            <span className="text-emerald-600 font-bold">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={16} className="text-indigo-600" />
                                                            <span>{isAr ? 'نسخ الرقم' : 'Copy Number'}</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Upload Receipt Box */}
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                                                {isAr ? 'إرفاق صورة إيصال التحويل (اختياري لتسريع التجهيز)' : 'Attach Transfer Receipt Screenshot (Optional)'}
                                            </label>

                                            {receiptPreview ? (
                                                <div className="relative inline-block border-2 border-indigo-600/40 rounded-2xl overflow-hidden p-1 bg-white dark:bg-white/5">
                                                    <img
                                                        src={receiptPreview}
                                                        alt="Receipt Preview"
                                                        className="w-36 h-36 object-cover rounded-xl"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={removeReceipt}
                                                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-white/15 rounded-2xl p-6 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all">
                                                    <Upload size={24} className="text-indigo-600 mb-2" />
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        {isAr ? 'اضغط لرفع لقطة شاشة لإيصال التحويل' : 'Click to upload screenshot'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WebP</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleReceiptChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* WhatsApp confirmation prompt */}
                        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                        {isAr ? 'تأكيد وإشعارات الطلب عبر الواتساب' : 'WhatsApp Order Confirmation'}
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        {isAr ? 'سنرسل لك تحديثات الشحن ورقم التتبع لحظة بلحظة.' : 'We will send tracking updates directly to your WhatsApp.'}
                                    </p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={isWhatsAppConfirm}
                                onChange={(e) => setIsWhatsAppConfirm(e.target.checked)}
                                className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                        </div>
                    </motion.div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 space-y-6">
                        <motion.div
                            className="glass-card rounded-[2rem] p-7 sm:p-9 border border-slate-200/70 dark:border-white/5 shadow-2xl shadow-black/5 sticky top-32"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                                {isAr ? 'ملخص الطلب' : 'Order Summary'}
                            </h3>

                            {/* Cart Items List */}
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3.5 pb-3 border-b border-slate-100 dark:border-white/5 last:border-0">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/10 flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                                                {item.title}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                                                {isAr ? 'الكمية' : 'Qty'}: {item.quantity}
                                                {item.size && ` • ${item.size}`}
                                                {item.color && ` • ${item.color}`}
                                            </p>
                                            {item.note && (
                                                <p className="text-[10px] text-indigo-500 font-semibold truncate mt-0.5">
                                                    {isAr ? 'ملاحظة' : 'Note'}: {item.note}
                                                </p>
                                            )}
                                        </div>
                                        <p className="font-black text-xs text-slate-900 dark:text-white">
                                            {(item.price * item.quantity).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Pricing breakdown */}
                            <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-white/10">
                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                    <span>{isAr ? 'مجموع المنتجات' : 'Subtotal'}</span>
                                    <span className="text-slate-900 dark:text-white font-black">{totalPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                    <span>{isAr ? 'مصاريف الشحن' : 'Shipping'}</span>
                                    <span className="text-emerald-600 font-black">
                                        {isAr ? 'يحدد مع المندوب' : 'Calculated by region'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-slate-200/60 dark:border-white/10">
                                    <span className="text-base font-black text-slate-900 dark:text-white">
                                        {isAr ? 'الإجمالي المطلوب' : 'Total Amount'}
                                    </span>
                                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                        {totalPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="premium-button w-full py-4.5 rounded-2xl mt-8 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-600/25"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save size={20} />
                                )}
                                <span className="text-base font-black uppercase tracking-wider">
                                    {loading ? (isAr ? 'جاري التأكيد...' : 'Processing...') : (isAr ? 'تأكيد وإرسال الطلب' : 'Confirm Order')}
                                </span>
                            </button>

                            <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-400 font-medium">
                                <ShieldCheck size={15} className="text-emerald-500" />
                                <span>{isAr ? 'بياناتك وطلبك في أمان تام 100%' : '100% Secure Checkout'}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
