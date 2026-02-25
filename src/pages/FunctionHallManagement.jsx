import React from 'react';
import { MdOutlineMeetingRoom } from 'react-icons/md';
import CrudPage from '../components/CrudPage';
import { getFunctionHalls, createFunctionHall, updateFunctionHall, deleteFunctionHall } from '../services/api';

export default function FunctionHallManagement() {
    return (
        <CrudPage
            title="Function Halls"
            icon={MdOutlineMeetingRoom}
            color="#EC4899"
            fetchFn={getFunctionHalls}
            createFn={createFunctionHall}
            updateFn={updateFunctionHall}
            deleteFn={deleteFunctionHall}
            idKey="hallId"
            fields={[
                { key: 'name', label: 'Hall Name', required: true, placeholder: 'e.g. Grand Ballroom' },
                { key: 'capacity', label: 'Capacity (Guests)', type: 'number', required: true },
                { key: 'pricePerHour', label: 'Price/Hour (₹)', type: 'number', required: true },
                { key: 'pricePerDay', label: 'Price/Day (₹)', type: 'number', required: true },
                { key: 'amenities', label: 'Amenities (comma separated)', placeholder: 'e.g. AC, Sound System, Stage' },
                { key: 'icon', label: 'Icon Name', placeholder: 'e.g. castle, diamond-stone, flower' },
            ]}
            displayName={(item) => item.name}
            displayPrice={(item) => item.pricePerHour}
            displayDesc={(item) => `${item.capacity} Guests • ₹${item.pricePerDay}/day`}
            displayTags={(item) => [
                { label: 'Venue', color: '#EC4899' },
                { label: item.available ? 'Available' : 'Booked', color: item.available ? '#10B981' : '#EF4444' }
            ]}
        />
    );
}
