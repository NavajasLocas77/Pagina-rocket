import React, { useState, useMemo } from 'react';
import itemsData from '../data/items.json';
import { Package, Search, MapPin, Tag, Sparkles } from 'lucide-react';

export default function ItemsView({ initialSearch = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set();
    itemsData.forEach(it => {
      if (it.category) set.add(it.category);
    });
    return ['all', ...Array.from(set)];
  }, []);

  const filteredItems = useMemo(() => {
    return itemsData.filter(it => {
      if (selectedCategory !== 'all' && it.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mName = it.name.toLowerCase().includes(q);
        const mLoc = it.location_and_method.toLowerCase().includes(q);
        const mCat = it.category.toLowerCase().includes(q);
        if (!mName && !mLoc && !mCat) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Package size={26} color="#10b981" />
          <span>OBJETOS, TIENDAS Y MÉTODOS DE OBTENCIÓN (401 OBJETOS)</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#8f94ad' }}>
          Catálogo completo de piedras evolutivas, objetos competitivos, potenciadores, tablas elementales de Arceus, discos, todas las MTs y Megapiedras oficiales y nuevas.
        </p>

        {/* Search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={16} color="#8a8fa6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por objeto (Piedra Agua, Chaleco Asalto, MT32, Restos...)"
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

        {/* Categories Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
          {categories.map((c, ci) => (
            <button
              key={ci}
              onClick={() => setSelectedCategory(c)}
              className={`filter-chip ${selectedCategory === c ? 'active' : ''}`}
            >
              {c === 'all' ? 'Todas las Categorías' : c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '14px', fontSize: '0.8rem', color: '#7e839c' }}>
        Mostrando <strong style={{ color: '#fff' }}>{filteredItems.length}</strong> objetos registrados
      </div>

      {/* Grid of Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
        {filteredItems.map((item, idx) => (
          <div 
            key={idx}
            className="rocket-card"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>
                  {item.name}
                </h3>
                <span style={{ fontSize: '0.66rem', padding: '1px 6px', borderRadius: '4px', background: '#1c1f30', color: '#8ec5fc', border: '1px solid #283a54' }}>
                  {item.category}
                </span>
              </div>

              <div style={{ background: '#11121c', border: '1px solid #1f2130', borderRadius: '6px', padding: '10px 12px', fontSize: '0.82rem', color: '#cbd0e6', lineHeight: 1.5 }}>
                <div style={{ fontSize: '0.68rem', color: '#10b981', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} /> Dónde y Cómo Conseguirlo:
                </div>
                {item.location_and_method}
              </div>
            </div>

            <div style={{ marginTop: '10px', borderTop: '1px solid #1c1e2b', paddingTop: '6px', fontSize: '0.66rem', color: '#5f647d', textAlign: 'right' }}>
              Fuente: {item.source.file} (Línea {item.source.line})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
