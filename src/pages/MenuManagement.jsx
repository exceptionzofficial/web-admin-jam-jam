import React from 'react';
import { MdRestaurantMenu } from 'react-icons/md';
import CrudPage from '../components/CrudPage';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';

const CATEGORIES = ['Starters', 'Main Course', 'Biryani', 'Breads', 'Chinese', 'Desserts', 'Beverages', 'Soups', 'Salads'];
const BAR_CATEGORIES = ['whiskey', 'whisky', 'beer', 'wine', 'cocktails', 'vodka', 'gin', 'rum', 'snacks', 'brandy', 'scotch', 'liquor', 'spirit'];

export default function MenuManagement() {
    return (
        <CrudPage
            title="Restaurant Menu"
            icon={MdRestaurantMenu}
            color="#F97316"
            fetchFn={async () => {
                const items = await getMenuItems();
                return items.filter(i => !BAR_CATEGORIES.includes(i.category?.toLowerCase()));
            }}
            createFn={createMenuItem}
            updateFn={updateMenuItem}
            deleteFn={deleteMenuItem}
            idKey="itemId"
            fields={[
                { key: 'name', label: 'Item Name', required: true, placeholder: 'e.g. Butter Chicken' },
                { key: 'category', label: 'Category', type: 'select', options: CATEGORIES, required: true },
                { key: 'price', label: 'Price (₹)', type: 'number', required: true },
                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description...' },
                { key: 'isVeg', label: 'Veg/Non-Veg', type: 'select', options: ['true', 'false'] },
            ]}
            displayName={(item) => item.name}
            displayDesc={(item) => item.description}
            displayPrice={(item) => item.price}
            displayTags={(item) => [
                { label: item.category || 'Uncategorized', color: '#F97316' },
                ...(item.isVeg === 'true' || item.isVeg === true ? [{ label: '🟢 Veg', color: '#22C55E' }] : [{ label: '🔴 Non-Veg', color: '#EF4444' }]),
            ]}
        />
    );
}
