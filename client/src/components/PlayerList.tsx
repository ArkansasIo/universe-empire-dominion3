import React, { useEffect, useState } from 'react';
import { triggerDataRefresh } from './GameLoop';
import { Player } from './xenoberage-types';
import { getPlayers } from './xenoberage-api';

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch players
  const fetchPlayers = () => {
    setLoading(true);
    getPlayers()
      .then(setPlayers)
      .catch((err) => setError(err.message || 'Failed to load players'))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchPlayers();
    const handler = () => fetchPlayers();
    window.addEventListener('game-data-refresh', handler);
    return () => window.removeEventListener('game-data-refresh', handler);
  }, []);

  if (loading) return <div>Loading players...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} (Score: {player.score})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
