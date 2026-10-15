import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, MessageSquare, MapPin, User, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import './CSS/CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose }) => {
    const { 
        cart, 
        getCartTotal, 
        clearCart,
        getDeliveryCharge,
        getFinalTotal,
        isFreeDelivery,
        getAmountForFreeDelivery
    } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    });
    const [hasAcceptedPolicy, setHasAcceptedPolicy] = useState(false);
    const [policyError, setPolicyError] = useState('');

    const modalRef = React.useRef(null);
    const formRef = React.useRef(null);

    // Lock body scroll when modal is open and reset policy acceptance state on close
    React.useEffect(() => {
        if (isOpen) {
            document.body.classList.add('body-checkout-open');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.classList.remove('body-checkout-open');
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
            setHasAcceptedPolicy(false);
            setPolicyError('');
        }
        return () => {
            document.body.classList.remove('body-checkout-open');
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle input focus to scroll into view (Mobile Keyboard Fix)
    const handleInputFocus = (e) => {
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleWhatsAppCheckout = (e) => {
        e.preventDefault();
        
        if (!hasAcceptedPolicy) {
            setPolicyError('Please review and check the Return & Refund Policy to proceed with your order.');
            return;
        }
        setPolicyError('');

        const phoneNumber = "917043591952"; 
        
        const orderItemsText = cart.map((item, idx) => {
            let line = `${idx + 1}. *${item.title}* × ${item.quantity} = ₹${item.price * item.quantity}`;
            if (item.selectedSet && item.selectedSet.trim()) {
                line += `\n   📦 Pack: ${item.selectedSet.trim()}`;
            }
            if (item.selectedColor && item.selectedColor.trim()) {
                line += `\n   🎨 Color: ${item.selectedColor.trim()}`;
            }
            if (item.customizationText && item.customizationText.trim()) {
                line += `\n   ✨ Customization: "${item.customizationText.trim()}"`;
            }
            return line;
        }).join('\n\n');

        const subtotal = getCartTotal();
        const deliveryFree = subtotal >= 999;
        const deliveryCharge = deliveryFree ? 0 : 99;
        const total = subtotal + deliveryCharge;
        const policyUrl = 'https://www.printin3d.in/return-policy';

        const message = 
            `🛒 *New Order — Print-IN 3D Creations*\n\n` +
            `👤 *Customer Details*\n` +
            `Name: ${formData.name}\n` +
            `Phone: ${formData.phone}\n\n` +
            `📍 *Delivery Address*\n` +
            `${formData.address}\n` +
            `${formData.city} — ${formData.pincode}\n\n` +
            `📦 *Order Items*\n\n` +
            `${orderItemsText}\n\n` +
            `-----------------------------\n` +
            `Subtotal: ₹${subtotal}\n` +
            `Delivery Charge: ${deliveryFree ? 'FREE (Order ₹999+)' : '₹99'}\n` +
            `*Grand Total: ₹${total}*\n\n` +
            `📋 *RETURN & REFUND POLICY*\n\n` +
            `Please review our Return & Refund Policy before completing your payment:\n` +
            `${policyUrl}\n\n` +
            `For defective, damaged, or incorrect products, please follow the instructions provided in our policy.\n\n` +
            `Please confirm my order. Thank you! 💙`;

        const encodedMessage = encodeURIComponent(message);
        window.location.href = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
        clearCart();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="checkout-overlay" onClick={onClose}>
            <div className="checkout-modal-premium" onClick={(e) => e.stopPropagation()} ref={modalRef}>
                <header className="checkout-header-premium">
                    <div className="checkout-header-title">
                        <ShieldCheck size={24} className="checkout-trust-icon" />
                        <div>
                            <h2>Checkout</h2>
                            <p>Complete your order via WhatsApp</p>
                        </div>
                    </div>
                    <button className="checkout-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <form className="checkout-form-premium" onSubmit={handleWhatsAppCheckout} ref={formRef}>
                    <div className="checkout-sections-scroll">
                        <div className="checkout-sections">
                            {/* Personal Info */}
                            <div className="checkout-section">
                                <h3 className="checkout-section-title">
                                    <User size={18} />
                                    Personal Information
                                </h3>
                                <div className="checkout-input-row">
                                    <div className="checkout-input-group">
                                        <label>Full Name</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onFocus={handleInputFocus}
                                            required 
                                        />
                                    </div>
                                    <div className="checkout-input-group">
                                        <label>Phone Number</label>
                                        <input 
                                            type="tel" 
                                            name="phone" 
                                            placeholder="Mobile number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onFocus={handleInputFocus}
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="checkout-section">
                                <h3 className="checkout-section-title">
                                    <MapPin size={18} />
                                    Shipping Address
                                </h3>
                                <div className="checkout-input-group">
                                    <label>House No. / Building / Street</label>
                                    <textarea 
                                        name="address" 
                                        placeholder="Complete address details"
                                        value={formData.address}
                                        onChange={handleChange}
                                        onFocus={handleInputFocus}
                                        required 
                                    />
                                </div>
                                <div className="checkout-input-row">
                                    <div className="checkout-input-group">
                                        <label>City / Town</label>
                                        <input 
                                            type="text" 
                                            name="city" 
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleChange}
                                            onFocus={handleInputFocus}
                                            required 
                                        />
                                    </div>
                                    <div className="checkout-input-group">
                                        <label>Pincode</label>
                                        <input 
                                            type="text" 
                                            name="pincode" 
                                            placeholder="6-digit PIN"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            onFocus={handleInputFocus}
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="checkout-footer-premium">
                        <div style={{
                            background: '#F8FAFC',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: '1px solid var(--color-border)',
                            marginBottom: '16px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                                <span>Subtotal</span>
                                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>₹{getCartTotal()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                                <span>Delivery Charge</span>
                                {isFreeDelivery() ? (
                                    <span style={{ color: '#059669', fontWeight: 700, background: 'rgba(5, 150, 105, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem' }}>
                                        FREE
                                    </span>
                                ) : (
                                    <span style={{ fontWeight: 700, color: '#C8234A' }}>₹99</span>
                                )}
                            </div>
                            {!isFreeDelivery() && (
                                <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#0284C7', fontWeight: 600 }}>
                                    💡 Add ₹{getAmountForFreeDelivery()} more to unlock FREE Delivery!
                                </p>
                            )}
                        </div>

                        <div className="checkout-summary-mini">
                            <span className="mini-total-label">Total Amount</span>
                            <span className="mini-total-val">₹{getFinalTotal()}</span>
                        </div>

                        {/* Return, Replacement & Refund Policy Acknowledgment */}
                        <div className={`checkout-policy-box ${policyError ? 'has-error' : ''}`}>
                            <div className="checkout-policy-header">
                                <FileText size={15} className="checkout-policy-icon" />
                                <span className="checkout-policy-title">Before Placing Your Order</span>
                            </div>
                            <p className="checkout-policy-desc">
                                Please review our <Link to="/return-policy" target="_blank" rel="noopener noreferrer" className="checkout-policy-inline-link">Return, Replacement & Refund Policy</Link> before completing your purchase. Returns and replacements are subject to the stated policy and applicable consumer protection laws.
                            </p>
                            <label className="checkout-policy-checkbox-container" htmlFor="checkout-policy-consent">
                                <input
                                    type="checkbox"
                                    id="checkout-policy-consent"
                                    checked={hasAcceptedPolicy}
                                    onChange={(e) => {
                                        setHasAcceptedPolicy(e.target.checked);
                                        if (e.target.checked) setPolicyError('');
                                    }}
                                    className="checkout-policy-checkbox"
                                />
                                <span className="checkout-policy-checkbox-text">
                                    I have read and understood the <Link to="/return-policy" target="_blank" rel="noopener noreferrer" className="checkout-policy-inline-link">Return & Refund Policy</Link>.
                                </span>
                            </label>
                            {policyError && (
                                <div className="checkout-policy-error" role="alert">
                                    <AlertCircle size={14} />
                                    <span>{policyError}</span>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btn-whatsapp-checkout">
                            <MessageSquare size={20} />
                            Place Order via WhatsApp (₹{getFinalTotal()})
                        </button>
                        <p className="checkout-privacy-hint">
                            Your data is used only for processing this order.
                        </p>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;
