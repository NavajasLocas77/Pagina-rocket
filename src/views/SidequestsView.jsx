import React, { useState, useMemo } from 'react';
import sidequestsData from '../data/sidequests.json';
import bossesData from '../data/bosses.json';
import { getPokemonSprite } from '../utils/pokemon';
import { 
  Compass, 
  Search, 
  CheckCircle2, 
  Circle, 
  Gift, 
  Video, 
  MapPin, 
  ShieldAlert, 
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function SidequestsView({ 
  onSelectPokemon, 
  onSelectBoss, 
  onSelectItem, 
  completedQuests, 
  toggleQuestCompleted 
}) {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedRewardType, setSelectedRewardType] = useState('all'); // 'all' | 'pokemon' | 'money' | 'items'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestId, setExpandedQuestId] = useState(null);

  const regions = [
    { id: 'all', label: 'Todas las Regiones' },
    { id: 'ISLA INTA', label: 'Isla Inta' },
    { id: 'KANTO', label: 'Kanto' },
    { id: 'SEVII', label: 'Sevii (Islas Sete)' },
    { id: 'JOHTO', label: 'Johto' },
    { id: 'JOHTO DLC', label: 'Johto DLC' },
    { id: 'HOENN', label: 'Hoenn' }
  ];

  const filteredQuests = useMemo(() => {
    return sidequestsData.filter(q => {
      // Region
      if (selectedRegion !== 'all' && q.region !== selectedRegion) return false;

      // Status
      const isDone = completedQuests.includes(q.id);
      if (statusFilter === 'pending' && isDone) return false;
      if (statusFilter === 'completed' && !isDone) return false;

      // Reward type
      if (selectedRewardType === 'pokemon' && q.rewards.pokemon.length === 0) return false;
      if (selectedRewardType === 'money' && !q.rewards.money) return false;
      if (selectedRewardType === 'items' && q.rewards.items.length === 0) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const mName = q.name.toLowerCase().includes(query);
        const mDesc = q.description.toLowerCase().includes(query);
        const mReq = q.requirements.toLowerCase().includes(query);
        const mPkmn = q.rewards.pokemon.some(p => p.toLowerCase().includes(query));
        const mItem = q.rewards.items.some(i => i.toLowerCase().includes(query));
        if (!mName && !mDesc && !mReq && !mPkmn && !mItem) return false;
      }

      return true;
    });
  }, [selectedRegion, selectedRewardType, statusFilter, searchQuery, completedQuests]);

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Compass size={26} color="#eab308" />
              <span>MISIONES SECUNDARIAS (ORDEN CRONOLÓGICO)</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#9196af' }}>
              Las 33 misiones secundarias estructuradas en el orden exacto en que deben o pueden desbloquearse durante la partida.
            </p>
          </div>

          <div style={{ background: '#181a28', border: '1px solid #2b2e44', padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', color: '#cbd0e6' }}>
            Completadas: <strong style={{ color: '#22c55e' }}>{completedQuests.length}</strong> / 33
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search size={16} color="#8a8fa6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por misión, Pokémon de premio, objeto, requisito..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          {/* Reward Type Filter */}
          <div style={{ display: 'flex', background: '#161724', border: '1px solid #282a3d', borderRadius: '6px', padding: '2px' }}>
            {[
              { id: 'all', label: 'Todo tipo' },
              { id: 'pokemon', label: 'Con Pokémon' },
              { id: 'money', label: 'Con Dinero' },
              { id: 'items', label: 'Con Objetos' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedRewardType(f.id)}
                style={{
                  padding: '6px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  background: selectedRewardType === f.id ? '#26293d' : 'transparent',
                  color: selectedRewardType === f.id ? '#eab308' : '#7c819c',
                  fontWeight: selectedRewardType === f.id ? '600' : '400'
                }}
              >
                {f.label}
              </button>
            ))}
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
              Todas
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
              Completadas
            </button>
          </div>
        </div>

        {/* Region Chips */}
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

      {/* Quests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredQuests.map((quest) => {
          const isDone = completedQuests.includes(quest.id);
          const isExpanded = expandedQuestId === quest.id;
          
          return (
            <div 
              key={quest.id}
              className="rocket-panel"
              style={{
                borderColor: isDone ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-color)',
                backgroundColor: isDone ? '#10171a' : 'var(--bg-card)'
              }}
            >
              {/* Header bar of quest */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <button
                    onClick={() => toggleQuestCompleted(quest.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginTop: '3px' }}
                    title={isDone ? 'Marcar como pendiente' : 'Marcar como completada'}
                  >
                    {isDone ? <CheckCircle2 size={22} color="#22c55e" /> : <Circle size={22} color="#606680" />}
                  </button>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'Chakra Petch', fontWeight: '800', color: '#eab308', fontSize: '0.85rem' }}>
                        #{quest.order}
                      </span>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: isDone ? '#4ade80' : '#fff' }}>
                        {quest.name}
                      </h2>
                      <span style={{ fontSize: '0.7rem', padding: '1px 8px', borderRadius: '4px', background: '#25273b', color: '#ff8a8a', fontWeight: '700' }}>
                        {quest.region}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.78rem', color: '#8d92ab', marginTop: '4px' }}>
                      <span>👤 NPC / Emisor: <strong style={{ color: '#cbd0e6' }}>{quest.npc}</strong></span>
                      <span>•</span>
                      <span>Prerrequisito: <strong style={{ color: '#cbd0e6' }}>{quest.requirements}</strong></span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setExpandedQuestId(isExpanded ? null : quest.id)}
                    style={{
                      background: '#191b29',
                      border: '1px solid #2e3149',
                      color: '#a0a5bf',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{isExpanded ? 'Menos detalles' : 'Pasos y Combates'}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* Description & Steps */}
              <div style={{ background: '#12131f', border: '1px solid #202233', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.88rem', color: '#e0e3f5', lineHeight: 1.6 }}>
                  {quest.description}
                </div>

                {/* Numbered steps if present */}
                {quest.steps && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#eab308', textTransform: 'uppercase' }}>
                      Pasos para completarla:
                    </div>
                    {quest.steps.map((st, sIdx) => (
                      <div key={sIdx} style={{ fontSize: '0.82rem', color: '#cbd0e6', display: 'flex', gap: '8px' }}>
                        <span style={{ color: '#eab308', fontWeight: '700' }}>{sIdx + 1}.</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Connected Boss Battles if available */}
              {quest.connected_boss_ids && quest.connected_boss_ids.length > 0 && (
                <div style={{ marginBottom: '14px', padding: '10px 14px', background: 'rgba(229, 57, 53, 0.08)', border: '1px solid rgba(229, 57, 53, 0.25)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ff6b6b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    ⚔️ Combates Obligatorios de esta Misión:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {quest.connected_boss_ids.map(bId => {
                      const bossObj = bossesData.find(b => b.id === bId);
                      return bossObj ? (
                        <button
                          key={bId}
                          onClick={() => onSelectBoss(bId)}
                          style={{
                            background: '#1b141d',
                            border: '1px solid #e53935',
                            color: '#fff',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          className="hover:bg-[#2b1720]"
                          title="Clic para ver el equipo completo de este jefe"
                        >
                          <span>{bossObj.title} ({bossObj.team.length} PKMN)</span>
                          <ExternalLink size={12} color="#ff6b6b" />
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Rewards Box */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', background: '#161726', padding: '12px 14px', borderRadius: '8px', border: '1px solid #282a3d' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#a0a5bf', fontWeight: '700' }}>
                    <Gift size={16} color="#22c55e" /> Recompensas:
                  </div>

                  {/* Pokémon rewards */}
                  {quest.rewards.pokemon.map((pk, pIdx) => (
                    <div key={pIdx} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#1e242b', border: '1px solid #2a4336', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#4ade80' }}>
                      <img src={getPokemonSprite(pk)} alt="" style={{ width: '22px', height: '22px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                      <button
                        onClick={() => onSelectPokemon(pk)}
                        style={{ background: 'transparent', border: 'none', color: '#4ade80', fontWeight: '700', cursor: 'pointer', fontSize: '0.75rem' }}
                        className="hover:underline"
                      >
                        {pk}
                      </button>
                    </div>
                  ))}

                  {/* Money reward */}
                  {quest.rewards.money && (
                    <span style={{ background: '#252119', border: '1px solid #634b1d', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#fbbf24', fontWeight: '700' }}>
                      💰 {quest.rewards.money}
                    </span>
                  )}

                  {/* Badge reward */}
                  {quest.rewards.badges && (
                    <span style={{ background: '#231c29', border: '1px solid #613b78', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#c084fc', fontWeight: '700' }}>
                      🏅 {quest.rewards.badges}
                    </span>
                  )}

                  {/* Access unlock */}
                  {quest.rewards.access && (
                    <span style={{ background: '#17222a', border: '1px solid #1e455c', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#38bdf8' }}>
                      🔓 {quest.rewards.access}
                    </span>
                  )}

                  {/* Items */}
                  {quest.rewards.items.map((it, iIdx) => (
                    <button
                      key={iIdx}
                      onClick={() => onSelectItem(it)}
                      style={{ background: '#1c1e2d', border: '1px solid #2f324c', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#cbd0e8', cursor: 'pointer' }}
                      className="hover:border-[#e53935]"
                    >
                      🎒 {it}
                    </button>
                  ))}
                </div>

                {/* Video Tutorial if available */}
                {quest.video_tutorial && quest.video_tutorial !== 'No disponible' && quest.video_tutorial !== 'No está disponible.' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#9da2bd', background: '#111219', padding: '4px 10px', borderRadius: '4px', border: '1px solid #222436' }}>
                    <Video size={13} color="#ef4444" />
                    <span>Tutorial oficial: <strong>"{quest.video_tutorial}"</strong></span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
