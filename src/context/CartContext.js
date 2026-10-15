import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [storageReady, setStorageReady] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('cartItems') || '[]');
            if (Array.isArray(saved)) setCartItems(saved);
        } catch { /* Corrupt or blocked storage must not break the storefront. */ }
        setStorageReady(true);
    }, []);
    useEffect(() => {
        if (!storageReady) return;
        try { localStorage.setItem('cartItems', JSON.stringify(cartItems)); } catch { /* Storage may be blocked. */ }
    }, [cartItems, storageReady]);

    const addToCart = (product) => {
        // Include customizationText and color in the unique key so same product with different options = separate item
        let itemKey = product.id;
        if (product.customizationText) {
            itemKey += `__${product.customizationText.trim().toLowerCase()}`;
        }
        if (product.selectedColor) {
            itemKey += `__${product.selectedColor.trim().toLowerCase()}`;
        }
        if (product.selectedSet) {
            itemKey += `__${product.selectedSet.trim().toLowerCase()}`;
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.cartKey === itemKey);
            if (existingItem) {
                return prevItems.map(item =>
                    item.cartKey === itemKey ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, cartKey: itemKey, quantity: 1 }];
        });

        setNotification({ title: product.title || product.name, image: product.image });
        setTimeout(() => setNotification(null), 4000);
    };

    const removeFromCart = (cartKey) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartKey !== cartKey));
    };

    const updateQuantity = (cartKey, delta) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.cartKey === cartKey) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            })
        );
    };

    const clearCart = () => setCartItems([]);

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const FREE_DELIVERY_THRESHOLD = 999;
    const STANDARD_DELIVERY_CHARGE = 99;

    const getCartCount = () => cartItems.reduce((count, item) => count + item.quantity, 0);
    const getCartTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    
    // Delivery charge is ₹0 (Free) if subtotal >= 999; ₹99 if subtotal < 999 (when cart has items)
    const getDeliveryCharge = () => (cartItems.length > 0 && getCartTotal() < FREE_DELIVERY_THRESHOLD ? STANDARD_DELIVERY_CHARGE : 0);
    const getFinalTotal = () => getCartTotal() + getDeliveryCharge();
    const isFreeDelivery = () => getCartTotal() >= FREE_DELIVERY_THRESHOLD;
    const getAmountForFreeDelivery = () => Math.max(0, FREE_DELIVERY_THRESHOLD - getCartTotal());

    return (
        <CartContext.Provider value={{
            cart: cartItems, // Keeping 'cart' name if it was used
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity,
            clearCart, 
            isCartOpen, 
            setIsCartOpen, // Keeping original state setter if used
            toggleCart, 
            cartTotal: getCartTotal(), 
            cartCount: getCartCount(),
            getCartCount,
            getCartTotal,
            getDeliveryCharge,
            getFinalTotal,
            isFreeDelivery,
            getAmountForFreeDelivery,
            FREE_DELIVERY_THRESHOLD,
            STANDARD_DELIVERY_CHARGE,
            notification, 
            setNotification
        }}>
            {children}
        </CartContext.Provider>
    );
};
