import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE, normalizeCatalog } from '../data/catalog';

export const DEFAULT_SITE_SETTINGS = {
    id: 1,
    marquee_enabled: true,
    marquee_speed: 75,
    marquee_items: [
        {
            id: 'free-shipping',
            icon: 'truck',
            badge: 'Free Shipping',
            badge_type: 'cyan',
            main_text: 'on Orders',
            highlight_text: 'Above ₹500',
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
    ],
    hero_media_type: 'video',
    hero_image: '',
    hero_images: [],
    hero_carousel_enabled: false,
    hero_carousel_speed: 5,
    hero_videos: [
        '/videos/hero-background1.mp4',
        '/videos/hero-background2.mp4',
        '/videos/hero-background3.mp4'
    ],
    hero_title: 'Precision 3D Creations',
    hero_subtitle: 'Crafted for Creators, Collectors & Modern Spaces',
    header_theme: 'dark',
    header_bg_color: 'rgba(255, 255, 255, 0.98)',
    header_text_color: '#0F172A',
    marquee_bg_color: 'linear-gradient(90deg, #090E1A 0%, #0F172A 50%, #090E1A 100%)',
    marquee_text_color: '#F1F5F9',
    marquee_accent_color: '#60A5FA',
    marquee_border_color: 'rgba(59, 130, 246, 0.22)'
};

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children, initialData = null }) => {
    const [catalog, setCatalog] = useState(initialData || { topicsData: [], subProductsMap: {} });
    const [siteSettings, setSiteSettings] = useState(initialData?.siteSettings || DEFAULT_SITE_SETTINGS);
    const [loading, setLoading] = useState(!initialData);
    const [isBackendOnline, setIsBackendOnline] = useState(!!initialData);
    const refreshData = async () => {
        try {
            let data;
            if (process.env.NODE_ENV === 'development' || window.location.pathname.startsWith('/admin')) {
                const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
                const query = isAdmin ? '?all=true' : '';
                const responses = await Promise.all(['topics', 'products'].map(endpoint =>
                    fetch(`${API_BASE}/${endpoint}/${query}`, { signal: AbortSignal.timeout(15000) })));
                if (responses.some(r => !r.ok)) throw new Error('Catalog API unavailable');
                const [topics, products] = await Promise.all(responses.map(r => r.json()));
                data = normalizeCatalog(topics, products);
            } else {
                const response = await fetch('/api/catalog', { signal: AbortSignal.timeout(20000) });
                if (!response.ok) throw new Error('Catalog API unavailable');
                data = await response.json();
                if (!Array.isArray(data.topicsData) || !data.subProductsMap) throw new Error('Invalid catalog response');
            }
            setCatalog(data);

            // Fetch dynamic site settings (marquee, hero media, theme)
            try {
                const settingsRes = await fetch(`${API_BASE}/settings/`, { signal: AbortSignal.timeout(6000) });
                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json();
                    if (settingsData && typeof settingsData === 'object' && !Array.isArray(settingsData)) {
                        setSiteSettings(settingsData);
                    }
                }
            } catch {
                // Graceful fallback to default settings
            }

            setIsBackendOnline(true);
        } catch (err) {
            console.warn('Catalog refresh unavailable', err);
            // Keep the last successfully fetched live catalog during a transient outage.
            setIsBackendOnline(false);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { refreshData(); }, []);
    return <DataContext.Provider value={{ ...catalog, siteSettings, updateSiteSettings: setSiteSettings, loading, isBackendOnline, refreshData }}>
        {!loading && !isBackendOnline && <div role="alert" style={{ padding: '12px', textAlign: 'center' }}>
            The product catalog could not be refreshed. Please confirm prices and availability on WhatsApp.
            <button onClick={refreshData}>Retry</button>
        </div>}
        {children}
    </DataContext.Provider>;
};
