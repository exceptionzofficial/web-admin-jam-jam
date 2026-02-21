import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdClose, MdSearch, MdInventory, MdWarning, MdCheckCircle, MdError } from 'react-icons/md';

const CATEGORIES = ['Kitchen', 'Bar', 'Bakery', 'Juice Bar', 'Cleaning', 'Games', 'Pool', 'Massage', 'General'];
const CAT_COLORS = {
    Kitchen: '#F97316', Bar: '#A855F7', Bakery: '#EC4899', 'Juice Bar': '#22C55E',
    Cleaning: '#06B6D4', Games: '#8B5CF6', Pool: '#3B82F6', Massage: '#06B6D4', General: '#64748B',
};

const STORAGE_KEY = 'jamjam_inventory';
const loadInventory = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
const saveInventory = (d) => localStorage.setItem(STORAGE_KEY, JSON.stringify(d));

const getStatus = (qty, min) => {
    if (qty <= 0) return { label: 'Out of Stock', color: '#EF4444', icon: MdError };
    if (qty <= min) return { label: 'Low Stock', color: '#F59E0B', icon: MdWarning };
    return { label: 'In Stock', color: '#22C55E', icon: MdCheckCircle };
};

export default function Inventory() {
    const [items, setItems] = useState(loadInventory);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [form, setForm] = useState({ name: '', category: 'Kitchen', quantity: '', unit: 'pcs', minQuantity: '', cost: '', supplier: '' });

    useEffect(() => { saveInventory(items); }, [items]);

    const openAdd = () => { setEditing(null); setForm({ name: '', category: 'Kitchen', quantity: '', unit: 'pcs', minQuantity: '', cost: '', supplier: '' }); setShowModal(true); };
    const openEdit = (item) => {
        setEditing(item.id);
        setForm({ name: item.name, category: item.category, quantity: String(item.quantity), unit: item.unit, minQuantity: String(item.minQuantity), cost: String(item.cost || ''), supplier: item.supplier || '' });
        setShowModal(true);
    };

    const save = () => {
        if (!form.name.trim() || !form.quantity) return;
        const entry = { ...form, quantity: Number(form.quantity), minQuantity: Number(form.minQuantity || 5), cost: Number(form.cost || 0), id: editing || `inv_${Date.now()}`, updatedAt: new Date().toISOString() };
        if (editing) {
            setItems(prev => prev.map(it => it.id === editing ? entry : it));
        } else {
            setItems(prev => [entry, ...prev]);
        }
        setShowModal(false);
    };

    const remove = (id) => { if (confirm('Delete this item?')) setItems(prev => prev.filter(it => it.id !== id)); };

    const adjustQty = (id, delta) => {
        setItems(prev => prev.map(it => it.id === id ? { ...it, quantity: Math.max(0, it.quantity + delta), updatedAt: new Date().toISOString() } : it));
    };

    const filtered = items.filter(it => {
        if (catFilter !== 'all' && it.category !== catFilter) return false;
        if (statusFilter !== 'all') {
            const st = getStatus(it.quantity, it.minQuantity);
            if (statusFilter === 'low' && st.label !== 'Low Stock') return false;
            if (statusFilter === 'out' && st.label !== 'Out of Stock') return false;
            if (statusFilter === 'ok' && st.label !== 'In Stock') return false;
        }
        if (search) {
            const q = search.toLowerCase();
            return it.name.toLowerCase().includes(q) || it.category.toLowerCase().includes(q) || (it.supplier || '').toLowerCase().includes(q);
        }
        return true;
    });

    const totalItems = items.length;
    const lowStock = items.filter(it => it.quantity > 0 && it.quantity <= it.minQuantity).length;
    const outStock = items.filter(it => it.quantity <= 0).length;
    const totalValue = items.reduce((s, it) => s + (it.cost * it.quantity), 0);

    return (
        <div className="animate-fade">
            <div className="page-header">
                <h2>Inventory Tracking</h2>
                <button className="btn btn-primary" onClick={openAdd}><MdAdd size={18} /> Add Item</button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>
                        <MdInventory size={22} color="#3B82F6" />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{totalItems}</div>
                        <div className="stat-label">Total Items</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>
                        <MdWarning size={22} color="#F59E0B" />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{lowStock}</div>
                        <div className="stat-label">Low Stock</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.12)' }}>
                        <MdError size={22} color="#EF4444" />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{outStock}</div>
                        <div className="stat-label">Out of Stock</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>
                        <MdCheckCircle size={22} color="#22C55E" />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">₹{totalValue.toLocaleString('en-IN')}</div>
                        <div className="stat-label">Total Value</div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="search-bar">
                <MdSearch size={20} className="search-icon" />
                <input placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <div className="filter-chips" style={{ marginBottom: 0 }}>
                    <button className={`filter-chip ${catFilter === 'all' ? 'active' : ''}`} onClick={() => setCatFilter('all')}>All</button>
                    {CATEGORIES.map(c => (
                        <button key={c} className={`filter-chip ${catFilter === c ? 'active' : ''}`}
                            style={catFilter === c ? { background: CAT_COLORS[c], borderColor: CAT_COLORS[c] } : {}}
                            onClick={() => setCatFilter(c)}
                        >{c}</button>
                    ))}
                </div>
            </div>
            <div className="filter-chips">
                {[{ k: 'all', l: 'All' }, { k: 'ok', l: '✓ In Stock' }, { k: 'low', l: '⚠ Low Stock' }, { k: 'out', l: '✗ Out of Stock' }].map(s => (
                    <button key={s.k} className={`filter-chip ${statusFilter === s.k ? 'active' : ''}`} onClick={() => setStatusFilter(s.k)}>{s.l}</button>
                ))}
            </div>

            {/* Items Grid */}
            {filtered.length === 0 ? (
                <div className="empty-state">
                    <MdInventory size={64} />
                    <p>No inventory items found</p>
                    <button className="btn btn-primary" onClick={openAdd}>Add your first item</button>
                </div>
            ) : (
                <div className="grid-3">
                    {filtered.map(item => {
                        const st = getStatus(item.quantity, item.minQuantity);
                        const color = CAT_COLORS[item.category] || '#64748B';
                        const StIcon = st.icon;
                        return (
                            <div key={item.id} className="item-card">
                                <div className="item-card-header">
                                    <div>
                                        <div className="item-card-name">{item.name}</div>
                                        <span className="tag" style={{ background: color + '15', color, marginTop: 4, display: 'inline-block' }}>{item.category}</span>
                                    </div>
                                    <div className="data-actions">
                                        <button className="btn-icon btn-sm" onClick={() => openEdit(item)}><MdEdit size={14} /></button>
                                        <button className="btn-icon btn-sm" style={{ borderColor: 'var(--error)' }} onClick={() => remove(item.id)}><MdDelete size={14} color="var(--error)" /></button>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>{item.quantity}</div>
                                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.unit}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button className="btn btn-outline btn-sm" onClick={() => adjustQty(item.id, -1)} disabled={item.quantity <= 0}>−</button>
                                        <button className="btn btn-outline btn-sm" onClick={() => adjustQty(item.id, 1)}>+</button>
                                    </div>
                                </div>

                                <div className="item-card-footer">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <StIcon size={14} color={st.color} />
                                        <span style={{ fontSize: 12, fontWeight: 600, color: st.color }}>{st.label}</span>
                                    </div>
                                    {item.cost > 0 && (
                                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>₹{item.cost}/{item.unit}</span>
                                    )}
                                </div>
                                {item.supplier && (
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Supplier: {item.supplier}</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{editing ? 'Edit Item' : 'Add Inventory Item'}</span>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><MdClose size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Item Name *</label>
                                <input className="form-input" placeholder="e.g. Rice 25kg bag" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Unit</label>
                                    <select className="form-input" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                                        {['pcs', 'kg', 'g', 'liters', 'ml', 'bottles', 'packs', 'boxes', 'dozen'].map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Quantity *</label>
                                    <input className="form-input" type="number" placeholder="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Min. Quantity (alert)</label>
                                    <input className="form-input" type="number" placeholder="5" value={form.minQuantity} onChange={e => setForm({ ...form, minQuantity: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Cost per Unit (₹)</label>
                                    <input className="form-input" type="number" placeholder="0" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Supplier</label>
                                    <input className="form-input" placeholder="Optional" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={save}>{editing ? 'Update' : 'Add Item'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
