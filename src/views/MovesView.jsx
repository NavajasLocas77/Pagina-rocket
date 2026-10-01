import React, { useState, useMemo } from 'react';
import movesData from '../data/moves.json';
import bossesData from '../data/bosses.json';
import { Zap, Search, Shield, Flame, Swords, ExternalLink } from 'lucide-react';

export default function MovesView({ onSelectBoss, initialSearch = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Cross-reference which bosses use each move
  const movesWithBosses = useMemo(() => {
    return movesData.map(move => {
      const moveNameLower = move.name.toLowerCase().trim();
      const matchedBosses = [];

      bossesData.forEach(boss => {
        const usesMove = boss.team.some(p => 
          p.moves.some(m => m.toLowerCase().trim() === moveNameLower || m.toLowerCase().includes(moveNameLower))
        );
        if (usesMove) {
          matchedBosses.push({
            id: boss.id,
            trainer_name: boss.trainer_name,
            location: boss.location
          });
        }
      });

      return {
        ...move,
        bosses: matchedBosses
      };
    });
  }, []);

  const filteredMoves = useMemo(() => {
    if (!searchQuery.trim()) return movesWithBosses;
    const q = searchQuery.toLowerCase().trim();
    return movesWithBosses.filter(m => 
      m.name.toLowerCase().includes(q) ||
      (m.hackrom.type && m.hackrom.type.toLowerCase().includes(q)) ||
      (m.hackrom.effect && m.hackrom.effect.toLowerCase().includes(q))
    );
  }, [movesWithBosses, searchQuery]);

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Zap size={26} color="#eab308" />
          <span>ATAQUES Y MOVIMIENTOS CON CAMBIOS TÉCNICOS (47)</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#8f94ad' }}>
          Comparativa exacta oficial vs hackrom de los movimientos rebalanceados, potenciados o con efectos y tipos alterados en el juego.
        </p>

        {/* Search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={16} color="#8a8fa6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar movimiento modificado (Guillotine, Corte, Golpe Aéreo, Puya Nociva...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: '#25283c', border: '1px solid #363a54', color: '#cbd0e6', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '14px', fontSize: '0.8rem', color: '#7e839c' }}>
        Mostrando <strong style={{ color: '#fff' }}>{filteredMoves.length}</strong> movimientos modificados
      </div>

      {/* Grid of Moves */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '18px' }}>
        {filteredMoves.map((m, idx) => (
          <div 
            key={idx}
            className="rocket-panel"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                  {m.name}
                </h3>
                <span style={{ fontSize: '0.72rem', background: '#252119', color: '#fbbf24', border: '1px solid #634b1d', padding: '1px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  Hackrom: {m.hackrom.type || 'Mismo tipo'}
                </span>
              </div>

              {/* Side by side comparison table */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '0.76rem' }}>
                {/* Official column */}
                <div style={{ background: '#12131d', border: '1px solid #202234', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ color: '#7e839e', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.68rem', marginBottom: '4px' }}>
                    Oficial
                  </div>
                  <div>Tipo: <strong style={{ color: '#cbd0e6' }}>{m.official.type || 'Original'}</strong></div>
                  <div>Potencia: <strong style={{ color: '#cbd0e6' }}>{m.official.power || '-'}</strong></div>
                  <div>Precisión: <strong style={{ color: '#cbd0e6' }}>{m.official.accuracy || '-'}</strong></div>
                  <div>PP: <strong style={{ color: '#cbd0e6' }}>{m.official.pp || '-'}</strong></div>
                  <div style={{ marginTop: '4px', color: '#8e93aa', fontSize: '0.7rem' }}>
                    Efecto: {m.official.effect || 'Ninguno'}
                  </div>
                </div>

                {/* Hackrom column */}
                <div style={{ background: '#191522', border: '1px solid rgba(229, 57, 53, 0.3)', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ color: '#ff6b6b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.68rem', marginBottom: '4px' }}>
                    Team Rocket Ed.
                  </div>
                  <div>Tipo: <strong style={{ color: '#ff8a8a' }}>{m.hackrom.type || m.official.type}</strong></div>
                  <div>Potencia: <strong style={{ color: '#4ade80' }}>{m.hackrom.power || m.official.power}</strong></div>
                  <div>Precisión: <strong style={{ color: '#4ade80' }}>{m.hackrom.accuracy || m.official.accuracy}</strong></div>
                  <div>PP: <strong style={{ color: '#4ade80' }}>{m.hackrom.pp || m.official.pp}</strong></div>
                  <div style={{ marginTop: '4px', color: '#ffd6d6', fontSize: '0.7rem', fontWeight: '500' }}>
                    Efecto: {m.hackrom.effect || 'Sin cambios'}
                  </div>
                </div>
              </div>

              {/* Bosses that use this move */}
              {m.bosses.length > 0 && (
                <div style={{ background: '#11121b', border: '1px solid #1f2130', borderRadius: '6px', padding: '8px 10px', fontSize: '0.72rem' }}>
                  <div style={{ color: '#a0a5bf', fontWeight: '700', marginBottom: '4px' }}>
                    ⚔️ Jefes que lo utilizan en combate ({m.bosses.length}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {m.bosses.slice(0, 5).map(b => (
                      <button
                        key={b.id}
                        onClick={() => onSelectBoss(b.id)}
                        style={{ background: '#1c1e2e', border: '1px solid #2e314a', color: '#cbd0e6', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontSize: '0.68rem' }}
                        className="hover:border-[#e53935]"
                      >
                        {b.trainer_name}
                      </button>
                    ))}
                    {m.bosses.length > 5 && (
                      <span style={{ color: '#7a7f98', padding: '2px 4px', fontSize: '0.68rem' }}>
                        +{m.bosses.length - 5} más
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
