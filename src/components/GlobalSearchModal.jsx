import React, { useState, useEffect, useRef } from 'react';
import bossesData from '../data/bosses.json';
import pokemonData from '../data/pokemon.json';
import sidequestsData from '../data/sidequests.json';
import itemsData from '../data/items.json';
import movesData from '../data/moves.json';
import customPkmnData from '../data/custom_pokemon.json';
import { getPokemonSprite } from '../utils/pokemon';
import { Search, Skull, BookOpen, Compass, Package, Zap, Dna, ArrowRight, X } from 'lucide-react';

export default function GlobalSearchModal({ 
  isOpen, 
  onClose, 
  onNavigate 
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose ? onClose(!isOpen) : null;
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results
  let results = {
    bosses: [],
    pokemon: [],
    quests: [],
    items: [],
    moves: [],
    custom: []
  };

  if (q.length >= 2) {
    results.bosses = bossesData.filter(b => 
      b.title.toLowerCase().includes(q) || 
      b.location.toLowerCase().includes(q) ||
      b.team.some(p => p.name.toLowerCase().includes(q))
    ).slice(0, 5);

    results.pokemon = pokemonData.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.method.toLowerCase().includes(q) ||
      (p.dex_num && p.dex_num.toString() === q)
    ).slice(0, 6);

    results.quests = sidequestsData.filter(sq => 
      sq.name.toLowerCase().includes(q) || 
      sq.description.toLowerCase().includes(q) ||
      sq.rewards.pokemon.some(pk => pk.toLowerCase().includes(q))
    ).slice(0, 4);

    results.items = itemsData.filter(it => 
      it.name.toLowerCase().includes(q) || 
      it.location_and_method.toLowerCase().includes(q)
    ).slice(0, 5);

    results.moves = movesData.filter(m => 
      m.name.toLowerCase().includes(q) ||
      (m.hackrom.type && m.hackrom.type.toLowerCase().includes(q))
    ).slice(0, 4);

    results.custom = customPkmnData.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.category.toLowerCase().includes(q)
    ).slice(0, 4);
  }

  const totalResults = results.bosses.length + results.pokemon.length + results.quests.length + results.items.length + results.moves.length + results.custom.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '680px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid #26283b' }}>
          <Search size={20} color="#e53935" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por jefe, Pokémon, objeto, movimiento o misión..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '1.05rem',
              fontFamily: 'Inter'
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#888d9f', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
          {q.length < 2 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#7a7f98', fontSize: '0.88rem' }}>
              Escribe al menos 2 caracteres para buscar en toda la base de datos...
            </div>
          ) : totalResults === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#7a7f98', fontSize: '0.88rem' }}>
              No se encontraron coincidencias para "{query}".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Pokémon Results */}
              {results.pokemon.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#a855f7', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={13} /> Pokémon y Obtención ({results.pokemon.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.pokemon.map((p, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          onNavigate('pokedex', p.name);
                          onClose();
                        }}
                        style={{
                          background: '#13141f',
                          border: '1px solid #202235',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}
                        className="hover:border-[#a855f7]"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={getPokemonSprite(p.name, p.dex_num)} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                          <div>
                            <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.88rem' }}>{p.name} {p.dex_num ? `(#${p.dex_num})` : ''}</div>
                            <div style={{ fontSize: '0.75rem', color: '#8d92aa', maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.method}
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={14} color="#888da8" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bosses Results */}
              {results.bosses.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#e53935', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Skull size={13} /> Jefes y Entrenadores ({results.bosses.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.bosses.map((b, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          onNavigate('bosses', b.id);
                          onClose();
                        }}
                        style={{
                          background: '#13141f',
                          border: '1px solid #202235',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        className="hover:border-[#e53935]"
                      >
                        <div>
                          <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.88rem' }}>{b.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#8d92aa' }}>📍 {b.location} ({b.region}) • {b.team.length} PKMN</div>
                        </div>
                        <ArrowRight size={14} color="#888da8" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sidequests Results */}
              {results.quests.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#eab308', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass size={13} /> Misiones Secundarias ({results.quests.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.quests.map((q, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          onNavigate('sidequests', q.id);
                          onClose();
                        }}
                        style={{
                          background: '#13141f',
                          border: '1px solid #202235',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        className="hover:border-[#eab308]"
                      >
                        <div>
                          <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.88rem' }}>#{q.order} {q.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#8d92aa' }}>{q.region} • Premios: {q.rewards.pokemon.join(', ') || q.rewards.money || 'Objetos'}</div>
                        </div>
                        <ArrowRight size={14} color="#888da8" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items Results */}
              {results.items.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Package size={13} /> Objetos y Tiendas ({results.items.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.items.map((it, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          onNavigate('items', it.name);
                          onClose();
                        }}
                        style={{
                          background: '#13141f',
                          border: '1px solid #202235',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        className="hover:border-[#10b981]"
                      >
                        <div>
                          <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.88rem' }}>{it.name} <span style={{ fontSize: '0.7rem', color: '#686d85' }}>({it.category})</span></div>
                          <div style={{ fontSize: '0.75rem', color: '#8d92aa', maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {it.location_and_method}
                          </div>
                        </div>
                        <ArrowRight size={14} color="#888da8" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Moves Results */}
              {results.moves.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#eab308', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={13} /> Ataques Modificados ({results.moves.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.moves.map((m, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          onNavigate('moves', m.name);
                          onClose();
                        }}
                        style={{
                          background: '#13141f',
                          border: '1px solid #202235',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        className="hover:border-[#eab308]"
                      >
                        <div>
                          <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.88rem' }}>{m.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#8d92aa' }}>Potencia: {m.hackrom.power} • Tipo: {m.hackrom.type} • {m.hackrom.effect}</div>
                        </div>
                        <ArrowRight size={14} color="#888da8" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
