import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowUpRight } from 'lucide-react';
import './CSS/Products.css';

const Products = () => {
    const { topicsData, subProductsMap } = useData();
    const revealRef = useScrollReveal();

    const getTopicImage = (topic) => {
        if (topic.image) return topic.image;
        const products = subProductsMap[topic.id] || [];
        const first = products.find(p => p.images && p.images.length > 0);
        return first ? first.images[0] : null;
    };

    return (
        <section id="products" className="products-showcase">
            <div className="container" ref={revealRef}>
                <div className="header-centered-p reveal-hidden">
                    <span className="eyebrow">Studio Series</span>
                    <h2 className="section-title-large">Design Categories</h2>
                    <p className="section-subtitle">
                        Discover precision-engineered 3D creations tailored to your lifestyle.
                    </p>
                </div>

                <div className="category-grid-premium">
                    {topicsData.filter(topic => topic.isActive !== false && topic.is_active !== false).map((topic, index) => {
                        const thumbnailImg = getTopicImage(topic);
                        return (
                            <Link
                                key={topic.id}
                                className={`category-card-premium reveal-hidden reveal-stagger-${(index % 3) + 1}`}
                                to={topic.id === 1 ? '/contact' : `/product/${topic.id}`}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                            >
                                <div className="card-media-wrap">
                                    {thumbnailImg ? (
                                        <img
                                            src={thumbnailImg}
                                            alt={topic.title}
                                            className="card-media-img"
                                            loading="lazy" decoding="async"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/product-unavailable.svg';
                                            }}
                                        />
                                    ) : (
                                        <div className="card-media-fallback">{topic.title[0]}</div>
                                    )}
                                    <div className="card-hover-overlay">
                                        <div className="overlay-btn">
                                            Explore <ArrowUpRight size={18} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-info-wrap">
                                    <h3 className="card-title-premium">{topic.title}</h3>
                                    <p className="card-desc-premium">{topic.desc}</p>
                                    <div className="card-footer-premium">
                                        <span className="card-cta-link">
                                            {topic.id === 1 ? 'Start Custom Project' : 'Explore Collection'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Products;
