import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    // Key unique to user
    const cartKey = user ? `cart_${user._id}` : null;

    useEffect(() => {
        if (cartKey) {
            loadCart();
        } else {
            setCart([]);
        }
    }, [cartKey]);

    const loadCart = async () => {
        try {
            const stored = await AsyncStorage.getItem(cartKey);
            if (stored) setCart(JSON.parse(stored));
            else setCart([]);
        } catch (e) {
            console.error('Cart load error', e);
            setCart([]);
        }
    };

    const saveCart = async (newCart) => {
        if (cartKey) {
            await AsyncStorage.setItem(cartKey, JSON.stringify(newCart));
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(item => item._id === product._id);
            let updated;
            if (exists) {
                updated = prev.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updated = [...prev, { ...product, quantity: 1 }];
            }
            saveCart(updated);
            return updated;
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => {
            const updated = prev.filter(item => item._id !== id);
            saveCart(updated);
            return updated;
        });
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setCart(prev => {
            const updated = prev.map(item =>
                item._id === id ? { ...item, quantity } : item
            );
            saveCart(updated);
            return updated;
        });
    };

    const clearCart = async () => {
        setCart([]);
        if (cartKey) await AsyncStorage.removeItem(cartKey);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity,
            clearCart, cartTotal, cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
