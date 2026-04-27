'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, User, ChevronRight, Loader2, Search, Bell, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminSupportPage() {
    const { lang } = useLanguage();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const isAr = lang === 'ar';

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.userId);
            const interval = setInterval(() => fetchMessages(selectedUser.userId), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/admin/support');
            const data = await res.json();
            if (res.ok) {
                setConversations(data.conversations);
            } else {
                console.error('Fetch conversations error:', data.error);
                // Silence error if we are polling, but log it
            }
        } catch (error) {
            console.error('Fetch conversations error:', error);
        } finally {
            setLoadingConversations(false);
        }
    };

    const fetchMessages = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/support/${userId}`);
            const data = await res.json();
            if (res.ok) {
                setMessages(data.messages);
            } else {
                console.error('Fetch messages error:', data.error);
            }
        } catch (error) {
            console.error('Fetch messages error:', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        setSending(true);
        try {
            const res = await fetch(`/api/admin/support/${selectedUser.userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage }),
            });
            if (res.ok) {
                setNewMessage('');
                fetchMessages(selectedUser.userId);
                fetchConversations();
            }
        } catch (error) {
            console.error('Send message error:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-6">
            {/* Conversations List */}
            <div className="w-full md:w-96 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 flex flex-col overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-white/5">
                    <h2 className="text-2xl font-black mb-6 flex items-center justify-between">
                        {isAr ? 'المحادثات' : 'Support Center'}
                        {conversations.some(c => c.unreadCount > 0) && (
                            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        )}
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={isAr ? 'بحث...' : 'Search customers...'}
                            className="w-full bg-slate-50 dark:bg-white/5 rounded-2xl h-12 pl-12 pr-6 text-sm font-bold transition-all outline-none focus:ring-2 ring-indigo-500/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loadingConversations ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="animate-spin text-indigo-500" />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center p-10">
                            <MessageCircle size={48} className="mb-4" />
                            <p className="font-black text-xs uppercase tracking-widest">{isAr ? 'لا توجد رسائل' : 'Inbox Empty'}</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <button
                                key={conv.userId}
                                onClick={() => setSelectedUser(conv)}
                                className={`w-full p-6 rounded-3xl flex items-center gap-4 transition-all duration-300 text-left ${selectedUser?.userId === conv.userId
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                    : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 border border-transparent'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${selectedUser?.userId === conv.userId ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/5'}`}>
                                    {conv.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-black truncate text-sm">{conv.name}</h4>
                                        {conv.unreadCount > 0 && selectedUser?.userId !== conv.userId && (
                                            <span className="w-5 h-5 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center shadow-lg animate-bounce">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs truncate opacity-70 ${selectedUser?.userId === conv.userId ? 'text-white' : ''}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 flex flex-col overflow-hidden relative">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl z-10">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="md:hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400"
                                >
                                    <ArrowLeft size={20} className={isAr ? 'rotate-180' : ''} />
                                </button>
                                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-black text-xl">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-lg">{selectedUser.name}</h3>
                                    <p className="text-xs text-slate-400 font-bold">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="hidden md:flex w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
                                    title={isAr ? 'رجوع للقائمة' : 'Back to list'}
                                >
                                    <ArrowLeft size={20} className={isAr ? 'rotate-180' : ''} />
                                </button>
                                <span className="p-2 px-4 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest">Active Chat</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 p-10 overflow-y-auto space-y-8 bg-slate-50/50 dark:bg-slate-950/20">
                            {messages.map((msg, i) => (
                                <div
                                    key={msg._id || i}
                                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="max-w-[70%] space-y-2 text-left">
                                        <div
                                            className={`p-6 rounded-[2rem] text-sm font-bold shadow-sm ${msg.sender === 'admin'
                                                ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-600/30'
                                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-none border border-slate-100 dark:border-white/5 shadow-lg shadow-slate-200/50 dark:shadow-none'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-2">
                                            {new Date(msg.createdAt).toLocaleTimeString()} • {msg.sender === 'admin' ? 'Support' : 'Customer'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={isAr ? 'اكتب ردك هنا...' : 'Reply to customer...'}
                                    disabled={sending}
                                    className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-indigo-600/20 rounded-[2rem] h-20 pl-10 pr-24 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className="absolute right-4 top-4 bottom-4 px-8 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/30 disabled:opacity-50"
                                >
                                    {sending ? <Loader2 size={20} className="animate-spin mx-auto" /> : (isAr ? 'إرسال' : 'Send')}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-30">
                        <div className="w-32 h-32 rounded-[3rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-8">
                            <MessageCircle size={64} />
                        </div>
                        <h3 className="text-3xl font-black mb-4">{isAr ? 'بريد الدعم' : 'Select a conversation'}</h3>
                        <p className="font-bold max-w-sm mx-auto tracking-tight">{isAr ? 'اختر مستخدماً من القائمة الجانبية لعرض المحادثة والرد عليها' : 'Choose a customer from the list to start providing high-quality support for BibaStore.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
