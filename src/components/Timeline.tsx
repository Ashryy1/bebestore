'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Eye, DollarSign, Package, Truck, PartyPopper, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TimelineProps {
    entries: any[];
    currentStatus: string;
}

const statusConfig: Record<string, { icon: any; labelEn: string; labelAr: string; color: string; gradient: string }> = {
    Pending: { icon: Clock, labelEn: 'Request Submitted', labelAr: 'تم إرسال الطلب', color: 'text-slate-400', gradient: 'from-slate-400 to-slate-500' },
    Reviewing: { icon: Eye, labelEn: 'Under Review', labelAr: 'قيد المراجعة', color: 'text-blue-500', gradient: 'from-blue-400 to-blue-600' },
    Pricing: { icon: DollarSign, labelEn: 'Price Quote', labelAr: 'تحديد السعر', color: 'text-amber-500', gradient: 'from-amber-400 to-amber-600' },
    Processing: { icon: Package, labelEn: 'In Production', labelAr: 'قيد التنفيذ', color: 'text-indigo-500', gradient: 'from-indigo-400 to-indigo-600' },
    Shipped: { icon: Truck, labelEn: 'Shipped', labelAr: 'تم الشحن', color: 'text-emerald-500', gradient: 'from-emerald-400 to-emerald-600' },
    Completed: { icon: PartyPopper, labelEn: 'Completed', labelAr: 'اكتمل الطلب', color: 'text-emerald-500', gradient: 'from-emerald-400 to-emerald-600' },
};

const allStatuses = ['Pending', 'Reviewing', 'Pricing', 'Processing', 'Shipped', 'Completed'];

export default function Timeline({ entries, currentStatus }: TimelineProps) {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const currentIndex = allStatuses.indexOf(currentStatus);

    return (
        <div className="relative py-8">
            <div className={`relative ${isAr ? 'mr-1 pr-12' : 'ml-1 pl-12'}`}>
                {/* Vertical line background */}
                <div className={`absolute ${isAr ? 'right-[23px]' : 'left-[23px]'} top-0 bottom-0 w-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden`}>
                    <motion.div
                        className="absolute top-0 left-0 w-full bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                        initial={{ height: '0%' }}
                        animate={{ height: `${((currentIndex + 1) / allStatuses.length) * 100}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                </div>

                {/* Timeline nodes */}
                <div className="space-y-12">
                    {allStatuses.map((status, index) => {
                        const config = statusConfig[status];
                        const Icon = config.icon;
                        const entry = entries.find((e: any) => e.status === status);
                        const isActive = index <= currentIndex;
                        const isCurrent = status === currentStatus;

                        return (
                            <motion.div
                                key={status}
                                initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* Node dot */}
                                <motion.div
                                    className={`absolute ${isAr ? '-right-[53px]' : '-left-[53px]'} w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${isCurrent
                                            ? `bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 ring-4 ring-indigo-600/10`
                                            : isActive
                                                ? 'bg-emerald-500 text-white shadow-lg'
                                                : 'bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-700 border-2 border-slate-100 dark:border-white/5'
                                        }`}
                                >
                                    {isActive && !isCurrent ? (
                                        <CheckCircle2 size={24} />
                                    ) : (
                                        <Icon size={24} className={isCurrent ? 'animate-pulse' : ''} />
                                    )}
                                </motion.div>

                                {/* Content Card */}
                                <div
                                    className={`rounded-[2rem] p-8 transition-all duration-500 ${isCurrent
                                            ? 'glass-card border-indigo-500/30 shadow-2xl shadow-indigo-500/10'
                                            : isActive
                                                ? 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5'
                                                : 'opacity-40 grayscale'
                                        }`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`text-xl font-black ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {isAr ? config.labelAr : config.labelEn}
                                            </h3>
                                            {isCurrent && (
                                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                                    {isAr ? 'الحالة الحالية' : 'Current'}
                                                </span>
                                            )}
                                        </div>
                                        {entry && (
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                                <Calendar size={14} />
                                                {new Date(entry.timestamp).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {entry?.note ? (
                                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">{entry.note}</p>
                                    ) : !isActive ? (
                                        <p className="text-slate-300 dark:text-slate-700 italic font-medium">{isAr ? 'في الانتظار...' : 'Pending completion...'}</p>
                                    ) : null}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

