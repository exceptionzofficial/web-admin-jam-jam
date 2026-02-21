import React from 'react';
import { MdLocalDrink } from 'react-icons/md';
import CrudPage from '../components/CrudPage';
import { getJuiceItems, createJuiceItem, updateJuiceItem, deleteJuiceItem } from '../services/api';

const CATEGORIES = ['Fresh Juice', 'Smoothies', 'Milkshakes', 'Mocktails', 'Lassi', 'Other'];

export default function JuiceManagement() {
    return (
        <CrudPage
            title="Juice Bar"
            icon={MdLocalDrink}
            color="#22C55E"
            fetchFn={getJuiceItems}
            createFn={createJuiceItem}
            updateFn={updateJuiceItem}
            deleteFn={deleteJuiceItem}
            idKey="itemId"
            fields={[
                { key: 'name', label: 'Item Name', required: true, placeholder: 'e.g. Mango Smoothie' },
                { key: 'category', label: 'Category', type: 'select', options: CATEGORIES },
                { key: 'price', label: 'Price (₹)', type: 'number', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            displayName={(item) => item.name}
            displayPrice={(item) => item.price}
            displayDesc={(item) => item.description}
            displayTags={(item) => [{ label: item.category || 'Juice', color: '#22C55E' }]}
        />
    );
}
