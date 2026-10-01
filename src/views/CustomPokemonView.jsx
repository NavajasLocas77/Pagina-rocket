import React, { useState } from 'react';
import customPkmnData from '../data/custom_pokemon.json';
import { getPokemonSprite } from '../utils/pokemon';
import { Dna, Search, Sparkles, Shield, Zap, Info } from 'lucide-react';

export default function CustomPokemonView({ onSelectPokemon }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Todas las Formas (79)' },
    { id: 'Experimento Rocket', label: 'Experimentos Rocket (Prototipos)' },
    { id: 'Fuerte Vínculo', label: 'Fuertes Vínculo' },
    { id: 'Megaevolución Inédita', label: 'Nuevas Megaevoluciones' },
    { id: 'Forma Primigenia / Beta 97', label: 'Primigenios & Beta Spaceworld 97' }
  ];

  const filtered = customPkmnData.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const mName = item.name.toLowerCase().includes(q);
      const mType = item.type.toLowerCase().includes(q);
      const mHab = item.ability.toLowerCase().includes(q);
      if (!mName && !mType && !mHab) return false;
    }
    return true;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Dna size={26} color="#e53935" />
          <span>FORMAS ROCKET, FUERTE VÍNCULO, MEGAS Y PRIMIGENIOS</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#8f94ad' }}>
          Dossier confidencial del Team Rocket con las 79 modificaciones genéticas, prototipos, lazos de vínculo, betas de Spaceworld 1997 y despertares primigenios.
        </p>

        {/* Search & Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search size={16} color="#8a8fa6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por nombre, tipo o habilidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`filter-chip ${selectedCategory === c.id ? 'active' : ''}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Custom Pokemon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {filtered.map((item, idx) => (
          <div 
            key={idx}
            className="rocket-panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(229, 57, 53, 0.3)',
              background: 'linear-gradient(180deg, #161726 0%, #11121c 100%)'
            }}
          >
            <div>
              {/* Header: Sprite, Name, Category Badge */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '60px', height: '60px', background: '#1c1e30', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2f334d' }}>
                  <img
                    src={getPokemonSprite(item.name)}
                    alt={item.name}
                    style={{ width: '52px', height: '52px', objectFit: 'contain' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(229, 57, 53, 0.15)', border: '1px solid rgba(229, 57, 53, 0.4)', color: '#ff7b7b', fontWeight: '700' }}>
                    {item.category}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', margin: '4px 0 2px' }}>
                    {item.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#8a8fa7' }}>
                    Tipo: <strong style={{ color: '#fff' }}>{item.type}</strong>
                  </div>
                </div>
              </div>

              {/* Stats Breakdown Box */}
              <div style={{ background: '#0e0f17', border: '1px solid #1f2130', borderRadius: '6px', padding: '10px 12px', marginBottom: '10px', fontSize: '0.75rem', fontFamily: 'JetBrains Mono', color: '#cbd0e6' }}>
                <div style={{ fontSize: '0.68rem', color: '#e53935', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px', fontFamily: 'Inter' }}>
                  Comparativa de Estadísticas Base:
                </div>
                {item.stats_breakdown.map((sb, sbi) => (
                  <div key={sbi} style={{ padding: '2px 0', borderBottom: sbi < item.stats_breakdown.length - 1 ? '1px dashed #1a1b29' : 'none' }}>
                    {sb}
                  </div>
                ))}
              </div>

              {/* Ability & Lore */}
              <div style={{ fontSize: '0.78rem', color: '#9da2bd', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>
                  ⚡ <strong>Habilidad:</strong> <span style={{ color: '#4ade80', fontWeight: '600' }}>{item.ability}</span>
                </div>
                {item.notes && (
                  <div style={{ background: '#171926', padding: '6px 8px', borderRadius: '4px', color: '#a0a5be', fontSize: '0.74rem', borderLeft: '2px solid #e53935' }}>
                    {item.notes}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '12px', borderTop: '1px solid #202235', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#686d87' }}>{item.category_description}</span>
              <button
                onClick={() => onSelectPokemon(item.name.split('-')[0])}
                style={{ background: 'transparent', border: 'none', color: '#e53935', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer' }}
                className="hover:underline"
              >
                Ver en Pokédex →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
