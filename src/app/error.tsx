'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Unhandled app error:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                <AlertCircle size={36} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                حدث خطأ غير متوقع
            </h2>
            <p className="text-sm text-slate-500 max-w-md mb-8">
                نعتذر عن هذا الخطأ المؤقت، يمكنك الضغط على زر إعادة المحاولة لمتابعة التصفح.
            </p>
            <button
                onClick={() => reset()}
                className="premium-button px-7 py-3.5 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-lg"
            >
                <RotateCcw size={18} />
                <span>إعادة المحاولة</span>
            </button>
        </div>
    );
}
