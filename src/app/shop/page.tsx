'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, X, Sparkles, Filter, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Demo products
// Products will be fetched from API

export default function ShopPage() {
    const { lang, t } = useLanguage();
    const isAr = lang === 'ar';

    const [products, setProducts] = useState<any[]>([]);
    const [dbCategories, setDbCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch(`/api/products?category=${category}&search=${search}`),
                    fetch('/api/categories')
                ]);
                const prodData = await prodRes.json();
                const catData = await catRes.json();
                setProducts(Array.isArray(prodData.products) ? prodData.products : []);
                setDbCategories(Array.isArray(catData) ? catData : []);
            } catch (error) {
                console.error('Fetch error:', error);
                setProducts([]);
                setDbCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [category, search]);

    // Dynamic Categories with Counts
    const categories = useMemo(() => {
        const cats = Array.isArray(dbCategories) ? dbCategories : [];
        return [
            { value: '', label: isAr ? 'الكل' : 'All' },
            ...cats.map(cat => ({
                value: cat.slug,
                label: cat.name
            }))
        ];
    }, [dbCategories, isAr]);

    const filtered = useMemo(() => {
        let result = products.filter((p) => {
            const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = !category || p.category === category;
            return matchesSearch && matchesCategory;
        });

        // Sorting
        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);

        return result;
    }, [products, search, category, sortBy]);

    return (
        <div className="min-h-screen bg-[var(--sh-bg)] transition-colors duration-500">
            {/* Header Section */}
            <section className="relative overflow-hidden pt-32 pb-20 px-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.08),transparent_70%)]" />
                <div className="orb w-[600px] h-[600px] bg-indigo-500/5 -top-40 -left-40 animate-float" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="badge-brand mb-6"
                    >
                        <Sparkles size={12} />
                        {isAr ? 'مجموعة كروشيه الفاخرة' : 'Premium Crochet Collection'}
                    </motion.div>

                    <motion.h1
                        className="text-6xl md:text-8xl font-black mb-6 tracking-tight text-[var(--sh-fg)]"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {isAr ? <>أناقة <span className="gradient-text">المتجر</span></> : <>Shop <span className="gradient-text">Elegance</span></>}
                    </motion.h1>

                    <motion.p
                        className="text-[var(--sh-fg)] opacity-70 max-w-2xl mx-auto text-xl font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {isAr ? 'قطع فريدة مصنوعة يدوياً بكل حب لتناسب ذوقك الرفيع.' : 'Unique handmade pieces crafted with love for your sophisticated taste.'}
                    </motion.p>
                </div>
            </section>

            {/* Filters Bar */}
            <section className="sticky top-[72px] z-50 bg-[var(--sh-bg)]/80 backdrop-blur-2xl border-y border-[var(--sh-border)] py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        {/* Search */}
                        <div className="relative flex-1 w-full group">
                            <Search size={20} className={`absolute top-1/2 -translate-y-1/2 text-[var(--sh-fg)] opacity-40 group-focus-within:text-[var(--sh-primary)] transition-colors ${isAr ? 'right-5' : 'left-5'}`} />
                            <input
                                type="text"
                                placeholder={isAr ? 'ابحث عما تفضله...' : 'Search for your favorites...'}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`input-field bg-[var(--sh-card)] border-none h-14 ${isAr ? 'pr-14' : 'pl-14'}`}
                            />
                        </div>

                        {/* Controls Group */}
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            {/* Sort Dropdown */}
                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-[var(--sh-card)] border-none h-14 pl-6 pr-12 rounded-2xl text-sm font-bold text-[var(--sh-fg)] cursor-pointer focus:ring-2 focus:ring-[var(--sh-primary)]/20"
                                >
                                    <option value="newest">{isAr ? 'الأحدث' : 'Newest'}</option>
                                    <option value="price-low">{isAr ? 'السعر: من الأقل' : 'Price: Low to High'}</option>
                                    <option value="price-high">{isAr ? 'السعر: من الأعلى' : 'Price: High to Low'}</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--sh-fg)] opacity-40 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                            </div>

                            <div className="flex items-center gap-1 p-1 bg-[var(--sh-card)] rounded-2xl h-14">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[var(--sh-bg)] text-[var(--sh-primary)] shadow-sm' : 'text-[var(--sh-fg)] opacity-40 hover:opacity-100'}`}
                                >
                                    <LayoutGrid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[var(--sh-bg)] text-[var(--sh-primary)] shadow-sm' : 'text-[var(--sh-fg)] opacity-40 hover:opacity-100'}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-3 mt-8 overflow-x-auto no-scrollbar pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setCategory(cat.value)}
                                className={`flex items-center gap-3 whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black transition-all duration-500 border-2 ${category === cat.value
                                    ? 'bg-[var(--sh-primary)] text-white border-[var(--sh-primary)] shadow-xl shadow-[var(--sh-primary)]/20 scale-105'
                                    : 'bg-[var(--sh-bg)] text-[var(--sh-fg)] opacity-60 border-[var(--sh-border)] hover:border-[var(--sh-primary)]'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {filtered.length === 0 ? (
                        <motion.div
                            className="text-center py-40 glass-card border-dashed border-2"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-8">
                                <Search size={44} className="text-[var(--sh-primary)] opacity-20" />
                            </div>
                            <h3 className="text-3xl font-black text-[var(--sh-fg)] mb-4">
                                {isAr ? 'لم نجد ما تبحث عنه' : 'Nothing found for you'}
                            </h3>
                            <p className="text-[var(--sh-fg)] opacity-60 text-lg mb-8">
                                {isAr ? 'جرب البحث بكلمات أخرى أو تغيير القسم المختارة.' : 'Try different keywords or switch to another category.'}
                            </p>
                            <button
                                onClick={() => { setSearch(''); setCategory(''); }}
                                className="premium-button py-4"
                            >
                                {isAr ? 'إعادة ضبط الفلاتر' : 'Reset all filters'}
                            </button>
                        </motion.div>
                    ) : (
                        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                            <AnimatePresence mode="popLayout">
                                {filtered.map((product) => (
                                    <ProductCard key={product._id} {...product} id={product._id} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
