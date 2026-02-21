import React from 'react';
import { MdSportsEsports } from 'react-icons/md';
import CrudPage from '../components/CrudPage';
import { getGames, createGame, updateGame, deleteGame } from '../services/api';

export default function GamesManagement() {
    return (
        <CrudPage
            title="Games"
            icon={MdSportsEsports}
            color="#8B5CF6"
            fetchFn={getGames}
            createFn={createGame}
            updateFn={updateGame}
            deleteFn={deleteGame}
            idKey="gameId"
            fields={[
                { key: 'name', label: 'Game Name', required: true, placeholder: 'e.g. Table Tennis' },
                { key: 'rate', label: 'Rate (₹)', type: 'number', required: true },
                { key: 'coins', label: 'Coins', placeholder: 'e.g. 10 or -' },
                { key: 'minutes', label: 'Duration (min)', type: 'number' },
            ]}
            displayName={(item) => item.name}
            displayPrice={(item) => item.rate}
            displayDesc={(item) => item.minutes ? `${item.minutes} minutes${item.coins && item.coins !== '-' ? ` • ${item.coins} coins` : ''}` : item.coins && item.coins !== '-' ? `${item.coins} coins` : null}
            displayTags={(item) => [{ label: 'Game', color: '#8B5CF6' }]}
        />
    );
}
