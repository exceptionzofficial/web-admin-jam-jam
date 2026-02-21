import React from 'react';
import { MdLocalBar } from 'react-icons/md';
import CrudPage from '../components/CrudPage';
import { getBarItems, createBarItem, updateBarItem, deleteBarItem } from '../services/api';

const CATEGORIES = ['Whiskey', 'Beer', 'Wine', 'Cocktails', 'Vodka', 'Gin', 'Rum', 'Brandy', 'Snacks'];

export default function BarManagement() {
    return (
        <CrudPage
            title="Bar"
            icon={MdLocalBar}
            color="#A855F7"
            fetchFn={getBarItems}
            createFn={createBarItem}
            updateFn={updateBarItem}
            deleteFn={deleteBarItem}
            idKey="itemId"
            fields={[
                { key: 'name', label: 'Item Name', required: true, placeholder: 'e.g. Royal Stag' },
                { key: 'category', label: 'Category', type: 'select', options: CATEGORIES, required: true },
                { key: 'price', label: 'Price (₹)', type: 'number', required: true },
                { key: 'bottlePrice', label: 'Bottle Price (₹)', type: 'number' },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            displayName={(item) => item.name}
            displayPrice={(item) => item.price}
            displayDesc={(item) => item.bottlePrice ? `Bottle: ₹${item.bottlePrice}` : item.description}
            displayTags={(item) => [{ label: item.category || 'Bar', color: '#A855F7' }]}
        />
    );
}
