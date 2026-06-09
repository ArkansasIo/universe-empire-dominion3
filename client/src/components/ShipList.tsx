import React, { useEffect, useState } from 'react';
import { Ship } from '../../shared/types';

import { triggerDataRefresh } from './GameLoop';

const ShipList: React.FC = () => {
  const [ships, setShips] = useState<Ship[]>([]);
  const fetchShips = () => {
    fetch('/api/ships')
      .then(res => res.json())
      .then(setShips);
  };
  useEffect(() => {
      const [sectors, setSectors] = useState<any[]>([]);
      const [moving, setMoving] = useState<string | null>(null);
      const [moveTarget, setMoveTarget] = useState<{ [shipId: string]: string }>({});

      fetchSectors = () => {
        fetch('/api/universe')
          .then(res => res.json())
          .then(data => setSectors(Object.values(data)));
      };
      const moveShip = (shipId: string) => {
        const targetSector = moveTarget[shipId];
        if (!targetSector) return;
        setMoving(shipId);
        fetch(`/api/ships/${shipId}/move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectorId: targetSector })
        })
          .then(() => {
            setMoving(null);
            triggerDataRefresh();
          });
      };
    fetchShips();
    const handler = () => fetchShips();
    window.addEventListener('game-data-refresh', handler);
    return () => window.removeEventListener('game-data-refresh', handler);
  }, []);
  return (
    <div>
      <h2>Ships</h2>
      <ul>
        {ships.map(ship => (
          <li key={ship.id}>
            {ship.type} (Owner: {ship.ownerId}) - Location: {ship.location}
            <select
              value={moveTarget[ship.id] || ''}
              onChange={e => setMoveTarget({ ...moveTarget, [ship.id]: e.target.value })}
              disabled={moving === ship.id}
            >
              <option value=''>Select sector</option>
              {sectors.map(sector => (
                <option key={sector.id} value={sector.id}>{sector.id}</option>
              ))}
            </select>
            <button
              disabled={moving === ship.id || !moveTarget[ship.id]}
              onClick={() => moveShip(ship.id)}
            >
              {moving === ship.id ? 'Moving...' : 'Move'}
            </button>
          </li>
        ))}
        {ships.map(ship => (
          <li key={ship.id}>{ship.type} (Owner: {ship.ownerId})</li>
        ))}
      </ul>
    </div>
  );
};
export default ShipList;
