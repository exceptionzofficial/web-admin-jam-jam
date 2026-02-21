import React from 'react';
import { MdMeetingRoom } from 'react-icons/md';
import CrudPage from '../components/CrudPage';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../services/api';

const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Premium', 'Family', 'Cottage'];
const STATUSES = ['available', 'occupied', 'maintenance'];

export default function RoomsManagement() {
    return (
        <CrudPage
            title="Rooms"
            icon={MdMeetingRoom}
            color="#F59E0B"
            fetchFn={getRooms}
            createFn={createRoom}
            updateFn={updateRoom}
            deleteFn={deleteRoom}
            idKey="roomId"
            fields={[
                { key: 'roomNumber', label: 'Room Number', required: true, placeholder: 'e.g. 101' },
                { key: 'name', label: 'Room Name', required: true, placeholder: 'e.g. Deluxe Sea View' },
                { key: 'type', label: 'Type', type: 'select', options: ROOM_TYPES },
                { key: 'price', label: 'Price per Night (₹)', type: 'number', required: true },
                { key: 'status', label: 'Status', type: 'select', options: STATUSES },
                { key: 'capacity', label: 'Max Guests', type: 'number' },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            displayName={(item) => `${item.roomNumber ? '#' + item.roomNumber + ' - ' : ''}${item.name}`}
            displayPrice={(item) => item.price}
            displayDesc={(item) => item.description}
            displayTags={(item) => {
                const tags = [];
                if (item.type) tags.push({ label: item.type, color: '#F59E0B' });
                if (item.status) {
                    const sc = { available: '#22C55E', occupied: '#3B82F6', maintenance: '#EF4444' };
                    tags.push({ label: item.status, color: sc[item.status] || '#64748B' });
                }
                if (item.capacity) tags.push({ label: `${item.capacity} guests`, color: '#8B5CF6' });
                return tags;
            }}
        />
    );
}
