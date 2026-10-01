import React, { useState, useMemo, useEffect, useRef } from 'react';
import guide100Data from '../data/guide_100_data.json';
import bossesData from '../data/bosses.json';
import sidequestsData from '../data/sidequests.json';
import diffCompData from '../data/difficulty_comparison.json';
import { getPokemonSprite } from '../utils/pokemon';
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  AlertTriangle, 
  MapPin, 
  Skull, 
  Compass, 
  Gift, 
  Package, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink,
  Shield,
  Zap,
  Filter,
  Play
} from 'lucide-react';

export default function Guide100View({ 
  onSelectBoss, 
  onSelectQuest, 
  onSelectPokemon, 
  onSelectItem 
}) {
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' | 'hard'
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'story' | 'boss' | 'sidequest' | 'gift' | 'missable'
  const [activeAct, setActiveAct] = useState('all'); // 'all' | 'kanto' | 'archi7' | 'johto' | 'dlc' | 'hoenn'
  const [activeTabSub, setActiveTabSub] = useState('walkthrough'); // 'walkthrough' | 'missables' | 'differences'

  // Independent LocalStorage for Easy and Hard
  const [easyProgress, setEasyProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tre_100_easy_progress')) || [];
    } catch {
      return [];
    }
  });

  const [hardProgress, setHardProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tre_100_hard_progress')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tre_100_easy_progress', JSON.stringify(easyProgress));
  }, [easyProgress]);

  useEffect(() => {
    localStorage.setItem('tre_100_hard_progress', JSON.stringify(hardProgress));
  }, [hardProgress]);

  const currentProgress = difficulty === 'easy' ? easyProgress : hardProgress;

  const toggleObjective = (id) => {
    if (difficulty === 'easy') {
      setEasyProgress(prev => 
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    } else {
      setHardProgress(prev => 
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    }
  };

  const resetCurrentModeProgress = () => {
    const modeName = difficulty === 'easy' ? 'Modo Fácil' : 'Modo Difícil';
    if (window.confirm(`¿Estás seguro de que deseas reiniciar todo el progreso del 100% en ${modeName}?`)) {
      if (difficulty === 'easy') setEasyProgress([]);
      else setHardProgress([]);
    }
  };

  // Next incomplete objective locator
  const nextIncompleteObjective = useMemo(() => {
    return guide100Data.find(obj => !currentProgress.includes(obj.id));
  }, [currentProgress]);

  const scrollToNextObjective = () => {
    if (nextIncompleteObjective) {
      const el = document.getElementById(`milestone-${nextIncompleteObjective.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pulse-active');
        setTimeout(() => el.classList.remove('pulse-active'), 3000);
      }
    }
  };

  // Progress metrics
  const totalObjectives = guide100Data.length;
  const completedCount = currentProgress.length;
  const percentCompleted = Math.round((completedCount / totalObjectives) * 100);

  // Filtered objectives
  const filteredObjectives = useMemo(() => {
    return guide100Data.filter(obj => {
      if (activeAct !== 'all' && obj.act !== activeAct) return false;
      if (selectedFilter !== 'all' && obj.type !== selectedFilter) return false;
      return true;
    });
  }, [activeAct, selectedFilter]);

  // Missables
  const missablesList = useMemo(() => {
    return guide100Data.filter(obj => obj.missable);
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Title & Difficulty Switcher Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target size={28} color="#e53935" />
              <span>GUÍA 100% DE COMPLETADO</span>
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#8f94ad' }}>
              Recorrido paso a paso para completar el juego de inicio a fin sin perder ningún Pokémon, evento u objeto, con seguimiento independiente por dificultad.
            </p>
          </div>

          {/* DUAL DIFFICULTY TOGGLE */}
          <div style={{ display: 'flex', background: '#141624', border: '1px solid #282b40', borderRadius: '10px', padding: '4px' }}>
            <button
              onClick={() => setDifficulty('easy')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: difficulty === 'easy' ? '#166534' : 'transparent',
                color: difficulty === 'easy' ? '#4ade80' : '#888ea4',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: difficulty === 'easy' ? '0 0 14px rgba(34, 197, 94, 0.3)' : 'none'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
              <span>🟢 MODO FÁCIL</span>
            </button>

            <button
              onClick={() => setDifficulty('hard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: difficulty === 'hard' ? '#991b1b' : 'transparent',
                color: difficulty === 'hard' ? '#fca5a5' : '#888ea4',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: difficulty === 'hard' ? '0 0 14px rgba(229, 57, 53, 0.3)' : 'none'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
              <span>🔴 MODO DIFÍCIL</span>
            </button>
          </div>
        </div>

        {/* Mode Indicator & Live 100% Progress Dashboard */}
        <div style={{
          background: difficulty === 'easy' 
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(18, 20, 30, 0.95) 100%)' 
            : 'linear-gradient(135deg, rgba(229, 57, 53, 0.12) 0%, rgba(18, 20, 30, 0.95) 100%)',
          border: `1px solid ${difficulty === 'easy' ? 'rgba(34, 197, 94, 0.35)' : 'rgba(229, 57, 53, 0.35)'}`,
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  background: difficulty === 'easy' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: difficulty === 'easy' ? '#4ade80' : '#fca5a5',
                  border: `1px solid ${difficulty === 'easy' ? '#22c55e' : '#ef4444'}`
                }}>
                  {difficulty === 'easy' ? '🟢 PROGRESO: MODO FÁCIL' : '🔴 PROGRESO: MODO DIFÍCIL'}
                </span>
                <span style={{ fontSize: '0.82rem', color: '#9da2bd' }}>
                  Progreso guardado independientemente en tu navegador
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '6px' }}>
                {completedCount} de {totalObjectives} Objetivos Cumplidos ({percentCompleted}%)
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Next Objective Button */}
              {nextIncompleteObjective ? (
                <button
                  onClick={scrollToNextObjective}
                  style={{
                    background: difficulty === 'easy' ? '#166534' : '#b91c1c',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                  }}
                >
                  <Play size={14} fill="#fff" />
                  <span>▶ SIGUIENTE OBJETIVO</span>
                </button>
              ) : (
                <span style={{ background: '#14532d', color: '#86efac', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700' }}>
                  🏆 ¡100% COMPLETADO!
                </span>
              )}

              <button
                onClick={resetCurrentModeProgress}
                title="Reiniciar progreso de este modo"
                style={{
                  background: '#1a1c2b',
                  border: '1px solid #2e3146',
                  color: '#8e93ae',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem'
                }}
              >
                <RotateCcw size={13} /> Reiniciar
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '8px', background: '#1e2133', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${percentCompleted}%`, 
                height: '100%', 
                background: difficulty === 'easy' ? 'linear-gradient(90deg, #22c55e, #10b981)' : 'linear-gradient(90deg, #ef4444, #f97316)',
                transition: 'width 0.4s ease'
              }} 
            />
          </div>
        </div>

        {/* Sub-view Navigation Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #25283c', paddingBottom: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTabSub('walkthrough')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid',
              background: activeTabSub === 'walkthrough' ? '#25283c' : 'transparent',
              borderColor: activeTabSub === 'walkthrough' ? '#3d4160' : 'transparent',
              color: activeTabSub === 'walkthrough' ? '#fff' : '#8d92ab',
              fontWeight: activeTabSub === 'walkthrough' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Compass size={16} color={difficulty === 'easy' ? '#22c55e' : '#ef4444'} />
            <span>Recorrido Completo al 100%</span>
          </button>

          <button
            onClick={() => setActiveTabSub('missables')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid',
              background: activeTabSub === 'missables' ? '#25283c' : 'transparent',
              borderColor: activeTabSub === 'missables' ? '#3d4160' : 'transparent',
              color: activeTabSub === 'missables' ? '#ff8a8a' : '#8d92ab',
              fontWeight: activeTabSub === 'missables' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <AlertTriangle size={16} color="#ef4444" />
            <span>⚠️ Elementos Perdibles (Missables)</span>
          </button>

          <button
            onClick={() => setActiveTabSub('differences')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid',
              background: activeTabSub === 'differences' ? '#25283c' : 'transparent',
              borderColor: activeTabSub === 'differences' ? '#3d4160' : 'transparent',
              color: activeTabSub === 'differences' ? '#60a5fa' : '#8d92ab',
              fontWeight: activeTabSub === 'differences' ? '700' : '500',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Shield size={16} color="#3b82f6" />
            <span>⚔️ Diferencias de Dificultad Documentadas</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: RECORRIDO COMPLETO AL 100% */}
      {activeTabSub === 'walkthrough' && (
        <div>
          {/* Act and Type Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
            {/* Act selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { id: 'all', label: 'Todos los Actos' },
                { id: 'kanto', label: 'Acto I: Kanto' },
                { id: 'archi7', label: 'Acto II: Archi7' },
                { id: 'johto', label: 'Acto III: Johto' },
                { id: 'dlc', label: 'Acto IV: DLC' },
                { id: 'hoenn', label: 'Acto V: Hoenn' }
              ].map(act => (
                <button
                  key={act.id}
                  onClick={() => setActiveAct(act.id)}
                  className={`filter-chip ${activeAct === act.id ? 'active' : ''}`}
                >
                  {act.label}
                </button>
              ))}
            </div>

            {/* Type selector */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { id: 'all', label: 'Todo tipo' },
                { id: 'story', label: 'Historia' },
                { id: 'boss', label: 'Jefes' },
                { id: 'sidequest', label: 'Secundarias' },
                { id: 'gift', label: 'Regalos' },
                { id: 'missable', label: '⚠️ Perdibles' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    border: '1px solid',
                    background: selectedFilter === f.id ? '#1e2235' : '#141624',
                    borderColor: selectedFilter === f.id ? '#4a5075' : '#25283c',
                    color: selectedFilter === f.id ? '#fff' : '#888da4',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chronological Objectives List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredObjectives.map((obj, idx) => {
              const isDone = currentProgress.includes(obj.id);
              const bossObj = obj.bossId ? bossesData.find(b => b.id === obj.bossId) : null;
              const questObj = obj.questId ? sidequestsData.find(q => q.id === obj.questId) : null;

              return (
                <div
                  key={obj.id}
                  id={`milestone-${obj.id}`}
                  className="rocket-panel"
                  style={{
                    borderColor: isDone 
                      ? (difficulty === 'easy' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)') 
                      : (obj.missable ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-color)'),
                    backgroundColor: isDone ? '#10151a' : 'var(--bg-card)',
                    borderLeft: obj.missable ? '4px solid #ef4444' : (isDone ? '4px solid #22c55e' : '4px solid #3b82f6')
                  }}
                >
                  {/* Top Bar of Milestone */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <button
                        onClick={() => toggleObjective(obj.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginTop: '2px' }}
                        title={isDone ? 'Marcar como no completado' : 'Marcar como completado'}
                      >
                        {isDone ? (
                          <CheckCircle2 size={22} color={difficulty === 'easy' ? '#22c55e' : '#ef4444'} />
                        ) : (
                          <Circle size={22} color="#555a73" />
                        )}
                      </button>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '800', background: '#1c1e2e', color: '#ff6b6b', padding: '1px 7px', borderRadius: '4px', fontFamily: 'Chakra Petch' }}>
                            {obj.actTitle}
                          </span>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: isDone ? '#4ade80' : '#fff' }}>
                            {obj.title}
                          </h3>
                          {obj.missable && (
                            <span style={{ fontSize: '0.68rem', fontWeight: '800', background: '#451a1a', border: '1px solid #7f1d1d', color: '#f87171', padding: '1px 6px', borderRadius: '4px' }}>
                              ⚠️ PERDIBLE
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#8d92ab', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                          <MapPin size={13} color="#e53935" />
                          <span>{obj.location}</span>
                          <span>•</span>
                          <span>Requisito: <strong style={{ color: '#cbd0e6' }}>{obj.requirements}</strong></span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleObjective(obj.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        border: '1px solid',
                        background: isDone ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        borderColor: isDone ? '#22c55e' : '#2e3146',
                        color: isDone ? '#4ade80' : '#888ea6'
                      }}
                    >
                      {isDone ? '✓ Cumplido' : 'Marcar 100%'}
                    </button>
                  </div>

                  {/* Narrative & Instructions */}
                  <div style={{ background: '#12131e', borderRadius: '6px', padding: '12px', fontSize: '0.85rem', color: '#cbd0e8', lineHeight: 1.5, marginBottom: '10px' }}>
                    {obj.description}
                  </div>

                  {/* Missable Alert Box if applicable */}
                  {obj.missable && obj.missableWarning && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', padding: '10px 12px', marginBottom: '10px', fontSize: '0.8rem', color: '#fca5a5', lineHeight: 1.5 }}>
                      {obj.missableWarning}
                    </div>
                  )}

                  {/* Connected Links: Bosses & Sidequests without duplicating data */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', background: '#161826', padding: '10px 12px', borderRadius: '6px', fontSize: '0.78rem' }}>
                    {bossObj && (
                      <button
                        onClick={() => onSelectBoss(bossObj.id)}
                        style={{
                          background: '#1f1622',
                          border: '1px solid #e53935',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.76rem'
                        }}
                        className="hover:bg-[#2e1722]"
                      >
                        <Skull size={13} color="#ef4444" />
                        <span>Ver Ficha de Jefe: {bossObj.trainer_name}</span>
                        <ExternalLink size={12} color="#ff6b6b" />
                      </button>
                    )}

                    {questObj && (
                      <button
                        onClick={() => onSelectQuest(questObj.id)}
                        style={{
                          background: '#222016',
                          border: '1px solid #eab308',
                          color: '#fef08a',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.76rem'
                        }}
                        className="hover:bg-[#332b17]"
                      >
                        <Compass size={13} color="#eab308" />
                        <span>Ver Misión Secundaria #{questObj.order}</span>
                        <ExternalLink size={12} color="#eab308" />
                      </button>
                    )}

                    {/* Involved Pokemon */}
                    {obj.pokemonIds && obj.pokemonIds.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#8e93aa', fontSize: '0.72rem' }}>Pokémon:</span>
                        {obj.pokemonIds.map((pName, pi) => (
                          <button
                            key={pi}
                            onClick={() => onSelectPokemon(pName)}
                            style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                            className="hover:underline"
                          >
                            {pName}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Involved Items */}
                    {obj.itemIds && obj.itemIds.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#8e93aa', fontSize: '0.72rem' }}>Objetos:</span>
                        {obj.itemIds.map((iName, ii) => (
                          <span key={ii} style={{ background: '#1c1e2d', padding: '2px 6px', borderRadius: '4px', color: '#facc15', fontSize: '0.72rem' }}>
                            🎒 {iName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Difficulty Verification Note */}
                  <div style={{ marginTop: '8px', fontSize: '0.68rem', color: '#686d85', textAlign: 'right' }}>
                    Estado técnico en archivos: <em>{obj.difficultyNote}</em>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: ⚠️ ELEMENTOS PERDIBLES (MISSABLES) */}
      {activeTabSub === 'missables' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '16px 20px', fontSize: '0.86rem', color: '#cbd0e6', lineHeight: 1.6 }}>
            <strong style={{ color: '#ef4444' }}>Advertencia Crítica para el 100%:</strong> A continuación se listan todos los Pokémon, eventos y objetos que exigen acciones irreversibles o decisiones que, de pasarse por alto, impiden completar el juego al 100% en una sola partida.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
            {missablesList.map((m, mi) => (
              <div 
                key={mi}
                className="rocket-panel"
                style={{ borderLeft: '4px solid #ef4444' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>{m.title}</h3>
                  <span style={{ fontSize: '0.68rem', background: '#3b1c1c', color: '#fca5a5', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    {m.actTitle}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#9da2bd', marginBottom: '8px' }}>
                  📍 Ubicación: <strong style={{ color: '#cbd0e6' }}>{m.location}</strong>
                </div>

                <div style={{ background: '#13141f', padding: '10px 12px', borderRadius: '6px', fontSize: '0.82rem', color: '#fca5a5', lineHeight: 1.5, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  {m.missableWarning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: ⚔️ DIFERENCIAS DE DIFICULTAD DOCUMENTADAS */}
      {activeTabSub === 'differences' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ background: '#12141f', border: '1px solid #23273e', borderRadius: '10px', padding: '16px 20px', fontSize: '0.85rem', color: '#cbd0e6', lineHeight: 1.6 }}>
            <strong style={{ color: '#38bdf8' }}>Transparencia Absoluta de la Base de Datos:</strong> Los archivos originales del hackrom registran los combates de jefes con sus configuraciones competitivas máximas (IVs perfectos, EVs entrenados y objetos competitivos). La siguiente tabla resume las diferencias mecánicas y consideraciones de dificultad fundamentadas en la documentación técnica y notas del autor.
          </div>

          <div style={{ background: '#13141f', border: '1px solid var(--border-color)', borderRadius: '10px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#181926', borderBottom: '1px solid #272a3d', color: '#8f94ad', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '14px 18px' }}>Mecánica / Parámetro</th>
                  <th style={{ padding: '14px 18px', color: '#4ade80' }}>🟢 Modo Fácil</th>
                  <th style={{ padding: '14px 18px', color: '#f87171' }}>🔴 Modo Difícil</th>
                  <th style={{ padding: '14px 18px' }}>Evidencia en Archivos</th>
                </tr>
              </thead>
              <tbody>
                {diffCompData.map((d, di) => (
                  <tr key={di} style={{ borderBottom: '1px solid #1f2130' }}>
                    <td style={{ padding: '14px 18px', fontWeight: '700', color: '#fff' }}>{d.element}</td>
                    <td style={{ padding: '14px 18px', color: '#cbd0e6' }}>{d.easy}</td>
                    <td style={{ padding: '14px 18px', color: '#ffd6d6' }}>{d.hard}</td>
                    <td style={{ padding: '14px 18px', color: '#888ea6', fontSize: '0.75rem' }}>{d.docStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
