'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
    userId: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    image?: string;
    phone?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateUser: (newData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // First check session storage for local test user
        const localUser = sessionStorage.getItem('bibastore_test_user');
        if (localUser) {
            setUser(JSON.parse(localUser));
            setLoading(false);
        } else {
            checkAuth();
        }
    }, []);

    async function checkAuth() {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch {
            // Not authenticated
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string) {
        // LOCAL TEST MODE FALLBACK (Bypasses DB if credentials match)
        if (password === 'test123') {
            let testUser: AuthUser | null = null;
            if (email === 'admin@test.com') {
                testUser = { userId: 'test-admin-id', email: 'admin@test.com', name: 'Test Admin', role: 'admin' };
            } else if (email === 'user@test.com') {
                testUser = { userId: 'test-user-id', email: 'user@test.com', name: 'Test User', role: 'user' };
            }

            if (testUser) {
                setUser(testUser);
                sessionStorage.setItem('bibastore_test_user', JSON.stringify(testUser));
                return { success: true };
            }
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setUser({
                    userId: data.user.id,
                    email: data.user.email,
                    name: data.user.name,
                    role: data.user.role,
                    image: data.user.image
                });
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch {
            return { success: false, error: 'Database connection failed. Please check your internet or .env.local' };
        }
    }

    async function register(name: string, email: string, phone: string, password: string) {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password }),
            });
            const data = await res.json();
            if (res.ok) {
                return login(email, password);
            }
            return { success: false, error: data.error };
        } catch {
            return { success: false, error: 'Network error' };
        }
    }

    async function logout() {
        sessionStorage.removeItem('bibastore_test_user');
        await fetch('/api/auth/me', { method: 'DELETE' });
        setUser(null);
    }

    function updateUser(newData: Partial<AuthUser>) {
        if (!user) return;
        const updated = { ...user, ...newData };
        setUser(updated);
        // If it was a test user, update session storage too
        if (sessionStorage.getItem('bibastore_test_user')) {
            sessionStorage.setItem('bibastore_test_user', JSON.stringify(updated));
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
