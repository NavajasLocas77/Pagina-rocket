import React, { useState, useMemo } from 'react';
import bossesData from '../data/bosses.json';
import { getPokemonSprite } from '../utils/pokemon';
import { 
  Skull, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Layers, 
  List, 
  Grid,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function BossesView({ 
  onSelectPokemon, 
  onSelectMove, 
  onSelectItem, 
  spoilerMode,
  completedBosses,
  toggleBossCompleted,
  initialBossId = null
}) {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [selectedBoss, setSelectedBoss] = useState(
    initialBossId ? bossesData.find(b => b.id === initialBossId) : null
  );
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  const regions = [
    { id: 'all', label: 'Todas las Regiones' },
    { id: 'T1: Kanto', label: 'T1: Kanto (44)' },
    { id: 'T2: Archi7 (Islas Sete)', label: 'T2: Archi7 (18)' },
    { id: 'T3: Johto', label: 'T3: Johto (37)' },
    { id: 'T4: DLC (Johto DLC)', label: 'T4: DLC (37)' },
    { id: 'T5: Hoenn', label: 'T5: Hoenn (28)' },
    { id: 'side', label: 'Secundarias (36)' }
  ];

  const filteredBosses = useMemo(() => {
    return bossesData.filter(boss => {
      // Region filter
      if (selectedRegion === 'side') {
        if (boss.category !== 'side') return false;
      } else if (selectedRegion !== 'all' && boss.region !== selectedRegion) {
        return false;
      }

      // Status filter
      const isDone = completedBosses.includes(boss.id);
      if (statusFilter === 'pending' && isDone) return false;
      if (statusFilter === 'completed' && !isDone) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = boss.title.toLowerCase().includes(q);
        const matchesLocation = boss.location.toLowerCase().includes(q);
        const matchesPokemon = boss.team.some(p => p.name.toLowerCase().includes(q));
        const matchesMoves = boss.team.some(p => p.moves.some(m => m.toLowerCase().includes(q)));
        if (!matchesTitle && !matchesLocation && !matchesPokemon && !matchesMoves) return false;
      }

      return true;
    });
  }, [selectedRegion, searchQuery, statusFilter, completedBosses]);

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Top Title & Filters Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Skull size={26} color="#e53935" />
              <span>JEFES Y COMBATES DESTACADOS</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#9095ae' }}>
              {bossesData.length} combates analizados y catalogados con sus equipos completos, niveles, objetos, naturalezas, IVs y EVs exactos.
            </p>
          </div>

          {/* View mode toggle */}
          <div style={{ display: 'flex', background: '#161724', border: '1px solid #282a3d', borderRadius: '8px', padding: '3px' }}>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'cards' ? '#e53935' : 'transparent',
                color: viewMode === 'cards' ? '#fff' : '#8d92ab',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
            >
              <Grid size={14} /> Fichas Detalladas
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'table' ? '#e53935' : 'transparent',
                color: viewMode === 'table' ? '#fff' : '#8d92ab',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
            >
              <List size={14} /> Tabla Resumen
            </button>
          </div>
        </div>

        {/* Search and Filters Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search size={16} color="#8e93ae" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por nombre de jefe, Pokémon, movimiento o zona..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', background: '#161724', border: '1px solid #282a3d', borderRadius: '6px', padding: '2px' }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                padding: '6px 10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                background: statusFilter === 'all' ? '#26293d' : 'transparent',
                color: statusFilter === 'all' ? '#fff' : '#7c819c'
              }}
            >
              Todos ({filteredBosses.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              style={{
                padding: '6px 10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                background: statusFilter === 'pending' ? '#26293d' : 'transparent',
                color: statusFilter === 'pending' ? '#fff' : '#7c819c'
              }}
            >
              Pendientes
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              style={{
                padding: '6px 10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                background: statusFilter === 'completed' ? '#26293d' : 'transparent',
                color: statusFilter === 'completed' ? '#22c55e' : '#7c819c'
              }}
            >
              Derrotados ({completedBosses.length})
            </button>
          </div>
        </div>

        {/* Region Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {regions.map(r => (
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

      {/* Main Content: Cards or Table */}
      {filteredBosses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#141522', borderRadius: '10px', border: '1px dashed #2b2d42' }}>
          <Skull size={40} color="#555972" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '6px' }}>No se encontraron combates de jefe</h3>
          <p style={{ fontSize: '0.85rem', color: '#878c9e' }}>Intenta ajustar los filtros de búsqueda o la región seleccionada.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (Requirement 7) */
        <div style={{ background: '#13141f', border: '1px solid var(--border-color)', borderRadius: '10px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#181926', borderBottom: '1px solid #272a3d', color: '#8f94ad', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 16px', width: '50px' }}>Estado</th>
                <th style={{ padding: '12px 16px' }}>Jefe / Combate</th>
                <th style={{ padding: '12px 16px' }}>Ubicación</th>
                <th style={{ padding: '12px 16px' }}>Región / Categoría</th>
                <th style={{ padding: '12px 16px' }}>Rango Nivel</th>
                <th style={{ padding: '12px 16px' }}>Equipo Pokémon</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredBosses.map((boss, idx) => {
                const isDone = completedBosses.includes(boss.id);
                return (
                  <tr 
                    key={boss.id} 
                    style={{ 
                      borderBottom: '1px solid #1f2130',
                      backgroundColor: isDone ? 'rgba(34, 197, 94, 0.03)' : 'transparent',
                      transition: 'background 0.15s'
                    }}
                    className="hover:bg-[#1a1c2b]"
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => toggleBossCompleted(boss.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title={isDone ? 'Marcar como pendiente' : 'Marcar como derrotado'}
                      >
                        {isDone ? <CheckCircle2 size={18} color="#22c55e" /> : <Circle size={18} color="#555a73" />}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{boss.trainer_name}</span>
                        {boss.category === 'side' && (
                          <span style={{ fontSize: '0.68rem', padding: '1px 5px', borderRadius: '4px', background: '#3b2818', color: '#fbbf24', border: '1px solid #854d0e' }}>Secundaria</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#a0a5bf' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={13} color="#e53935" />
                        <span>{boss.location}</span>
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#8e93ad' }}>
                      {boss.region}
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'Chakra Petch', fontWeight: '700', color: '#ff6b6b' }}>
                      {boss.min_level && boss.max_level ? `Nv. ${boss.min_level} - ${boss.max_level}` : 'Variable'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {boss.team.map((pkmn, pIdx) => (
                          <img
                            key={pIdx}
                            src={getPokemonSprite(pkmn.name)}
                            alt={pkmn.name}
                            title={`${pkmn.name} (Nv. ${pkmn.level})`}
                            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedBoss(boss)}
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* CARDS VIEW (Requirement 6) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredBosses.map((boss) => {
            const isDone = completedBosses.includes(boss.id);
            return (
              <div 
                key={boss.id} 
                className="rocket-panel"
                style={{ 
                  borderColor: isDone ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-color)',
                  backgroundColor: isDone ? '#10171a' : 'var(--bg-card)'
                }}
              >
                {/* Boss Card Header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', borderBottom: '1px solid #232538', paddingBottom: '14px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <button
                        onClick={() => toggleBossCompleted(boss.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        {isDone ? <CheckCircle2 size={20} color="#22c55e" /> : <Circle size={20} color="#606680" />}
                      </button>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: isDone ? '#4ade80' : '#fff', letterSpacing: '0.02em' }}>
                        {boss.title}
                      </h2>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', fontSize: '0.8rem', color: '#8f94ab', marginLeft: '30px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd0e6' }}>
                        <MapPin size={14} color="#e53935" /> {boss.location}
                      </span>
                      <span>•</span>
                      <span style={{ color: '#ff6b6b', fontWeight: '600' }}>{boss.region}</span>
                      <span>•</span>
                      <span style={{ background: '#222538', padding: '1px 8px', borderRadius: '4px', color: '#ff8a8a', fontFamily: 'Chakra Petch', fontWeight: '700' }}>
                        {boss.min_level && boss.max_level ? `Nv. ${boss.min_level} - ${boss.max_level}` : 'Nivel Variable'}
                      </span>
                      <span>•</span>
                      <span style={{ fontSize: '0.72rem', color: '#666a82' }}>Fuente: {boss.source.file}:{boss.source.line}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => toggleBossCompleted(boss.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        border: '1px solid',
                        background: isDone ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        borderColor: isDone ? '#22c55e' : '#303348',
                        color: isDone ? '#4ade80' : '#8e93ae'
                      }}
                    >
                      {isDone ? '✓ Derrotado' : 'Marcar como Derrotado'}
                    </button>
                  </div>
                </div>

                {/* Boss Team Pokémon Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {boss.team.map((pkmn, pIdx) => (
                    <div 
                      key={pIdx} 
                      style={{
                        background: '#131420',
                        border: '1px solid #232536',
                        borderRadius: '8px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      {/* Top: Sprite, Name, Level, Nature */}
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ width: '56px', height: '56px', background: '#1c1d2e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #2a2d42' }}>
                          <img
                            src={getPokemonSprite(pkmn.name)}
                            alt={pkmn.name}
                            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <button
                              onClick={() => onSelectPokemon(pkmn.name)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              className="hover:text-[#e53935]"
                            >
                              <span>{pkmn.name}</span>
                              <ExternalLink size={12} color="#8a8fa6" />
                            </button>
                            <span style={{ fontFamily: 'Chakra Petch', fontWeight: '800', color: '#ff4d4d', fontSize: '0.9rem' }}>
                              Nv. {pkmn.level || '?'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px', fontSize: '0.73rem' }}>
                            {pkmn.item && pkmn.item !== 'No item' && (
                              <button
                                onClick={() => onSelectItem(pkmn.item)}
                                style={{
                                  background: '#202336',
                                  border: '1px solid #333752',
                                  color: '#cbd0e8',
                                  borderRadius: '4px',
                                  padding: '1px 6px',
                                  cursor: 'pointer',
                                  fontSize: '0.7rem'
                                }}
                                title="Consultar objeto en la guía"
                              >
                                🎒 {pkmn.item}
                              </button>
                            )}
                            {pkmn.nature && pkmn.nature !== 'No confirmada' && (
                              <span style={{ color: '#888d9f', background: '#191b29', padding: '1px 6px', borderRadius: '4px' }}>
                                Nat: {pkmn.nature}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Moves 4-slot grid */}
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.68rem', color: '#6f748d', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em', marginBottom: '4px' }}>
                          Movimientos
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                          {pkmn.moves && pkmn.moves.length > 0 ? (
                            pkmn.moves.map((m, mIdx) => (
                              <button
                                key={mIdx}
                                onClick={() => onSelectMove(m)}
                                style={{
                                  background: '#181928',
                                  border: '1px solid #282a3d',
                                  borderRadius: '4px',
                                  padding: '4px 6px',
                                  textAlign: 'left',
                                  fontSize: '0.74rem',
                                  color: '#e2e5f5',
                                  cursor: 'pointer',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                                className="hover:border-[#e53935] hover:text-[#fff]"
                                title="Clic para ver cambios y potencia de este movimiento"
                              >
                                {m}
                              </button>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: '#60647a', fontStyle: 'italic', gridColumn: 'span 2' }}>
                              Movimientos por nivel del juego
                            </span>
                          )}
                        </div>
                      </div>

                      {/* IVs & EVs Footer */}
                      <div style={{ borderTop: '1px solid #1f2130', paddingTop: '6px', fontSize: '0.68rem', color: '#7a7f98', display: 'flex', justifyContent: 'space-between' }}>
                        <span>IVs: <strong style={{ color: '#cbd0e6' }}>{pkmn.ivs}</strong></span>
                        <span>EVs: <strong style={{ color: '#cbd0e6' }}>{pkmn.evs}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Boss Detail when clicked in Table View */}
      {selectedBoss && (
        <div className="modal-overlay" onClick={() => setSelectedBoss(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff' }}>{selectedBoss.title}</h3>
                <div style={{ fontSize: '0.8rem', color: '#8e93ae', display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span>📍 {selectedBoss.location}</span>
                  <span>•</span>
                  <span>{selectedBoss.region}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBoss(null)}
                style={{ background: 'transparent', border: 'none', color: '#8e93ae', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
                {selectedBoss.team.map((pkmn, idx) => (
                  <div key={idx} style={{ background: '#11121c', border: '1px solid #26283b', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      <img src={getPokemonSprite(pkmn.name)} alt={pkmn.name} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                      <div>
                        <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>{pkmn.name}</div>
                        <div style={{ color: '#e53935', fontWeight: '700', fontSize: '0.82rem' }}>Nv. {pkmn.level}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9da2bd', marginBottom: '8px' }}>
                      <div>Objeto: <strong>{pkmn.item}</strong></div>
                      <div>Naturaleza: <strong>{pkmn.nature}</strong></div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd0e6' }}>
                      <div style={{ color: '#7a7f98', marginBottom: '3px' }}>Movimientos:</div>
                      {pkmn.moves.map((m, mi) => (
                        <div key={mi} style={{ background: '#191b2b', padding: '3px 6px', borderRadius: '3px', margin: '2px 0' }}>• {m}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
