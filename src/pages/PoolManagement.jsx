import React from 'react';
import { MdPool } from 'react-icons/md';
import CrudPage from '../components/CrudPage';
import { getPoolTypes, createPoolType, updatePoolType, deletePoolType } from '../services/api';

export default function PoolManagement() {
    return (
        <CrudPage
            title="Pool"
            icon={MdPool}
            color="#3B82F6"
            fetchFn={getPoolTypes}
            createFn={createPoolType}
            updateFn={updatePoolType}
            deleteFn={deletePoolType}
            idKey="typeId"
            fields={[
                { key: 'name', label: 'Pool Type Name', required: true, placeholder: 'e.g. Adult Pool (1 hour)' },
                { key: 'price', label: 'Price (₹)', type: 'number', required: true },
                { key: 'duration', label: 'Duration (min)', type: 'number' },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            displayName={(item) => item.name}
            displayPrice={(item) => item.price}
            displayDesc={(item) => item.duration ? `${item.duration} min` : item.description}
            displayTags={(item) => [{ label: 'Pool', color: '#3B82F6' }]}
        />
    );
}
