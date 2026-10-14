import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { 
    ArrowLeft, 
    ShoppingCart, 
    ShieldCheck, 
    Truck, 
    Zap, 
    Scale, 
    Box, 
    PenTool, 
    HelpCircle
} from 'lucide-react';
import './CSS/SubProductDetails.css';
import NotFound from './NotFound';

const slugify = (text) =>
    (text || '')
        .toLowerCase()
        .trim()
        .replace(/[&]/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const SubProductDetails = () => {
    const { topicsData, subProductsMap, loading } = useData();
    const { topicId, productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const revealRef = useScrollReveal();
    
    const [customText, setCustomText] = useState('');
    const [error, setError] = useState('');
    const [activeImg, setActiveImg] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);

    // Optimized Data Lookups (Stable for Refactor)
    const topic = useMemo(() => {
        const found = topicsData.find(t => t.id === Number(topicId) || slugify(t.title) === topicId);
        return (found && found.isActive !== false && found.is_active !== false) ? found : null;
    }, [topicsData, topicId]);

    const products = useMemo(() => {
        if (!topic) return [];
        return subProductsMap[topic.id] || [];
    }, [subProductsMap, topic]);

    const product = useMemo(() => {
        const found = products.find(p => p.id === productId || slugify(p.name) === productId);
        return (found && found.isActive !== false && found.is_active !== false) ? found : null;
    }, [products, productId]);

    const galleryImages = useMemo(() => {
        if (product && product.hasColors && product.colorOptions && product.colorOptions.length > 0) {
            const opt = product.colorOptions[selectedColor];
            return opt && opt.images && opt.images.length > 0 ? opt.images : (product.images || []);
        }
        return product ? (product.images || []) : [];
    }, [product, selectedColor]);

    useEffect(() => {
        window.scrollTo(0, 0);
        setSelectedColor(0);
        setActiveImg(0);
    }, [productId]);

    if (loading) return <div className="error-container" role="status">Loading product...</div>;
    if (!product || !topic) return <NotFound />;

    const handleAddToCart = () => {
        setError('');
        
        if (product.customizable && customText.trim().length > (product.customLettersLimit || 50)) {
            setError(`Text exceeds the character limit of ${product.customLettersLimit || 50} characters.`);
            return;
        }
        
        const activeColorOpt = product.hasColors && product.colorOptions && product.colorOptions[selectedColor];
        const selectedColorName = activeColorOpt ? activeColorOpt.color : null;

        // Ensure we pass the customization text under the key expected by CartContext
        addToCart({
            id: product.id,
            title: `${topic.title}: ${product.name}`,
            price: product.price,
            image: galleryImages[activeImg] || null,
            customizationText: product.customizable ? customText : null,
            selectedColor: selectedColorName
        });
        
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="pdp-premium">
            <div className="container" ref={revealRef}>
                {/* Back Navigation */}
                <button className="pdp-back-btn" onClick={() => navigate(`/product/${topicId}`)}>
                    <ArrowLeft size={18} />
                    Back to {topic.title}
                </button>

                <div className="pdp-main-grid">
                    {/* Gallery Section */}
                    <div className="pdp-gallery-container reveal-hidden">
                        <div className="pdp-main-viewport glass-panel">
                            {galleryImages && galleryImages[activeImg] ? (
                                <img 
                                    src={galleryImages[activeImg]} 
                                    alt={product.name} 
                                    className="pdp-main-image"
                                    fetchPriority="high" decoding="async"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/product-unavailable.svg';
                                    }}
                                />
                            ) : (
                                <div className="pdp-image-placeholder">🎁</div>
                            )}
                        </div>
                        <div className="pdp-thumbnails">
                            {galleryImages && galleryImages.map((img, idx) => (
                                <div 
                                    key={idx} 
                                    className={`pdp-thumb ${activeImg === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImg(idx)}
                                >
                                    <img 
                                        src={img} 
                                        alt={`View ${idx + 1}`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/product-unavailable.svg';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Information Section */}
                    <div className="pdp-info-panel reveal-hidden reveal-stagger-1">
                        <div className="pdp-header">
                            <div className="pdp-category-label">{topic.title}</div>
                            <h1 className="pdp-title">{product.name}</h1>
                            <div className="pdp-price-tag" style={{ alignItems: 'baseline' }}>
                                <span className="pdp-currency">₹</span>
                                <span className="pdp-val">{product.price === 0 ? 'Quote Required' : product.price}</span>
                                <span style={{ fontSize: '0.55em', fontWeight: 'normal', opacity: 0.8, marginLeft: '8px' }}>(Inclusive of all taxes)</span>
                            </div>
                        </div>

                        {product.hasColors && product.colorOptions && product.colorOptions.length > 0 && (
                            <div className="pdp-color-picker-section" style={{ marginBottom: '24px', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                <span className="pdp-small-title" style={{ display: 'block', marginBottom: '12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>Color Options</span>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {product.colorOptions.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setSelectedColor(idx);
                                                setActiveImg(0);
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                border: selectedColor === idx ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                                background: selectedColor === idx ? 'var(--color-primary-light)' : '#fff',
                                                color: selectedColor === idx ? 'var(--color-primary)' : 'var(--color-text-main)',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                outline: 'none'
                                            }}
                                        >
                                            {opt.color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pdp-storytelling">
                            <h3 className="section-title-pdp">The Craftsmanship</h3>
                            <p className="pdp-full-desc">{product.fullDetails || product.desc}</p>
                        </div>

                        {/* Attribute Cards Grid */}
                        <div className="pdp-attributes">
                            {product.specs && Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="attribute-card">
                                    <div className="attr-icon-wrap">
                                        {key.toLowerCase().includes('material') ? <Box size={16} /> : 
                                         key.toLowerCase().includes('size') ? <Scale size={16} /> : 
                                         <Zap size={16} />}
                                    </div>
                                    <div className="attr-info">
                                        <span className="attr-label">{key}</span>
                                        <span className="attr-value">{value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Why You'll Love It (Premium Highlight Section) */}
                        <div className="pdp-benefits-grid reveal-hidden reveal-stagger-2">
                            <div className="benefit-card">
                                <div className="benefit-icon-box">
                                    <Zap size={22} />
                                </div>
                                <div className="benefit-content">
                                    <h4>Precision Layering</h4>
                                    <p>Industrial-grade resolution ensuring every curve and detail is captured with professional clarity.</p>
                                </div>
                                <div className="benefit-glow"></div>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon-box">
                                    <ShieldCheck size={22} />
                                </div>
                                <div className="benefit-content">
                                    <h4>Studio Quality</h4>
                                    <p>Each piece undergoes a rigorous multi-point inspection and hand-finishing process before shipping.</p>
                                </div>
                                <div className="benefit-glow"></div>
                            </div>
                        </div>

                        {/* Signature Attributes (Pills) */}
                        {product.features && (
                            <div className="pdp-tags-section">
                                <span className="pdp-small-title">Signature Highlights</span>
                                <div className="pdp-tags-grid">
                                    {product.features.map((feat, i) => (
                                        <span key={i} className="pdp-tag-pill">{feat}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Customization Experience */}
                        {product.customizable && (
                            <div className="pdp-customization-studio reveal-hidden reveal-stagger-3">
                                <div className="studio-header">
                                    <div className="studio-title-wrap">
                                        <PenTool size={20} className="studio-icon" />
                                        <h3 className="studio-title">Customization Studio</h3>
                                    </div>
                                    <span className="studio-badge">Bespoke Option</span>
                                </div>
                                
                                <div className="studio-content glass-panel">
                                    <label className="studio-label">
                                        {product.customizationLabel || "Personalize your creation"}
                                        <span className="studio-label-hint">Add your custom text, initials, or special instructions.</span>
                                    </label>
                                    
                                    <div className="studio-input-wrap">
                                        <textarea 
                                            className={`studio-textarea ${error ? 'error' : ''}`}
                                            placeholder={product.customizationPlaceholder || "e.g. 'GHOST-01' or 'Happy Birthday John'..."}
                                            value={customText}
                                            maxLength={product.customLettersLimit || 50}
                                            onChange={(e) => {
                                                setCustomText(e.target.value);
                                                if (error) setError('');
                                            }}
                                        />
                                        <div className="studio-focus-border"></div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                                        {error ? (
                                            <span style={{ color: '#EF4444', fontSize: '0.75rem', fontWeight: 600 }}>{error}</span>
                                        ) : (
                                            <span></span>
                                        )}
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                                            {customText.length} / {product.customLettersLimit || 50} letters
                                        </span>
                                    </div>
                                    
                                    <div className="studio-footer" style={{ marginTop: '12px' }}>
                                        <div className="studio-status">
                                            <div className="status-dot pulsing"></div>
                                            <span>Hand-crafted to order</span>
                                        </div>
                                        <p className="studio-microcopy">Make it uniquely yours. Our designers will optimize your text for the perfect print.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pdp-actions">
                            <button 
                                className={`btn-pdp-main ${isAdded ? 'success' : ''}`}
                                onClick={handleAddToCart}
                                disabled={product.price === 0}
                            >
                                {isAdded ? (
                                    <>Success! Added</>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        {product.price === 0 ? 'Request Quote via WhatsApp' : 'Add to Collection'}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="pdp-trust-bar">
                            <div className="trust-item">
                                <ShieldCheck size={18} />
                                <span>High Strength PLA</span>
                            </div>
                            <div className="trust-item">
                                <Truck size={18} />
                                <span>Pan-India Delivery</span>
                            </div>
                            <div className="trust-item">
                                <HelpCircle size={18} />
                                <span>Expert Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className={`pdp-mobile-sticky ${product.price === 0 ? 'hide' : ''}`}>
                <div className="mobile-sticky-inner">
                    <div className="mobile-sticky-price" style={{ alignItems: 'baseline' }}>
                        <span className="sticky-currency">₹</span>
                        <span className="sticky-val">{product.price}</span>
                        <span style={{ fontSize: '0.65em', fontWeight: 'normal', opacity: 0.9, marginLeft: '6px' }}>(Inclusive of all taxes)</span>
                    </div>
                    <button className="btn-sticky-add" onClick={handleAddToCart}>
                        {isAdded ? 'Added!' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubProductDetails;
