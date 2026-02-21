import React from 'react';
import { MdSpa } from 'react-icons/md';
import CrudPage from '../components/CrudPage';
import { getMassageItems, createMassageItem, updateMassageItem, deleteMassageItem } from '../services/api';

const CATEGORIES = ['Swedish', 'Deep Tissue', 'Hot Stone', 'Aromatherapy', 'Head Massage', 'Foot Reflexology', 'Full Body', 'Other'];

export default function MassageManagement() {
    return (
        <CrudPage
            title="Massage"
            icon={MdSpa}
            color="#06B6D4"
            fetchFn={getMassageItems}
            createFn={createMassageItem}
            updateFn={updateMassageItem}
            deleteFn={deleteMassageItem}
            idKey="itemId"
            fields={[
                { key: 'name', label: 'Service Name', required: true, placeholder: 'e.g. Full Body Massage' },
                { key: 'category', label: 'Category', type: 'select', options: CATEGORIES },
                { key: 'price', label: 'Price (₹)', type: 'number', required: true },
                { key: 'duration', label: 'Duration (min)', type: 'number' },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            displayName={(item) => item.name}
            displayPrice={(item) => item.price}
            displayDesc={(item) => item.duration ? `${item.duration} min` + (item.description ? ` • ${item.description}` : '') : item.description}
            displayTags={(item) => [{ label: item.category || 'Massage', color: '#06B6D4' }]}
        />
    );
}
