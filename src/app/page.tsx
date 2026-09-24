'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
    ShoppingBag, Sparkles, Heart, Truck, Star,
    ArrowRight, Users, Scissors, Palette, ShieldCheck,
    Smartphone, CheckCircle2
} from 'lucide-react';

export default function HomePage() {
    const { lang, t } = useLanguage();
    const isAr = lang === 'ar';

    const stats = [
        { label: isAr ? 'قطعة يدوية' : 'Pieces Crafted', value: '500+', icon: Scissors, color: 'text-pink-500' },
        { label: isAr ? 'عميل سعيد' : 'Happy Customers', value: '200+', icon: Users, color: 'text-amber-500' },
        { label: isAr ? 'تقييم ممتاز' : 'Average Rating', value: '4.9', icon: Star, color: 'text-yellow-400' },
    ];

    const features = [
        {
            title: isAr ? 'صنع بحب' : 'Handmade with Love',
            desc: isAr ? 'كل قطعة مصنوعة يدويًا بعناية فائقة لضمان أعلى جودة.' : 'Every piece is carefully crafted by hand, ensuring unique quality in each item.',
            icon: Heart,
            color: 'bg-pink-500/10 text-pink-500'
        },
        {
            title: isAr ? 'تصميمات خاصة' : 'Custom Designs',
            desc: isAr ? 'صمم قطعتك المفضلة بالألوان والمقاسات التي تختارها.' : "Dream it, describe it, and we'll create it. Fully personalized crochet pieces.",
            icon: Palette,
            color: 'bg-amber-500/10 text-amber-500'
        },
        {
            title: isAr ? 'تتبع طلبك' : 'Track Your Order',
            desc: isAr ? 'تابع مراحل تنفيذ طلبك الخاص لحظة بلحظة حتى الوصول.' : 'Follow your custom order from request to delivery with our live timeline.',
            icon: Truck,
            color: 'bg-indigo-500/10 text-indigo-500'
        },
    ];

    const [latestProducts, setLatestProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                // Try featured first
                let res = await fetch('/api/products?featured=true&limit=4');
                let data = await res.json();

                if (!data.products || data.products.length === 0) {
                    // Fallback to latest
                    res = await fetch('/api/products?limit=4');
                    data = await res.json();
                }

                setLatestProducts(data.products || []);
            } catch (error) {
                console.error('Fetch latest products error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    return (
        <div className="flex flex-col w-full overflow-hidden bg-[var(--sh-bg)]">
            {/* ─── Hero Section ─── */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
                {/* Visual Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(79,70,229,0.08),transparent_70%)]" />

                    {/* Animated Orbs */}
                    <div className="orb w-[500px] h-[500px] bg-indigo-500/10 -top-48 -left-20 animate-float" />
                    <div className="orb w-[400px] h-[400px] bg-purple-500/10 bottom-20 -right-20 animate-float-delayed" />
                    <div className="orb w-[300px] h-[300px] bg-amber-500/5 top-1/2 left-1/4 blur-[120px]" />

                    {/* Yarn Decorations (SVG patterns or icons) */}
                    <motion.div
                        initial={{ opacity: 0, rotate: -10 }}
                        animate={{ opacity: 0.1, rotate: 0 }}
                        transition={{ duration: 2 }}
                        className="absolute top-40 right-[10%] text-indigo-500 ltr-only"
                    >
                        <Scissors size={200} strokeWidth={0.5} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, rotate: 10 }}
                        animate={{ opacity: 0.1, rotate: 0 }}
                        transition={{ duration: 2 }}
                        className="absolute bottom-40 left-[10%] text-purple-500 rtl-only"
                    >
                        <Scissors size={200} strokeWidth={0.5} />
                    </motion.div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 flex items-center justify-center"
                    >
                        {/* Soft blend masked crochet video showing real hands */}
                        <div
                            className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full shadow-2xl"
                            style={{
                                maskImage: 'radial-gradient(circle at center, black 55%, transparent 82%)',
                                WebkitMaskImage: 'radial-gradient(circle at center, black 55%, transparent 82%)'
                            }}
                        >
                            <video
                                src="/crochet-video.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover scale-110 pointer-events-none"
                            />
                        </div>

                        {/* Floating Craft Badge */}
                        <div className="absolute -bottom-2 px-3.5 py-1 rounded-full bg-[var(--sh-card)]/90 border border-[var(--sh-border)] shadow-md backdrop-blur-md flex items-center gap-1.5 z-10">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--sh-fg)] font-sans">
                                Handcrafted with Love
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-8 backdrop-blur-md"
                        >
                            <Sparkles size={14} className="text-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                                {isAr ? 'بيبا أستور - فخامة يدوية' : 'BibaStore - Premium Handmade'}
                            </span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.9] text-[var(--sh-fg)]">
                            {isAr ? (
                                <>جمال <span className="gradient-text">بيبا أستور</span> <br /> يُصنع من أجلك</>
                            ) : (
                                <>Beautiful <span className="gradient-text">BibaStore</span> <br /> Made Just for You</>
                            )}
                        </h1>

                        <p className="max-w-2xl mx-auto text-xl md:text-2xl text-[var(--sh-fg)] opacity-70 mb-12 leading-relaxed font-medium">
                            {t('heroSub')}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/shop" className="premium-button group px-12 py-6 text-xl">
                                {t('browse')}
                                <ShoppingBag size={24} className={`${isAr ? 'mr-3' : 'ml-3'} group-hover:rotate-12 transition-transform`} />
                            </Link>
                            <Link href="/custom" className="flex items-center justify-center px-12 py-6 text-xl font-black text-[var(--sh-fg)] bg-[var(--sh-card)] rounded-2xl border border-[var(--sh-border)] hover:bg-[var(--sh-hover)] transition-all backdrop-blur-md">
                                {t('request')}
                                <ArrowRight size={24} className={`${isAr ? 'mr-3 rotate-180' : 'ml-3'}`} />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-indigo-500 to-transparent" />
                </motion.div>
            </section>


            {/* ─── Marquee Values ─── */}
            <div className="py-12 bg-[var(--sh-primary)] overflow-hidden whitespace-nowrap">
                <div className="flex animate-marquee">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex items-center gap-12 px-6">
                            {[
                                isAr ? 'صنع بحب' : 'MADE WITH LOVE',
                                isAr ? 'جودة فاخرة' : 'PREMIUM QUALITY',
                                isAr ? 'تصميمات خاصة' : 'CUSTOM DESIGNS',
                                isAr ? 'شحن سريع' : 'FAST SHIPPING',
                            ].map((text) => (
                                <span key={text} className="text-4xl md:text-6xl font-black text-white/20 tracking-tighter uppercase italic">
                                    {text}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Stats Bar (Organized) ─── */}
            <section className="py-12 border-y border-[var(--sh-border)] bg-[var(--sh-card)]/30">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${stat.color} bg-white dark:bg-slate-900 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-110`}>
                                    <stat.icon size={26} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                                <p className="text-xs text-slate-400 uppercase tracking-[0.2em] font-black">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Features Section (Organized Clean Layout) ─── */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-[var(--sh-primary)] font-black tracking-[0.3em] uppercase text-xs">{t('features')}</span>
                        <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-[var(--sh-fg)]">
                            {isAr ? <>نصنع بكل <span className="gradient-text">حب وشغف</span></> : <>Crafted with <span className="gradient-text">Passion</span></>}
                        </h2>
                        <div className="w-20 h-1.5 bg-[var(--sh-primary)] mx-auto rounded-full mb-8" />
                        <p className="text-[var(--sh-fg)] opacity-70 text-lg font-medium leading-relaxed">{isAr ? 'نجمع بين الطرق التقليدية والتصميمات العصرية لنقدم لك قطعاً فريدة تدوم طويلاً.' : 'We combine traditional techniques with modern designs to create pieces that last a lifetime.'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card group hover:border-indigo-500/30 transition-all duration-500"
                            >
                                <div className={`w-16 h-16 rounded-3xl ${f.color} flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500 shadow-inner`}>
                                    <f.icon size={30} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{f.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── New Arrivals Section ─── */}
            <section className="py-32 bg-[var(--sh-bg)]">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <span className="badge-brand mb-4">{isAr ? 'وصلنا حديثاً' : 'NEW ARRIVALS'}</span>
                            <h2 className="text-5xl font-black text-[var(--sh-fg)]">
                                {isAr ? <>أحدث <span className="gradient-text">الإبداعات</span></> : <>Latest <span className="gradient-text">Creations</span></>}
                            </h2>
                        </div>
                        <Link href="/shop" className="text-[var(--sh-primary)] font-black flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest text-sm">
                            {isAr ? 'تصفح الكل' : 'View all products'}
                            <ArrowRight size={20} className={isAr ? 'rotate-180' : ''} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="glass-card animate-pulse p-6">
                                    <div className="aspect-[4/5] rounded-3xl bg-slate-200 dark:bg-slate-800 mb-6" />
                                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 mb-2" />
                                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
                                </div>
                            ))
                        ) : latestProducts.length === 0 ? (
                            <div className="col-span-4 text-center py-20 bg-slate-100/50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                                <ShoppingBag size={48} className="text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">{isAr ? 'لا يوجد منتجات معروضة حالياً' : 'No products featured yet'}</h3>
                            </div>
                        ) : (
                            latestProducts.map((product, i) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card hover:border-indigo-500/30 group p-6"
                                >
                                    <Link href={`/shop/${product._id}`}>
                                        <div className="aspect-[4/5] rounded-3xl bg-slate-200 dark:bg-slate-800 mb-6 overflow-hidden relative">
                                            {product.images && product.images[0] ? (
                                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                                                    <ShoppingBag size={80} />
                                                </div>
                                            )}
                                            {new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-indigo-600">
                                                    {isAr ? 'جديد' : 'NEW'}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{product.title}</h3>
                                        <p className="text-2xl font-black gradient-text">{product.price?.toLocaleString()} <span className="text-xs">{isAr ? 'ج.م' : 'EGP'}</span></p>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ─── Testimonials Section ─── */}
            <section className="py-32 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="badge-purple mb-4">{isAr ? 'آراء العملاء' : 'TESTIMONIALS'}</span>
                        <h2 className="text-5xl font-black text-[var(--sh-fg)]">
                            {isAr ? <>ماذا يقولون <span className="gradient-text">عنّا؟</span></> : <>What They <span className="gradient-text">Say About Us</span></>}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: isAr ? 'سارة محمد' : 'Sarah Miller', text: isAr ? 'الجودة رائعة والتفاصيل مذهلة جداً! كنت قلقة من المقاسات لكنها طلعت مظبوطة تماماً.' : 'The quality is incredible and the details are so precise! I was worried about the sizes but they fit perfectly.', role: isAr ? 'عميلة دائمة' : 'Regular Customer' },
                            { name: isAr ? 'أحمد كمال' : 'Ahmed Kamal', text: isAr ? 'طلبت هدية لزوجتي وكانت منبهرة جداً بدقة الشغل والتغليف الشيك.' : 'I ordered a gift for my wife and she was very impressed by the craftsmanship and the elegant packaging.', role: isAr ? 'عميل جديد' : 'New Customer' },
                            { name: isAr ? 'لينا راشد' : 'Lina Rashid', text: isAr ? 'تجربة ممتازة في التعامل والطلب وصل في ميعاده بالظبط.' : 'Excellent experience dealing with them, and the order arrived exactly on time.', role: isAr ? 'عميلة' : 'Customer' },
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card flex flex-col items-center text-center group"
                            >
                                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Users size={32} className="text-indigo-500" />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 italic mb-8 font-medium">"{t.text}"</p>
                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{t.name}</h4>
                                <span className="text-[10px] font-bold text-indigo-500 tracking-[0.2em]">{t.role}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA Banner (Organized) ─── */}
            <section className="py-24 px-6">
                <div className="container mx-auto">
                    <motion.div
                        className="relative rounded-[40px] overflow-hidden p-12 md:p-24 text-center text-white"
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                    >
                        <div className="absolute inset-0 bg-[var(--sh-primary)] dark:bg-slate-950" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--sh-primary)] via-[var(--sh-green-vibrant)] to-[var(--sh-accent)] opacity-60 dark:opacity-90 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent_50%)]" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black mb-10 leading-tight">
                                {isAr ? <>ابحث عن قطعتك <br /> اليدوية المثالية</> : <>Find Your Perfect <br /> Handmade Piece</>}
                            </h2>
                            <p className="text-white opacity-80 mb-12 text-lg font-medium italic">
                                {isAr ? 'انضم إلى أكثر من ٢٠٠ عميل سعيد بمنتجاتنا الفريدة' : 'Join over 200+ happy customers who love our unique products.'}
                            </p>
                            <Link href="/shop" className="premium-button px-12 py-5 text-xl bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white hover:text-[var(--sh-primary)]">
                                {t('shop')}
                                <ArrowRight size={24} className={`${isAr ? 'mr-3 rotate-180' : 'ml-3'}`} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
