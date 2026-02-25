import React, { useState, createContext, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    MdDashboard, MdReceipt, MdAccountBalanceWallet, MdPeople,
    MdRestaurantMenu, MdSportsEsports, MdLocalBar, MdCake,
    MdLocalDrink, MdSpa, MdPool, MdMeetingRoom, MdSettings,
    MdInventory, MdMenu, MdClose, MdDarkMode, MdLightMode,
    MdKeyboardArrowLeft, MdKeyboardArrowRight, MdMovie, MdFoundation
} from 'react-icons/md';
import './Layout.css';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const NAV_ITEMS = [
    { path: '/', label: 'Dashboard', icon: MdDashboard },
    { path: '/orders', label: 'Orders / Bills', icon: MdReceipt },
    { path: '/expenses', label: 'Expenses', icon: MdAccountBalanceWallet },
    { path: '/inventory', label: 'Inventory', icon: MdInventory },
    { path: '/customers', label: 'Customers', icon: MdPeople },
    { type: 'divider', label: 'Service Management' },
    { path: '/menu', label: 'Restaurant Menu', icon: MdRestaurantMenu },
    { path: '/games', label: 'Games', icon: MdSportsEsports },
    { path: '/bar', label: 'Bar', icon: MdLocalBar },
    { path: '/bakery', label: 'Bakery', icon: MdCake },
    { path: '/juice', label: 'Juice Bar', icon: MdLocalDrink },
    { path: '/massage', label: 'Massage', icon: MdSpa },
    { path: '/pool', label: 'Pool', icon: MdPool },
    { path: '/theater', label: 'Theater Packages', icon: MdMovie },
    { path: '/function-hall', label: 'Function Halls', icon: MdFoundation },
    { type: 'divider', label: 'Settings' },
    { path: '/rooms', label: 'Rooms', icon: MdMeetingRoom },
    { path: '/tax-settings', label: 'Tax Settings', icon: MdSettings },
];

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(true);
    const toggle = () => {
        setIsDark(p => !p);
        document.documentElement.setAttribute('data-theme', !isDark ? 'dark' : 'light');
    };
    return (
        <ThemeContext.Provider value={{ isDark, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { isDark, toggle } = useTheme();
    const location = useLocation();

    const currentPage = NAV_ITEMS.find(n => n.path === location.pathname);

    return (
        <div className="layout">
            {/* Mobile overlay */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    {!collapsed && (
                        <div className="brand">
                            <div className="brand-icon">JJ</div>
                            <div className="brand-text">
                                <span className="brand-name">JamJam</span>
                                <span className="brand-sub">Web Admin</span>
                            </div>
                        </div>
                    )}
                    {collapsed && <div className="brand-icon small">JJ</div>}
                    <button className="close-btn mobile-only" onClick={() => setSidebarOpen(false)}>
                        <MdClose size={22} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((item, i) => {
                        if (item.type === 'divider') {
                            return !collapsed ? (
                                <div key={i} className="nav-divider">
                                    <span>{item.label}</span>
                                </div>
                            ) : <div key={i} className="nav-divider-line" />;
                        }
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon size={20} className="nav-icon" />
                                {!collapsed && <span className="nav-label">{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button className="theme-toggle" onClick={toggle} title={isDark ? 'Light Mode' : 'Dark Mode'}>
                        {isDark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
                        {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>
                    <button className="collapse-btn desktop-only" onClick={() => setCollapsed(c => !c)}>
                        {collapsed ? <MdKeyboardArrowRight size={18} /> : <MdKeyboardArrowLeft size={18} />}
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <main className={`main-content ${collapsed ? 'expanded' : ''}`}>
                <header className="top-header">
                    <button className="hamburger mobile-only" onClick={() => setSidebarOpen(true)}>
                        <MdMenu size={24} />
                    </button>
                    <div className="header-title">
                        <h1>{currentPage?.label || 'JamJam Admin'}</h1>
                    </div>
                    <div className="header-right">
                        <div className="live-badge">
                            <span className="live-dot" />
                            <span>LIVE</span>
                        </div>
                    </div>
                </header>
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
