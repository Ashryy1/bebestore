import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotificationPrompt from '@/components/NotificationPrompt';

import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';

import SupportChat from '@/components/SupportChat';

export const metadata: Metadata = {
    title: 'BibaStore | بيبا أستور — Premium Handmade Store',
    description: 'Beautiful handmade pieces crafted with love at BibaStore. Custom orders welcome.',
    keywords: ['BibaStore', 'handmade', 'custom', 'premium', 'craft'],
    icons: {
        icon: '/logo.png',
        apple: '/logo.png',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Caveat:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body className="min-h-screen flex flex-col antialiased">
                <LanguageProvider>
                    <AuthProvider>
                        <CartProvider>
                            <Navbar />
                            <main className="flex-1 pt-20">{children}</main>
                            <Footer />
                            <SupportChat />
                            <NotificationPrompt />
                        </CartProvider>
                    </AuthProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
