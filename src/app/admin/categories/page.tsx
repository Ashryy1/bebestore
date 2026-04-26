'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Tag, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // RE-ADDED
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Fetch categories error:', error);
        } finally {
            setLoading(false);
        }
    };

    const safeCategories = Array.isArray(categories) ? categories : [];
    const filteredCategories = safeCategories.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory }),
            });
            if (res.ok) {
                setNewCategory('');
                fetchCategories();
            }
        } catch (error) {
            console.error('Add category error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will not delete products in this category.')) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (res.ok) fetchCategories();
        } catch (error) {
            console.error('Delete category error:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex items-center gap-6">
                <Link
                    href="/admin"
                    className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Store Sections</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">Manage your product categories</p>
                </div>
            </div>

            {/* Quick Add Card */}
            <motion.div
                className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <form onSubmit={handleAdd} className="flex gap-4">
                    <div className="relative flex-1">
                        <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New Section Name (e.g. Winter Collection)"
                            className="input-field bg-slate-50 dark:bg-white/5 border-none h-16 pl-14 pr-6 rounded-2xl w-full text-sm font-bold"
                            disabled={submitting}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting || !newCategory.trim()}
                        className="premium-button px-8 h-16 rounded-2xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                        <span className="font-black uppercase tracking-widest text-[10px]">Add Section</span>
                    </button>
                </form>
            </motion.div>

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-24 rounded-3xl bg-slate-100 dark:bg-white/5 animate-pulse" />
                    ))
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredCategories.map((cat, index) => (
                            <motion.div
                                key={cat._id}
                                className="group relative glass-card rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-xl shadow-black/5 flex items-center justify-between hover:border-indigo-500/30 transition-all"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                                        <Tag size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white">{cat.name}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">slug: {cat.slug}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="w-10 h-10 rounded-xl bg-red-500/5 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
