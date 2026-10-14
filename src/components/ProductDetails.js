import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { 
    ArrowLeft, 
    SlidersHorizontal, 
    ShoppingCart, 
    ChevronDown, 
    CheckCircle2
} from 'lucide-react';

import './CSS/ProductDetails.css';
import NotFound from './NotFound';


const slugify = (text) =>
    (text || '')
        .toLowerCase()
        .trim()
        .replace(/[&]/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const ProductDetails = () => {
    const { topicsData, subProductsMap, loading } = useData();
    const { topicId } = useParams();
    const navigate = useNavigate();
    const revealRef = useScrollReveal({ threshold: 0.01, rootMargin: '50px' });
    const [sortBy, setSortBy] = useState('featured');

    // Stable Data Selection
    const topic = useMemo(() => {
        const found = topicsData.find(t => t.id === Number(topicId) || slugify(t.title) === topicId);
        return (found && found.isActive !== false && found.is_active !== false) ? found : null;
    }, [topicsData, topicId]);

    const products = useMemo(() => {
        if (!topic) return [];
        return (subProductsMap[topic.id] || []).filter(p => p.isActive !== false && p.is_active !== false);
    }, [subProductsMap, topic]);

    const sortedProducts = useMemo(() => {
        let items = [...products];
        if (sortBy === 'price-low') items.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') items.sort((a, b) => b.price - a.price);
        if (sortBy === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
        return items;
    }, [products, sortBy]);

    if (loading) return <div className="error-container" role="status">Loading collection...</div>;
    if (!topic) return <NotFound />;

    return (
        <div className="product-listing-page">
            <div className="container" ref={revealRef}>
                {/* Back Link */}
                <button className="back-link-premium" onClick={() => navigate('/')}>
                    <ArrowLeft size={18} />
                    Back to Home
                </button>

                {/* Cinematic Category Header */}
                <header className="listing-header-premium reveal-hidden">
                    <div className="listing-header-main">
                        {/* <div className="topic-icon-premium">
                            {iconMap[topic.icon] ? React.createElement(iconMap[topic.icon], { size: 48 }) : null}
                        </div> */}
                        <div className="topic-text-premium">
                            <h1 className="topic-title-cinematic">{topic.title}</h1>
                            <p className="topic-desc-refined">{topic.fullDesc || topic.desc}</p>
                            <div className="topic-meta-glass">
                                <div className="meta-item">
                                    <CheckCircle2 size={14} className="meta-icon" />
                                    <span>{products.length} Items Available</span>
                                </div>
                                <div className="meta-divider"></div>
                                <div className="meta-item">
                                    <CheckCircle2 size={14} className="meta-icon" />
                                    <span>Premium Finish</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Sorting Bar */}
                <div className="listing-controls-premium reveal-hidden">
                    <div className="filter-summary">
                        Showing all <strong>{products.length}</strong> creations
                    </div>
                    <div className="sort-wrapper-premium">
                        <SlidersHorizontal size={16} />
                        <span>Sort by:</span>
                        <div className="sort-select-wrap">
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="premium-select"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Alphabetical</option>
                            </select>
                            <ChevronDown size={14} className="select-arrow" />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="listing-grid-premium">
                    {sortedProducts.length > 0 ? (
                        sortedProducts.map((product, index) => (
                            <Link
                                key={product.id} 
                                className={`listing-card-premium reveal-hidden reveal-stagger-${(index % 4) + 1}`}
                                to={`/product/${topic.id}/${product.id}`}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                            >
                                <div className="listing-card-media">
                                    {product.images && product.images[0] ? (
                                        <img 
                                            src={product.images[0]} 
                                            alt={product.name} 
                                            className="listing-card-img"
                                            loading="lazy" decoding="async"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/product-unavailable.svg';
                                            }}
                                        />
                                    ) : (
                                        <div className="listing-card-placeholder">🎁</div>
                                    )}
                                    {product.customizable && (
                                        <span className="listing-card-badge">Custom</span>
                                    )}
                                    <div className="listing-card-overlay">
                                        <span className="overlay-view-btn">
                                            View Details
                                        </span>
                                    </div>
                                </div>
                                <div className="listing-card-info">
                                    <h3 className="listing-card-title">{product.name}</h3>
                                    <p className="listing-card-desc">{product.desc}</p>
                                    <div className="listing-card-footer">
                                        <div className="listing-card-pricing" style={{ alignItems: 'baseline' }}>
                                            <span className="price-symbol">₹</span>
                                            <span className="price-value">
                                                {product.price === 0 ? 'Quote' : product.price}
                                            </span>
                                            <span style={{ fontSize: '0.65em', fontWeight: 'normal', opacity: 0.8, marginLeft: '4px' }}>(Inclusive of all taxes)</span>
                                        </div>
                                        <div className="listing-card-action">
                                            <ShoppingCart size={18} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="empty-listing-premium">
                            <h2>No products found in this category.</h2>
                            <p>Check back soon or request a custom commission!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
