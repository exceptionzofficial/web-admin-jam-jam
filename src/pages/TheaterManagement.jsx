import React from 'react';
import { MdMovie } from 'react-icons/md';
import CrudPage from '../components/CrudPage';
import { getTheaterShows, createTheaterShow, updateTheaterShow, deleteTheaterShow } from '../services/api';

export default function TheaterManagement() {
    return (
        <CrudPage
            title="Theater Packages"
            icon={MdMovie}
            color="#8B5CF6"
            fetchFn={getTheaterShows}
            createFn={createTheaterShow}
            updateFn={updateTheaterShow}
            deleteFn={deleteTheaterShow}
            idKey="showId"
            fields={[
                { key: 'name', label: 'Show Name', required: true, placeholder: 'e.g. Magic Show' },
                { key: 'time', label: 'Show Time', required: true, placeholder: 'e.g. 11:00 AM' },
                { key: 'duration', label: 'Duration', required: true, placeholder: 'e.g. 45 min' },
                { key: 'price', label: 'Base Price (₹)', type: 'number', required: true },
                { key: 'totalSeats', label: 'Total Seats', type: 'number', required: true },
                { key: 'availableSeats', label: 'Available Seats', type: 'number', required: true },
                { key: 'icon', label: 'Icon Name', placeholder: 'e.g. magic-staff, music' },
            ]}
            displayName={(item) => item.name}
            displayPrice={(item) => item.price}
            displayDesc={(item) => `${item.time} • ${item.duration} • ${item.availableSeats}/${item.totalSeats} seats`}
            displayTags={(item) => [{ label: 'Theater', color: '#8B5CF6' }]}
        />
    );
}
