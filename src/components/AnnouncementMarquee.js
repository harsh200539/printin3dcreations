import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Truck, Zap, Sparkles, Tag, Flame, Gift, Heart, Star, ShoppingBag } from 'lucide-react';
import './CSS/AnnouncementMarquee.css';

const ICON_MAP = {
    truck: <Truck size={14} />,
    zap: <Zap size={14} />,
    sparkles: <Sparkles size={14} />,
    tag: <Tag size={14} />,
    flame: <Flame size={14} />,
    gift: <Gift size={14} />,
    heart: <Heart size={14} />,
    star: <Star size={14} />,
    shopping: <ShoppingBag size={14} />
};

export const DEFAULT_ANNOUNCEMENTS = [
    {
        id: 'free-shipping',
        icon: 'truck',
        badge: 'Free Shipping',
        badge_type: 'cyan',
        main_text: 'on Orders',
        highlight_text: 'Above ₹999',
        target: '#products'
    },
    {
        id: 'exclusive-deals',
        icon: 'zap',
        badge: 'Limited Offer',
        badge_type: 'gold',
        main_text: 'Exclusive Deals',
        highlight_text: 'Available Now',
        target: '#products'
    },
    {
        id: 'latest-collection',
        icon: 'sparkles',
        badge: 'New Season',
        badge_type: 'blue',
        main_text: 'Shop the',
        highlight_text: 'Latest Collection',
        target: '#products'
    },
    {
        id: 'custom-designs',
        icon: 'tag',
        badge: 'Custom Studio',
        badge_type: 'blue',
        main_text: 'Personalized Keychains &',
        highlight_text: 'Custom 3D Gifts',
        target: '/contact'
    },
    {
        id: 'craftsmanship',
        icon: 'flame',
        badge: 'Made in India',
        badge_type: 'gold',
        main_text: 'Precision 3D Printed with',
        highlight_text: 'Pro-Grade Materials',
        target: '#products'
    }
];

const AnnouncementMarquee = () => {
    const { siteSettings } = useData();
    const navigate = useNavigate();
    const location = useLocation();

    // Respect backend toggle to activate or remove the marquee
    if (!siteSettings || siteSettings.marquee_enabled === false) {
        return null;
    }

    const items = (Array.isArray(siteSettings.marquee_items) && siteSettings.marquee_items.length > 0)
        ? siteSettings.marquee_items
        : DEFAULT_ANNOUNCEMENTS;

    const speed = siteSettings.marquee_speed || 75;

    const handleClick = (e, target) => {
        if (!target) return;
        e.preventDefault();
        if (target.startsWith('#')) {
            if (location.pathname === '/') {
                const element = document.getElementById(target.slice(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                navigate('/' + target);
            }
        } else {
            navigate(target);
        }
    };

    const getIcon = (iconKey) => {
        if (!iconKey) return <Sparkles size={14} />;
        if (typeof iconKey === 'string' && ICON_MAP[iconKey.toLowerCase()]) {
            return ICON_MAP[iconKey.toLowerCase()];
        }
        return <Sparkles size={14} />;
    };

    const barStyle = {
        background: siteSettings.marquee_bg_color || undefined,
        color: siteSettings.marquee_text_color || undefined,
        borderTopColor: siteSettings.marquee_border_color || undefined,
        borderBottomColor: siteSettings.marquee_border_color || undefined,
        '--marquee-accent': siteSettings.marquee_accent_color || '#60A5FA',
        '--marquee-text': siteSettings.marquee_text_color || '#F1F5F9'
    };

    const trackStyle = {
        animationDuration: `${speed}s`
    };

    const renderItems = (keyPrefix) => (
        <>
            {items.map((item, idx) => (
                <React.Fragment key={`${keyPrefix}-${item.id || idx}`}>
                    <span
                        className="marquee-item"
                        onClick={(e) => handleClick(e, item.target)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleClick(e, item.target)}
                        style={{ color: siteSettings.marquee_text_color || undefined }}
                    >
                        <span className="marquee-icon-wrap" style={{ color: siteSettings.marquee_accent_color || '#38BDF8' }}>
                            {getIcon(item.icon)}
                        </span>
                        {item.badge && (
                            <span className={`marquee-badge marquee-badge-${item.badge_type || item.badgeType || 'blue'}`}>
                                {item.badge}
                            </span>
                        )}
                        <span className="marquee-text-main" style={{ color: siteSettings.marquee_text_color || '#F1F5F9' }}>
                            {item.main_text || item.mainText}
                        </span>
                        <span className="marquee-text-highlight" style={{ color: siteSettings.marquee_accent_color || '#60A5FA' }}>
                            {item.highlight_text || item.highlightText}
                        </span>
                    </span>
                    <span className="marquee-separator" style={{ color: siteSettings.marquee_accent_color || '#3B82F6' }} aria-hidden="true">
                        ✦
                    </span>
                </React.Fragment>
            ))}
        </>
    );

    return (
        <aside
            className="announcement-marquee-bar"
            aria-label="Promotions and Announcements"
            style={barStyle}
        >
            <div className="marquee-track" style={trackStyle}>
                {/* Primary Block */}
                <div className="marquee-content">
                    {renderItems('blk1-a')}
                    {renderItems('blk1-b')}
                </div>
                {/* Secondary Clone Block for 100% gapless infinite loop */}
                <div className="marquee-content" aria-hidden="true">
                    {renderItems('blk2-a')}
                    {renderItems('blk2-b')}
                </div>
            </div>
        </aside>
    );
};

export default AnnouncementMarquee;
