import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Search, ArrowRight, Frown, ShoppingCart, ArrowLeft } from 'lucide-react';
import './CSS/SearchPage.css';

const SearchPage = () => {
    const { subProductsMap, topicsData } = useData();
    const location = useLocation();
    const navigate = useNavigate();
    const revealRef = useScrollReveal();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') || '';
        setSearchQuery(q);
        
        if (q.trim()) {
            const activeTopics = new Set(topicsData.filter(t => t.isActive !== false && t.is_active !== false).map(t => Number(t.id)));
            const allProducts = Object.entries(subProductsMap)
                .filter(([topicId]) => activeTopics.has(Number(topicId)))
                .map(([, prods]) => prods)
                .flat();
            const filtered = allProducts.filter(p => 
                (p.isActive !== false && p.is_active !== false) &&
                (p.name.toLowerCase().includes(q.toLowerCase()) || 
                p.desc.toLowerCase().includes(q.toLowerCase()))
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [location.search, subProductsMap, topicsData]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleProductClick = (product) => {
        // Find the topicId for this product
        let foundTopicId = null;
        for (const [topicId, products] of Object.entries(subProductsMap)) {
            if (products.some(p => p.id === product.id)) {
                foundTopicId = topicId;
                break;
            }
        }
        if (foundTopicId) {
            navigate(`/product/${foundTopicId}/${product.id}`);
        }
    };

    return (
        <div className="search-page-premium">
            <div className="container" ref={revealRef}>
                {/* Back Navigation */}
                <button className="search-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                    Back
                </button>

                <header className="search-page-header reveal-hidden">
                    <h1 className="search-title-premium">Find Your Creation</h1>
                    <form className="search-hero-bar" onSubmit={handleSearch}>
                        <Search size={24} className="search-hero-icon" />
                        <input 
                            type="text" 
                            placeholder="Search products, materials, themes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="btn-search-hero">Search</button>
                    </form>
                </header>

                <div className="search-results-section">
                    {searchQuery.trim() && (
                        <div className="search-status-bar reveal-hidden">
                            Showing {results.length} results for "<strong>{searchQuery}</strong>"
                        </div>
                    )}

                    {results.length > 0 ? (
                        <div className="search-results-grid">
                            {results.map((product, index) => (
                                <div 
                                    key={product.id} 
                                    className={`search-result-card reveal-hidden reveal-stagger-${(index % 4) + 1}`}
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className="result-card-media">
                                        {product.images && product.images[0] ? (
                                            <img src={product.images[0]} alt={product.name} />
                                        ) : (
                                            <div className="result-card-placeholder">🎁</div>
                                        )}
                                        <div className="result-card-overlay">
                                            <span>View Product</span>
                                        </div>
                                    </div>
                                    <div className="result-card-info">
                                        <h3 className="result-card-title">{product.name}</h3>
                                        <div className="result-card-footer">
                                            <div className="result-price">
                                                ₹{product.price === 0 ? 'Quote' : product.price}
                                                <span style={{ fontSize: '0.65em', fontWeight: 'normal', opacity: 0.8, marginLeft: '4px' }}>(Inclusive of all taxes)</span>
                                            </div>
                                            <div className="result-action"><ShoppingCart size={16} /></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchQuery.trim() ? (
                        <div className="search-empty-state reveal-hidden">
                            <Frown size={64} className="empty-icon" />
                            <h2>No matches found</h2>
                            <p>We couldn't find anything matching "{searchQuery}". Try different keywords or browse our categories.</p>
                            
                            <div className="suggested-categories">
                                <h3>Suggested Collections</h3>
                                <div className="suggestion-chips">
                                    {topicsData.filter(t => t.isActive !== false && t.is_active !== false).slice(0, 4).map(topic => (
                                        <button 
                                            key={topic.id} 
                                            className="suggestion-chip"
                                            onClick={() => navigate(`/product/${topic.id}`)}
                                        >
                                            {topic.title} <ArrowRight size={14} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
