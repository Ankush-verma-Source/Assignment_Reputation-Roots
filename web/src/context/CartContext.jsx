import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    // Compute a user-specific storage key so each user has their own cart
    const cartKey = user ? `cart_${user._id}` : null;

    // Load cart from localStorage whenever the logged-in user changes
    useEffect(() => {
        if (cartKey) {
            try {
                const storedCart = localStorage.getItem(cartKey);
                setCart(storedCart ? JSON.parse(storedCart) : []);
            } catch {
                setCart([]);
            }
        } else {
            // No user logged in — clear cart from state (don't persist guest cart)
            setCart([]);
        }
    }, [cartKey]);

    // Persist cart to localStorage whenever it changes (only for logged-in users)
    useEffect(() => {
        if (cartKey) {
            localStorage.setItem(cartKey, JSON.stringify(cart));
        }
    }, [cart, cartKey]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item._id === product._id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
