'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Minus, Plus, ShoppingBag, ChevronRight, Heart, Share2, MessageCircle, Star, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import SizeChart from '@/components/SizeChart';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { lang, t } = useLanguage();
    const isAr = lang === 'ar';

    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        if (id) fetchProductData();
    }, [id]);

    const fetchProductData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();

            if (data.product) {
                setProduct(data.product);
                // Fetch related products in same category
                const relRes = await fetch(`/api/products?category=${data.product.category}&limit=3`);
                const relData = await relRes.json();
                setRelatedProducts(relData.products?.filter((p: any) => p._id !== id) || []);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppOrder = () => {
        if (!product) return;
        const title = product.title;
        const message = encodeURIComponent(
            isAr
                ? `مرحباً، أود طلب ${title} (عدد: ${quantity}). السعر الإجمالي: ${product.price * quantity} ج.م`
                : `Hello, I'd like to order ${title} (Qty: ${quantity}). Total price: ${product.price * quantity} EGP`
        );
        window.open(`https://wa.me/201234567890?text=${message}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">{isAr ? 'جاري التحميل...' : 'Crafting detail...'}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 pt-32">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{isAr ? 'المنتج غير موجود' : 'Product Not Found'}</h2>
                    <Link href="/shop" className="premium-button px-8 py-3 rounded-2xl inline-block">
                        {isAr ? 'العودة للمتجر' : 'Back to Shop'}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <motion.div
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-12 overflow-x-auto no-scrollbar whitespace-nowrap"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link href="/" className="text-slate-400 hover:text-indigo-500 transition-colors uppercase">{isAr ? 'الرئيسية' : 'Home'}</Link>
                    <ChevronRight size={12} className={`text-slate-300 dark:text-slate-800 ${isAr ? 'rotate-180' : ''}`} />
                    <Link href="/shop" className="text-slate-400 hover:text-indigo-500 transition-colors uppercase">{isAr ? 'المتجر' : 'Shop'}</Link>
                    <ChevronRight size={12} className={`text-slate-300 dark:text-slate-800 ${isAr ? 'rotate-180' : ''}`} />
                    <span className="text-indigo-500 font-black truncate max-w-[200px]">{product.title}</span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:items-start mb-32">
                    {/* Image Gallery */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Thumbnails */}
                        <div className="md:col-span-2 flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[600px]">
                            {product.images?.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative flex-shrink-0 aspect-square w-20 md:w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-indigo-500 scale-105' : 'border-slate-100 dark:border-white/5 opacity-50'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <motion.div
                            className="md:col-span-10 order-1 md:order-2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden glass-card relative group p-0 border-none shadow-2xl shadow-indigo-500/5">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeImage}
                                        src={product.images?.[activeImage]}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.7 }}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>

                                {/* Action buttons removed as requested */}
                            </div>
                        </motion.div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-5 flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="badge-brand mb-6">
                                {product.category}
                            </span>

                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tighter">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-amber-500">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star
                                                key={i}
                                                size={18}
                                                fill={i <= Math.round(product.rating || 5) ? "currentColor" : "none"}
                                                className={i <= Math.round(product.rating || 5) ? "" : "text-slate-200 dark:text-slate-800"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{product.rating || 5.0}</span>
                                </div>
                                <span className="text-xs font-black text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-4 uppercase tracking-[0.2em]">
                                    {product.numReviews || 0} {isAr ? 'مراجعة' : 'Reviews'}
                                </span>
                            </div>

                            <div className="flex items-baseline gap-4 mb-10">
                                <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                                    {product.price?.toLocaleString()} <span className="text-xl font-black opacity-70">{isAr ? 'ج.م' : 'EGP'}</span>
                                </span>
                            </div>

                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                                {product.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-12">
                                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <Truck size={24} className="text-indigo-500 mb-2" />
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isAr ? 'الشحن' : 'Shipping'}</h4>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{isAr ? 'خلال ٢-٣ أيام' : 'In 2-3 Days'}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <ShieldCheck size={24} className="text-indigo-500 mb-2" />
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isAr ? 'الجودة' : 'Quality'}</h4>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{isAr ? 'صنع يدوي ١٠٠٪' : '100% Handmade'}</p>
                                </div>
                            </div>

                            {product.sizeChart?.type === 'table' && product.sizeChart.sizes?.length > 0 && (
                                <div className="mb-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Size</h3>
                                        <button className="text-[10px] font-bold text-indigo-600 underline">Size Guide</button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizeChart.sizes.map((s: any) => (
                                            <button
                                                key={s.label}
                                                onClick={() => setSelectedSize(s.label)}
                                                className={`px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 border-2 ${selectedSize === s.label
                                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-105'
                                                        : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:border-slate-200 dark:hover:border-white/10'
                                                    }`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="section-divider mb-10" />

                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-500">{isAr ? 'الكمية' : 'Quantity'}</span>
                                    <div className="flex items-center bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-4 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="w-16 text-center font-black text-xl text-slate-900 dark:text-white">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="p-4 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    className="premium-button text-lg py-5 w-full flex items-center justify-center gap-3"
                                    disabled={product.stock === 0 || (product.sizeChart?.type === 'table' && product.sizeChart.sizes?.length > 0 && !selectedSize)}
                                    onClick={() => addToCart(product, quantity, selectedSize || undefined)}
                                >
                                    <ShoppingBag size={24} />
                                    {isAr ? 'إضافة للسلة' : 'Add to Cart'}
                                </button>
                                {product.sizeChart?.type === 'table' && product.sizeChart.sizes?.length > 0 && !selectedSize && (
                                    <p className="text-center text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-2">Please select a size first</p>
                                )}

                                <div className="space-y-4">
                                    {!product.isOutOfStock && (
                                        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder={isAr ? "الاسم" : "Full Name"}
                                                    id="orderName"
                                                    className="w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-900 border-none text-sm font-bold"
                                                />
                                                <input
                                                    type="tel"
                                                    placeholder={isAr ? "رقم الواتساب" : "WhatsApp Phone"}
                                                    id="orderPhone"
                                                    className="w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-900 border-none text-sm font-bold"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={async () => {
                                            const name = (document.getElementById('orderName') as HTMLInputElement)?.value;
                                            const phone = (document.getElementById('orderPhone') as HTMLInputElement)?.value;

                                            if (!name || !phone) {
                                                alert(isAr ? 'يرجى إدخال الاسم ورقم الهاتف' : 'Please enters name and phone');
                                                return;
                                            }

                                            try {
                                                const res = await fetch('/api/orders', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        userName: name,
                                                        userPhone: phone,
                                                        items: [{
                                                            productId: product._id,
                                                            title: product.title,
                                                            quantity,
                                                            price: product.price,
                                                            image: product.images?.[0]
                                                        }],
                                                        totalAmount: product.price * quantity
                                                    })
                                                });
                                                const data = await res.json();
                                                const orderNo = data.order?.orderNumber;

                                                const message = encodeURIComponent(
                                                    isAr
                                                        ? `طلب جديد رقم #${orderNo}\nالمنتج: ${product.title}\nالعدد: ${quantity}\nالإجمالي: ${product.price * quantity} ج.م`
                                                        : `New Order #${orderNo}\nProduct: ${product.title}\nQty: ${quantity}\nTotal: ${product.price * quantity} EGP`
                                                );
                                                window.open(`https://wa.me/201234567890?text=${message}`, '_blank');
                                            } catch (error) {
                                                console.error('Order creation error:', error);
                                            }
                                        }}
                                        className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black text-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
                                    >
                                        <MessageCircle size={24} />
                                        {isAr ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
                                    </button>
                                </div>
                            </div>

                            {product.sizeChart && (
                                <div className="mt-12">
                                    <SizeChart sizeChart={product.sizeChart} />
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* You May Also Like */}
                {relatedProducts.length > 0 && (
                    <section className="pt-20 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <span className="badge-purple mb-4">{isAr ? 'مقتنيات أخرى' : 'WISHLIST FAVORITES'}</span>
                                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {isAr ? <>قد <span className="gradient-text">يُعجبك</span> أيضاً</> : <>You May <span className="gradient-text">Also Like</span></>}
                                </h2>
                            </div>
                            <Link href="/shop" className="text-slate-400 font-black flex items-center gap-2 hover:text-indigo-500 transition-all underline underline-offset-8 decoration-2 uppercase tracking-widest text-[10px]">
                                {isAr ? 'مشاهدة المزيد' : 'See all products'}
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p._id} {...p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
