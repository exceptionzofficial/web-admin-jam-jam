// Web Admin API Service – JamJam Resort
const API_BASE_URL = 'https://jamjambackendsettlo.vercel.app/api';

const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'API request failed');
    return data;
};

// ===== ADMIN DASHBOARD =====
export const getDashboardStats = () => apiCall('/admin/dashboard');

export const getAllOrders = (startDate, endDate, service = 'all') => {
    let url = '/admin/orders?';
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;
    if (service && service !== 'all') url += `service=${service}`;
    return apiCall(url);
};

// ===== CUSTOMERS =====
export const getCustomers = () => apiCall('/customers');
export const getCustomerById = (id) => apiCall(`/customers/${id}`);

// ===== GAMES =====
export const getGames = () => apiCall('/games');
export const createGame = (data) => apiCall('/games', { method: 'POST', body: JSON.stringify(data) });
export const updateGame = (id, data) => apiCall(`/games/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteGame = (id) => apiCall(`/games/${id}`, { method: 'DELETE' });

// ===== MENU (Restaurant) =====
export const getMenuItems = () => apiCall('/menu');
export const createMenuItem = (data) => apiCall('/menu', { method: 'POST', body: JSON.stringify(data) });
export const updateMenuItem = (id, data) => apiCall(`/menu/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMenuItem = (id) => apiCall(`/menu/${id}`, { method: 'DELETE' });

// ===== BAR =====
export const getBarItems = () => apiCall('/bar/items');
export const createBarItem = (data) => apiCall('/bar/items', { method: 'POST', body: JSON.stringify(data) });
export const updateBarItem = (id, data) => apiCall(`/bar/items/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBarItem = (id) => apiCall(`/bar/items/${id}`, { method: 'DELETE' });

// ===== BAKERY =====
export const getBakeryItems = () => apiCall('/bakery-items');
export const createBakeryItem = (data) => apiCall('/bakery-items', { method: 'POST', body: JSON.stringify(data) });
export const updateBakeryItem = (id, data) => apiCall(`/bakery-items/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBakeryItem = (id) => apiCall(`/bakery-items/${id}`, { method: 'DELETE' });

// ===== JUICE =====
export const getJuiceItems = () => apiCall('/juice-items');
export const createJuiceItem = (data) => apiCall('/juice-items', { method: 'POST', body: JSON.stringify(data) });
export const updateJuiceItem = (id, data) => apiCall(`/juice-items/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteJuiceItem = (id) => apiCall(`/juice-items/${id}`, { method: 'DELETE' });

// ===== MASSAGE =====
export const getMassageItems = () => apiCall('/massage-items');
export const createMassageItem = (data) => apiCall('/massage-items', { method: 'POST', body: JSON.stringify(data) });
export const updateMassageItem = (id, data) => apiCall(`/massage-items/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMassageItem = (id) => apiCall(`/massage-items/${id}`, { method: 'DELETE' });

// ===== POOL =====
export const getPoolTypes = () => apiCall('/pool-types');
export const createPoolType = (data) => apiCall('/pool-types', { method: 'POST', body: JSON.stringify(data) });
export const updatePoolType = (id, data) => apiCall(`/pool-types/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePoolType = (id) => apiCall(`/pool-types/${id}`, { method: 'DELETE' });

// ===== ROOMS =====
export const getRooms = () => apiCall('/rooms');
export const createRoom = (data) => apiCall('/rooms', { method: 'POST', body: JSON.stringify(data) });
export const updateRoom = (id, data) => apiCall(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteRoom = (id) => apiCall(`/rooms/${id}`, { method: 'DELETE' });

// ===== TAX SETTINGS =====
export const getTaxSettings = () => apiCall('/tax-settings');
export const updateTaxSetting = (serviceId, taxPercent) =>
    apiCall(`/tax-settings/${serviceId}`, { method: 'PUT', body: JSON.stringify({ taxPercent }) });

// ===== THEATER =====
export const getTheaterShows = () => apiCall('/theater/shows');
export const createTheaterShow = (data) => apiCall('/theater/shows', { method: 'POST', body: JSON.stringify(data) });
export const updateTheaterShow = (id, data) => apiCall(`/theater/shows/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTheaterShow = (id) => apiCall(`/theater/shows/${id}`, { method: 'DELETE' });

// ===== FUNCTION HALLS =====
export const getFunctionHalls = () => apiCall('/function-halls');
export const createFunctionHall = (data) => apiCall('/function-halls', { method: 'POST', body: JSON.stringify(data) });
export const updateFunctionHall = (id, data) => apiCall(`/function-halls/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteFunctionHall = (id) => apiCall(`/function-halls/${id}`, { method: 'DELETE' });

// ===== BOOKINGS =====
export const getBookings = () => apiCall('/bookings');
