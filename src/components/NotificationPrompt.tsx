'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { registerServiceWorker, requestNotificationPermission, subscribeToPush } from '@/lib/pushManager';
import { useLanguage } from '@/context/LanguageContext';

import { usePathname } from 'next/navigation';

export default function NotificationPrompt() {
    const [show, setShow] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const { lang } = useLanguage();
    const pathname = usePathname();

    useEffect(() => {
        // Don't show on auth or admin pages
        if (pathname?.includes('/auth') || pathname?.startsWith('/admin')) {
            setShow(false);
            return;
        }

        // Register SW on load
        registerServiceWorker();

        // Check if we should show the prompt
        if ('Notification' in window) {
            setPermission(Notification.permission);
            if (Notification.permission === 'default') {
                const dismissed = sessionStorage.getItem('notif-dismissed');
                if (!dismissed) {
                    // Show after delay
                    const timer = setTimeout(() => setShow(true), 3000);
                    return () => clearTimeout(timer);
                }
            }
        }
    }, []);

    const handleAllow = async () => {
        const perm = await requestNotificationPermission();
        setPermission(perm);
        if (perm === 'granted') {
            await subscribeToPush();
        }
        setShow(false);
    };

    const handleDismiss = () => {
        sessionStorage.setItem('notif-dismissed', 'true');
        setShow(false);
    };

    if (permission === 'granted' || permission === 'denied' || pathname?.startsWith('/admin')) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-6 right-6 z-40 max-w-sm"
                >
                    <div className="glass-card rounded-2xl p-6 shadow-2xl border-indigo-500/20">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                                <Bell size={22} className="text-white" />
                            </div>
                            <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                                <h3 className="font-bold text-white mb-1">
                                    {lang === 'ar' ? 'ابقَ على اطلاع! 🧶' : 'Stay in the loop! 🧶'}
                                </h3>
                                <p className="text-sm text-slate-400 mb-4 leading-relaxed font-medium">
                                    {lang === 'ar'
                                        ? 'احصل على تنبيهات عند تحديث طلبك الخاص أو شحنه!'
                                        : 'Get notified when your custom order is updated or shipped!'}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button onClick={handleAllow} className="premium-button text-xs py-2 px-4">
                                        {lang === 'ar' ? 'تفعيل التنبيهات' : 'Allow Notifications'}
                                    </button>
                                    <button
                                        onClick={handleDismiss}
                                        className="text-xs text-slate-500 hover:text-slate-300 px-3 py-2 transition-colors font-bold"
                                    >
                                        {lang === 'ar' ? 'ليس الآن' : 'Not now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
