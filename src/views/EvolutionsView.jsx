import React, { useState } from 'react';
import evolutionsData from '../data/evolutions.json';
import { getPokemonSprite } from '../utils/pokemon';
import { RefreshCw, Search, ArrowRight, Sparkles } from 'lucide-react';

export default function EvolutionsView({ onSelectPokemon }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = evolutionsData.filter(e => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return e.from.toLowerCase().includes(q) || 
           e.to.toLowerCase().includes(q) || 
           e.method.toLowerCase().includes(q);
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <RefreshCw size={26} color="#38bdf8" />
          <span>MÉTODOS DE EVOLUCIÓN MODIFICADOS (129 ENTRADAS)</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#8f94ad' }}>
          <strong>Nota de los archivos:</strong> Los Pokémon que no aparezcan en esta lista mantienen su método de evolución similar a los juegos oficiales. Todos los intercambios y formas regionales han sido adaptados para juego individual (Piedra Sagrada, Piedra Link, niveles).
        </p>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '400px', marginTop: '16px' }}>
          <Search size={16} color="#8a8fa6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por Pokémon origen, evolución o método..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '38px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '14px', fontSize: '0.8rem', color: '#7e839c' }}>
        Mostrando <strong style={{ color: '#fff' }}>{filtered.length}</strong> métodos de evolución documentados
      </div>

      {/* Grid of Evolutions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
        {filtered.map((item, idx) => (
          <div 
            key={idx}
            className="rocket-card"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={getPokemonSprite(item.from)} 
                alt={item.from} 
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <button
                  onClick={() => onSelectPokemon(item.from)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left', display: 'block' }}
                  className="hover:text-[#38bdf8]"
                >
                  {item.from}
                </button>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: '600' }}>
                  ➜ {item.to}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', maxWidth: '140px' }}>
              <span style={{ 
                fontSize: '0.74rem', 
                background: '#192533', 
                border: '1px solid #234360', 
                color: '#7dd3fc', 
                padding: '4px 8px', 
                borderRadius: '6px',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                {item.method}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
