import React from 'react';
import { MdCake } from 'react-icons/md';
import CrudPage from '../components/CrudPage';
import { getBakeryItems, createBakeryItem, updateBakeryItem, deleteBakeryItem } from '../services/api';

const CATEGORIES = ['Cakes', 'Pastries', 'Cookies', 'Bread', 'Donuts', 'Muffins', 'Brownies', 'Other'];

export default function BakeryManagement() {
    return (
        <CrudPage
            title="Bakery"
            icon={MdCake}
            color="#EC4899"
            fetchFn={getBakeryItems}
            createFn={createBakeryItem}
            updateFn={updateBakeryItem}
            deleteFn={deleteBakeryItem}
            idKey="itemId"
            fields={[
                { key: 'name', label: 'Item Name', required: true, placeholder: 'e.g. Chocolate Cake' },
                { key: 'category', label: 'Category', type: 'select', options: CATEGORIES },
                { key: 'price', label: 'Price (₹)', type: 'number', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            displayName={(item) => item.name}
            displayPrice={(item) => item.price}
            displayDesc={(item) => item.description}
            displayTags={(item) => [{ label: item.category || 'Bakery', color: '#EC4899' }]}
        />
    );
}
