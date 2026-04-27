'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Loader2, User, Image as ImageIcon } from 'lucide-react';
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
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isAr = lang === 'ar';

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        const handleOpenWithMsg = (e: any) => {
            setIsOpen(true);
            if (e.detail) setNewMessage(e.detail);
        };
        window.addEventListener('open-support', handleOpen);
        window.addEventListener('open-support-with-msg', handleOpenWithMsg);
        return () => {
            window.removeEventListener('open-support', handleOpen);
            window.removeEventListener('open-support-with-msg', handleOpenWithMsg);
        };
    }, []);

    useEffect(() => {
        if (isOpen && user) {
            markAsRead();
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        } else if (user) {
            // Even if closed, poll for unread count
            const interval = setInterval(fetchMessages, 10000);
            return () => clearInterval(interval);
        }
    }, [isOpen, user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const markAsRead = async () => {
        try {
            await fetch('/api/support', { method: 'PATCH' });
            setUnreadCount(0);
        } catch (error) {
            console.error('Mark read error:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            setFetching(true);
            const res = await fetch('/api/support');
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);
                // Calculate unread from admin
                const unread = data.messages.filter((m: any) => m.sender === 'admin' && !m.isRead).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Fetch support messages error:', error);
        } finally {
            setFetching(false);
        }
    };

    const formatMessageDate = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return isAr ? 'اليوم' : 'Today';
        if (days === 1) return isAr ? 'أمس' : 'Yesterday';
        return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' });
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const hasText = newMessage && newMessage.trim().length > 0;
        const hasImage = !!selectedImage;
        if ((!hasText && !hasImage) || loading || !user) return;

        setLoading(true);
        try {
            const res = await fetch('/api/support', {
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
            console.error('Send support message error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:justify-end p-4 pointer-events-none">
                        {/* Backdrop for mobile */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-auto sm:hidden"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 pointer-events-auto overflow-hidden flex flex-col h-[80vh] sm:h-[600px] mb-4 sm:mr-4 mr-0 relative z-10"
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
                                    messages.map((msg, i) => {
                                        const showDate = i === 0 || formatMessageDate(messages[i - 1].createdAt) !== formatMessageDate(msg.createdAt);
                                        return (
                                            <div key={msg._id || i} className="space-y-6">
                                                {showDate && (
                                                    <div className="flex justify-center my-4">
                                                        <span className="px-4 py-1 rounded-full bg-slate-200 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                            {formatMessageDate(msg.createdAt)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div
                                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] p-4 rounded-3xl text-sm font-bold shadow-sm ${msg.sender === 'user'
                                                            ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-600/10'
                                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-none border border-slate-200 dark:border-white/5'
                                                            }`}
                                                    >
                                                        {msg.image && (
                                                            <div
                                                                className="mb-2 rounded-2xl overflow-hidden cursor-zoom-in transition-transform hover:scale-[1.02] active:scale-95"
                                                                onClick={() => setPreviewImage(msg.image)}
                                                            >
                                                                <img src={msg.image} alt="Sent image" className="w-full h-auto max-h-80 object-cover shadow-sm" />
                                                            </div>
                                                        )}
                                                        {msg.content && <p className={msg.image ? 'mt-3' : ''}>{msg.content}</p>}
                                                        <p className={`text-[8px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Input Area */}
                            {user && (
                                <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
                                    <form onSubmit={handleSendMessage} className="relative">
                                        <AnimatePresence>
                                            {selectedImage && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute bottom-full mb-4 left-0 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-white/5 flex items-center gap-3 z-50"
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
                                            placeholder={isAr ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                                            disabled={loading}
                                            className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-indigo-600/20 rounded-2xl h-14 pl-12 pr-16 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={loading}
                                            className="absolute left-2 top-2 w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-white/20 transition-all disabled:opacity-50"
                                        >
                                            <ImageIcon size={18} />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || (!newMessage && !selectedImage)}
                                            className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Image Box / Lightbox */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md pointer-events-auto"
                        onClick={() => setPreviewImage(null)}
                    >
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreviewImage(null);
                            }}
                        >
                            <X size={24} />
                        </motion.button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-8 left-8 z-[105] w-16 h-16 rounded-[2rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 flex items-center justify-center hover:bg-indigo-700 transition-all group pointer-events-auto"
                >
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black animate-bounce shadow-lg">
                            {unreadCount}
                        </span>
                    )}
                    <span className="absolute left-full ml-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl text-xs font-black text-slate-900 dark:text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap border border-slate-100 dark:border-white/5">
                        {isAr ? 'تواصل معنا' : 'Chat with us'}
                    </span>
                </motion.button>
            )}
        </>
    );
}
