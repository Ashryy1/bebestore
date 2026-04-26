import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotificationPrompt from '@/components/NotificationPrompt';

import { LanguageProvider } from '@/context/LanguageContext';

import SupportChat from '@/components/SupportChat';

export const metadata: Metadata = {
    title: 'BibaStore | بيبا أستور — Premium Handmade Store',
    description: 'Beautiful handmade pieces crafted with love at BibaStore. Custom orders welcome.',
    keywords: ['BibaStore', 'handmade', 'custom', 'premium', 'craft'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
                <script dangerouslySetInnerHTML={{
                    __html: `
                        tailwind.config = {
                            darkMode: 'class',
                            theme: {
                                extend: {
                                    colors: {
                                        brand: {
                                            50: '#fdfaff', 100: '#f9f5ff', 200: '#f0e6ff', 300: '#e1ccff',
                                            400: '#c4b5fd', 500: '#9c83f9', 600: '#8a72e8', 700: '#7367f0',
                                            800: '#5b52c9', 900: '#4a42a3', 950: '#2d296b',
                                        },
                                        warm: {
                                            50: '#fff9eb', 100: '#ffefc6', 200: '#ffd08a', 300: '#ffb14e',
                                            400: '#ff8c1a', 500: '#f56a00', 600: '#d14d00', 700: '#a33b00',
                                            800: '#803000', 900: '#662700', 950: '#3d1400',
                                        }
                                    }
                                }
                            }
                        }
                    `
                }} />
            </head>
            <body className="min-h-screen flex flex-col antialiased">
                <LanguageProvider>
                    <AuthProvider>
                        <Navbar />
                        <main className="flex-1 pt-20">{children}</main>
                        <Footer />
                        <SupportChat />
                        <NotificationPrompt />
                    </AuthProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
