'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Calendar, Shield, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const safeUsers = Array.isArray(users) ? users : [];
    const filteredUsers = safeUsers.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
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

            {/* Users Table Card */}
            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5">
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
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {u._id.slice(-6)}</p>
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
        </div>
    );
}
