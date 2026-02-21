import React, { useState, useEffect } from 'react';
import { MdSearch, MdPeople, MdPhone, MdAccountBalanceWallet } from 'react-icons/md';
import { getCustomers } from '../services/api';

const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await getCustomers();
                setCustomers(data);
            } catch (e) {
                console.error('Customers error:', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = customers.filter(c => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (c.name && c.name.toLowerCase().includes(q)) || (c.mobile && c.mobile.includes(q));
    });

    if (loading) return <div className="loading-container"><div className="loading-spinner" /><p>Loading Customers...</p></div>;

    return (
        <div className="animate-fade">
            <div className="page-header">
                <h2>Customers</h2>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{customers.length} total</span>
            </div>

            <div className="search-bar">
                <MdSearch size={20} className="search-icon" />
                <input placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <MdPeople size={64} />
                    <p>No customers found</p>
                </div>
            ) : (
                <div className="grid-2">
                    {filtered.map((c, i) => (
                        <div key={c.customerId || i} className="item-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--brand), #8B5CF6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0,
                            }}>
                                {(c.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="data-name">{c.name || 'Unknown'}</div>
                                <div style={{ display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
                                    {c.mobile && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
                                            <MdPhone size={14} /> {c.mobile}
                                        </div>
                                    )}
                                    {c.walletAmount !== undefined && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--success)' }}>
                                            <MdAccountBalanceWallet size={14} /> {fmt(c.walletAmount)}
                                        </div>
                                    )}
                                </div>
                                {c.status && (
                                    <span className="service-badge" style={{
                                        marginTop: 6, display: 'inline-flex',
                                        background: c.status === 'checked-in' ? 'rgba(34,197,94,0.12)' : 'rgba(100,116,139,0.12)',
                                        color: c.status === 'checked-in' ? '#22C55E' : '#64748B',
                                    }}>
                                        {c.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
