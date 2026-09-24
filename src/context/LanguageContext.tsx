'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';
type Theme = 'light' | 'dark';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: any) => void;
    theme: Theme;
    toggleTheme: () => void;
    t: (key: string) => string;
    isDark: boolean;
}

const translations: Record<string, string> = {
    home: 'Home',
    shop: 'Shop',
    custom: 'Custom Order',
    track: 'Track Order',
    login: 'Login',
    register: 'Register',
    admin: 'Dashboard',
    logout: 'Logout',
    myOrders: 'My Orders',
    cart: 'Cart',
    settings: 'Settings',
    heroTitle: 'Beautiful Crochet Made Just for You',
    heroSub: 'From adorable amigurumi to cozy wearables — every stitch tells a story.',
    browse: 'Browse Collection',
    request: 'Request Custom Design',
    features: 'Why Choose Us',
    featuresSub: 'Crafted with Passion',
    welcomeBack: 'Welcome Back',
    signInToAccount: 'Sign in to your BibaStore account',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    noAccount: "Don't have an account?",
    createOne: 'Create one',
    createAccount: 'Create Account',
    joinFamily: 'Join the BibaStore family',
    alreadyHaveAccount: 'Already have an account?',
    fullName: 'Full Name',
    // Admin
    dashboard: 'Dashboard',
    products: 'Products',
    sections: 'Sections',
    requests: 'Requests',
    users: 'Users',
    finance: 'Finance',
    adminMenu: 'Admin Menu',
    masterControl: 'Master Control',
    navigation: 'Navigation',
    store: 'Store',
    exit: 'Exit',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const lang: Language = 'en';
    const [theme, setTheme] = useState<Theme>('dark'); // Default to dark for "Midnight" experience
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Clear any old saved language to enforce English
        try {
            localStorage.removeItem('lang');
            localStorage.setItem('lang', 'en');
        } catch (e) {
            // ignore
        }

        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Strictly enforce LTR and English
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';

        // Apply Theme
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    const setLang = () => {};
    const t = (key: string) => translations[key] || key;
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const isDark = theme === 'dark';

    return (
        <LanguageContext.Provider value={{ lang, setLang, theme, toggleTheme, t, isDark }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
}
