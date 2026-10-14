import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowRight, Star } from 'lucide-react';
import './CSS/BestSellers.css';

// Manually curated bestseller product references
const BESTSELLER_REFS = [
    { topicId: 2, productId: '2-7' },  // Flexy Shark
    { topicId: 2, productId: '2-2' },  // Commando
    { topicId: 2, productId: '2-1' },  // Standing Alphabets
    { topicId: 3, productId: '3-3' },  // Honeycomb Stand
    { topicId: 5, productId: '5-1' },  // Mini F1 Car
    { topicId: 4, productId: '4-1' },  // Minimalist Headphone Stand
];

const BestSellers = () => {
    const { topicsData, subProductsMap } = useData();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const revealRef = useScrollReveal();

    const dynamicBestsellers = [];
    let backendSupportsBestseller = false;

    topicsData.forEach(topic => {
        if (topic.isActive === false || topic.is_active === false) return;
        const products = subProductsMap[topic.id] || [];
        products.forEach(product => {
            if (product.isActive === false || product.is_active === false) return;
            if (product.rawHasBestseller) {
                backendSupportsBestseller = true;
            }
            if (product.isBestseller) {
                dynamicBestsellers.push({ ...product, topicId: topic.id, topic });
            }
        });
    });

    const bestsellers = backendSupportsBestseller
        ? dynamicBestsellers
        : BESTSELLER_REFS.map(({ topicId, productId }) => {
            const topic = topicsData.find(t => t.id === topicId);
            if (!topic || topic.isActive === false || topic.is_active === false) return null;
            const products = subProductsMap[topicId] || [];
            const product = products.find(p => p.id === productId);
            if (!product || product.isActive === false || product.is_active === false) return null;
            return { ...product, topicId, topic };
        }).filter(Boolean);

    if (bestsellers.length === 0) {
        return null;
    }

    const handleCardClick = (item) => {
        navigate(`/product/${item.topicId}/${item.id}`);
    };

    const handleAddToCart = (e, item) => {
        e.stopPropagation();
        if (item.customizable || item.hasColors || item.price === 0) {
            handleCardClick(item);
            return;
        }
        addToCart({
            id: item.id,
            title: `${item.topic.title}: ${item.name}`,
            price: item.price,
            image: item.images && item.images[0] ? item.images[0] : null,
        });
    };

    const handleViewCatalog = (e) => {
        if (window.location.pathname === '/') {
            e.preventDefault();
            const element = document.getElementById('products');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section className="bestsellers-premium">
            <div className="container" ref={revealRef}>
                <div className="header-centered-p reveal-hidden">
                    <div className="eyebrow">
                        <Star size={14} />
                        Most Loved Creations
                    </div>
                    <h2 className="section-title-premium">Our Bestsellers</h2>
                    <p className="section-desc-premium">
                        Explore 3D printed keychains, desk accessories and models from our studio.
                    </p>
                </div>

                <div className="bestsellers-grid-premium">
                    {bestsellers.map((item, index) => (
                        <div
                            key={item.id}
                            className={`bs-card-premium reveal-hidden reveal-stagger-${(index % 3) + 1}`}
                            onClick={() => handleCardClick(item)}
                        >
                            <div className="bs-card-visual">
                                {item.images && item.images[0] ? (
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        className="bs-card-img-premium"
                                        loading="lazy" decoding="async"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/product-unavailable.svg';
                                        }}
                                    />
                                ) : (
                                    <div className="bs-card-placeholder-premium">🎁</div>
                                )}
                                <div className="bs-card-overlay-premium">
                                    <span className="bs-overlay-topic">{item.topic.title}</span>
                                </div>
                            </div>
                            <div className="bs-card-content-premium">
                                <div className="bs-card-top">
                                    <h3 className="bs-card-title-premium"><Link to={`/product/${item.topicId}/${item.id}`} onClick={e => e.stopPropagation()} style={{ color: 'inherit', textDecoration: 'none' }}>{item.name}</Link></h3>
                                    <p className="bs-card-description-premium">{item.desc}</p>
                                </div>
                                <div className="bs-card-bottom-premium">
                                    <div className="bs-card-pricing-premium" style={{ alignItems: 'baseline' }}>
                                        <span className="bs-currency">₹</span>
                                        <span className="bs-price-val">
                                            {item.price === 0 ? 'Quote' : item.price}
                                        </span>
                                        <span style={{ fontSize: '0.65em', fontWeight: 'normal', opacity: 0.8, marginLeft: '4px' }}>(Inclusive of all taxes)</span>
                                    </div>
                                    <button
                                        className="bs-action-btn-premium"
                                        onClick={(e) => handleAddToCart(e, item)}
                                    >
                                        {item.price === 0 || item.customizable || item.hasColors ? (
                                            <>Customize <ArrowRight size={16} /></>
                                        ) : (
                                            <>Add to Cart</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bestsellers-footer-premium reveal-hidden">
                    <Link 
                        to="/#products" 
                        className="btn-premium btn-secondary-p"
                        onClick={handleViewCatalog}
                    >
                        <span>View Entire Catalog</span>
                        <ArrowRight size={18} className="btn-arrow-p" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BestSellers;
