'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, TrendingUp, TrendingDown,
    Plus, Package, ArrowLeft, Loader2,
    History, Receipt, Filter
} from 'lucide-react';
import Link from 'next/link';

export default function AdminFinancePage() {
    const [records, setRecords] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        type: 'expense',
        category: 'material',
        amount: '',
        description: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        try {
            const res = await fetch('/api/finance');
            const data = await res.json();
            setRecords(data.records || []);
            setSummary(data.summary);
        } catch (error) {
            console.error('Fetch finance error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/finance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    amount: parseFloat(form.amount)
                }),
            });
            if (res.ok) {
                setForm({ type: 'expense', category: 'material', amount: '', description: '' });
                fetchFinanceData();
            }
        } catch (error) {
            console.error('Add finance error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const safeRecords = Array.isArray(records) ? records : [];
    const stats = safeRecords.reduce((acc, curr) => {
        if (curr.type === 'income') acc.income += curr.amount;
        else acc.expense += curr.amount;
        return acc;
    }, { income: summary?.orderIncome || 0, expense: 0 });

    const totalProfit = stats.income - stats.expense;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center gap-6">
                <Link
                    href="/admin"
                    className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Treasury</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Financial performance & expenses</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    className="glass-card rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-black/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Income</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">EGP {stats.income.toLocaleString()}</p>
                </motion.div>

                <motion.div
                    className="glass-card rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-black/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                            <TrendingDown size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Expenses</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">EGP {stats.expense.toLocaleString()}</p>
                </motion.div>

                <motion.div
                    className="glass-card rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-black/5 relative overflow-hidden group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Net Profit</span>
                    </div>
                    <p className={`text-3xl font-black ${totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        EGP {totalProfit.toLocaleString()}
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Expense Form */}
                <div className="lg:col-span-1">
                    <motion.div
                        className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5 sticky top-24"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                            <Receipt size={24} className="text-indigo-600" />
                            Record Expense
                        </h2>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                                <select
                                    className="input-field w-full h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl px-6 font-bold text-slate-900 dark:text-white"
                                    value={form.type}
                                    onChange={e => setForm({ ...form, type: e.target.value as any })}
                                >
                                    <option value="expense" className="bg-white dark:bg-slate-900">Expense (-)</option>
                                    <option value="income" className="bg-white dark:bg-slate-900">Income (+)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field w-full h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl px-6 font-bold text-slate-900 dark:text-white"
                                    placeholder="e.g., Material, Shipping, Discount..."
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount (EGP)</label>
                                <input
                                    type="number"
                                    required
                                    className="input-field w-full h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl px-6 font-bold"
                                    placeholder="500"
                                    value={form.amount}
                                    onChange={e => setForm({ ...form, amount: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field w-full h-14 bg-slate-50 dark:bg-white/5 border-none rounded-2xl px-6 font-bold"
                                    placeholder="e.g., 5 Packs of Cotton Yarn"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="premium-button w-full h-16 rounded-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                <span className="font-black uppercase tracking-widest text-[10px]">Save Record</span>
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* History List */}
                <div className="lg:col-span-2">
                    <motion.div
                        className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5 min-h-[600px]"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                            <History size={24} className="text-indigo-600" />
                            Recent Activity
                        </h2>

                        <div className="space-y-4">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
                                ))
                            ) : safeRecords.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No financial records found</p>
                                </div>
                            ) : safeRecords.map((record, i) => (
                                <motion.div
                                    key={record._id}
                                    className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${record.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {record.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white">{record.description}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{record.category}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(record.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`font-black text-lg ${record.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {record.type === 'income' ? '+' : '-'} {record.amount.toLocaleString()}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
