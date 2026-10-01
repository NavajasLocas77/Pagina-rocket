import React, { useState, useMemo } from 'react';
import pokemonData from '../data/pokemon.json';
import statChangesData from '../data/stat_changes.json';
import customPkmnData from '../data/custom_pokemon.json';
import evolutionsData from '../data/evolutions.json';
import { getPokemonSprite } from '../utils/pokemon';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Dna, 
  Zap, 
  RefreshCw, 
  Sparkles, 
  MapPin, 
  Tag, 
  ExternalLink 
} from 'lucide-react';

export default function PokedexView({ 
  onSelectPokemon, 
  onSelectMove, 
  onSelectItem, 
  initialSearch = '' 
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const tags = [
    { id: 'all', label: 'Todos (978)' },
    { id: 'Regalo', label: 'Regalos / NPC' },
    { id: 'Salvaje', label: 'Salvajes' },
    { id: 'Evolución', label: 'Evolución' },
    { id: 'Misión Secundaria', label: 'Secundarias' },
    { id: 'Robado / Historia', label: 'Robados / Historia' },
    { id: 'Fósil', label: 'Fósiles' },
    { id: 'Legendario / Especial', label: 'Legendarios / Formas Rocket' }
  ];

  // Fast index lookup for changes, custom, evolutions
  const statChangesMap = useMemo(() => {
    const map = {};
    statChangesData.forEach(s => {
      map[s.name.toUpperCase()] = s;
    });
    return map;
  }, []);

  const customMap = useMemo(() => {
    const map = {};
    customPkmnData.forEach(c => {
      map[c.name.toUpperCase()] = c;
    });
    return map;
  }, []);

  const evoMap = useMemo(() => {
    const map = {};
    evolutionsData.forEach(e => {
      map[e.from.toUpperCase()] = e;
    });
    return map;
  }, []);

  const filteredPokemon = useMemo(() => {
    return pokemonData.filter(p => {
      if (selectedTag !== 'all' && !p.tags.includes(selectedTag)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mName = p.name.toLowerCase().includes(q);
        const mMethod = p.method.toLowerCase().includes(q);
        const mNum = p.dex_num && p.dex_num.toString() === q;
        if (!mName && !mMethod && !mNum) return false;
      }
      return true;
    });
  }, [selectedTag, searchQuery]);

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <BookOpen size={26} color="#a855f7" />
          <span>POKÉDEX Y GUÍA DE OBTENCIÓN (978 POKÉMON)</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#8f94ad' }}>
          Escribe el nombre de cualquier Pokémon para saber de inmediato <strong>dónde conseguirlo</strong>, si es regalado, salvaje, robado, de casino o fósil.
        </p>

        {/* Search bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 320px', position: 'relative' }}>
            <Search size={16} color="#8a8fa6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="¿Dónde consigo a...? Escribe Pikachu, Charmander, Mewtwo, Larvitar, 150..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '38px', fontSize: '0.95rem' }}
            />
          </div>

          {/* Quick Clear */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: '#25283c', border: '1px solid #363a54', color: '#cbd0e6', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>

        {/* Category Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {tags.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTag(t.id)}
              className={`filter-chip ${selectedTag === t.id ? 'active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '14px', fontSize: '0.8rem', color: '#7c819a' }}>
        Mostrando <strong style={{ color: '#fff' }}>{filteredPokemon.length}</strong> Pokémon encontrados en los archivos
      </div>

      {/* Grid of Pokemon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '14px' }}>
        {filteredPokemon.map((pkmn) => {
          const nameUpper = pkmn.name.toUpperCase();
          const statMod = statChangesMap[nameUpper];
          const customMod = customMap[nameUpper];
          const evoMod = evoMap[nameUpper];

          return (
            <div 
              key={pkmn.dex_num ? `p-${pkmn.dex_num}` : `p-${pkmn.name}`}
              className="rocket-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: (statMod || customMod) ? '1px solid rgba(229, 57, 53, 0.4)' : '1px solid #232538',
                background: (statMod || customMod) ? 'linear-gradient(180deg, #161726 0%, #12131d 100%)' : '#141521'
              }}
            >
              <div>
                {/* Header: Sprite, Dex#, Name, Tags */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ width: '64px', height: '64px', background: '#1c1e2e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #282a40' }}>
                    <img
                      src={getPokemonSprite(pkmn.name, pkmn.dex_num)}
                      alt={pkmn.name}
                      style={{ width: '56px', height: '56px', objectFit: 'contain' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: 'Chakra Petch', fontWeight: '800', color: '#888ea4', fontSize: '0.8rem' }}>
                        {pkmn.dex_num ? `#${String(pkmn.dex_num).padStart(3, '0')}` : 'FORMA ESPECIAL'}
                      </span>

                      {/* Custom/Buff Badges */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {statMod && (
                          <span style={{ fontSize: '0.65rem', background: '#3b1c1c', border: '1px solid #852d2d', color: '#f87171', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                            STATS BUFF
                          </span>
                        )}
                        {customMod && (
                          <span style={{ fontSize: '0.65rem', background: '#2c193b', border: '1px solid #6b21a8', color: '#c084fc', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                            {customMod.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', margin: '2px 0 4px', lineHeight: 1.2 }}>
                      {pkmn.name}
                    </h3>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {pkmn.tags.map((t, ti) => (
                        <span key={ti} style={{ fontSize: '0.66rem', background: '#1e2133', color: '#9da2be', padding: '1px 6px', borderRadius: '3px' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Acquisition Method Box */}
                <div style={{ background: '#10111a', border: '1px solid #1f2130', borderRadius: '6px', padding: '10px 12px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#e53935', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={11} /> Método de Obtención:
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#dde1f5', lineHeight: 1.5 }}>
                    {pkmn.method}
                  </div>
                </div>

                {/* Evolution Alteration if present */}
                {evoMod && (
                  <div style={{ background: '#161924', border: '1px solid #233446', borderRadius: '6px', padding: '8px 10px', marginBottom: '8px', fontSize: '0.76rem', color: '#7dd3fc' }}>
                    <span style={{ fontWeight: '700' }}>🔄 Evolución modificada:</span> {evoMod.method}
                  </div>
                )}

                {/* Custom Form / Stat Breakdown if present */}
                {(statMod || customMod) && (
                  <div style={{ background: '#181924', border: '1px solid #2f334d', borderRadius: '6px', padding: '8px 10px', fontSize: '0.74rem' }}>
                    {statMod && (
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ color: '#ff6b6b', fontWeight: '700' }}>⚡ Ajustes de Estadísticas:</div>
                        {statMod.official && <div style={{ color: '#888d9f' }}>Oficial: {statMod.official}</div>}
                        {statMod.hackrom && <div style={{ color: '#4ade80', fontWeight: '600' }}>Hackrom: {statMod.hackrom}</div>}
                        {statMod.type && <div style={{ color: '#cbd0e6' }}>Tipo: <strong>{statMod.type}</strong></div>}
                        {statMod.ability && <div style={{ color: '#cbd0e6' }}>Habilidad: <strong>{statMod.ability}</strong></div>}
                      </div>
                    )}
                    {customMod && (
                      <div>
                        <div style={{ color: '#c084fc', fontWeight: '700' }}>🧬 {customMod.category}:</div>
                        {customMod.stats_breakdown.map((sb, sbi) => (
                          <div key={sbi} style={{ color: '#cbd0e6' }}>{sb}</div>
                        ))}
                        {customMod.type && <div style={{ color: '#cbd0e6' }}>Tipo: <strong>{customMod.type}</strong></div>}
                        {customMod.ability && <div style={{ color: '#cbd0e6' }}>Habilidad: <strong>{customMod.ability}</strong></div>}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Source traceability */}
              <div style={{ marginTop: '10px', borderTop: '1px solid #1c1e2b', paddingTop: '6px', fontSize: '0.66rem', color: '#5f647d', textAlign: 'right' }}>
                Línea {pkmn.line} en OBTENCIÓN TODOS PKMN.txt
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
