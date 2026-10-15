import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    HelpCircle,
    RotateCcw
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
    const [selectedSetIdx, setSelectedSetIdx] = useState(-1);

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

    const activeColorOpt = useMemo(() => {
        if (product && product.hasColors && product.colorOptions && product.colorOptions.length > 0) {
            return product.colorOptions[selectedColor] || product.colorOptions[0];
        }
        return null;
    }, [product, selectedColor]);

    const galleryImages = useMemo(() => {
        if (activeColorOpt && activeColorOpt.images && activeColorOpt.images.length > 0) {
            return activeColorOpt.images;
        }
        return product ? (product.images || []) : [];
    }, [product, activeColorOpt]);

    const selectedSet = useMemo(() => {
        if (product && product.hasSets && product.setOptions && selectedSetIdx >= 0 && selectedSetIdx < product.setOptions.length) {
            return product.setOptions[selectedSetIdx];
        }
        return null;
    }, [product, selectedSetIdx]);

    const currentPrice = selectedSet && selectedSet.price !== undefined ? Number(selectedSet.price) : Number(product?.price || 0);

    useEffect(() => {
        window.scrollTo(0, 0);
        setSelectedColor(0);
        setActiveImg(0);
        setSelectedSetIdx(-1);
    }, [productId]);

    if (loading) return <div className="error-container" role="status">Loading product...</div>;
    if (!product || !topic) return <NotFound />;

    const handleAddToCart = () => {
        setError('');
        
        if (product.customizable && customText.trim().length > (product.customLettersLimit || 50)) {
            setError(`Text exceeds the character limit of ${product.customLettersLimit || 50} characters.`);
            return;
        }
        
        const selectedColorName = activeColorOpt ? activeColorOpt.color : null;
        const selectedSetName = selectedSet ? (selectedSet.name || `Set of ${selectedSet.quantity}`) : null;

        // Ensure we pass the customization text under the key expected by CartContext
        addToCart({
            id: product.id,
            title: `${topic.title}: ${product.name}`,
            price: currentPrice,
            image: galleryImages[activeImg] || null,
            customizationText: product.customizable ? customText : null,
            selectedColor: selectedColorName,
            selectedSet: selectedSetName
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
                                    alt={`${product.name}${activeColorOpt ? ` - ${activeColorOpt.color}` : ''}`} 
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

                        {/* Gallery Thumbnails for active color/product */}
                        {galleryImages && galleryImages.length > 0 && (
                            <div className="pdp-thumbnails pdp-gallery-thumbnails">
                                {galleryImages.map((img, idx) => (
                                    <button 
                                        key={`view-${idx}`} 
                                        type="button"
                                        className={`pdp-thumb ${activeImg === idx ? 'active' : ''}`}
                                        onClick={() => setActiveImg(idx)}
                                        title={`View image ${idx + 1}`}
                                        aria-label={`View image ${idx + 1}`}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`View ${idx + 1}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/product-unavailable.svg';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* More Color Options Section */}
                        {product.hasColors && product.colorOptions && product.colorOptions.length > 1 && (
                            <div className="pdp-other-colors-section">
                                <div className="pdp-other-colors-header">
                                    <span className="pdp-other-colors-title">More Color Options</span>
                                    <span className="pdp-other-colors-count">
                                        {product.colorOptions.length - 1} other shades available
                                    </span>
                                </div>
                                <div className="pdp-thumbnails pdp-color-thumbnails">
                                    {product.colorOptions.map((opt, idx) => {
                                        if (idx === selectedColor) return null; // Hide the currently selected color
                                        const colorImg = (opt.images && opt.images.length > 0) ? opt.images[0] : (product.images && product.images[0]);
                                        if (!colorImg) return null;
                                        return (
                                            <button 
                                                key={`color-${idx}`} 
                                                type="button"
                                                className="pdp-thumb pdp-color-thumb"
                                                onClick={() => {
                                                    setSelectedColor(idx);
                                                    setActiveImg(0);
                                                }}
                                                title={`Switch to ${opt.color}`}
                                                aria-label={`Select ${opt.color}`}
                                            >
                                                <img 
                                                    src={colorImg} 
                                                    alt={opt.color}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/images/product-unavailable.svg';
                                                    }}
                                                />
                                                <span className="pdp-thumb-label">{opt.color}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Information Section */}
                    <div className="pdp-info-panel reveal-hidden reveal-stagger-1">
                        <div className="pdp-header">
                            <div className="pdp-category-label">{topic.title}</div>
                            <h1 className="pdp-title">{product.name}</h1>
                            <div className="pdp-price-tag" style={{ alignItems: 'baseline' }}>
                                <span className="pdp-currency">₹</span>
                                <span className="pdp-val">{currentPrice === 0 ? 'Quote Required' : currentPrice}</span>
                                <span style={{ fontSize: '0.55em', fontWeight: 'normal', opacity: 0.8, marginLeft: '8px' }}>(Inclusive of all taxes)</span>
                                {selectedSet && (
                                    <span style={{
                                        fontSize: '0.55em',
                                        background: '#E0F2FE',
                                        color: '#0369A1',
                                        padding: '3px 8px',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        marginLeft: '10px'
                                    }}>
                                        {selectedSet.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Set / Pack Size Options (Optional Backend Feature) */}
                        {product.hasSets && product.setOptions && product.setOptions.length > 0 && (
                            <div className="pdp-pack-selector-section">
                                <div className="pdp-pack-selector-header">
                                    <span className="pdp-small-title" style={{ margin: 0, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                                        Set / Pack Options
                                    </span>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                        {selectedSet ? `${selectedSet.name} Selected` : 'Single Piece Selected'}
                                    </span>
                                </div>
                                <div className="pdp-pack-options-grid">
                                    {/* Base Single Unit Option */}
                                    <button
                                        type="button"
                                        className={`pdp-pack-card ${selectedSetIdx === -1 ? 'active' : ''}`}
                                        onClick={() => setSelectedSetIdx(-1)}
                                    >
                                        <div className="pdp-pack-card-top">
                                            <span className="pdp-pack-name">Single Unit</span>
                                            <span className="pdp-pack-price">₹{product.price}</span>
                                        </div>
                                        <span className="pdp-pack-sub">1 Piece</span>
                                    </button>

                                    {/* Set Options configured in backend */}
                                    {product.setOptions.map((setOpt, sIdx) => {
                                        const qty = Number(setOpt.quantity) || 2;
                                        const unitPrice = setOpt.price ? Math.round(Number(setOpt.price) / qty) : null;
                                        return (
                                            <button
                                                key={sIdx}
                                                type="button"
                                                className={`pdp-pack-card ${selectedSetIdx === sIdx ? 'active' : ''}`}
                                                onClick={() => setSelectedSetIdx(sIdx)}
                                            >
                                                <div className="pdp-pack-card-top">
                                                    <span className="pdp-pack-name">{setOpt.name || `Set of ${qty}`}</span>
                                                    <span className="pdp-pack-price">₹{setOpt.price}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                                    <span className="pdp-pack-sub">{qty} Pieces</span>
                                                    {unitPrice && (
                                                        <span className="pdp-pack-unit-price">₹{unitPrice}/pc</span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
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

                        {/* Returns & Replacements Policy Notice */}
                        <div className="pdp-policy-notice">
                            <div className="pdp-policy-notice-header">
                                <RotateCcw size={16} className="pdp-policy-icon" />
                                <span className="pdp-policy-title">Returns & Replacements</span>
                            </div>
                            <p className="pdp-policy-text">
                                Received a defective, damaged, or incorrect product? Check our Return & Refund Policy for eligibility and instructions.
                            </p>
                            <Link to="/return-policy" className="pdp-policy-link">
                                Read Return & Refund Policy &rarr;
                            </Link>
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
                        <span className="sticky-val">{currentPrice}</span>
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
