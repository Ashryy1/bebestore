'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Calendar, Shield, ArrowLeft, Search, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (!res.ok) {
                console.error('Fetch users error:', data.error);
                alert(`Error: ${data.error || 'Failed to fetch users'}`);
                setUsers([]);
            } else {
                setUsers(data);
            }
        } catch (error) {
            console.error('Fetch users error:', error);
            alert('Something went wrong while fetching users.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const safeUsers = Array.isArray(users) ? users : [];
    const filteredUsers = safeUsers.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm) ||
        u.readableId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/admin"
                        className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Community</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Manage member access & details</p>
                    </div>
                </div>

                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold outline-none transition-all"
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Member</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Contact Info</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Role</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-8 py-6"><div className="h-4 bg-slate-100 dark:bg-white/5 rounded-full w-3/4"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 font-black text-lg">
                                                {u.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white">{u.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.readableId || `ID: ${u._id.slice(-6)}`}</p>
                                                    <button
                                                        onClick={() => handleCopy(u.readableId || u._id)}
                                                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-indigo-500 transition-all"
                                                        title="Copy ID"
                                                    >
                                                        {copiedId === (u.readableId || u._id) ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                                                <Mail size={14} className="text-indigo-500" />
                                                {u.email}
                                            </div>
                                            {u.phone && (
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                                                    <Phone size={14} className="text-emerald-500" />
                                                    {u.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${u.role === 'admin'
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                            : 'bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                            <Shield size={10} />
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <Calendar size={14} />
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="glass-card rounded-3xl p-6 animate-pulse bg-slate-100 dark:bg-white/5 h-40" />
                    ))
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-10 opacity-30">
                        <p className="font-black text-xs uppercase tracking-widest italic">No members found</p>
                    </div>
                ) : (
                    filteredUsers.map((u) => (
                        <motion.div
                            key={u._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card rounded-[2rem] p-6 border border-slate-100 dark:border-white/5 shadow-xl relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 font-black text-xl">
                                        {u.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white leading-tight">{u.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.readableId || `ID: ${u._id.slice(-6)}`}</p>
                                            <button
                                                onClick={() => handleCopy(u.readableId || u._id)}
                                                className="p-1 rounded-md bg-slate-50 dark:bg-white/5 text-slate-400"
                                            >
                                                {copiedId === (u.readableId || u._id) ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${u.role === 'admin'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-emerald-500/10 text-emerald-500'
                                    }`}>
                                    <Shield size={8} />
                                    {u.role}
                                </span>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-indigo-500">
                                        <Mail size={14} />
                                    </div>
                                    <span className="truncate">{u.email}</span>
                                </div>
                                {u.phone && (
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-emerald-500">
                                            <Phone size={14} />
                                        </div>
                                        <span>{u.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                                        <Calendar size={14} />
                                    </div>
                                    <span className="uppercase tracking-widest text-[9px] font-black">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
