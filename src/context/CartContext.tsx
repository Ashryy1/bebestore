'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
    note?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, quantity: number, size?: string, color?: string, note?: string) => void;
    removeFromCart: (productId: string, size?: string, color?: string, note?: string) => void;
    updateQuantity: (productId: string, size?: string, color?: string, note?: string, quantity?: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('krosh_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart');
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('krosh_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any, quantity: number, size?: string, color?: string, note?: string) => {
        setCart((prev) => {
            const existing = prev.find((item) =>
                item.id === product._id &&
                item.size === size &&
                item.color === color &&
                item.note === note
            );
            if (existing) {
                return prev.map((item) =>
                    (item.id === product._id && item.size === size && item.color === color && item.note === note)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, {
                id: product._id,
                title: product.title,
                price: product.price,
                image: product.images[0],
                quantity,
                size,
                color,
                note
            }];
        });
    };

    const removeFromCart = (productId: string, size?: string, color?: string, note?: string) => {
        setCart((prev) => prev.filter((item) => !(item.id === productId && item.size === size && item.color === color && item.note === note)));
    };

    const updateQuantity = (productId: string, size?: string, color?: string, note?: string, quantity?: number) => {
        if (!quantity || quantity < 1) return;
        setCart((prev) =>
            prev.map((item) =>
                (item.id === productId && item.size === size && item.color === color && item.note === note) ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}
