'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Timeline from '@/components/Timeline';
import { ArrowLeft, Send, DollarSign, CheckCircle2, User, Clock, MessageCircle, AlertCircle, Phone, MapPin, Loader2, Package } from 'lucide-react';

type Status = 'Pending' | 'Reviewing' | 'Pricing' | 'Processing' | 'Shipped' | 'Completed' | 'Returned';

const allStatuses: Status[] = ['Pending', 'Reviewing', 'Pricing', 'Processing', 'Shipped', 'Completed', 'Returned'];

const statusConfig: Record<Status, { color: string; bg: string; dot: string }> = {
    Pending: { color: 'text-slate-500', bg: 'bg-slate-100/50', dot: 'bg-slate-400' },
    Reviewing: { color: 'text-indigo-600', bg: 'bg-indigo-600/5', dot: 'bg-indigo-600' },
    Pricing: { color: 'text-amber-600', bg: 'bg-amber-600/5', dot: 'bg-amber-500' },
    Processing: { color: 'text-purple-600', bg: 'bg-purple-600/5', dot: 'bg-purple-600' },
    Shipped: { color: 'text-blue-600', bg: 'bg-blue-600/5', dot: 'bg-blue-600' },
    Completed: { color: 'text-emerald-600', bg: 'bg-emerald-600/5', dot: 'bg-emerald-500' },
    Returned: { color: 'text-red-600', bg: 'bg-red-600/5', dot: 'bg-red-500' },
};

export default function AdminRequestDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [request, setRequest] = useState<any>(null);
    const [quote, setQuote] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        if (id) fetchRequest();
    }, [id]);

    const fetchRequest = async () => {
        try {
            const res = await fetch(`/api/custom-requests/${id}`);
            const data = await res.json();
            if (data.request) {
                setRequest(data.request);
                if (data.request.adminQuote) setQuote(data.request.adminQuote.toString());
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (updates: any) => {
        setUpdateLoading(true);
        try {
            const res = await fetch(`/api/custom-requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const data = await res.json();
                setRequest(data.request);
                setNote('');
            }
        } catch (error) {
            console.error('Update error:', error);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleWhatsApp = () => {
        if (!request?.userPhone) return;
        const msg = encodeURIComponent(`مرحباً ${request.userName}، تواصلنا معك بخصوص طلب الكروشيه الخاص بك...`);
        window.open(`https://wa.me/${request.userPhone.replace(/\s+/g, '')}?text=${msg}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Request not found</h2>
                <Link href="/admin/requests" className="text-indigo-600 font-bold mt-4 inline-block underline">Back to list</Link>
            </div>
        );
    }

    const currentIndex = allStatuses.indexOf(request.status);
    const nextStatus = currentIndex < allStatuses.length - 1 ? allStatuses[currentIndex + 1] : null;

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/admin/requests"
                        className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Request Detail</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600 text-xs font-black italic">
                                {request.userName?.charAt(0) || 'U'}
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-none">
                                {request.userName} <span className="mx-2 text-slate-300">/</span> {request.userPhone || request.userEmail || 'No contact info'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleWhatsApp}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95"
                    >
                        <MessageCircle size={16} />
                        WhatsApp User
                    </button>
                    <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${statusConfig[request.status as Status]?.bg || 'bg-slate-100'} ${statusConfig[request.status as Status]?.color || 'text-slate-500'} border-current`}>
                        Status: {request.status}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Left: Details & Actions */}
                <div className="xl:col-span-8 space-y-8">
                    {/* Request Info */}
                    <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl shadow-black/5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                                <MessageCircle size={20} className="text-indigo-600" />
                            </div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Design Brief</h2>
                        </div>

                        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 mb-8">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                {request.description}
                            </p>
                        </div>

                        {request.referenceImages?.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Reference Images</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                    {request.referenceImages.map((img: string, i: number) => (
                                        <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 ring-1 ring-slate-100 dark:ring-white/5">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Shipping Details */}
                    {request.shippingDetails && (
                        <div className="glass-card rounded-[2.5rem] p-8 border border-emerald-500/10 bg-emerald-500/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                                    <MapPin size={20} className="text-white" />
                                </div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Shipping Info</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">City</p>
                                    <p className="font-bold text-slate-900 dark:text-white uppercase">{request.shippingDetails.city}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{request.shippingDetails.phone}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 md:col-span-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{request.shippingDetails.address}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Quote Box */}
                        <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                    <DollarSign size={20} className="text-amber-500" />
                                </div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Financials</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <DollarSign size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="number"
                                        value={quote}
                                        onChange={(e) => setQuote(e.target.value)}
                                        placeholder="Set price..."
                                        className="input-field bg-slate-50 dark:bg-white/5 border-none h-14 pl-12 pr-6 rounded-2xl w-full text-sm font-black"
                                    />
                                </div>
                                <button
                                    onClick={() => handleUpdate({ adminQuote: parseFloat(quote), status: 'Pricing' })}
                                    disabled={!quote || updateLoading}
                                    className="premium-button w-full h-14 rounded-2xl"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">Apply Quote</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <Clock size={20} className="text-purple-500" />
                                </div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Status Update</h2>
                            </div>

                            <div className="space-y-4">
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Update log note..."
                                    rows={1}
                                    className="input-field bg-slate-50 dark:bg-white/5 border-none p-4 rounded-2xl w-full text-xs font-bold resize-none"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    {nextStatus && (
                                        <button
                                            onClick={() => handleUpdate({ status: nextStatus, note })}
                                            disabled={updateLoading}
                                            className="premium-button h-14 rounded-2xl flex items-center justify-center gap-2 group col-span-2"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">Move to {nextStatus}</span>
                                            <Send size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Workflow Buttons */}
                    <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 ml-1">Manual Transitions</h3>
                        <div className="flex flex-wrap gap-2">
                            {allStatuses.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleUpdate({ status, note })}
                                    disabled={status === request.status || updateLoading}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${status === request.status
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                        : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Timeline */}
                <div className="xl:col-span-4">
                    <div className="glass-card rounded-[2.5rem] p-8 sticky top-24 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-10">
                            <Clock size={18} className="text-slate-400" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Activity Log</h2>
                        </div>
                        <Timeline entries={request.timeline} currentStatus={request.status} />

                        <div className="mt-10 p-6 rounded-[2rem] bg-indigo-600/5 border border-indigo-600/10 flex items-start gap-4">
                            <AlertCircle size={20} className="text-indigo-600 shrink-0 mt-1" />
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">WhatsApp Tip</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">Use the WhatsApp button to clarify design details or Send quick updates directly to the customer's phone.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { FileText } from 'lucide-react';

