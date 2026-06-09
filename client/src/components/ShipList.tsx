import React, { useEffect, useState } from 'react';
import type { Sector, Ship } from '@shared/types';
import { triggerDataRefresh } from './GameLoop';

const ShipList: React.FC = () => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [moving, setMoving] = useState<string | null>(null);
  const [moveTarget, setMoveTarget] = useState<Record<string, string>>({});

  const fetchShips = () => {
    fetch('/api/ships')
      .then((res) => res.json())
      .then((data: Ship[]) => setShips(Array.isArray(data) ? data : []));
  };

  const fetchSectors = () => {
    fetch('/api/universe')
      .then((res) => res.json())
      .then((data: Record<string, Sector> | Sector[]) => {
        setSectors(Array.isArray(data) ? data : Object.values(data || {}));
      });
  };

  const moveShip = (shipId: string) => {
    const targetSector = moveTarget[shipId];
    if (!targetSector) return;

    setMoving(shipId);
    fetch(`/api/ships/${shipId}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectorId: targetSector }),
    })
      .then(() => {
        fetchShips();
        triggerDataRefresh();
      })
      .finally(() => setMoving(null));
  };

  useEffect(() => {
    fetchShips();
    fetchSectors();
    const handler = () => {
      fetchShips();
      fetchSectors();
    };
    window.addEventListener('game-data-refresh', handler);
    return () => window.removeEventListener('game-data-refresh', handler);
  }, []);

  return (
    <div>
      <h2>Ships</h2>
      <ul>
        {ships.map((ship) => (
          <li key={ship.id}>
            {ship.type} (Owner: {ship.ownerId}) - Location: {ship.sectorId}
            <select
              value={moveTarget[ship.id] || ''}
              onChange={(event) => setMoveTarget({ ...moveTarget, [ship.id]: event.target.value })}
              disabled={moving === ship.id}
            >
              <option value="">Select sector</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.id}
                </option>
              ))}
            </select>
            <button disabled={moving === ship.id || !moveTarget[ship.id]} onClick={() => moveShip(ship.id)}>
              {moving === ship.id ? 'Moving...' : 'Move'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShipList;
