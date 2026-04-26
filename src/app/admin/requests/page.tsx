'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MessageSquare, Clock, ChevronRight, Sparkles, Filter, Search, Loader2 } from 'lucide-react';

type Status = 'Pending' | 'Reviewing' | 'Pricing' | 'Processing' | 'Shipped' | 'Completed' | 'Returned';

const statusConfig: Record<Status, { color: string; bg: string; dot: string }> = {
    Pending: { color: 'text-slate-500', bg: 'bg-slate-100/50', dot: 'bg-slate-400' },
    Reviewing: { color: 'text-indigo-600', bg: 'bg-indigo-600/5', dot: 'bg-indigo-600' },
    Pricing: { color: 'text-amber-600', bg: 'bg-amber-600/5', dot: 'bg-amber-500' },
    Processing: { color: 'text-purple-600', bg: 'bg-purple-600/5', dot: 'bg-purple-600' },
    Shipped: { color: 'text-blue-600', bg: 'bg-blue-600/5', dot: 'bg-blue-600' },
    Completed: { color: 'text-emerald-600', bg: 'bg-emerald-600/5', dot: 'bg-emerald-500' },
    Returned: { color: 'text-red-600', bg: 'bg-red-600/5', dot: 'bg-red-500' },
};

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/custom-requests');
            const data = await res.json();
            setRequests(data.requests || []);
        } catch (error) {
            console.error('Fetch requests error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = (Array.isArray(requests) ? requests : []).filter((r) => {
        const matchesFilter = filter ? r.status === filter : true;
        const matchesSearch = searchTerm
            ? r.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description?.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        return matchesFilter && matchesSearch;
    });

    const statusCounts = (Array.isArray(requests) ? requests : []).reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Request Hub</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">Curate custom handcrafted dreams</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find request..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field bg-slate-100 dark:bg-white/5 border-none h-14 pl-12 pr-6 rounded-2xl w-64 text-sm focus:ring-2 focus:ring-indigo-500/20 font-bold"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none ring-1 ring-slate-100 dark:ring-white/5 p-2 rounded-[2rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                <button
                    onClick={() => setFilter('')}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${!filter
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-105'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                >
                    All ({requests.length})
                </button>
                {(['Pending', 'Reviewing', 'Pricing', 'Processing', 'Shipped', 'Completed', 'Returned'] as Status[]).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2 ${filter === status
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-105'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'
                            }`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${filter === status ? 'bg-white' : statusConfig[status]?.dot || 'bg-slate-400'}`} />
                        {status} ({statusCounts[status] || 0})
                    </button>
                ))}
            </div>

            {/* Request Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 animate-pulse" />
                    ))
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filtered.map((request, i) => (
                            <motion.div
                                key={request._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    href={`/admin/requests/${request._id}`}
                                    className="block glass-card rounded-[2.5rem] p-8 group relative overflow-hidden active:scale-[0.98] transition-all duration-500"
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600/5 flex items-center justify-center text-indigo-600 font-black italic text-2xl group-hover:scale-110 transition-transform">
                                                {request.userName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 dark:text-white leading-tight">{request.userName}</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {request.userPhone || request.userEmail}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current ${statusConfig[request.status as Status]?.bg || 'bg-slate-100'} ${statusConfig[request.status as Status]?.color || 'text-slate-500'}`}>
                                            {request.status}
                                        </span>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[1.5rem] mb-8 ring-1 ring-slate-100 dark:ring-white/5">
                                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed line-clamp-2">
                                            {request.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                                                <Clock size={14} className="text-slate-400" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {request.adminQuote ? (
                                            <div className="text-right">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Quote</p>
                                                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
                                                    {request.adminQuote.toLocaleString()} <span className="text-[10px] font-bold">EGP</span>
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-amber-500 animate-pulse">
                                                <Sparkles size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Needs Quote</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {!loading && filtered.length === 0 && (
                <div className="text-center py-24">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-600/5 flex items-center justify-center mx-auto mb-6">
                        <MessageSquare size={32} className="text-indigo-600/20" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">No requests found</h3>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Try a broad filter</p>
                </div>
            )}
        </div>
    );
}
