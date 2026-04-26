'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Loader2, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function SupportChat() {
    const { user } = useAuth();
    const { lang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const isAr = lang === 'ar';

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-support', handleOpen);
        return () => window.removeEventListener('open-support', handleOpen);
    }, []);

    useEffect(() => {
        if (isOpen && user) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000); // Poll every 5s
            return () => clearInterval(interval);
        }
    }, [isOpen, user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            setFetching(true);
            const res = await fetch('/api/support');
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Fetch support messages error:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        setLoading(true);
        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage }),
            });
            if (res.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Send support message error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:justify-end p-4 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.9 }}
                    className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 pointer-events-auto overflow-hidden flex flex-col h-[80vh] sm:h-[600px] mb-4 sm:mr-4 mr-0"
                >
                    {/* Header */}
                    <div className="p-6 bg-indigo-600 text-white flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-lg tracking-tight">{isAr ? 'الدعم الفني' : 'Support Chat'}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                                    {isAr ? 'متصل الآن' : 'Online Support'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50 dark:bg-slate-950/50 scroll-smooth"
                    >
                        {!user ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
                                <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                                    <User size={32} />
                                </div>
                                <p className="text-slate-500 font-bold">
                                    {isAr ? 'الرجاء تسجيل الدخول لبدء المحادثة' : 'Please login to start a conversation'}
                                </p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-40">
                                <div className="w-16 h-16 rounded-3xl bg-slate-200 dark:bg-white/5 flex items-center justify-center">
                                    <MessageCircle size={32} />
                                </div>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                    {isAr ? 'لا توجد رسائل بعد' : 'No messages yet'}
                                </p>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <div
                                    key={msg._id || i}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-3xl text-sm font-bold shadow-sm ${msg.sender === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-600/10'
                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-none border border-slate-200 dark:border-white/5'
                                            }`}
                                    >
                                        {msg.content}
                                        <p className={`text-[8px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Area */}
                    {user && (
                        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={isAr ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                                    disabled={loading}
                                    className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-indigo-600/20 rounded-2xl h-14 pl-6 pr-16 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !newMessage.trim()}
                                    className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </form>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
