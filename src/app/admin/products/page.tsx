'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Package, Search, ShoppingBag, Eye, Star, Loader2 } from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products?limit=100'); // Fetch all for management
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Fetch products error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = (Array.isArray(products) ? products : []).filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter((p) => p._id !== id));
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Delete product error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Products</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">Manage your handcrafted collection</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group hidden md:block">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search collection..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field bg-slate-100 dark:bg-white/5 border-none h-14 pl-12 pr-6 rounded-2xl w-80 text-sm focus:ring-2 focus:ring-indigo-500/20 font-bold outline-none"
                        />
                    </div>
                    <Link href="/admin/products/new" className="premium-button px-6 h-14 rounded-2xl flex items-center gap-2">
                        <Plus size={20} />
                        <span className="text-sm font-black uppercase tracking-widest whitespace-nowrap">Add Product</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="relative group md:hidden">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search collection..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field bg-slate-100 dark:bg-white/5 border-none h-14 pl-12 pr-6 rounded-2xl w-full text-sm font-bold shadow-inner"
                />
            </div>

            {/* Table Area */}
            <motion.div
                className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-start border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Product</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Price</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-8">
                                            <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-2xl w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                filtered.map((product, i) => (
                                    <motion.tr
                                        key={product._id}
                                        className="group border-b last:border-0 border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden relative">
                                                    {product.images && product.images[0] ? (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ShoppingBag size={20} className="text-indigo-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-black text-slate-900 dark:text-white leading-tight truncate max-w-[200px]">{product.title}</span>
                                                        {product.featured && <Star size={12} className="text-amber-500 fill-amber-500" />}
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {product._id?.slice(-6)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 rounded-full bg-indigo-600/5 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-600/10">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-black text-slate-900 dark:text-white">
                                            {product.price?.toLocaleString()} <span className="text-[10px] font-bold text-slate-400 ml-1">EGP</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${product.stock <= 3 ? 'bg-red-500' : 'bg-emerald-500'} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                                                <span className="text-sm font-black text-slate-600 dark:text-slate-300">{product.stock} Units</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/shop/${product._id}`} target="_blank" className="p-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-400 hover:text-indigo-600 transition-all">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link href={`/admin/products/edit/${product._id}`} className="p-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-400 hover:text-indigo-600 transition-all">
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-3 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-24 bg-slate-50/10 dark:bg-white/5">
                                        <div className="w-20 h-20 rounded-[2rem] bg-indigo-600/10 flex items-center justify-center mx-auto mb-6">
                                            <Package size={32} className="text-indigo-600/40" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white">No products found</h3>
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2 px-6">Adjust your collection search</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
