import React, { useState, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdDownload, MdClose, MdReceipt } from 'react-icons/md';
import { getAllOrders } from '../services/api';

const SERVICES = ['all', 'Games', 'Restaurant', 'Bakery', 'Juice', 'Massage', 'Pool', 'Combo', 'Bar'];
const SERVICE_COLORS = {
    Games: '#8B5CF6', Restaurant: '#F97316', Bakery: '#EC4899',
    Juice: '#22C55E', Massage: '#06B6D4', Pool: '#3B82F6',
    Combo: '#F97316', Bar: '#A855F7',
};

const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [service, setService] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('all');
    const [showFilter, setShowFilter] = useState(false);

    const load = useCallback(async () => {
        try {
            const data = await getAllOrders(
                startDate ? new Date(startDate).toISOString() : undefined,
                endDate ? new Date(endDate).toISOString() : undefined,
                service
            );
            setOrders(data);
            filterLocal(data, search);
        } catch (e) {
            console.error('Orders error:', e);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, service]);

    useEffect(() => { load(); }, [load]);

    const filterLocal = (list, q, pm) => {
        let filteredList = list;

        // Filter by payment method
        if (pm !== 'all') {
            filteredList = filteredList.filter(o => {
                const method = (o.paymentMethod || '').toLowerCase();
                if (pm === 'Cash') return !method.includes('upi') && !method.includes('qr');
                if (pm === 'UPI') return method.includes('upi') || method.includes('qr');
                return true;
            });
        }

        if (!q.trim()) { setFiltered(filteredList); return; }
        const lq = q.toLowerCase();
        setFiltered(filteredList.filter(o =>
            (o.customerName && o.customerName.toLowerCase().includes(lq)) ||
            (o.orderId && o.orderId.toLowerCase().includes(lq)) ||
            (o.service && o.service.toLowerCase().includes(lq))
        ));
    };

    const handleSearch = (q) => { setSearch(q); filterLocal(orders, q, paymentMethod); };
    const handlePaymentFilter = (pm) => { setPaymentMethod(pm); filterLocal(orders, search, pm); };

    const total = filtered.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const cashTotal = filtered.filter(o => !((o.paymentMethod || '').toLowerCase().includes('upi') || (o.paymentMethod || '').toLowerCase().includes('qr'))).reduce((s, o) => s + (o.totalAmount || 0), 0);
    const upiTotal = filtered.filter(o => (o.paymentMethod || '').toLowerCase().includes('upi') || (o.paymentMethod || '').toLowerCase().includes('qr')).reduce((s, o) => s + (o.totalAmount || 0), 0);

    const exportCsv = () => {
        if (!filtered.length) return;
        const header = 'Order ID,Service,Customer,Amount,Date,Payment\n';
        const rows = filtered.map(o =>
            `${o.orderId},${o.service},${o.customerName || 'Walk-in'},${o.totalAmount || 0},${fmtDate(o.createdAt || o.timestamp)},${o.paymentMethod || 'N/A'}`
        ).join('\n');
        const blob = new Blob([header + rows + `\n\nTotal: ${filtered.length} orders, Revenue: ${total}, Cash: ${cashTotal}, UPI/QR: ${upiTotal}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `JamJam_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

    const exportBarCsv = () => {
        const barOrders = orders.filter(o => o.service === 'Bar');
        if (!barOrders.length) return alert('No Bar orders found for this period');
        const totalBar = barOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
        const header = 'Order ID,Service,Customer,Amount,Date,Payment\n';
        const rows = barOrders.map(o =>
            `${o.orderId},${o.service},${o.customerName || 'Walk-in'},${o.totalAmount || 0},${fmtDate(o.createdAt || o.timestamp)},${o.paymentMethod || 'N/A'}`
        ).join('\n');
        const blob = new Blob([header + rows + `\n\nTotal: ${barOrders.length} Bar orders, Revenue: ${totalBar}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `JamJam_Bar_Bills_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

    const exportOtherCsv = () => {
        const otherOrders = orders.filter(o => o.service !== 'Bar');
        if (!otherOrders.length) return alert('No other service orders found');
        const totalOther = otherOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
        const header = 'Order ID,Service,Customer,Amount,Date,Payment\n';
        const rows = otherOrders.map(o =>
            `${o.orderId},${o.service},${o.customerName || 'Walk-in'},${o.totalAmount || 0},${fmtDate(o.createdAt || o.timestamp)},${o.paymentMethod || 'N/A'}`
        ).join('\n');
        const blob = new Blob([header + rows + `\n\nTotal: ${otherOrders.length} Other service orders, Revenue: ${totalOther}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `JamJam_Service_Bills_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

    const setQuick = (days) => {
        const end = new Date();
        const start = new Date();
        if (days === 0) start.setHours(0, 0, 0, 0);
        else start.setDate(start.getDate() - days);
        setStartDate(start.toISOString().slice(0, 10));
        setEndDate(end.toISOString().slice(0, 10));
        setShowFilter(false);
    };

    const clearFilters = () => {
        setStartDate(''); setEndDate(''); setService('all'); setPaymentMethod('all'); setShowFilter(false);
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner" /><p>Loading Orders...</p></div>;

    return (
        <div className="animate-fade">
            {/* Actions */}
            <div className="page-header">
                <h2>Orders / Bills</h2>
                <div className="page-header-actions">
                    <button className="btn btn-outline" onClick={() => setShowFilter(true)}>
                        <MdFilterList size={18} /> Filters
                    </button>
                    <button className="btn btn-outline" onClick={exportBarCsv} title="Download Bar invoices only">
                        <MdDownload size={18} /> Export Bar Bills
                    </button>
                    <button className="btn btn-outline" onClick={exportOtherCsv} title="Download non-Bar invoices">
                        <MdDownload size={18} /> Export Other Bills
                    </button>
                    <button className="btn btn-primary" onClick={exportCsv}>
                        <MdDownload size={18} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="search-bar">
                <MdSearch size={20} className="search-icon" />
                <input placeholder="Search by customer, order ID, service..." value={search} onChange={e => handleSearch(e.target.value)} />
                {search && <button className="btn-icon" style={{ border: 'none' }} onClick={() => handleSearch('')}><MdClose size={16} /></button>}
            </div>

            {/* Service Chips */}
            <div className="filter-chips">
                {SERVICES.map(s => (
                    <button key={s} className={`filter-chip ${service === s ? 'active' : ''}`}
                        style={service === s ? { background: SERVICE_COLORS[s] || 'var(--brand)', borderColor: SERVICE_COLORS[s] || 'var(--brand)' } : {}}
                        onClick={() => { setService(s); }}
                    >
                        {s === 'all' ? 'All Services' : s}
                    </button>
                ))}
            </div>

            {/* Payment Filter Chips */}
            <div className="filter-chips" style={{ marginTop: -8 }}>
                {['all', 'Cash', 'UPI'].map(pm => (
                    <button key={pm} className={`filter-chip ${paymentMethod === pm ? 'active' : ''}`}
                        onClick={() => handlePaymentFilter(pm)}
                    >
                        {pm === 'all' ? 'All Payments' : pm}
                    </button>
                ))}
            </div>

            {/* Summary */}
            <div className="summary-bar">
                <div className="summary-item">
                    <div className="summary-value">{filtered.length}</div>
                    <div className="summary-label">Orders</div>
                </div>
                <div className="summary-divider" />
                <div className="summary-item">
                    <div className="summary-value" style={{ color: '#22C55E' }}>{fmt(cashTotal)}</div>
                    <div className="summary-label">Cash</div>
                </div>
                <div className="summary-divider" />
                <div className="summary-item">
                    <div className="summary-value" style={{ color: '#3B82F6' }}>{fmt(upiTotal)}</div>
                    <div className="summary-label">UPI / QR</div>
                </div>
                <div className="summary-divider" />
                <div className="summary-item">
                    <div className="summary-value">{fmt(total)}</div>
                    <div className="summary-label">Total Revenue</div>
                </div>
            </div>

            {/* Active filters */}
            {(startDate || endDate) && (
                <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span>Date: {startDate || '...'} → {endDate || '...'}</span>
                    <button className="btn-icon btn-sm" onClick={clearFilters}><MdClose size={14} /></button>
                </div>
            )}

            {/* Order List */}
            {filtered.length === 0 ? (
                <div className="empty-state">
                    <MdReceipt size={64} />
                    <p>No orders found</p>
                </div>
            ) : (
                <div className="data-list">
                    {filtered.map((item, i) => {
                        const color = SERVICE_COLORS[item.service] || '#888';
                        const ts = item.createdAt || item.timestamp;
                        return (
                            <div key={item.orderId || i} className="data-item">
                                <div className="data-icon" style={{ background: color + '20' }}>
                                    <MdReceipt size={20} color={color} />
                                </div>
                                <div className="data-info">
                                    <div className="data-name">{item.customerName || 'Walk-in'}</div>
                                    <div className="data-desc">{item.service}</div>
                                    <div className="data-meta">
                                        <span>{fmtDate(ts)} • {fmtTime(ts)}</span>
                                        {item.paymentMethod && (
                                            <span className="service-badge" style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                                                {item.paymentMethod}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="data-amount" style={{ color }}>{fmt(item.totalAmount)}</div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Filter Modal */}
            {showFilter && (
                <div className="modal-overlay" onClick={() => setShowFilter(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">Filter Orders</span>
                            <button className="btn-icon" onClick={() => setShowFilter(false)}><MdClose size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-label">Quick Filters</div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                                {[{ l: 'Today', d: 0 }, { l: '7 Days', d: 7 }, { l: '30 Days', d: 30 }, { l: '90 Days', d: 90 }].map(f => (
                                    <button key={f.l} className="btn btn-outline btn-sm" onClick={() => setQuick(f.d)}>{f.l}</button>
                                ))}
                            </div>
                            <div className="form-label">Custom Date Range</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Start Date</label>
                                    <input type="date" className="form-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End Date</label>
                                    <input type="date" className="form-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={clearFilters}>Clear All</button>
                            <button className="btn btn-primary" onClick={() => { setShowFilter(false); load(); }}>Apply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
