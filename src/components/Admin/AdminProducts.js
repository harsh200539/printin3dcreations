import { adminFetch } from '../../adminApi';
import { API_BASE } from '../../data/catalog';
import { uploadImage } from '../../utils/cloudinary';
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
    Plus,
    Edit,
    Trash2,
    X,
    Upload,
    Search,
    Star,
    Eye,
    EyeOff
} from 'lucide-react';
import '../CSS/Admin.css';

const AdminProducts = () => {
    const { topicsData, subProductsMap, isBackendOnline, refreshData } = useData();
    const [selectedTopicId, setSelectedTopicId] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form fields
    const [topic, setTopic] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [desc, setDesc] = useState('');
    const [fullDetails, setFullDetails] = useState('');
    const [customizable, setCustomizable] = useState(false);
    const [customizationLabel, setCustomizationLabel] = useState('');
    const [customizationPlaceholder, setCustomizationPlaceholder] = useState('');
    const [customLettersLimit, setCustomLettersLimit] = useState(50);
    const [isActive, setIsActive] = useState(true);

    // Dynamic Lists states
    const [features, setFeatures] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [specs, setSpecs] = useState([]); // Array of { key, value }
    const [images, setImages] = useState([]); // List of image paths/URLs
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [hasColors, setHasColors] = useState(false);
    const [colorOptions, setColorOptions] = useState([]);

    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isBestseller, setIsBestseller] = useState(false);
    const [togglingBestsellerId, setTogglingBestsellerId] = useState(null);
    const [togglingActiveId, setTogglingActiveId] = useState(null);

    // Flat list of products for the table
    const productsList = useMemo(() => {
        const list = [];
        Object.entries(subProductsMap).forEach(([topicId, products]) => {
            products.forEach(p => {
                const category = topicsData.find(t => t.id === Number(topicId));
                list.push({
                    ...p,
                    categoryName: category ? category.title : `Category #${topicId}`,
                    categoryId: Number(topicId),
                    categoryActive: category ? (category.is_active !== false && category.isActive !== false) : true
                });
            });
        });
        return list;
    }, [subProductsMap, topicsData]);

    // Filtering & Searching
    const filteredProducts = useMemo(() => {
        return productsList.filter(p => {
            let matchesTopic = true;
            if (selectedTopicId === 'all') {
                matchesTopic = true;
            } else if (selectedTopicId === 'bestsellers') {
                matchesTopic = !!p.isBestseller;
            } else if (selectedTopicId === 'active') {
                matchesTopic = p.isActive !== false && p.is_active !== false;
            } else if (selectedTopicId === 'hidden') {
                matchesTopic = p.isActive === false || p.is_active === false;
            } else {
                matchesTopic = p.categoryId === Number(selectedTopicId);
            }
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.desc.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTopic && matchesSearch;
        });
    }, [productsList, selectedTopicId, searchTerm]);

    const openCreateModal = () => {
        setEditingProduct(null);
        setTopic(topicsData[0]?.id || '');
        setName('');
        setPrice(0);
        setDesc('');
        setFullDetails('');
        setFeatures([]);
        setSpecs([{ key: 'material', value: 'PLA' }]);
        setImages([]);
        setHasColors(false);
        setColorOptions([]);
        setCustomizable(false);
        setCustomizationLabel('');
        setCustomizationPlaceholder('');
        setCustomLettersLimit(50);
        setIsBestseller(false);
        setIsActive(true);
        setError('');
        setModalOpen(true);
    };

    const openEditModal = (p) => {
        setEditingProduct(p);
        setTopic(p.categoryId);
        setName(p.name);
        setPrice(p.price);
        setDesc(p.desc);
        setFullDetails(p.fullDetails || '');
        setFeatures(p.features || []);

        // Map specs dictionary to key-value array
        const specsArr = Object.entries(p.specs || {}).map(([key, value]) => ({ key, value }));
        setSpecs(specsArr.length > 0 ? specsArr : [{ key: 'material', value: '' }]);

        setImages(p.images || []);
        setHasColors(p.hasColors || false);
        setColorOptions(
            (p.colorOptions || []).map(opt => ({
                color: opt.color || '',
                images: opt.images || [],
                urlInput: ''
            }))
        );
        setCustomizable(p.customizable || false);
        setCustomizationLabel(p.customizationLabel || '');
        setCustomizationPlaceholder(p.customizationPlaceholder || '');
        setCustomLettersLimit(p.customLettersLimit || 50);
        setIsBestseller(!!p.isBestseller);
        setIsActive(p.is_active !== undefined ? p.is_active : (p.isActive !== undefined ? p.isActive : true));
        setError('');
        setModalOpen(true);
    };

    // Specs Builders Actions
    const addSpecRow = () => {
        setSpecs([...specs, { key: '', value: '' }]);
    };

    const removeSpecRow = (idx) => {
        const copy = [...specs];
        copy.splice(idx, 1);
        setSpecs(copy);
    };

    const handleSpecChange = (idx, field, value) => {
        const copy = [...specs];
        copy[idx][field] = value;
        setSpecs(copy);
    };

    // Features tags actions
    const addTag = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            const tag = tagInput.trim();
            if (tag && !features.includes(tag)) {
                setFeatures([...features, tag]);
                setTagInput('');
            }
        }
    };

    const removeTag = (idx) => {
        const copy = [...features];
        copy.splice(idx, 1);
        setFeatures(copy);
    };

    // Image URL uploader
    const addImageUrl = () => {
        const url = imageUrlInput.trim();
        if (url) {
            setImages([...images, url]);
            setImageUrlInput('');
        }
    };

    const removeImage = (idx) => {
        const copy = [...images];
        copy.splice(idx, 1);
        setImages(copy);
    };

    // Native direct upload endpoint integration
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!isBackendOnline) {
            alert('File uploads are disabled in offline mode.');
            return;
        }

        setUploading(true);
        try {
            const url = await uploadImage(file);
            setImages([...images, url]);
        } catch (err) {
            console.error("Upload error", err);
            alert(err.message || "Upload failed. Verify server connections.");
        } finally {
            setUploading(false);
        }
    };

    // CRUD saving handler
    const handleSave = async (e) => {
        e.preventDefault();
        setError('');

        if (!isBackendOnline) {
            setError('Modifications are disabled in offline mode.');
            return;
        }

        if (!name || !desc || !topic) {
            setError('Please fill in all required fields.');
            return;
        }

        setSaving(true);

        // Reassemble specifications back to object key-value dictionary
        const specsObj = {};
        specs.forEach(s => {
            const k = s.key.trim();
            const v = s.value.trim();
            if (k) specsObj[k] = v;
        });

        // Unique alphanumeric ID generators for new products (e.g. topicId-unique)
        const productStrId = editingProduct
            ? editingProduct.id
            : `${topic}-${Math.random().toString(36).substr(2, 5)}`;

        const savedColorOptions = hasColors
            ? colorOptions.map(opt => ({ color: opt.color, images: opt.images }))
            : [];

        const savedImages = hasColors
            ? (colorOptions.length > 0 && colorOptions[0].images.length > 0 ? colorOptions[0].images : images)
            : images;

        const payload = {
            product_id: productStrId,
            topic: Number(topic),
            name,
            price: Number(price),
            images: savedImages,
            desc,
            full_details: fullDetails,
            specs: specsObj,
            features,
            has_colors: hasColors,
            color_options: savedColorOptions,
            customizable: customizable,
            customization_label: customizationLabel,
            customization_placeholder: customizationPlaceholder,
            custom_letters_limit: Number(customLettersLimit),
            is_bestseller: isBestseller,
            is_active: isActive
        };

        try {
            let response;
            if (editingProduct && editingProduct.dbId) {
                // Update
                response = await adminFetch(`${API_BASE}/products/${editingProduct.dbId}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create
                response = await adminFetch(`${API_BASE}/products/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (response.ok) {
                await refreshData();
                setModalOpen(false);
            } else {
                const data = await response.json();
                setError(data.detail || JSON.stringify(data) || 'Failed to save product.');
            }
        } catch (err) {
            console.error("Save product error", err);
            setError('Network error. Failed to save product.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (dbId, strId, prodName) => {
        if (!isBackendOnline) {
            alert('Modifications are disabled in offline mode.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete product "${prodName}" (#${strId})?`)) {
            try {
                const response = await adminFetch(`${API_BASE}/products/${dbId}/`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await refreshData();
                } else {
                    alert('Failed to delete product.');
                }
            } catch (err) {
                console.error("Delete product error", err);
                alert('Network error. Failed to delete product.');
            }
        }
    };

    const handleToggleBestseller = async (p) => {
        if (!isBackendOnline) {
            alert('Modifications are disabled in offline mode.');
            return;
        }
        const newStatus = !p.isBestseller;
        setTogglingBestsellerId(p.id);
        try {
            const response = await adminFetch(`${API_BASE}/products/${p.dbId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_bestseller: newStatus })
            });

            if (response.ok) {
                await refreshData();
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.detail || JSON.stringify(data) || 'Failed to update bestseller status.');
            }
        } catch (err) {
            console.error("Toggle bestseller error", err);
            alert('Network error. Failed to update bestseller status.');
        } finally {
            setTogglingBestsellerId(null);
        }
    };

    const handleToggleActive = async (p) => {
        if (!isBackendOnline) {
            alert('Modifications are disabled in offline mode.');
            return;
        }
        const current = p.is_active !== undefined ? p.is_active : (p.isActive !== undefined ? p.isActive : true);
        const newStatus = !current;
        setTogglingActiveId(p.id);
        try {
            const response = await adminFetch(`${API_BASE}/products/${p.dbId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: newStatus })
            });

            if (response.ok) {
                await refreshData();
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.detail || 'Failed to update product visibility.');
            }
        } catch (err) {
            console.error("Toggle product visibility error", err);
            alert('Network error. Failed to update product visibility.');
        } finally {
            setTogglingActiveId(null);
        }
    };

    return (
        <div style={{ animation: 'modalSlideUp 0.4s ease' }}>
            {/* Header controls filter */}
            <div className="admin-panel-card" style={{ marginBottom: '24px', padding: '20px 24px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1, minWidth: '280px' }}>

                        {/* Search */}
                        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--admin-text-muted)' }} />
                            <input
                                type="text"
                                className="admin-form-control"
                                style={{ paddingLeft: '36px' }}
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category filter */}
                        <select
                            className="admin-form-control"
                            style={{ width: '220px' }}
                            value={selectedTopicId}
                            onChange={(e) => setSelectedTopicId(e.target.value)}
                        >
                            <option value="all">All Products</option>
                            <option value="active">🟢 Active / Visible Only</option>
                            <option value="hidden">🚫 Hidden / Blocked Only</option>
                            <option value="bestsellers">⭐ Bestsellers Only</option>
                            <optgroup label="Filter by Category">
                                {topicsData.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.title} {(t.is_active === false || t.isActive === false) ? '(Hidden Cat)' : ''}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    <button onClick={openCreateModal} className="admin-btn-action">
                        <Plus size={16} /> Add Product
                    </button>
                </div>
            </div>

            {/* Catalog Grid Table */}
            <div className="admin-panel-card">
                <div className="admin-panel-header">
                    <h2>Catalog List ({filteredProducts.length} items)</h2>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Thumbnail</th>
                                <th>Ref ID</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th style={{ textAlign: 'center' }}>Bestseller</th>
                                <th style={{ textAlign: 'center' }}>Visibility</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <img
                                            src={p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/100x100?text=Product'}
                                            alt={p.name}
                                            className="table-thumbnail"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                                            }}
                                        />
                                    </td>
                                    <td style={{ fontWeight: 700, color: 'var(--admin-text-muted)' }}>{p.id}</td>
                                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                                    <td>
                                        <span className="badge-status active" style={{ background: '#EFF6FF', color: '#1E40AF' }}>{p.categoryName}</span>
                                    </td>
                                    <td style={{ fontWeight: 800 }}>₹{p.price === 0 ? 'Quote' : p.price}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleBestseller(p)}
                                            disabled={togglingBestsellerId === p.id}
                                            title={p.isBestseller ? "Click to remove from Bestsellers" : "Click to mark as Bestseller"}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '5px 12px',
                                                borderRadius: '20px',
                                                border: p.isBestseller ? '1px solid #F59E0B' : '1px solid var(--admin-border)',
                                                background: p.isBestseller ? '#FEF3C7' : '#F8FAFC',
                                                color: p.isBestseller ? '#B45309' : 'var(--admin-text-muted)',
                                                cursor: togglingBestsellerId === p.id ? 'wait' : 'pointer',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                opacity: togglingBestsellerId === p.id ? 0.6 : 1,
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <Star size={14} fill={p.isBestseller ? "#F59E0B" : "none"} color={p.isBestseller ? "#D97706" : "currentColor"} />
                                            {p.isBestseller ? 'Bestseller' : 'Standard'}
                                        </button>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(p)}
                                            disabled={togglingActiveId === p.id}
                                            title={(p.is_active !== false && p.isActive !== false) ? "Click to temporarily pause/hide this product from store" : "Click to activate and show this product in store"}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                border: (p.is_active !== false && p.isActive !== false) ? '1px solid #10B981' : '1px solid #F59E0B',
                                                background: (p.is_active !== false && p.isActive !== false) ? '#ECFDF5' : '#FEF3C7',
                                                color: (p.is_active !== false && p.isActive !== false) ? '#065F46' : '#92400E',
                                                cursor: togglingActiveId === p.id ? 'wait' : 'pointer',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                opacity: togglingActiveId === p.id ? 0.6 : 1,
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {(p.is_active !== false && p.isActive !== false) ? <Eye size={14} /> : <EyeOff size={14} />}
                                            {(p.is_active !== false && p.isActive !== false) ? 'Active' : 'Paused (Click to Activate)'}
                                        </button>
                                        {p.categoryActive === false && (
                                            <div style={{ fontSize: '0.68rem', color: '#B45309', fontWeight: 600, marginTop: '2px' }}>
                                                (Category Paused)
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button onClick={() => openEditModal(p)} className="btn-table-action edit" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            {/* Safely pass database primary key ID and React string id */}
                                            <button onClick={() => handleDelete(p.dbId, p.id, p.name)} className="btn-table-action delete" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Large Edit Modal */}
            {modalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '800px' }}>
                        <div className="admin-modal-header">
                            <h3>{editingProduct ? `Edit Product — ${editingProduct.name}` : 'Create Product'}</h3>
                            <button onClick={() => setModalOpen(false)} className="btn-modal-close">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="admin-modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {error && <div className="login-error-box" style={{ gridColumn: 'span 2' }}>{error}</div>}

                                {/* Left column */}
                                <div>
                                    <div className="admin-form-group">
                                        <label>Category Category *</label>
                                        <select
                                            className="admin-form-control"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                        >
                                            {topicsData.map(t => (
                                                <option key={t.id} value={t.id}>{t.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="admin-form-group">
                                        <label>Product Name *</label>
                                        <input
                                            type="text"
                                            required
                                            className="admin-form-control"
                                            placeholder="e.g. Low Poly Dino"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label>Price (₹) *</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="admin-form-control"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '4px', display: 'block' }}>Enter 0 for WhatsApp Quote Items</span>
                                    </div>

                                    <div className="admin-form-group">
                                        <label>Short Description *</label>
                                        <textarea
                                            required
                                            className="admin-form-control"
                                            rows="2"
                                            placeholder="Short summary displayed on list pages..."
                                            value={desc}
                                            onChange={(e) => setDesc(e.target.value)}
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label>Craftsmanship / Detailed Story (Optional)</label>
                                        <textarea
                                            className="admin-form-control"
                                            rows="4"
                                            placeholder="Complete backstory and parameters displayed on PDP details..."
                                            value={fullDetails}
                                            onChange={(e) => setFullDetails(e.target.value)}
                                        />
                                    </div>

                                </div>

                                {/* Right column */}
                                <div>
                                    {/* Specifications Builder */}
                                    <div className="admin-form-group">
                                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            Technical Specifications
                                            <button type="button" onClick={addSpecRow} className="admin-btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                                                + Add Spec
                                            </button>
                                        </label>

                                        <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--admin-border)', padding: '8px', borderRadius: '4px', background: '#F8FAFC' }}>
                                            {specs.map((s, idx) => (
                                                <div key={idx} className="dynamic-list-row">
                                                    <input
                                                        type="text"
                                                        className="admin-form-control"
                                                        style={{ height: '34px', fontSize: '0.8rem' }}
                                                        placeholder="e.g. material"
                                                        value={s.key}
                                                        onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="admin-form-control"
                                                        style={{ height: '34px', fontSize: '0.8rem' }}
                                                        placeholder="e.g. Pro PLA"
                                                        value={s.value}
                                                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                                                    />
                                                    <button type="button" onClick={() => removeSpecRow(idx)} className="btn-row-action delete" style={{ width: '34px', height: '34px' }}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            {specs.length === 0 && (
                                                <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', textAlign: 'center', margin: '10px 0' }}>No specs added yet.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Features Tags */}
                                    <div className="admin-form-group">
                                        <label>Signature Highlight Tags (Press Enter)</label>
                                        <div className="tag-input-container">
                                            {features.map((feat, idx) => (
                                                <span key={idx} className="tag-pill">
                                                    {feat}
                                                    <button type="button" onClick={() => removeTag(idx)}><X size={10} /></button>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                className="tag-input-field"
                                                placeholder="Add feature and enter..."
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={addTag}
                                            />
                                        </div>
                                    </div>
                                    {/* Product Active / Visibility Toggle */}
                                    <div className="admin-form-group" style={{
                                        marginBottom: '16px',
                                        padding: '12px 14px',
                                        background: isActive ? '#ECFDF5' : '#FFF1F2',
                                        border: isActive ? '1px solid #A7F3D0' : '1px solid #FECDD3',
                                        borderRadius: '6px',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        <label className="admin-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, color: isActive ? '#065F46' : '#9F1239' }}>
                                            <input
                                                type="checkbox"
                                                checked={isActive}
                                                onChange={(e) => setIsActive(e.target.checked)}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10B981' }}
                                            />
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                                Active & Visible in Store (uncheck to temporarily hide or block this product)
                                            </span>
                                        </label>
                                    </div>

                                    {/* Bestseller Toggle */}
                                    <div className="admin-form-group" style={{
                                        marginBottom: '20px',
                                        padding: '12px 14px',
                                        background: isBestseller ? '#FEF3C7' : '#F8FAFC',
                                        border: isBestseller ? '1px solid #FCD34D' : '1px solid var(--admin-border)',
                                        borderRadius: '6px',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        <label className="admin-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, color: isBestseller ? '#92400E' : 'inherit' }}>
                                            <input
                                                type="checkbox"
                                                checked={isBestseller}
                                                onChange={(e) => setIsBestseller(e.target.checked)}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#D97706' }}
                                            />
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Star size={16} fill={isBestseller ? "#F59E0B" : "none"} color={isBestseller ? "#D97706" : "currentColor"} />
                                                Feature as Bestseller (Display on Homepage "Our Bestsellers")
                                            </span>
                                        </label>
                                    </div>

                                    {/* Personalization Options Toggle */}
                                    <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                                        <label className="admin-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                            <input
                                                type="checkbox"
                                                checked={customizable}
                                                onChange={(e) => setCustomizable(e.target.checked)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                            />
                                            is there any personalization / custom option
                                        </label>
                                    </div>

                                    {customizable && (
                                        <div style={{
                                            padding: '16px',
                                            background: '#F8FAFC',
                                            border: '1px solid var(--admin-border)',
                                            borderRadius: '6px',
                                            marginBottom: '20px'
                                        }}>
                                            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-muted)' }}>
                                                Personalization Settings
                                            </h4>
                                            <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Customization Label *</label>
                                                <input
                                                    type="text"
                                                    required={customizable}
                                                    className="admin-form-control"
                                                    placeholder="e.g. Enter callsing to engrave"
                                                    value={customizationLabel}
                                                    onChange={(e) => setCustomizationLabel(e.target.value)}
                                                    style={{ height: '34px', fontSize: '0.85rem' }}
                                                />
                                            </div>
                                            <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Customization Placeholder *</label>
                                                <input
                                                    type="text"
                                                    required={customizable}
                                                    className="admin-form-control"
                                                    placeholder="e.g. e.g. GHOST-01"
                                                    value={customizationPlaceholder}
                                                    onChange={(e) => setCustomizationPlaceholder(e.target.value)}
                                                    style={{ height: '34px', fontSize: '0.85rem' }}
                                                />
                                            </div>
                                            <div className="admin-form-group" style={{ marginBottom: '0' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Custom Letters Limit *</label>
                                                <input
                                                    type="number"
                                                    required={customizable}
                                                    min="1"
                                                    className="admin-form-control"
                                                    placeholder="e.g. 50"
                                                    value={customLettersLimit}
                                                    onChange={(e) => setCustomLettersLimit(e.target.value)}
                                                    style={{ height: '34px', fontSize: '0.85rem' }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Color Options Toggle */}
                                    <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                                        <label className="admin-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                            <input
                                                type="checkbox"
                                                checked={hasColors}
                                                onChange={(e) => setHasColors(e.target.checked)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                            />
                                            is there any color options
                                        </label>
                                    </div>

                                    {hasColors ? (
                                        <div className="admin-form-group">
                                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                Color Options & Images
                                                <button
                                                    type="button"
                                                    onClick={() => setColorOptions([...colorOptions, { color: '', images: [], urlInput: '' }])}
                                                    className="admin-btn-secondary"
                                                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                                >
                                                    + Add Color Option
                                                </button>
                                            </label>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                {colorOptions.map((opt, optIdx) => (
                                                    <div
                                                        key={optIdx}
                                                        className="admin-panel-card"
                                                        style={{
                                                            padding: '16px',
                                                            background: '#F8FAFC',
                                                            border: '1px solid var(--admin-border)',
                                                            borderRadius: '6px',
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        {/* Delete color option */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const copy = [...colorOptions];
                                                                copy.splice(optIdx, 1);
                                                                setColorOptions(copy);
                                                            }}
                                                            className="btn-modal-close"
                                                            style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                                                            title="Remove Color Option"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>

                                                        {/* Color Name Input */}
                                                        <div className="admin-form-group" style={{ marginBottom: '12px', paddingRight: '24px' }}>
                                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Color Name *</label>
                                                            <input
                                                                type="text"
                                                                required
                                                                className="admin-form-control"
                                                                placeholder="e.g. Neon Red or Silk Gold"
                                                                value={opt.color}
                                                                onChange={(e) => {
                                                                    const copy = [...colorOptions];
                                                                    copy[optIdx].color = e.target.value;
                                                                    setColorOptions(copy);
                                                                }}
                                                                style={{ height: '34px', fontSize: '0.85rem' }}
                                                            />
                                                        </div>

                                                        {/* Image Upload/Link for this specific color */}
                                                        <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Color Images</label>

                                                            {/* Upload local image for color */}
                                                            <div className="media-manager-box" style={{ padding: '12px', minHeight: '80px' }}>
                                                                <Upload size={18} style={{ color: 'var(--admin-text-muted)', marginBottom: '4px' }} />
                                                                <p style={{ fontSize: '0.7rem', fontWeight: 600, margin: 0 }}>
                                                                    Upload Image for {opt.color || `Color #${optIdx + 1}`}
                                                                </p>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="media-upload-input"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files[0];
                                                                        if (!file) return;
                                                                        if (!isBackendOnline) {
                                                                            alert('File uploads are disabled in Offline Mode.');
                                                                            return;
                                                                        }
                                                                        try {
                                                                            const url = await uploadImage(file);
                                                                            const copy = [...colorOptions];
                                                                            copy[optIdx].images = [...copy[optIdx].images, url];
                                                                            setColorOptions(copy);
                                                                        } catch (err) {
                                                                            console.error(err);
                                                                            alert(err.message || 'Upload failed');
                                                                        }
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Paste URL for color */}
                                                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                                <input
                                                                    type="text"
                                                                    className="admin-form-control"
                                                                    style={{ height: '32px', fontSize: '0.8rem' }}
                                                                    placeholder="Or paste external URL..."
                                                                    value={opt.urlInput || ''}
                                                                    onChange={(e) => {
                                                                        const copy = [...colorOptions];
                                                                        copy[optIdx].urlInput = e.target.value;
                                                                        setColorOptions(copy);
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const url = (opt.urlInput || '').trim();
                                                                        if (url) {
                                                                            const copy = [...colorOptions];
                                                                            copy[optIdx].images = [...copy[optIdx].images, url];
                                                                            copy[optIdx].urlInput = '';
                                                                            setColorOptions(copy);
                                                                        }
                                                                    }}
                                                                    className="admin-btn-secondary"
                                                                    style={{ padding: '0 10px', height: '32px', fontSize: '0.75rem' }}
                                                                >
                                                                    Add
                                                                </button>
                                                            </div>

                                                            {/* Images Preview Grid for this color */}
                                                            <div className="media-preview-grid" style={{ marginTop: '10px', gap: '8px' }}>
                                                                {opt.images.map((img, imgIdx) => (
                                                                    <div key={imgIdx} className="media-preview-card" style={{ width: '60px', height: '60px' }}>
                                                                        <img
                                                                            src={img}
                                                                            alt="preview"
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = 'https://via.placeholder.com/60x60?text=Error';
                                                                            }}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const copy = [...colorOptions];
                                                                                copy[optIdx].images.splice(imgIdx, 1);
                                                                                setColorOptions(copy);
                                                                            }}
                                                                            className="btn-media-delete"
                                                                        >
                                                                            <Trash2 size={10} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {colorOptions.length === 0 && (
                                                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', textAlign: 'center', margin: '10px 0' }}>No color options added yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="admin-form-group">
                                            <label>Product Images</label>

                                            {/* Direct File Upload Drop Zone */}
                                            <div className="media-manager-box">
                                                <Upload size={24} style={{ color: 'var(--admin-text-muted)', marginBottom: '8px' }} />
                                                <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>
                                                    {uploading ? 'Uploading image...' : 'Click to Upload Local Image'}
                                                </p>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>Supports JPEG, PNG up to 5MB</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="media-upload-input"
                                                    disabled={uploading}
                                                    onChange={handleFileUpload}
                                                />
                                            </div>

                                            {/* External Image URL adder fallback */}
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                                <input
                                                    type="text"
                                                    className="admin-form-control"
                                                    style={{ height: '36px', fontSize: '0.8rem' }}
                                                    placeholder="Or paste external image URL..."
                                                    value={imageUrlInput}
                                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                                />
                                                <button type="button" onClick={addImageUrl} className="admin-btn-secondary" style={{ padding: '0 12px', height: '36px' }}>
                                                    Add
                                                </button>
                                            </div>

                                            {/* Images Preview Grid */}
                                            <div className="media-preview-grid">
                                                {images.map((img, idx) => (
                                                    <div key={idx} className="media-preview-card">
                                                        <img
                                                            src={img}
                                                            alt="preview"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://via.placeholder.com/80x80?text=Error';
                                                            }}
                                                        />
                                                        <button type="button" onClick={() => removeImage(idx)} className="btn-media-delete">
                                                            <Trash2 size={10} />
                                                        </button>
                                                        <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.6rem', textAlign: 'center' }}>#{idx + 1}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" onClick={() => setModalOpen(false)} className="admin-btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="admin-btn-action">
                                    {saving ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
