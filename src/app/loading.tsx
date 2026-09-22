import React from 'react';

export default function Loading() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-950 animate-pulse" />
                <div className="w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                BibaStore Loading...
            </p>
        </div>
    );
}
