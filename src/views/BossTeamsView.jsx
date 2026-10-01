import React, { useState } from 'react';
import bossesData from '../data/bosses.json';
import { getPokemonSprite } from '../utils/pokemon';
import { Users, Search, MapPin, Zap } from 'lucide-react';

export default function BossTeamsView({ onSelectPokemon, onSelectMove, onSelectItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const filtered = bossesData.filter(boss => {
    if (selectedRegion !== 'all' && !boss.region.includes(selectedRegion)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchBoss = boss.title.toLowerCase().includes(q) || boss.location.toLowerCase().includes(q);
      const matchPkmn = boss.team.some(p => p.name.toLowerCase().includes(q) || p.moves.some(m => m.toLowerCase().includes(q)));
      if (!matchBoss && !matchPkmn) return false;
    }
    return true;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Users size={26} color="#e53935" />
          <span>VISUALIZADOR RÁPIDO DE EQUIPOS RIVALES</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#8f94ad' }}>
          Consulta visual inmediata de los 200 equipos contrarios, organizados por orden cronológico y región.
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <Search size={16} color="#8a8fa6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Filtrar por jefe, Pokémon del equipo o movimiento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'Kanto', label: 'Kanto' },
              { id: 'Archi7', label: 'Archi7' },
              { id: 'Johto', label: 'Johto' },
              { id: 'DLC', label: 'DLC' },
              { id: 'Hoenn', label: 'Hoenn' },
              { id: 'Secundarias', label: 'Secundarias' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`filter-chip ${selectedRegion === r.id ? 'active' : ''}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Teams */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map(boss => (
          <div 
            key={boss.id} 
            className="rocket-panel"
            style={{ padding: '16px 20px', background: '#12131e' }}
          >
            {/* Header of team */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>{boss.title}</span>
                <span style={{ fontSize: '0.78rem', color: '#888d9f', marginLeft: '12px' }}>
                  📍 {boss.location} ({boss.region})
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ff6b6b', background: '#202235', padding: '2px 8px', borderRadius: '4px', fontFamily: 'Chakra Petch' }}>
                {boss.min_level ? `Nv. ${boss.min_level} - ${boss.max_level}` : 'Nivel variable'}
              </div>
            </div>

            {/* Pokémon Lineup Horizontal */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
              {boss.team.map((pkmn, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: '#161826',
                    border: '1px solid #26293d',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <img 
                      src={getPokemonSprite(pkmn.name)} 
                      alt={pkmn.name}
                      style={{ width: '38px', height: '38px', objectFit: 'contain' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <button
                        onClick={() => onSelectPokemon(pkmn.name)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          padding: 0,
                          textAlign: 'left',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block',
                          maxWidth: '100px'
                        }}
                        className="hover:text-[#e53935]"
                      >
                        {pkmn.name}
                      </button>
                      <div style={{ fontSize: '0.72rem', color: '#ff5c5c', fontWeight: '700', fontFamily: 'Chakra Petch' }}>
                        Nv. {pkmn.level}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.68rem', color: '#8d92a8', marginBottom: '6px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Item: <strong style={{ color: '#cbd0e6' }}>{pkmn.item}</strong>
                    </div>
                    <div>Nat: <strong style={{ color: '#cbd0e6' }}>{pkmn.nature}</strong></div>
                  </div>

                  {/* Moves pill stack */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {pkmn.moves.map((m, mIdx) => (
                      <button
                        key={mIdx}
                        onClick={() => onSelectMove(m)}
                        style={{
                          background: '#1d1f30',
                          border: '1px solid #2d3045',
                          borderRadius: '3px',
                          padding: '2px 5px',
                          textAlign: 'left',
                          fontSize: '0.66rem',
                          color: '#dde1f5',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        className="hover:border-[#e53935]"
                        title="Clic para ver detalles del movimiento"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
