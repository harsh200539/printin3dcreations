import React, { useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    MessageSquare, 
    Truck, 
    RotateCcw, 
    ShieldCheck, 
    AlertTriangle, 
    Layers, 
    PackageCheck, 
    FileText,
    Timer,
    ArrowRight
} from 'lucide-react';
import './CSS/PolicyPages.css';

const ReturnPolicy = () => {
    const revealRef = useScrollReveal();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="policy-page-premium" ref={revealRef}>
            <header className="policy-hero-premium reveal-hidden">
                <div className="container">
                    <div className="policy-badge">Customer Protection & Quality Guarantee</div>
                    <h1 className="policy-title-main">Return & Refund Policy</h1>
                    <div className="policy-meta">
                        <span>Reliability & Craftsmanship First</span>
                        <div className="meta-dot"></div>
                        <span>Last updated: May 2026</span>
                    </div>
                </div>
            </header>

            <section className="policy-content-section">
                <div className="container-narrow">
                    <div className="policy-document glass-panel reveal-hidden reveal-stagger-1">

                        {/* Top Key Highlights Grid */}
                        <div className="policy-summary-grid">
                            <div className="policy-summary-card">
                                <div className="summary-card-icon green">
                                    <Clock size={20} />
                                </div>
                                <div className="summary-card-body">
                                    <div className="summary-card-title">48-Hour Claim Window</div>
                                    <div className="summary-card-text">Inspect and report any transit damage or defects within 48h of delivery.</div>
                                </div>
                            </div>

                            <div className="policy-summary-card">
                                <div className="summary-card-icon blue">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="summary-card-body">
                                    <div className="summary-card-title">100% Free Replacements</div>
                                    <div className="summary-card-text">Zero-cost prioritized re-prints for transit breaks or printing faults.</div>
                                </div>
                            </div>

                            <div className="policy-summary-card">
                                <div className="summary-card-icon amber">
                                    <Timer size={20} />
                                </div>
                                <div className="summary-card-body">
                                    <div className="summary-card-title">2-Hour Cancellation</div>
                                    <div className="summary-card-text">Free instant cancellation window before slicing and printing starts.</div>
                                </div>
                            </div>
                        </div>

                        {/* Side-by-Side Comparison: Valid Return Cases vs Non-Returnable Scenarios */}
                        <div className="policy-comparison-section">
                            {/* Column 1: Valid Return Cases */}
                            <div className="policy-comparison-col valid-col">
                                <div className="comparison-col-header">
                                    <div className="col-header-top">
                                        <span className="badge-status-pill success">
                                            <CheckCircle2 size={13} />
                                            Eligible for Resolution
                                        </span>
                                    </div>
                                    <h2 className="comparison-col-title">Valid Return Cases</h2>
                                    <p className="comparison-col-desc">
                                        We provide <strong>full replacements or refunds</strong> in the following scenarios:
                                    </p>
                                </div>

                                <div className="policy-cards-stack">
                                    <div className="policy-item-card valid-card">
                                        <div className="item-card-icon">
                                            <Truck size={18} />
                                        </div>
                                        <div className="item-card-content">
                                            <h4>Shipping Damage</h4>
                                            <p>Items that arrive broken, cracked, or unusable due to transit.</p>
                                        </div>
                                    </div>

                                    <div className="policy-item-card valid-card">
                                        <div className="item-card-icon">
                                            <Layers size={18} />
                                        </div>
                                        <div className="item-card-content">
                                            <h4>Manufacturing Defect</h4>
                                            <p>Significant structural failures, severe layer separation, or deformations.</p>
                                        </div>
                                    </div>

                                    <div className="policy-item-card valid-card">
                                        <div className="item-card-icon">
                                            <FileText size={18} />
                                        </div>
                                        <div className="item-card-content">
                                            <h4>Customization Error</h4>
                                            <p>If we print text or lettering different from your provided details.</p>
                                        </div>
                                    </div>

                                    <div className="policy-item-card valid-card">
                                        <div className="item-card-icon">
                                            <PackageCheck size={18} />
                                        </div>
                                        <div className="item-card-content">
                                            <h4>Incorrect Item</h4>
                                            <p>Receipt of a model, color, or product not listed in your order.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Non-Returnable Scenarios */}
                            <div className="policy-comparison-col invalid-col">
                                <div className="comparison-col-header">
                                    <div className="col-header-top">
                                        <span className="badge-status-pill error">
                                            <XCircle size={13} />
                                            Non-Eligible Situations
                                        </span>
                                    </div>
                                    <h2 className="comparison-col-title">Non-Returnable Scenarios</h2>
                                    <p className="comparison-col-desc">
                                        Because each 3D creation is custom-made on demand, returns cannot be accepted for:
                                    </p>
                                </div>

                                <div className="policy-cards-stack">
                                    <div className="policy-item-card invalid-card">
                                        <div className="item-card-icon">
                                            <XCircle size={18} />
                                        </div>
                                        <div className="item-card-content">
                                            <h4>Customer Input Errors</h4>
                                            <p>Customer errors in customization text or accidental color choice.</p>
                                        </div>
                                    </div>

                                    <div className="policy-item-card invalid-card">
                                        <div className="item-card-icon">
                                            <Layers size={18} />
                                        </div>
                                        <div className="item-card-content">
                                            <h4>3D Printing Characteristics</h4>
                                            <p>Minor texture variations inherent to the layer-by-layer printing process.</p>
                                        </div>
                                    </div>

                                    <div className="policy-item-card invalid-card">
                                        <div className="item-card-icon">
                                            <AlertTriangle size={18} />
                                        </div>
                                        <div className="item-card-content">
                                            <h4>Post-Delivery Mishandling</h4>
                                            <p>Damage caused by dropping, excess heat, or mishandling post-delivery.</p>
                                        </div>
                                    </div>

                                    <div className="policy-item-card invalid-card">
                                        <div className="item-card-icon">
                                            <Clock size={18} />
                                        </div>
                                        <div className="item-card-content">
                                            <h4>Expired Reporting Window</h4>
                                            <p>Requests made after 48 hours of successful delivery.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step-by-Step Refund & Replacement Process */}
                        <div className="policy-process-box">
                            <div className="process-box-header">
                                <div className="process-header-badge">
                                    <RotateCcw size={15} />
                                    <span>Resolution Journey</span>
                                </div>
                                <h2 className="process-main-title">The Refund & Replacement Process</h2>
                                <p className="process-main-desc">
                                    Once your claim is validated via WhatsApp, we handle everything swiftly and transparently:
                                </p>
                            </div>

                            <div className="process-steps-row">
                                <div className="process-step-item">
                                    <div className="step-number-pill">1</div>
                                    <div className="step-body">
                                        <h4>Submit Verification</h4>
                                        <p>Send clear photos/video of outer box & product with Order ID to WhatsApp within 48h.</p>
                                    </div>
                                </div>

                                <div className="process-step-arrow" aria-hidden="true">
                                    <ArrowRight size={20} />
                                </div>

                                <div className="process-step-item">
                                    <div className="step-number-pill">2</div>
                                    <div className="step-body">
                                        <h4>Studio Review</h4>
                                        <p>Our workshop inspects and approves the claim within 12–24 business hours.</p>
                                    </div>
                                </div>

                                <div className="process-step-arrow" aria-hidden="true">
                                    <ArrowRight size={20} />
                                </div>

                                <div className="process-step-item">
                                    <div className="step-number-pill">3</div>
                                    <div className="step-body">
                                        <h4>Resolution Issued</h4>
                                        <p>Choose between a free priority re-print or direct bank/UPI refund.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Resolution Details Split */}
                            <div className="resolution-options-grid">
                                <div className="resolution-card refund">
                                    <div className="resolution-header">
                                        <span className="res-tag green">Option A</span>
                                        <h4>Refunds</h4>
                                    </div>
                                    <p className="res-timeline">⏱️ 5–7 Business Days</p>
                                    <p className="res-desc">
                                        Processed within 5-7 business days to your original payment method.
                                    </p>
                                </div>

                                <div className="resolution-card replacement">
                                    <div className="resolution-header">
                                        <span className="res-tag blue">Option B</span>
                                        <h4>Replacements</h4>
                                    </div>
                                    <p className="res-timeline">🚀 7–10 Business Days</p>
                                    <p className="res-desc">
                                        Prioritized on our 3D farm and shipped within 7-10 business days at zero extra charge.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cancellations Callout Banner */}
                        <div className="policy-cancellation-banner">
                            <div className="cancellation-badge-wrap">
                                <span className="pulsing-dot-amber"></span>
                                <span className="cancellation-badge-text">2-Hour Grace Period</span>
                            </div>
                            <div className="cancellation-content">
                                <h3>Cancellations Policy</h3>
                                <p>
                                    Orders can only be cancelled within <strong>2 hours</strong> of placement. Beyond this window, material and machine allocation have already begun.
                                </p>
                            </div>
                        </div>

                        {/* Direct WhatsApp Claim Support Card */}
                        <div className="policy-footer-cta">
                            <div className="cta-icon-wrap">
                                <MessageSquare size={26} />
                            </div>
                            <h3>Need to Open a Claim?</h3>
                            <p>Send clear photos of the issue to our WhatsApp team for fast resolution.</p>
                            <a 
                                href="https://wa.me/917043591952?text=Hi%20Print-IN%203D%20Team%2C%20I%20would%20like%20to%20open%20a%20Return%2FReplacement%20claim%20for%20my%20order." 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-policy-whatsapp"
                            >
                                <MessageSquare size={18} /> Contact Support on WhatsApp
                            </a>
                            <span className="cta-subtext">⚡ Fast response • Mon–Sat 10:00 AM – 7:00 PM</span>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default ReturnPolicy;
