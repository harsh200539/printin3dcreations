import React from 'react';
import { Link } from 'react-router-dom';
import {
    Mail,
    Phone,
    MapPin,
    Instagram,
    Facebook,
    MessageCircle,
    ShieldCheck,
    Truck,
    Clock
} from 'lucide-react';
import './CSS/Footer.css';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer-premium">


            <div className="container">
                <div className="footer-main-grid">
                    {/* Brand Column */}
                    <div className="footer-col-brand">
                        <div className="footer-logo-premium">
                            <Link to="/" onClick={scrollToTop}>
                                <span className="logo-text">Print-IN 3D</span>
                                <span className="logo-tag">PREMIUM STUDIO</span>
                            </Link>
                        </div>
                        <p className="footer-bio">
                            Elevating 3D additive manufacturing into an art form. We specialize in
                            high-precision custom creations for hobbyists and engineers alike.
                        </p>
                        <div className="footer-social-links">
                            <a href="https://www.instagram.com/printin_3dcreations?igsh=MWg5NjVyd3Btb3NjZg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram /></a>
                            <a href="https://www.facebook.com/share/1Ce3SsfvAe/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook /></a>
                            <a href="#!" onClick={(e) => { e.preventDefault(); window.open('https://wa.me/917043591952', '_blank'); }} aria-label="WhatsApp"><MessageCircle /></a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div className="footer-col-links">
                        <h4 className="footer-title">Explore</h4>
                        <ul className="footer-nav">
                            <li><Link to="/" onClick={scrollToTop}>Home</Link></li>
                            <li><Link to="/about" onClick={scrollToTop}>Our Story</Link></li>
                            <li><Link to="/#products" onClick={scrollToTop}>The Collection</Link></li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div className="footer-col-links">
                        <h4 className="footer-title">Support</h4>
                        <ul className="footer-nav">
                            <li><Link to="/faq" onClick={scrollToTop}>Help Center</Link></li>
                            <li><Link to="/contact" onClick={scrollToTop}>Custom Quote</Link></li>
                            <li><Link to="/terms" onClick={scrollToTop}>Terms of Service</Link></li>
                            <li><Link to="/return-policy" onClick={scrollToTop}>Return & Refund Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="footer-col-contact">
                        <h4 className="footer-title">Connect</h4>
                        <div className="footer-contact-blocks">
                            <div className="footer-c-item">
                                <Mail size={16} />
                                <span>printin3dcreations@gmail.com</span>
                            </div>
                            <div className="footer-c-item">
                                <Phone size={16} />
                                <span>+91 70435 91952</span>
                            </div>
                            <div className="footer-c-item">
                                <MapPin size={16} />
                                <span>India • Pan-India Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Footer Bottom ── */}
                <div className="footer-bottom-v2">
                    <div className="footer-bottom-left">
                        <p className="copyright-text">© {new Date().getFullYear()} Print-IN 3D Creations. Made with precision.</p>
                    </div>

                    <div className="footer-trust-indicators">
                        <div className="t-indicator">
                            <ShieldCheck size={14} /> <span>Secure Payment</span>
                        </div>
                        <div className="t-indicator">
                            <Truck size={14} /> <span>Express Shipping</span>
                        </div>
                        <div className="t-indicator">
                            <Clock size={14} /> <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
