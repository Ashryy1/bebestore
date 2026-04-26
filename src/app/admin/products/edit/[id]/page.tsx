'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';
import { Save, ArrowLeft, Plus, X, Package, Image as ImageIcon, Ruler, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [images, setImages] = useState<string[]>([]);
    const [sizeChartType, setSizeChartType] = useState<'none' | 'table' | 'image'>('none');
    const [sizeChartImage, setSizeChartImage] = useState<string[]>([]);
    const [sizes, setSizes] = useState([{ label: '', dimensions: '' }]);

    const [categories, setCategories] = useState<any[]>([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        featured: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catRes = await fetch('/api/categories');
                const cats = await catRes.json();
                setCategories(Array.isArray(cats) ? cats : []);

                // Fetch product data
                const prodRes = await fetch(`/api/products/${id}`);
                const prodData = await prodRes.json();

                if (prodData.product) {
                    const p = prodData.product;
                    setForm({
                        title: p.title || '',
                        description: p.description || '',
                        price: p.price?.toString() || '',
                        category: p.category || '',
                        stock: p.stock?.toString() || '0',
                        featured: p.featured || false,
                    });
                    setImages(p.images || []);

                    if (p.sizeChart) {
                        setSizeChartType(p.sizeChart.type);
                        if (p.sizeChart.type === 'table') {
                            setSizes(p.sizeChart.sizes || [{ label: '', dimensions: '' }]);
                        } else if (p.sizeChart.type === 'image') {
                            setSizeChartImage([p.sizeChart.imageUrl].filter(Boolean));
                        }
                    }
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const updateForm = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const addSize = () => setSizes([...sizes, { label: '', dimensions: '' }]);
    const removeSize = (i: number) => setSizes(sizes.filter((_, idx) => idx !== i));
    const updateSize = (i: number, field: string, value: string) => {
        const newSizes = [...sizes];
        (newSizes[i] as any)[field] = value;
        setSizes(newSizes);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const productData = {
            ...form,
            price: parseFloat(form.price),
            stock: parseInt(form.stock) || 0,
            images,
            sizeChart:
                sizeChartType === 'table'
                    ? { type: 'table', sizes: sizes.filter((s) => s.label && s.dimensions) }
                    : sizeChartType === 'image'
                        ? { type: 'image', imageUrl: sizeChartImage[0] || '' }
                        : null,
        };

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (res.ok) {
                router.push('/admin/products');
            }
        } catch (error) {
            console.error('Update error:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Gathering Product Data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex items-center gap-6">
                <Link
                    href="/admin/products"
                    className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Edit Product</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">Update your masterpiece</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <motion.div
                            className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                                    <Package size={20} className="text-indigo-600" />
                                </div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Essential Details</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Product Title</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => updateForm('title', e.target.value)}
                                        placeholder="e.g. Midnight Amigurumi Whale"
                                        required
                                        className="input-field bg-slate-50 dark:bg-white/5 border-none h-14 px-6 rounded-2xl w-full text-sm focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => updateForm('description', e.target.value)}
                                        placeholder="Tell the story of this creation..."
                                        rows={6}
                                        required
                                        className="input-field bg-slate-50 dark:bg-white/5 border-none p-6 rounded-[2rem] w-full text-sm focus:ring-2 focus:ring-indigo-500/20 resize-none"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Size Chart */}
                        <motion.div
                            className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                    <Ruler size={20} className="text-amber-500" />
                                </div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Specifications</h2>
                            </div>

                            <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-100 dark:bg-white/5 mb-8">
                                {['none', 'table', 'image'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setSizeChartType(type as any)}
                                        className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${sizeChartType === type
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                                            }`}
                                    >
                                        {type === 'none' ? 'None' : type === 'table' ? 'Table' : 'Image'}
                                    </button>
                                ))}
                            </div>

                            {sizeChartType === 'table' && (
                                <div className="space-y-4">
                                    {sizes.map((size, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={size.label}
                                                onChange={(e) => updateSize(i, 'label', e.target.value)}
                                                placeholder="S, M, L..."
                                                className="input-field bg-slate-50 dark:bg-white/5 border-none h-12 px-6 rounded-xl flex-[0.3] text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={size.dimensions}
                                                onChange={(e) => updateSize(i, 'dimensions', e.target.value)}
                                                placeholder="Dimensions..."
                                                className="input-field bg-slate-50 dark:bg-white/5 border-none h-12 px-6 rounded-xl flex-1 text-sm"
                                            />
                                            {sizes.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSize(i)}
                                                    className="w-12 h-12 rounded-xl bg-red-500/5 text-red-500 flex items-center justify-center transition-all"
                                                >
                                                    <X size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addSize}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:gap-3 transition-all mt-4"
                                    >
                                        <Plus size={16} />
                                        Add Dimension Row
                                    </button>
                                </div>
                            )}

                            {sizeChartType === 'image' && (
                                <div className="p-4 rounded-[2rem] bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10">
                                    <ImageUpload images={sizeChartImage} onChange={setSizeChartImage} maxFiles={1} />
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar / Options */}
                    <div className="space-y-8">
                        {/* Status & Pricing */}
                        <motion.div
                            className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Price (EGP)</label>
                                    <input
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={form.price}
                                        onChange={(e) => updateForm('price', e.target.value)}
                                        placeholder="1200"
                                        required
                                        className="input-field bg-slate-50 dark:bg-white/5 border-none h-14 px-6 rounded-2xl w-full text-sm font-black text-slate-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Stock Units</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={(e) => updateForm('stock', e.target.value)}
                                        placeholder="10"
                                        required
                                        className="input-field bg-slate-50 dark:bg-white/5 border-none h-14 px-6 rounded-2xl w-full text-sm font-black text-slate-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => updateForm('category', e.target.value)}
                                        className="input-field bg-slate-50 dark:bg-white/5 border-none h-14 px-6 rounded-2xl w-full text-sm font-black text-slate-900 dark:text-white"
                                        required
                                    >
                                        <option value="" disabled className="bg-white dark:bg-slate-900">Select Category</option>
                                        {(Array.isArray(categories) ? categories : []).map((c) => (
                                            <option key={c._id} value={c.slug} className="bg-white dark:bg-slate-900">{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={form.featured}
                                            onChange={(e) => updateForm('featured', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-8 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:bg-indigo-600 transition-colors" />
                                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 transition-colors">Featured Showcase</span>
                                </label>
                            </div>
                        </motion.div>

                        {/* Gallery */}
                        <motion.div
                            className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <ImageIcon size={18} className="text-purple-500" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Media Library</h2>
                            </div>
                            <ImageUpload images={images} onChange={setImages} maxFiles={5} />
                        </motion.div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="premium-button w-full h-16 rounded-[2rem] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={20} />
                            )}
                            <span className="font-black uppercase tracking-[0.2em]">{saving ? 'Updating...' : 'Update Product'}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
