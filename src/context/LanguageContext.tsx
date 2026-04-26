'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';
type Theme = 'light' | 'dark';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    theme: Theme;
    toggleTheme: () => void;
    t: (key: string) => string;
    isDark: boolean;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        home: 'Home',
        shop: 'Shop',
        custom: 'Custom Order',
        track: 'Track Order',
        login: 'Login',
        register: 'Register',
        admin: 'Dashboard',
        logout: 'Logout',
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
    },
    ar: {
        home: 'الرئيسية',
        shop: 'المتجر',
        custom: 'طلب خاص',
        track: 'تتبع طلبك',
        login: 'دخول',
        register: 'حساب جديد',
        admin: 'لوحة التحكم',
        logout: 'خروج',
        heroTitle: 'كروشيه يدوي بكل حب',
        heroSub: 'من ألعاب الأميجورومي اللطيفة إلى الملابس العصرية - كل غرزة تحكي قصة.',
        browse: 'تصفح المجموعة',
        request: 'طلب تصميم خاص',
        features: 'لماذا تختارنا؟',
        featuresSub: 'شغل يدوي بحب وشغف',
        welcomeBack: 'مرحباً بعودتك',
        signInToAccount: 'سجل دخولك إلى حساب بيبا أستور',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        signIn: 'تسجيل الدخول',
        noAccount: 'ليس لديك حساب؟',
        createOne: 'أنشئ حساباً جديداً',
        createAccount: 'إنشاء حساب',
        joinFamily: 'انضم لعائلة بيبا أستور',
        alreadyHaveAccount: 'لديك حساب بالفعل؟',
        fullName: 'الاسم بالكامل',
        // Admin
        dashboard: 'لوحة التحكم',
        products: 'المنتجات',
        sections: 'الأقسام',
        requests: 'الطلبات',
        users: 'المستخدمين',
        finance: 'المالية',
        adminMenu: 'قائمة المدير',
        masterControl: 'لوحة التحكم المركزية',
        navigation: 'التنقل',
        store: 'المتجر',
        exit: 'خروج',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>('ar');
    const [theme, setTheme] = useState<Theme>('dark'); // Default to dark for "Midnight" experience
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem('lang') as Language;
        const savedTheme = localStorage.getItem('theme') as Theme;

        if (savedLang) setLang(savedLang);
        if (savedTheme) setTheme(savedTheme);
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Apply Language
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);

        // Apply Theme
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [lang, theme, mounted]);

    const t = (key: string) => translations[lang][key] || key;
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
