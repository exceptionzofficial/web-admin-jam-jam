import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdClose, MdSearch, MdAccountBalanceWallet, MdTrendingUp, MdCalendarToday } from 'react-icons/md';

const CATEGORIES = ['Supplies', 'Maintenance', 'Salary', 'Food & Beverage', 'Utilities', 'Transport', 'Marketing', 'Other'];
const CAT_COLORS = {
    Supplies: '#3B82F6', Maintenance: '#F97316', Salary: '#8B5CF6',
    'Food & Beverage': '#EC4899', Utilities: '#22C55E', Transport: '#06B6D4',
    Marketing: '#F59E0B', Other: '#64748B',
};

const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;
const STORAGE_KEY = 'jamjam_expenses';
const loadExpenses = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
const saveExpenses = (e) => localStorage.setItem(STORAGE_KEY, JSON.stringify(e));

export default function Expenses() {
    const [expenses, setExpenses] = useState(loadExpenses);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [form, setForm] = useState({ title: '', amount: '', category: 'Supplies', date: new Date().toISOString().slice(0, 10), notes: '' });

    useEffect(() => { saveExpenses(expenses); }, [expenses]);

    const openAdd = () => { setEditing(null); setForm({ title: '', amount: '', category: 'Supplies', date: new Date().toISOString().slice(0, 10), notes: '' }); setShowModal(true); };
    const openEdit = (exp) => { setEditing(exp.id); setForm({ title: exp.title, amount: String(exp.amount), category: exp.category, date: exp.date, notes: exp.notes || '' }); setShowModal(true); };

    const save = () => {
        if (!form.title.trim() || !form.amount) return;
        const entry = { ...form, amount: Number(form.amount), id: editing || `exp_${Date.now()}`, updatedAt: new Date().toISOString() };
        if (editing) {
            setExpenses(prev => prev.map(e => e.id === editing ? entry : e));
        } else {
            setExpenses(prev => [entry, ...prev]);
        }
        setShowModal(false);
    };

    const remove = (id) => { if (confirm('Delete this expense?')) setExpenses(prev => prev.filter(e => e.id !== id)); };

    const filtered = expenses.filter(e => {
        if (catFilter !== 'all' && e.category !== catFilter) return false;
        if (dateFilter && e.date !== dateFilter) return false;
        if (search) {
            const q = search.toLowerCase();
            return e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || (e.notes || '').toLowerCase().includes(q);
        }
        return true;
    });

    const totalAll = expenses.reduce((s, e) => s + e.amount, 0);
    const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

    // This month's expenses
    const now = new Date();
    const thisMonth = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((s, e) => s + e.amount, 0);

    // Today's expenses
    const todayStr = now.toISOString().slice(0, 10);
    const todayTotal = expenses.filter(e => e.date === todayStr).reduce((s, e) => s + e.amount, 0);

    return (
        <div className="animate-fade">
            <div className="page-header">
                <h2>Expense Tracker</h2>
                <button className="btn btn-primary" onClick={openAdd}><MdAdd size={18} /> Add Expense</button>
            </div>

            {/* Summary Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.12)' }}>
                        <MdAccountBalanceWallet size={22} color="#EF4444" />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{fmt(totalAll)}</div>
                        <div className="stat-label">Total Expenses</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>
                        <MdTrendingUp size={22} color="#F59E0B" />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{fmt(thisMonth)}</div>
                        <div className="stat-label">This Month</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>
                        <MdCalendarToday size={22} color="#3B82F6" />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{fmt(todayTotal)}</div>
                        <div className="stat-label">Today</div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="search-bar">
                <MdSearch size={20} className="search-icon" />
                <input placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="filter-chips" style={{ marginBottom: 0 }}>
                    <button className={`filter-chip ${catFilter === 'all' ? 'active' : ''}`} onClick={() => setCatFilter('all')}>All</button>
                    {CATEGORIES.map(c => (
                        <button key={c} className={`filter-chip ${catFilter === c ? 'active' : ''}`}
                            style={catFilter === c ? { background: CAT_COLORS[c], borderColor: CAT_COLORS[c] } : {}}
                            onClick={() => setCatFilter(c)}
                        >{c}</button>
                    ))}
                </div>
                <input type="date" style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 13 }}
                    value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
                {dateFilter && <button className="btn btn-outline btn-sm" onClick={() => setDateFilter('')}><MdClose size={14} /> Clear</button>}
            </div>

            {/* Summary */}
            <div className="summary-bar" style={{ borderColor: 'var(--error)' }}>
                <div className="summary-item">
                    <div className="summary-value" style={{ color: 'var(--error)' }}>{filtered.length}</div>
                    <div className="summary-label">Expenses</div>
                </div>
                <div className="summary-divider" style={{ background: 'var(--error)' }} />
                <div className="summary-item">
                    <div className="summary-value" style={{ color: 'var(--error)' }}>{fmt(totalFiltered)}</div>
                    <div className="summary-label">Filtered Total</div>
                </div>
            </div>

            {/* Expense List */}
            {filtered.length === 0 ? (
                <div className="empty-state">
                    <MdAccountBalanceWallet size={64} />
                    <p>No expenses found</p>
                    <button className="btn btn-primary" onClick={openAdd}>Add your first expense</button>
                </div>
            ) : (
                <div className="data-list">
                    {filtered.map(exp => {
                        const color = CAT_COLORS[exp.category] || '#888';
                        return (
                            <div key={exp.id} className="data-item">
                                <div className="data-icon" style={{ background: color + '20' }}>
                                    <MdAccountBalanceWallet size={20} color={color} />
                                </div>
                                <div className="data-info">
                                    <div className="data-name">{exp.title}</div>
                                    <div className="data-meta">
                                        <span className="service-badge" style={{ background: color + '20', color }}>{exp.category}</span>
                                        <span>{new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    {exp.notes && <div className="data-desc" style={{ marginTop: 4 }}>{exp.notes}</div>}
                                </div>
                                <div className="data-amount" style={{ color: 'var(--error)' }}>-{fmt(exp.amount)}</div>
                                <div className="data-actions">
                                    <button className="btn-icon btn-sm" onClick={() => openEdit(exp)}><MdEdit size={16} /></button>
                                    <button className="btn-icon btn-sm" style={{ borderColor: 'var(--error)' }} onClick={() => remove(exp.id)}><MdDelete size={16} color="var(--error)" /></button>
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
                            <span className="modal-title">{editing ? 'Edit Expense' : 'Add Expense'}</span>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><MdClose size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Title *</label>
                                <input className="form-input" placeholder="e.g. Kitchen Supplies" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Amount (₹) *</label>
                                    <input className="form-input" type="number" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date *</label>
                                    <input className="form-input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Notes</label>
                                <textarea className="form-input" rows="2" placeholder="Optional notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={save}>{editing ? 'Update' : 'Add Expense'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
