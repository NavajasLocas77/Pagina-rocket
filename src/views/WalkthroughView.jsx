import React, { useState } from 'react';
import walkthroughData from '../data/walkthrough.json';
import bossesData from '../data/bosses.json';
import { 
  Map, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Skull, 
  Gift, 
  ArrowRight, 
  ShieldAlert, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink 
} from 'lucide-react';

export default function WalkthroughView({ 
  onSelectBoss, 
  onSelectPokemon, 
  completedSteps, 
  toggleStepCompleted 
}) {
  const [activeActId, setActiveActId] = useState('act-1');
  const currentAct = walkthroughData.find(a => a.id === activeActId) || walkthroughData[0];

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Map size={26} color="#3b82f6" />
          <span>GUÍA PASO A PASO (WALKTHROUGH COMPLETO)</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#8f94ad' }}>
          El recorrido argumental completo derivado cronológicamente de los eventos y combates del juego, dividido en sus 5 Temporadas / Actos oficiales.
        </p>

        {/* Act Selector Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
          {walkthroughData.map(act => {
            const isActive = act.id === activeActId;
            return (
              <button
                key={act.id}
                onClick={() => setActiveActId(act.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  background: isActive ? '#3b82f6' : '#141624',
                  borderColor: isActive ? '#3b82f6' : '#26293f',
                  color: isActive ? '#fff' : '#9da2bd',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s'
                }}
              >
                <span>Acto {act.act_number}: {act.region}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Act Overview Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(18, 19, 29, 0.95) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '10px',
        padding: '20px 24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
              {currentAct.title}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#b9bece', maxWidth: '800px', lineHeight: 1.5 }}>
              {currentAct.summary}
            </p>
          </div>
          <span style={{ fontFamily: 'Chakra Petch', fontWeight: '800', color: '#60a5fa', background: '#1c283f', border: '1px solid #2b456e', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
            Rango Sugerido: {currentAct.level_range}
          </span>
        </div>
      </div>

      {/* Steps List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {currentAct.steps.map((st) => {
          const stepKey = `${currentAct.id}-step-${st.step}`;
          const isDone = completedSteps.includes(stepKey);

          return (
            <div 
              key={st.step}
              className="rocket-panel"
              style={{
                borderColor: isDone ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-color)',
                backgroundColor: isDone ? '#10171a' : 'var(--bg-card)'
              }}
            >
              {/* Step Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => toggleStepCompleted(stepKey)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                    title={isDone ? 'Marcar como pendiente' : 'Marcar como completado'}
                  >
                    {isDone ? <CheckCircle2 size={24} color="#22c55e" /> : <Circle size={24} color="#606680" />}
                  </button>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'Chakra Petch', fontWeight: '800', color: '#3b82f6', fontSize: '0.9rem' }}>
                        Paso {st.step}
                      </span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: isDone ? '#4ade80' : '#fff' }}>
                        {st.title}
                      </h3>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#8d92ab', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={13} color="#e53935" />
                      <span>{st.location}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleStepCompleted(stepKey)}
                  style={{
                    background: isDone ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isDone ? '#22c55e' : '#2d3045'}`,
                    color: isDone ? '#4ade80' : '#8e93ae',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {isDone ? '✓ Completado' : 'Marcar Completado'}
                </button>
              </div>

              {/* Step Narrative */}
              <div style={{ background: '#12131e', borderRadius: '8px', padding: '14px', marginBottom: '14px', fontSize: '0.88rem', color: '#cbd0e6', lineHeight: 1.6 }}>
                {st.description}
              </div>

              {/* Boss Battles during this Step */}
              {st.boss_ids && st.boss_ids.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#ff6b6b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Skull size={14} color="#e53935" />
                    <span>Combates de Jefe en este momento de la historia:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                    {st.boss_ids.map(bId => {
                      const bObj = bossesData.find(b => b.id === bId);
                      if (!bObj) return null;
                      return (
                        <div
                          key={bId}
                          onClick={() => onSelectBoss(bId)}
                          style={{
                            background: '#161826',
                            border: '1px solid #282a3d',
                            borderRadius: '6px',
                            padding: '10px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                          className="hover:border-[#e53935]"
                        >
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{bObj.trainer_name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#888ea6' }}>{bObj.team.length} Pokémon {bObj.min_level ? `(Nv. ${bObj.min_level}-${bObj.max_level})` : ''}</div>
                          </div>
                          <ExternalLink size={14} color="#e53935" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rewards and Next Unlocks Footer */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: '#161826', padding: '10px 14px', borderRadius: '6px', border: '1px solid #25283c', fontSize: '0.78rem' }}>
                <div>
                  <strong style={{ color: '#22c55e' }}>🎁 Recompensas / Hallazgos:</strong> <span style={{ color: '#cbd0e6' }}>{st.rewards}</span>
                </div>
                <div>
                  <strong style={{ color: '#38bdf8' }}>🔓 Siguiente Desbloqueo:</strong> <span style={{ color: '#cbd0e6' }}>{st.key_unlocks}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
