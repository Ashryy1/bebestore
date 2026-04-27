'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface OrderChatProps {
    orderId: string;
    isChatOpen: boolean;
    isAdmin: boolean;
    customerName?: string;
}

export default function OrderChat({ orderId, isChatOpen, isAdmin, customerName }: OrderChatProps) {
    const { user } = useAuth();
    const { lang } = useLanguage();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isAr = lang === 'ar';

    useEffect(() => {
        if (orderId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [orderId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            setFetching(true);
            const res = await fetch(`/api/orders/${orderId}/messages`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);

                // Mark as read if receiving messages
                if (data.messages.some((m: any) => !m.isRead && m.sender !== (isAdmin ? 'admin' : 'user'))) {
                    await fetch(`/api/orders/${orderId}/messages`, { method: 'PATCH' });
                }
            }
        } catch (error) {
            console.error('Fetch order messages error:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const hasText = newMessage && newMessage.trim().length > 0;
        const hasImage = !!selectedImage;
        if ((!hasText && !hasImage) || loading || !isChatOpen) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${orderId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newMessage,
                    image: selectedImage
                }),
            });
            if (res.ok) {
                setNewMessage('');
                setSelectedImage(null);
                fetchMessages();
            }
        } catch (error) {
            console.error('Send order message error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-2xl shadow-black/5">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">
                            {isAdmin ? (customerName || 'Customer Chat') : (isAr ? 'محادثة الطلب' : 'Order Discussion')}
                        </h3>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                            {isChatOpen ? (isAr ? 'المحادثة مفتوحة' : 'Chat is open') : (isAr ? 'المحادثة مغلقة' : 'Chat is closed')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                        <MessageCircle size={40} className="mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">
                            {isAr ? 'لا توجد رسائل بعد' : 'No messages yet'}
                        </p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div key={msg._id || i} className={`flex ${msg.sender === (isAdmin ? 'admin' : 'user') ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-bold ${msg.sender === (isAdmin ? 'admin' : 'user')
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none shadow-sm'
                                }`}>
                                {msg.image && (
                                    <div className="mb-2 rounded-xl overflow-hidden border border-black/5">
                                        <img src={msg.image} alt="" className="w-full h-auto max-h-60 object-cover" />
                                    </div>
                                )}
                                {msg.content && <p>{msg.content}</p>}
                                <p className="text-[8px] opacity-50 mt-2 text-right">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {isChatOpen ? (
                <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900">
                    <form onSubmit={handleSendMessage} className="relative">
                        <AnimatePresence>
                            {selectedImage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute bottom-full mb-4 left-0 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3 z-50"
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-inner">
                                        <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedImage(null)}
                                        className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            accept="image/*"
                            className="hidden"
                        />
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={isAr ? 'اكتب رسالتك...' : 'Type message...'}
                            disabled={loading}
                            className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl h-14 pl-12 pr-12 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600/10 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute left-2 top-2 w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
                        >
                            <ImageIcon size={18} />
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (!newMessage && !selectedImage)}
                            className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="p-8 text-center bg-slate-50 dark:bg-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {isAr ? 'تم إغلاق المحادثة لهذا الطلب' : 'Chat has been closed for this order'}
                    </p>
                </div>
            )}
        </div>
    );
}
