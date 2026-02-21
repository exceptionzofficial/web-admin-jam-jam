import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout, { ThemeProvider } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Expenses from './pages/Expenses';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import MenuManagement from './pages/MenuManagement';
import GamesManagement from './pages/GamesManagement';
import BarManagement from './pages/BarManagement';
import BakeryManagement from './pages/BakeryManagement';
import JuiceManagement from './pages/JuiceManagement';
import MassageManagement from './pages/MassageManagement';
import PoolManagement from './pages/PoolManagement';
import RoomsManagement from './pages/RoomsManagement';
import TaxSettings from './pages/TaxSettings';
import './pages/Pages.css';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/games" element={<GamesManagement />} />
            <Route path="/bar" element={<BarManagement />} />
            <Route path="/bakery" element={<BakeryManagement />} />
            <Route path="/juice" element={<JuiceManagement />} />
            <Route path="/massage" element={<MassageManagement />} />
            <Route path="/pool" element={<PoolManagement />} />
            <Route path="/rooms" element={<RoomsManagement />} />
            <Route path="/tax-settings" element={<TaxSettings />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}
