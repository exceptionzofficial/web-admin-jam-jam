import React, { useState, useEffect, useCallback } from 'react';
import { MdTrendingUp, MdReceipt, MdAttachMoney, MdCalendarToday, MdDateRange, MdCalendarMonth, MdDownload } from 'react-icons/md';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getDashboardStats } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const SERVICE_CONFIG = {
    Games: { color: '#8B5CF6' },
    Restaurant: { color: '#F97316' },
    Bakery: { color: '#EC4899' },
    Juice: { color: '#22C55E' },
    Massage: { color: '#06B6D4' },
    Pool: { color: '#3B82F6' },
    Combo: { color: '#F97316' },
    Bar: { color: '#A855F7' },
};

const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('today');

    const load = useCallback(async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (e) {
            console.error('Dashboard error:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        const iv = setInterval(load, 30000);
        return () => clearInterval(iv);
    }, [load]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    const d = stats?.[period] || stats?.today || { revenue: 0, orderCount: 0, byService: {} };
    const services = Object.entries(d.byService || {});

    const chartData = {
        labels: services.map(([s]) => s),
        datasets: [{
            data: services.map(([, v]) => v),
            backgroundColor: services.map(([s]) => SERVICE_CONFIG[s]?.color || '#888'),
            borderWidth: 0,
            hoverOffset: 8,
        }],
    };

    const chartOpts = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: { label: (ctx) => `${ctx.label}: ${fmt(ctx.raw)}` }
            }
        }
    };

    const exportReport = () => {
        if (!stats) return;
        const rows = ['Period,Revenue,Orders,Avg Order Value'];
        ['today', 'week', 'month', 'year'].forEach(p => {
            const pd = stats[p] || {};
            rows.push(`${p},${pd.revenue || 0},${pd.orderCount || 0},${pd.orderCount ? Math.round(pd.revenue / pd.orderCount) : 0}`);
        });
        rows.push('');
        rows.push(`Service Breakdown (${period})`);
        rows.push('Service,Revenue,Percentage');
        services.forEach(([svc, amt]) => {
            const pct = d.revenue > 0 ? Math.round((amt / d.revenue) * 100) : 0;
            rows.push(`${svc},${amt},${pct}%`);
        });
        rows.push('');
        rows.push(`Total Orders (All-time),${stats.totalOrders || 0}`);
        const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `JamJam_Dashboard_${period}_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="animate-fade">
            {/* Header with Period Tabs + Export */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div className="period-tabs" style={{ marginBottom: 0 }}>
                    {['today', 'week', 'month', 'year'].map((p) => (
                        <button key={p} className={`period-tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
                <button className="btn btn-primary" onClick={exportReport}>
                    <MdDownload size={18} /> Export Report
                </button>
            </div>

            {/* Revenue Card */}
            <div className="revenue-card">
                <div className="revenue-header">
                    <MdTrendingUp size={26} />
                    <span className="revenue-period">{period.toUpperCase()} REVENUE</span>
                </div>
                <div className="revenue-amount">{fmt(d.revenue)}</div>
                <div className="revenue-footer">
                    <div className="revenue-footer-item">
                        <MdReceipt size={18} />
                        <span>{d.orderCount} Orders</span>
                    </div>
                    <div className="revenue-footer-item">
                        <MdAttachMoney size={18} />
                        <span>Avg {fmt(d.orderCount ? Math.round(d.revenue / d.orderCount) : 0)}</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>
                        <MdCalendarToday size={22} color="#22C55E" />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{fmt(stats?.today?.revenue || 0)}</div>
                        <div className="stat-label">Today</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>
                        <MdDateRange size={22} color="#F59E0B" />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{fmt(stats?.week?.revenue || 0)}</div>
                        <div className="stat-label">This Week</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>
                        <MdCalendarMonth size={22} color="#3B82F6" />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{fmt(stats?.month?.revenue || 0)}</div>
                        <div className="stat-label">This Month</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.12)' }}>
                        <MdReceipt size={22} color="#8B5CF6" />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{stats?.totalOrders || 0}</div>
                        <div className="stat-label">All-Time Orders</div>
                    </div>
                </div>
            </div>

            {/* Service Breakdown + Chart */}
            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Revenue by Service</span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{period}</span>
                    </div>
                    {services.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>No orders in this period</p>
                    ) : (
                        services.map(([service, amount]) => {
                            const color = SERVICE_CONFIG[service]?.color || '#888';
                            const pct = d.revenue > 0 ? Math.round((amount / d.revenue) * 100) : 0;
                            return (
                                <div key={service} style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                                    <div className="data-icon" style={{ background: color + '20', width: 38, height: 38, borderRadius: 10 }}>
                                        <div style={{ width: 16, height: 16, borderRadius: 4, background: color }} />
                                    </div>
                                    <div className="progress-wrap">
                                        <div className="progress-name">
                                            <span style={{ fontWeight: 600, fontSize: 14 }}>{service}</span>
                                            <span style={{ fontWeight: 700, fontSize: 14 }}>{fmt(amount)}</span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
                                        </div>
                                    </div>
                                    <span style={{ marginLeft: 12, fontWeight: 600, fontSize: 13, color }}>{pct}%</span>
                                </div>
                            );
                        })
                    )}
                </div>

                {services.length > 0 && (
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="card-header" style={{ width: '100%' }}>
                            <span className="card-title">Distribution</span>
                        </div>
                        <div style={{ width: '100%', maxWidth: 280, height: 280 }}>
                            <Doughnut data={chartData} options={chartOpts} />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16, justifyContent: 'center' }}>
                            {services.map(([s]) => (
                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 3, background: SERVICE_CONFIG[s]?.color || '#888' }} />
                                    <span style={{ color: 'var(--text-secondary)' }}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
