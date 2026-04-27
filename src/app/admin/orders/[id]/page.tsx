'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, User, Phone, MapPin, Calendar, CreditCard, ShoppingBag, Clock, CheckCircle, Truck, XCircle, Loader2, DollarSign, MessageCircle, Lock, Unlock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatWhatsAppNumber } from '@/lib/utils';
import OrderChat from '@/components/OrderChat';

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders`);
            const data = await res.json();
            const found = data.orders.find((o: any) => o._id === id);
            setOrder(found);
        } catch (error) {
            console.error('Fetch order error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (status: string) => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchOrder();
            }
        } catch (error) {
            console.error('Update status error:', error);
        }
    };

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    if (!order) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-black mb-4">Order not found</h2>
            <button onClick={() => router.back()} className="premium-button px-8 py-3">Go Back</button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex items-center gap-6">
                <button onClick={() => router.back()} className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all">
                    <ArrowLeft size={24} className={isAr ? 'rotate-180' : ''} />
                </button>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Order #{order.orderNumber}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Placed on {new Date(order.createdAt).toLocaleString()}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/10" />
                        <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(e.target.value)}
                            className="bg-slate-100 dark:bg-slate-800 border-none text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl focus:ring-0 cursor-pointer text-indigo-500"
                        >
                            <option value="Pending" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Pending</option>
                            <option value="Shipped" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Shipped</option>
                            <option value="Completed" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Completed</option>
                            <option value="Cancelled" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Cancelled</option>
                        </select>
                        {order.isWhatsAppOrder && (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                <MessageCircle size={10} />
                                <span className="text-[8px] font-black uppercase tracking-widest">WhatsApp Order</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                            <ShoppingBag className="text-slate-400" size={20} />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Order Items</h2>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {order.items.map((item: any, i: number) => (
                                <div key={i} className="py-6 first:pt-0 last:pb-0 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.title}</h3>
                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                <span className="text-xs font-bold text-slate-400">Qty: {item.quantity}</span>
                                                {item.size && (
                                                    <>
                                                        <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/10" />
                                                        <span className="text-xs font-black text-indigo-500 uppercase">Size: {item.size}</span>
                                                    </>
                                                )}
                                                {item.color && (
                                                    <>
                                                        <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/10" />
                                                        <span className="text-xs font-black text-purple-500 uppercase">Color: {item.color}</span>
                                                    </>
                                                )}
                                                {item.note && (
                                                    <div className="w-full mt-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                                        <p className="text-[10px] font-bold text-slate-500 italic">Note: {item.note}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">{(item.price * item.quantity).toLocaleString()} <span className="text-[10px] font-bold">EGP</span></p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CreditCard className="text-slate-400" size={20} />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Total Calculation</h2>
                        </div>
                        <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{order.totalAmount.toLocaleString()} <span className="text-sm font-bold uppercase">EGP</span></p>
                    </div>

                    {/* Deposit Management Card */}
                    <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <DollarSign className="text-amber-500" size={20} />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Deposit Management</h2>
                            </div>
                            {order.depositStatus !== 'None' && (
                                <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${order.depositStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                    {order.depositStatus}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Request Payment</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={order.depositAmount || ''}
                                        onChange={(e) => setOrder({ ...order, depositAmount: parseFloat(e.target.value) })}
                                        placeholder="Amount EGP..."
                                        className="input-field bg-slate-50 dark:bg-white/5 border-none h-14 px-6 rounded-2xl flex-1 text-sm font-black"
                                    />
                                    <button
                                        onClick={async () => {
                                            const res = await fetch(`/api/orders/${id}`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ depositAmount: order.depositAmount, depositStatus: 'Requested' })
                                            });
                                            if (res.ok) {
                                                const data = await res.json();
                                                setOrder(data.order);
                                            }
                                        }}
                                        disabled={!order.depositAmount}
                                        className="h-14 px-6 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        Request
                                    </button>
                                </div>
                            </div>

                            {order.depositScreenshot && (
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">User Proof</p>
                                    <div className="aspect-video relative rounded-xl overflow-hidden mb-4 group cursor-pointer" onClick={() => window.open(order.depositScreenshot, '_blank')}>
                                        <img src={order.depositScreenshot} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase">Click to open</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={async () => {
                                                const res = await fetch(`/api/orders/${id}`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ depositStatus: 'Paid' })
                                                });
                                                if (res.ok) {
                                                    const data = await res.json();
                                                    setOrder(data.order);
                                                }
                                            }}
                                            className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const res = await fetch(`/api/orders/${id}`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ depositStatus: 'Rejected' })
                                                });
                                                if (res.ok) {
                                                    const data = await res.json();
                                                    setOrder(data.order);
                                                }
                                            }}
                                            className="p-3 rounded-xl bg-red-500/10 text-red-600 text-[8px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Specific Chat Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center text-indigo-600">
                                    <MessageCircle size={20} />
                                </div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Order Discussion</h2>
                            </div>
                            <button
                                onClick={async () => {
                                    const res = await fetch(`/api/orders/${id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ isChatOpen: !order.isChatOpen })
                                    });
                                    if (res.ok) fetchOrder();
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${order.isChatOpen
                                    ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white'
                                    : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                                    }`}
                            >
                                {order.isChatOpen ? <Lock size={14} /> : <Unlock size={14} />}
                                {order.isChatOpen ? 'Close Chat' : 'Open Chat'}
                            </button>
                        </div>
                        <OrderChat
                            orderId={id as string}
                            isChatOpen={order.isChatOpen}
                            isAdmin={true}
                            customerName={order.userName}
                        />
                    </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-6">
                    <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <User className="text-slate-400" size={18} />
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Customer</h2>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{order.userName}</h3>
                            <div className="flex items-center gap-3 mt-2 text-slate-500">
                                <Phone size={14} />
                                <span className="text-sm font-bold">{order.userPhone}</span>
                            </div>
                            <button
                                onClick={() => {
                                    const msg = encodeURIComponent(`مرحباً ${order.userName}، بخصوص طلبك رقم #${order.orderNumber}، الحالة الحالية هي: [${order.status}]. سنوافيك بالتحديثات...`);
                                    const phone = formatWhatsAppNumber(order.userPhone);
                                    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                                }}
                                className="mt-4 w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all"
                            >
                                <MessageCircle size={14} />
                                Send WhatsApp Update
                            </button>
                        </div>

                        <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="text-slate-400" size={18} />
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Shipping</h2>
                            </div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                {order.shippingDetails?.address}
                            </p>
                            <p className="text-sm font-black text-slate-900 dark:text-white mt-1 uppercase tracking-widest">{order.shippingDetails?.city}</p>
                        </div>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-slate-400" size={18} />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Status History</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-emerald-500">
                                <CheckCircle size={16} />
                                <p className="text-[10px] font-black uppercase tracking-widest">Order Confirmed</p>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <Truck size={16} />
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Pending Shipment</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
