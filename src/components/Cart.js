import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, X, Trash2, Plus, Minus, ShieldCheck, ArrowRight } from 'lucide-react';
import './CSS/Cart.css';

const Cart = ({ setIsCheckoutOpen }) => {
    const {
        cartItems,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getDeliveryCharge,
        getFinalTotal,
        isFreeDelivery,
        getAmountForFreeDelivery
    } = useCart();

    const handleCheckoutClick = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    return (
        <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
            <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
                <header className="cart-header-premium">
                    <div className="cart-header-left">
                        <ShoppingCart size={20} />
                        <h2>Your Collection</h2>
                        <span className="cart-count-badge">{cartItems.length}</span>
                    </div>
                    <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
                        <X size={24} />
                    </button>
                </header>

                <div className="cart-items-container">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.cartKey} className="cart-item-premium">
                                <div className="cart-item-img-wrap">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} />
                                    ) : (
                                        <div className="cart-item-placeholder">🎁</div>
                                    )}
                                </div>
                                <div className="cart-item-details">
                                    <h4 className="cart-item-title">{item.title}</h4>
                                    {item.selectedColor && (
                                        <p className="cart-item-custom" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Color: {item.selectedColor}</p>
                                    )}
                                    {item.selectedSet && (
                                        <p className="cart-item-custom" style={{ color: '#0284C7', fontWeight: 600 }}>Pack: {item.selectedSet}</p>
                                    )}
                                    {item.customizationText && (
                                        <p className="cart-item-custom">"{item.customizationText}"</p>
                                    )}
                                    <div className="cart-item-footer">
                                        <div className="cart-quantity-stepper">
                                            <button onClick={() => updateQuantity(item.cartKey, -1)}>
                                                <Minus size={14} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.cartKey, 1)}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="cart-item-price" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <span>₹{item.price * item.quantity}</span>
                                            <span style={{ fontSize: '0.6em', fontWeight: 'normal', opacity: 0.8 }}>(Inclusive of all taxes)</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="cart-item-remove" onClick={() => removeFromCart(item.cartKey)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="empty-cart-premium">
                            <div className="empty-cart-icon-wrap">
                                <ShoppingCart size={48} strokeWidth={1} />
                            </div>
                            <h3>Your collection is empty</h3>
                            <p>Discover our precision-engineered 3D creations and start building your custom collection.</p>
                            <button className="btn-continue-shop" onClick={() => setIsCartOpen(false)}>
                                Explore Catalog
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <footer className="cart-footer-premium">
                        <div className="cart-trust-bar">
                            <ShieldCheck size={14} />
                            <span>Verified WhatsApp Checkout</span>
                        </div>

                        {/* Free Delivery Banner */}
                        <div style={{
                            margin: '10px 0',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: isFreeDelivery() ? '#F0FDF4' : '#F0F9FF',
                            border: `1px solid ${isFreeDelivery() ? '#86EFAC' : '#BAE6FD'}`,
                            fontSize: '0.78rem'
                        }}>
                            {isFreeDelivery() ? (
                                <div style={{ color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>🎉</span> You've unlocked FREE Delivery!
                                </div>
                            ) : (
                                <div style={{ color: '#0369A1', fontWeight: 600 }}>
                                    Add <strong style={{ color: '#C8234A' }}>₹{getAmountForFreeDelivery()}</strong> more for <strong>FREE Delivery</strong>
                                </div>
                            )}
                        </div>

                        <div className="cart-total-row" style={{ alignItems: 'baseline', marginBottom: '2px' }}>
                            <span className="total-label" style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>Subtotal</span>
                            <div>
                                <span className="total-val" style={{ fontSize: '1.2rem' }}>₹{getCartTotal()}</span>
                                <span style={{ fontSize: '0.6em', fontWeight: 'normal', opacity: 0.8, marginLeft: '4px' }}>(Incl. taxes)</span>
                            </div>
                        </div>

                        <div className="cart-total-row" style={{ alignItems: 'center', marginBottom: '6px' }}>
                            <span className="total-label" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Delivery</span>
                            {isFreeDelivery() ? (
                                <span style={{ color: '#059669', fontWeight: 700, background: 'rgba(5, 150, 105, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                    FREE
                                </span>
                            ) : (
                                <span style={{ fontWeight: 700, color: '#C8234A', fontSize: '0.9rem' }}>₹{getDeliveryCharge()}</span>
                            )}
                        </div>

                        <div className="cart-total-row" style={{ alignItems: 'baseline', borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '4px' }}>
                            <span className="total-label" style={{ fontWeight: 800 }}>Total</span>
                            <div>
                                <span className="total-val" style={{ color: 'var(--color-primary)' }}>₹{getFinalTotal()}</span>
                            </div>
                        </div>

                        <button className="btn-cart-checkout" onClick={handleCheckoutClick} style={{ marginTop: '12px' }}>
                            Proceed to Checkout
                            <ArrowRight size={20} />
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default Cart;
