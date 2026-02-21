import React, { useState, useEffect } from 'react';
import { MdSettings, MdSave, MdEdit } from 'react-icons/md';
import { getTaxSettings, updateTaxSetting } from '../services/api';

const SERVICE_COLORS = {
    Games: '#8B5CF6', Restaurant: '#F97316', Bakery: '#EC4899',
    Juice: '#22C55E', Massage: '#06B6D4', Pool: '#3B82F6',
    Bar: '#A855F7', Combo: '#F97316',
};

export default function TaxSettings() {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

    useEffect(() => {
        (async () => {
            try {
                const data = await getTaxSettings();
                setSettings(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const startEdit = (s) => { setEditing(s.serviceId); setEditValue(String(s.taxPercent || 0)); };

    const saveEdit = async (serviceId) => {
        try {
            await updateTaxSetting(serviceId, Number(editValue));
            setSettings(prev => prev.map(s => s.serviceId === serviceId ? { ...s, taxPercent: Number(editValue) } : s));
            setEditing(null);
            showToast('Tax updated');
        } catch (e) {
            showToast('Failed to update', 'error');
        }
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner" /><p>Loading Tax Settings...</p></div>;

    return (
        <div className="animate-fade">
            <div className="page-header">
                <h2>Tax Settings</h2>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Configure tax percentage per service</span>
            </div>

            {settings.length === 0 ? (
                <div className="empty-state">
                    <MdSettings size={64} />
                    <p>No tax settings found</p>
                </div>
            ) : (
                <div className="grid-2">
                    {settings.map(s => {
                        const color = SERVICE_COLORS[s.serviceId] || SERVICE_COLORS[s.serviceName] || 'var(--brand)';
                        const isEditing = editing === s.serviceId;
                        return (
                            <div key={s.serviceId} className="item-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12,
                                    background: color + '20',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <MdSettings size={22} color={color} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="data-name">{s.serviceName || s.serviceId}</div>
                                    {isEditing ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                            <input
                                                type="number"
                                                value={editValue}
                                                onChange={e => setEditValue(e.target.value)}
                                                style={{ width: 80, padding: '6px 10px', borderRadius: 8, border: '1px solid var(--brand)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: 16, fontWeight: 700 }}
                                                autoFocus
                                            />
                                            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)' }}>%</span>
                                            <button className="btn btn-primary btn-sm" onClick={() => saveEdit(s.serviceId)}><MdSave size={14} /> Save</button>
                                            <button className="btn btn-outline btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                            <span style={{ fontSize: 24, fontWeight: 700, color }}>{s.taxPercent || 0}%</span>
                                        </div>
                                    )}
                                </div>
                                {!isEditing && (
                                    <button className="btn-icon" onClick={() => startEdit(s)}>
                                        <MdEdit size={18} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
