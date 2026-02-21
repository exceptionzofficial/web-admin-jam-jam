import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdClose, MdSearch } from 'react-icons/md';

export default function CrudPage({
    title, icon: PageIcon, color = 'var(--brand)',
    fetchFn, createFn, updateFn, deleteFn,
    fields = [], // [{ key, label, type, required, options }]
    idKey = 'itemId',
    displayName = (item) => item.name,
    displayDesc = null,
    displayPrice = (item) => item.price || item.rate,
    displayTags = null,
}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    const load = async () => {
        try {
            const data = await fetchFn();
            setItems(data);
        } catch (e) {
            console.error(e);
            showToast('Failed to load', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const emptyForm = () => fields.reduce((acc, f) => ({ ...acc, [f.key]: f.defaultValue || '' }), {});

    const openAdd = () => { setEditing(null); setForm(emptyForm()); setShowModal(true); };
    const openEdit = (item) => {
        setEditing(item[idKey]);
        const f = {};
        fields.forEach(fd => { f[fd.key] = item[fd.key] !== undefined ? String(item[fd.key]) : ''; });
        setForm(f);
        setShowModal(true);
    };

    const save = async () => {
        const missing = fields.filter(f => f.required && !form[f.key]?.toString().trim());
        if (missing.length) { showToast(`Please fill: ${missing.map(f => f.label).join(', ')}`, 'error'); return; }

        setSaving(true);
        try {
            const data = { ...form };
            fields.forEach(f => { if (f.type === 'number') data[f.key] = Number(data[f.key] || 0); });

            if (editing) {
                await updateFn(editing, data);
                showToast('Updated successfully');
            } else {
                await createFn(data);
                showToast('Created successfully');
            }
            setShowModal(false);
            load();
        } catch (e) {
            showToast(e.message || 'Operation failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            await deleteFn(id);
            showToast('Deleted');
            load();
        } catch (e) {
            showToast('Delete failed', 'error');
        }
    };

    const filtered = items.filter(item => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return fields.some(f => String(item[f.key] || '').toLowerCase().includes(q));
    });

    const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;

    if (loading) return <div className="loading-container"><div className="loading-spinner" /><p>Loading {title}...</p></div>;

    return (
        <div className="animate-fade">
            <div className="page-header">
                <h2>{title}</h2>
                <div className="page-header-actions">
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{items.length} items</span>
                    <button className="btn btn-primary" onClick={openAdd}><MdAdd size={18} /> Add</button>
                </div>
            </div>

            <div className="search-bar">
                <MdSearch size={20} className="search-icon" />
                <input placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    {PageIcon && <PageIcon size={64} />}
                    <p>No items found</p>
                    <button className="btn btn-primary" onClick={openAdd}>Add your first item</button>
                </div>
            ) : (
                <div className="grid-3">
                    {filtered.map((item, i) => {
                        const price = displayPrice(item);
                        return (
                            <div key={item[idKey] || i} className="item-card">
                                <div className="item-card-header">
                                    <div className="item-card-name">{displayName(item)}</div>
                                    {price !== undefined && price !== null && (
                                        <div className="item-card-price">{fmt(price)}</div>
                                    )}
                                </div>
                                {displayDesc && <div className="item-card-desc">{displayDesc(item)}</div>}
                                <div className="item-card-footer">
                                    <div className="item-card-meta">
                                        {displayTags && displayTags(item).map((t, j) => (
                                            <span key={j} className="tag" style={t.color ? { background: t.color + '15', color: t.color } : {}}>{t.label}</span>
                                        ))}
                                    </div>
                                    <div className="data-actions">
                                        <button className="btn-icon btn-sm" onClick={() => openEdit(item)}><MdEdit size={14} /></button>
                                        <button className="btn-icon btn-sm" style={{ borderColor: 'var(--error)' }} onClick={() => remove(item[idKey])}>
                                            <MdDelete size={14} color="var(--error)" />
                                        </button>
                                    </div>
                                </div>
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
                            <span className="modal-title">{editing ? 'Edit' : 'Add'} {title.replace(/Management|Items?/, '').trim()}</span>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><MdClose size={20} /></button>
                        </div>
                        <div className="modal-body">
                            {fields.map(f => (
                                <div key={f.key} className="form-group">
                                    <label className="form-label">{f.label}{f.required ? ' *' : ''}</label>
                                    {f.type === 'select' ? (
                                        <select className="form-input" value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}>
                                            <option value="">Select...</option>
                                            {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    ) : f.type === 'textarea' ? (
                                        <textarea className="form-input" rows="3" placeholder={f.placeholder || ''} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                                    ) : (
                                        <input className="form-input" type={f.type || 'text'} placeholder={f.placeholder || ''} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
