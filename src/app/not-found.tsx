import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-6 text-indigo-600">
                    <ShoppingBag size={42} />
                </div>
                <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-3">404</h1>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    الصفحة غير موجودة | Page Not Found
                </h2>
                <p className="text-sm text-slate-500 mb-8 font-medium">
                    عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="premium-button px-6 py-3.5 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-lg"
                    >
                        <Home size={18} />
                        <span>الرئيسية</span>
                    </Link>
                    <Link
                        href="/shop"
                        className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white text-sm font-bold hover:bg-slate-200 transition-all"
                    >
                        تصفح المنتجات
                    </Link>
                </div>
            </div>
        </div>
    );
}
