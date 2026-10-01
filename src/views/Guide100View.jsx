import React, { useState, useMemo, useEffect } from 'react';
import walkthrough100Data from '../data/walkthrough_100_data.json';
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
  Compass, 
  Gift, 
  Package, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink,
  Shield,
  Play,
  Search,
  Award,
  Sparkles,
  BookOpen,
  Check,
  Swords,
  Filter
} from 'lucide-react';

export default function Guide100View({ 
  onSelectBoss, 
  onSelectQuest, 
  onSelectPokemon, 
  onSelectItem,
  initialDifficulty = 'hard'
}) {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [activeTabSub, setActiveTabSub] = useState('walkthrough'); // 'walkthrough' | 'missables' | 'differences' | 'trophy'
  const [activeAct, setActiveAct] = useState('all'); // 'all' | 'kanto' | 'archi7' | 'johto' | 'dlc' | 'hoenn'
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedStages, setCollapsedStages] = useState({});
  const [expandedBossTeams, setExpandedBossTeams] = useState({});

  useEffect(() => {
    if (initialDifficulty) {
      setDifficulty(initialDifficulty);
    }
  }, [initialDifficulty]);

  // Robust parsing of LocalStorage objects
  const parseStorageObj = (key) => {
    try {
      const val = JSON.parse(localStorage.getItem(key));
      return val && typeof val === 'object' && !Array.isArray(val) ? val : {};
    } catch {
      return {};
    }
  };

  // Independent LocalStorage for Easy and Hard Mode Walkthrough Progress
  const [easyChecked, setEasyChecked] = useState(() => parseStorageObj('tre_100_easy_walkthrough'));
  const [hardChecked, setHardChecked] = useState(() => parseStorageObj('tre_100_hard_walkthrough'));

  useEffect(() => {
    localStorage.setItem('tre_100_easy_walkthrough', JSON.stringify(easyChecked));
  }, [easyChecked]);

  useEffect(() => {
    localStorage.setItem('tre_100_hard_walkthrough', JSON.stringify(hardChecked));
  }, [hardChecked]);

  const currentChecked = (difficulty === 'easy' ? easyChecked : hardChecked) || {};

  const toggleCheck = (taskId) => {
    if (difficulty === 'easy') {
      setEasyChecked(prev => ({
        ...prev,
        [taskId]: !prev[taskId]
      }));
    } else {
      setHardChecked(prev => ({
        ...prev,
        [taskId]: !prev[taskId]
      }));
    }
  };

  const toggleStageCollapse = (stageId) => {
    setCollapsedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const toggleBossTeam = (bossId) => {
    setExpandedBossTeams(prev => ({
      ...prev,
      [bossId]: !prev[bossId]
    }));
  };

  const resetCurrentProgress = () => {
    const modeName = difficulty === 'easy' ? 'Modo Fácil' : 'Modo Difícil';
    if (window.confirm(`¿Estás seguro de que deseas reiniciar todo el progreso del Walkthrough 100% en ${modeName}?`)) {
      if (difficulty === 'easy') setEasyChecked({});
      else setHardChecked({});
    }
  };

  // Helper to map boss full team
  const bossMap = useMemo(() => {
    const map = {};
    bossesData.forEach(b => {
      map[b.id] = b;
    });
    return map;
  }, []);

  // Helper to map sidequests
  const questMap = useMemo(() => {
    const map = {};
    sidequestsData.forEach(q => {
      map[q.id] = q;
    });
    return map;
  }, []);

  // Filtered Stages
  const filteredStages = useMemo(() => {
    return walkthrough100Data.filter(stage => {
      if (activeAct !== 'all' && stage.act !== activeAct) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = stage.actTitle.toLowerCase().includes(q);
        const inLoc = stage.location.toLowerCase().includes(q);
        const inStory = stage.storySteps.some(s => s.toLowerCase().includes(q));
        const inPkmn = stage.availablePokemon.some(p => p.name.toLowerCase().includes(q));
        const inBoss = stage.bosses.some(b => b.trainerName.toLowerCase().includes(q));
        const inItems = stage.items.some(i => i.name.toLowerCase().includes(q));
        const inQuests = stage.sidequests.some(sq => sq.name.toLowerCase().includes(q));
        if (!inTitle && !inLoc && !inStory && !inPkmn && !inBoss && !inItems && !inQuests) {
          return false;
        }
      }
      return true;
    });
  }, [activeAct, searchQuery]);

  // Overall Statistics Calculation
  const stats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    let totalBosses = 0;
    let completedBosses = 0;
    let totalQuests = 0;
    let completedQuests = 0;
    let totalPokemon = 0;
    let completedPokemon = 0;
    let totalGifts = 0;
    let completedGifts = 0;
    let totalItems = 0;
    let completedItems = 0;

    walkthrough100Data.forEach(stage => {
      // Stage master task
      const stageKey = `stage_${stage.id}`;
      totalTasks += 1;
      if (currentChecked[stageKey]) completedTasks += 1;

      // Bosses
      stage.bosses.forEach(b => {
        totalBosses += 1;
        totalTasks += 1;
        const bKey = `boss_${stage.id}_${b.bossId}`;
        if (currentChecked[bKey]) {
          completedBosses += 1;
          completedTasks += 1;
        }
      });

      // Quests
      stage.sidequests.forEach(sq => {
        totalQuests += 1;
        totalTasks += 1;
        const qKey = `quest_${stage.id}_${sq.id}`;
        if (currentChecked[qKey]) {
          completedQuests += 1;
          completedTasks += 1;
        }
      });

      // Pokemon
      stage.availablePokemon.forEach(pk => {
        totalPokemon += 1;
        totalTasks += 1;
        const pKey = `pkmn_${stage.id}_${pk.name}`;
        if (currentChecked[pKey]) {
          completedPokemon += 1;
          completedTasks += 1;
        }
      });

      // Gifts
      stage.gifts.forEach(g => {
        totalGifts += 1;
        totalTasks += 1;
        const gKey = `gift_${stage.id}_${g.id}`;
        if (currentChecked[gKey]) {
          completedGifts += 1;
          completedTasks += 1;
        }
      });

      // Items
      stage.items.forEach(it => {
        totalItems += 1;
        totalTasks += 1;
        const itKey = `item_${stage.id}_${it.id}`;
        if (currentChecked[itKey]) {
          completedItems += 1;
          completedTasks += 1;
        }
      });
    });

    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      percent,
      totalBosses,
      completedBosses,
      totalQuests,
      completedQuests,
      totalPokemon,
      completedPokemon,
      totalGifts,
      completedGifts,
      totalItems,
      completedItems
    };
  }, [currentChecked]);

  // Current In-Progress Active Stage (for "¿QUÉ PUEDO HACER AHORA?")
  const activeStage = useMemo(() => {
    const found = walkthrough100Data.find(stage => !currentChecked[`stage_${stage.id}`]);
    return found || walkthrough100Data[0];
  }, [currentChecked]);

  const isGame100Completed = stats.percent === 100;

  const scrollToActiveStage = () => {
    if (activeStage) {
      const el = document.getElementById(`walkthrough-stage-${activeStage.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '80px' }}>
      
      {/* ========================================================================= */}
      {/* HERO HEADER: TITLE, DIFFICULTY SWITCHER & MAIN NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.35) 0%, rgba(22, 23, 34, 0.95) 50%, rgba(9, 10, 15, 1) 100%)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(229, 57, 53, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.06, pointerEvents: 'none' }}>
          <Target style={{ width: '240px', height: '240px', color: 'var(--color-rocket)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Top Bar: Title & Dual Difficulty Toggle */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                padding: '12px',
                background: 'rgba(229, 57, 53, 0.15)',
                border: '1px solid rgba(229, 57, 53, 0.3)',
                borderRadius: '12px',
                color: 'var(--color-rocket)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target style={{ width: '28px', height: '28px' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: '20px',
                    background: 'var(--color-rocket)',
                    color: '#fff'
                  }}>
                    Walkthrough Real 100%
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Edición Team Rocket</span>
                </div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginTop: '4px', letterSpacing: '0.02em' }}>
                  GUÍA 100% — RECORRIDO OFICIAL PASO A PASO
                </h1>
              </div>
            </div>

            {/* DUAL DIFFICULTY TOGGLE */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#0d0e15',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid #232537'
            }}>
              <button
                onClick={() => setDifficulty('easy')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: difficulty === 'easy' ? '#16a34a' : 'transparent',
                  color: difficulty === 'easy' ? '#fff' : '#9499ad',
                  boxShadow: difficulty === 'easy' ? '0 4px 12px rgba(22, 163, 74, 0.4)' : 'none'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: difficulty === 'easy' ? '#fff' : '#22c55e'
                }} />
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
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: difficulty === 'hard' ? 'var(--color-rocket)' : 'transparent',
                  color: difficulty === 'hard' ? '#fff' : '#9499ad',
                  boxShadow: difficulty === 'hard' ? '0 4px 12px rgba(229, 57, 53, 0.4)' : 'none'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: difficulty === 'hard' ? '#fff' : '#ef4444'
                }} />
                <span>🔴 MODO DIFÍCIL</span>
              </button>
            </div>
          </div>

          <div style={{
            fontSize: '0.88rem',
            color: '#c5c9db',
            lineHeight: '1.6',
            maxWidth: '900px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              💡 <span style={{ color: '#fff' }}>La dificultad no cambia la historia ni el recorrido:</span> Es exactamente la misma cronología, mapas y progresión. Cambian los equipos de combate, niveles, IVs, EVs, objetos y coberturas según la documentación original de la ROM.
            </p>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem' }}>
              {difficulty === 'hard' ? (
                <span style={{ color: '#fca5a5' }}>
                  🔴 <strong>Modo Difícil Activo:</strong> Visualizando los equipos de combate de alta dificultad (IVs mejorados, EVs asignados, objetos competitivos y repertorio técnico avanzado).
                </span>
              ) : (
                <span style={{ color: '#86efac' }}>
                  🟢 <strong>Modo Fácil Activo:</strong> Visualizando los equipos estándar del juego original con progresión equilibrada.
                </span>
              )}
            </p>
          </div>

          {/* SUB-TABS NAVIGATION */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={() => setActiveTabSub('walkthrough')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: activeTabSub === 'walkthrough' ? '1px solid #3b3e58' : '1px solid transparent',
                background: activeTabSub === 'walkthrough' ? '#202234' : 'transparent',
                color: activeTabSub === 'walkthrough' ? '#fff' : '#9499ad',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <BookOpen style={{ width: '16px', height: '16px', color: 'var(--color-rocket)' }} />
              <span>🗺️ Recorrido Paso a Paso 100%</span>
            </button>

            <button
              onClick={() => setActiveTabSub('missables')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: activeTabSub === 'missables' ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid transparent',
                background: activeTabSub === 'missables' ? 'rgba(234, 179, 8, 0.12)' : 'transparent',
                color: activeTabSub === 'missables' ? '#facc15' : '#9499ad',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <AlertTriangle style={{ width: '16px', height: '16px', color: '#eab308' }} />
              <span>⚠️ Elementos Perdibles (Missables)</span>
            </button>

            <button
              onClick={() => setActiveTabSub('differences')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: activeTabSub === 'differences' ? '1px solid rgba(96, 165, 250, 0.4)' : '1px solid transparent',
                background: activeTabSub === 'differences' ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                color: activeTabSub === 'differences' ? '#60a5fa' : '#9499ad',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Shield style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
              <span>⚔️ Diferencias Documentadas</span>
            </button>

            {isGame100Completed && (
              <button
                onClick={() => setActiveTabSub('trophy')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #eab308 0%, #d97706 100%)',
                  color: '#000',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                  boxShadow: '0 4px 14px rgba(234, 179, 8, 0.4)'
                }}
              >
                <Award style={{ width: '16px', height: '16px', color: '#000' }} />
                <span>🏆 ¡VER PANTALLA 100%!</span>
              </button>
            )}

            <button
              onClick={resetCurrentProgress}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid transparent',
                cursor: 'pointer',
                marginLeft: isGame100Completed ? '8px' : 'auto',
                transition: 'all 0.15s ease'
              }}
              title="Reiniciar progreso del modo actual"
            >
              <RotateCcw style={{ width: '14px', height: '14px' }} />
              <span>Reiniciar {difficulty === 'easy' ? 'Fácil' : 'Difícil'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: WALKTHROUGH INTERACTIVO REAL */}
      {/* ========================================================================= */}
      {activeTabSub === 'walkthrough' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* SYSTEM "¿QUÉ PUEDO HACER AHORA?" & "CONTINUAR MI PARTIDA" */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {/* WIDGET ¿QUÉ PUEDO HACER AHORA? */}
            <div style={{
              gridColumn: 'span 2',
              background: '#13141f',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(229, 57, 53, 0.35)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              gap: '16px'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #222436',
                  paddingBottom: '10px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'var(--color-rocket)',
                      boxShadow: '0 0 10px var(--color-rocket)'
                    }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f87171' }}>
                      📍 ¿QUÉ PUEDO HACER AHORA EN MI PARTIDA?
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: '#202234', color: '#9499ad', border: '1px solid #2e314a' }}>
                    {activeStage.actTitle}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#9499ad' }}>Zona actual según tu avance:</div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <MapPin style={{ width: '20px', height: '20px', color: 'var(--color-rocket)' }} />
                      <span>{activeStage.location}</span>
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600, marginTop: '4px' }}>
                      🎯 Nivel recomendado: <span style={{ color: '#fff', fontWeight: 800 }}>{activeStage.recommendedLevel}</span>
                    </div>
                  </div>

                  <button
                    onClick={scrollToActiveStage}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      background: 'var(--color-rocket)',
                      color: '#fff',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(229, 57, 53, 0.4)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <Play style={{ width: '16px', height: '16px', fill: '#fff' }} />
                    <span>▶ CONTINUAR EN ESTA ZONA</span>
                  </button>
                </div>
              </div>

              {/* QUICK COUNTERS AT THIS EXACT STAGE */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '8px',
                paddingTop: '12px',
                borderTop: '1px solid #222436'
              }}>
                <div style={{ background: '#191b29', padding: '8px', borderRadius: '8px', border: '1px solid #25283d', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#9499ad', display: 'block' }}>Secundarias</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#4ade80' }}>🟢 {activeStage.sidequests.length} Disp.</span>
                </div>
                <div style={{ background: '#191b29', padding: '8px', borderRadius: '8px', border: '1px solid #25283d', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#9499ad', display: 'block' }}>Pokémon</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#60a5fa' }}>🐾 {activeStage.availablePokemon.length} Nuevos</span>
                </div>
                <div style={{ background: '#191b29', padding: '8px', borderRadius: '8px', border: '1px solid #25283d', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#9499ad', display: 'block' }}>Regalos</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#facc15' }}>🎁 {activeStage.gifts.length} Clave</span>
                </div>
                <div style={{ background: '#191b29', padding: '8px', borderRadius: '8px', border: '1px solid #25283d', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#9499ad', display: 'block' }}>Batallas</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#f87171' }}>⚔️ {activeStage.bosses.length} Jefes</span>
                </div>
                <div style={{ background: '#191b29', padding: '8px', borderRadius: '8px', border: '1px solid #25283d', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#9499ad', display: 'block' }}>Objetos</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#c084fc' }}>🎒 {activeStage.items.length} Útiles</span>
                </div>
                <div style={{ background: '#191b29', padding: '8px', borderRadius: '8px', border: '1px solid #25283d', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#9499ad', display: 'block' }}>Perdibles</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: activeStage.missables.length > 0 ? '#fbbf24' : '#6b7280' }}>⚠️ {activeStage.missables.length}</span>
                </div>
              </div>
            </div>

            {/* GLOBAL 100% PROGRESS CARD */}
            <div style={{
              background: '#13141f',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #26283b',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#9499ad' }}>
                    PROGRESO TOTAL {difficulty === 'hard' ? '🔴 DIFÍCIL' : '🟢 FÁCIL'}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-rocket)' }}>{stats.percent}%</span>
                </div>
                
                <div style={{ width: '100%', background: '#0d0e15', height: '12px', borderRadius: '10px', overflow: 'hidden', padding: '2px', border: '1px solid #222436' }}>
                  <div style={{
                    height: '100%',
                    borderRadius: '8px',
                    transition: 'width 0.5s ease',
                    background: difficulty === 'hard' 
                      ? 'linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #f59e0b 100%)' 
                      : 'linear-gradient(90deg, #16a34a 0%, #34d399 100%)',
                    width: `${stats.percent}%`
                  }} />
                </div>

                <div style={{ fontSize: '0.78rem', color: '#9499ad', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hitos completados:</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{stats.completedTasks} / {stats.totalTasks}</span>
                </div>
              </div>

              {/* STATS BREAKDOWN */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '0.75rem',
                paddingTop: '12px',
                borderTop: '1px solid #222436'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9499ad' }}>
                  <span>⚔️ Jefes:</span>
                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{stats.completedBosses}/{stats.totalBosses}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9499ad' }}>
                  <span>📜 Secundarias:</span>
                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{stats.completedQuests}/{stats.totalQuests}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9499ad' }}>
                  <span>🐾 Pokémon:</span>
                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{stats.completedPokemon}/{stats.totalPokemon}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9499ad' }}>
                  <span>🎁 Regalos:</span>
                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{stats.completedGifts}/{stats.totalGifts}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SEARCH & ACT FILTERS */}
          {/* ========================================================================= */}
          <div style={{
            background: '#13141f',
            padding: '14px 20px',
            borderRadius: '12px',
            border: '1px solid #26283b',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justify: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9499ad', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
                <Filter style={{ width: '14px', height: '14px' }} /> Acto:
              </span>
              {[
                { id: 'all', label: 'Todos' },
                { id: 'kanto', label: 'Acto I Kanto' },
                { id: 'archi7', label: 'Acto II Archi7' },
                { id: 'johto', label: 'Acto III Johto' },
                { id: 'dlc', label: 'Acto IV DLC' },
                { id: 'hoenn', label: 'Acto V Hoenn' }
              ].map(act => (
                <button
                  key={act.id}
                  onClick={() => setActiveAct(act.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    background: activeAct === act.id ? 'var(--color-rocket)' : '#1f2130',
                    color: activeAct === act.id ? '#fff' : '#9499ad'
                  }}
                >
                  {act.label}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '320px' }}>
              <Search style={{ width: '14px', height: '14px', color: '#9499ad', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar ciudad, Pokémon, jefe..."
                style={{
                  width: '100%',
                  background: '#090a0f',
                  border: '1px solid #282a3d',
                  borderRadius: '8px',
                  padding: '8px 12px 8px 34px',
                  fontSize: '0.8rem',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STAGES LIST: 38 COMPREHENSIVE CHRONOLOGICAL STAGES */}
          {/* ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredStages.map((stage) => {
              const isCollapsed = collapsedStages[stage.id];
              const stageMasterKey = `stage_${stage.id}`;
              const isStageCompleted = !!currentChecked[stageMasterKey];

              return (
                <div
                  key={stage.id}
                  id={`walkthrough-stage-${stage.id}`}
                  style={{
                    borderRadius: '16px',
                    border: isStageCompleted ? '1px solid #1f2130' : '1px solid #282a3d',
                    background: isStageCompleted ? '#0e0f16' : '#13141f',
                    opacity: isStageCompleted ? 0.85 : 1,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* STAGE HEADER */}
                  <div style={{
                    padding: '16px 20px',
                    background: isStageCompleted ? '#11121b' : 'linear-gradient(90deg, #181a28 0%, #13141f 100%)',
                    borderBottom: '1px solid #222436',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justify: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => toggleCheck(stageMasterKey)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: isStageCompleted ? '#22c55e' : '#6b7280',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title={isStageCompleted ? "Etapa marcada como completada" : "Marcar etapa completa"}
                      >
                        {isStageCompleted ? (
                          <CheckCircle2 style={{ width: '26px', height: '26px' }} />
                        ) : (
                          <Circle style={{ width: '26px', height: '26px' }} />
                        )}
                      </button>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            padding: '2px 6px',
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            borderRadius: '4px',
                            background: 'rgba(229, 57, 53, 0.2)',
                            color: '#f87171',
                            border: '1px solid rgba(229, 57, 53, 0.4)'
                          }}>
                            Paso #{stage.order}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9499ad' }}>
                            {stage.actTitle}
                          </span>
                        </div>
                        <h2 style={{
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          marginTop: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: isStageCompleted ? '#6b7280' : '#fff',
                          textDecoration: isStageCompleted ? 'line-through' : 'none'
                        }}>
                          <MapPin style={{ width: '18px', height: '18px', color: 'var(--color-rocket)' }} />
                          <span>{stage.location}</span>
                        </h2>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: '#9499ad', display: 'block' }}>Nivel recomendado:</span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: '#facc15',
                          background: 'rgba(234, 179, 8, 0.15)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(234, 179, 8, 0.3)'
                        }}>
                          {stage.recommendedLevel}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleStageCollapse(stage.id)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          background: '#1f2130',
                          border: '1px solid #2e314a',
                          color: '#c5c9db',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title={isCollapsed ? "Expandir etapa" : "Colapsar etapa"}
                      >
                        {isCollapsed ? <ChevronDown style={{ width: '20px', height: '20px' }} /> : <ChevronRight style={{ width: '20px', height: '20px', transform: 'rotate(90deg)' }} />}
                      </button>
                    </div>
                  </div>

                  {/* STAGE ACCORDION CONTENT */}
                  {!isCollapsed && (
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      {/* 1. 📖 HISTORIA PASO A PASO */}
                      <div style={{
                        background: '#090a0f',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #222436'
                      }}>
                        <h3 style={{
                          fontSize: '0.82rem',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: '#f87171',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '12px'
                        }}>
                          <BookOpen style={{ width: '16px', height: '16px' }} />
                          <span>📖 HISTORIA PRINCIPAL — QUÉ HACER PASO A PASO</span>
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {stage.storySteps.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: '#e2e8f0' }}>
                              <span style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: 'rgba(229, 57, 53, 0.2)',
                                border: '1px solid rgba(229, 57, 53, 0.5)',
                                color: '#f87171',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: '2px'
                              }}>
                                {idx + 1}
                              </span>
                              <p style={{ margin: 0, lineHeight: 1.5 }}>{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. 🐾 POKÉMON DISPONIBLES EN ESTE MOMENTO */}
                      {stage.availablePokemon.length > 0 && (
                        <div style={{
                          background: '#090a0f',
                          padding: '16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(59, 130, 246, 0.25)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <h3 style={{
                              fontSize: '0.82rem',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              color: '#60a5fa',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <Compass style={{ width: '16px', height: '16px' }} />
                              <span>🐾 POKÉMON QUE PUEDES CONSEGUIR EN ESTE MOMENTO</span>
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: '#9499ad' }}>
                              {stage.availablePokemon.length} disponibles
                            </span>
                          </div>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: '10px'
                          }}>
                            {stage.availablePokemon.map((pkmn, idx) => {
                              const pkmnKey = `pkmn_${stage.id}_${pkmn.name}`;
                              const isPkmnChecked = !!currentChecked[pkmnKey];

                              return (
                                <div
                                  key={idx}
                                  style={{
                                    padding: '10px',
                                    borderRadius: '10px',
                                    border: isPkmnChecked ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid #222436',
                                    background: isPkmnChecked ? 'rgba(59, 130, 246, 0.08)' : '#13141f',
                                    opacity: isPkmnChecked ? 0.75 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                  }}
                                >
                                  <button
                                    onClick={() => toggleCheck(pkmnKey)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isPkmnChecked ? '#60a5fa' : '#6b7280' }}
                                    title="Marcar como obtenido"
                                  >
                                    {isPkmnChecked ? <CheckCircle2 style={{ width: '20px', height: '20px' }} /> : <Circle style={{ width: '20px', height: '20px' }} />}
                                  </button>

                                  <img
                                    src={getPokemonSprite(pkmn.name, pkmn.dexNum)}
                                    alt={pkmn.name}
                                    style={{
                                      width: '44px',
                                      height: '44px',
                                      objectFit: 'contain',
                                      background: '#090a0f',
                                      borderRadius: '8px',
                                      padding: '4px',
                                      border: '1px solid #282a3d',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => onSelectPokemon && onSelectPokemon(pkmn.name)}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />

                                  <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span
                                        style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                        onClick={() => onSelectPokemon && onSelectPokemon(pkmn.name)}
                                      >
                                        {pkmn.name}
                                      </span>
                                      {pkmn.is100Recommended && (
                                        <span style={{ fontSize: '0.65rem', padding: '1px 4px', borderRadius: '4px', background: 'rgba(234, 179, 8, 0.2)', color: '#facc15', fontWeight: 800, border: '1px solid rgba(234, 179, 8, 0.4)' }}>
                                          100%
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: '#9499ad', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {pkmn.method} • {pkmn.level}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      📍 {pkmn.location}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 3. 🎁 POKÉMON REGALADOS */}
                      {stage.gifts.length > 0 && (
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(9, 10, 15, 1) 100%)',
                          padding: '16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(234, 179, 8, 0.35)'
                        }}>
                          <h3 style={{
                            fontSize: '0.82rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#facc15',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px'
                          }}>
                            <Gift style={{ width: '16px', height: '16px' }} />
                            <span>🎁 POKÉMON REGALADO DISPONIBLE EN ESTA ETAPA</span>
                          </h3>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {stage.gifts.map((gift) => {
                              const giftKey = `gift_${stage.id}_${gift.id}`;
                              const isGiftChecked = !!currentChecked[giftKey];

                              return (
                                <div
                                  key={gift.id}
                                  style={{
                                    padding: '14px',
                                    background: '#13141f',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(234, 179, 8, 0.3)',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px'
                                  }}
                                >
                                  <button
                                    onClick={() => toggleCheck(giftKey)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isGiftChecked ? '#facc15' : '#6b7280', marginTop: '4px' }}
                                    title="Marcar como recibido"
                                  >
                                    {isGiftChecked ? <CheckCircle2 style={{ width: '22px', height: '22px' }} /> : <Circle style={{ width: '22px', height: '22px' }} />}
                                  </button>

                                  <img
                                    src={getPokemonSprite(gift.name, gift.dexNum)}
                                    alt={gift.name}
                                    style={{
                                      width: '56px',
                                      height: '56px',
                                      objectFit: 'contain',
                                      background: '#090a0f',
                                      borderRadius: '10px',
                                      padding: '6px',
                                      border: '1px solid rgba(234, 179, 8, 0.3)',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => onSelectPokemon && onSelectPokemon(gift.name)}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />

                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <h4
                                        style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', cursor: 'pointer', margin: 0 }}
                                        onClick={() => onSelectPokemon && onSelectPokemon(gift.name)}
                                      >
                                        {gift.name} ({gift.level})
                                      </h4>
                                      <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', fontWeight: 700, border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                                        Objeto: {gift.heldItem}
                                      </span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#9499ad', marginTop: '4px', margin: '4px 0 0 0' }}>
                                      👤 <strong>NPC:</strong> {gift.npc} | 📍 <strong>Ubicación:</strong> {gift.location}
                                    </p>
                                    <div style={{ fontSize: '0.75rem', color: '#e2e8f0', marginTop: '8px' }}>
                                      <strong>Pasos para conseguirlo:</strong>
                                      {gift.steps.map((st, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#facc15' }} />
                                          <span>{st}</span>
                                        </div>
                                      ))}
                                    </div>
                                    {gift.warning && (
                                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#facc15', marginTop: '8px', background: 'rgba(234, 179, 8, 0.15)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                                        {gift.warning}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 4. 🎯 MISIONES SECUNDARIAS */}
                      {stage.sidequests.length > 0 && (
                        <div style={{
                          background: '#090a0f',
                          padding: '16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(34, 197, 94, 0.25)'
                        }}>
                          <h3 style={{
                            fontSize: '0.82rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#4ade80',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px'
                          }}>
                            <Target style={{ width: '16px', height: '16px' }} />
                            <span>🎯 MISIONES SECUNDARIAS EN EL MOMENTO CORRECTO</span>
                          </h3>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {stage.sidequests.map((sq) => {
                              const sqKey = `quest_${stage.id}_${sq.id}`;
                              const isSqChecked = !!currentChecked[sqKey];
                              const questObj = questMap[sq.questRefId];

                              return (
                                <div
                                  key={sq.id}
                                  style={{
                                    padding: '14px',
                                    background: '#13141f',
                                    borderRadius: '12px',
                                    border: '1px solid #222436',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justify: 'space-between',
                                    gap: '12px'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: '1', minWidth: '260px' }}>
                                    <button
                                      onClick={() => toggleCheck(sqKey)}
                                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isSqChecked ? '#4ade80' : '#6b7280', marginTop: '2px' }}
                                      title="Marcar como completada"
                                    >
                                      {isSqChecked ? <CheckCircle2 style={{ width: '22px', height: '22px' }} /> : <Circle style={{ width: '22px', height: '22px' }} />}
                                    </button>

                                    <div>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                                          {sq.name}
                                        </h4>
                                        <span style={{
                                          fontSize: '0.7rem',
                                          padding: '2px 8px',
                                          borderRadius: '12px',
                                          fontWeight: 700,
                                          background: sq.status === 'must_complete' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                                          color: sq.status === 'must_complete' ? '#facc15' : '#4ade80',
                                          border: sq.status === 'must_complete' ? '1px solid rgba(234, 179, 8, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)'
                                        }}>
                                          {sq.statusLabel}
                                        </span>
                                      </div>

                                      <p style={{ fontSize: '0.75rem', color: '#9499ad', margin: '4px 0 0 0' }}>
                                        📍 <strong>Inicio:</strong> {sq.location} | 👤 <strong>NPC:</strong> {sq.npc}
                                      </p>
                                      <p style={{ fontSize: '0.75rem', color: '#fde047', margin: '2px 0 0 0' }}>
                                        🎁 <strong>Recompensa:</strong> {sq.rewards}
                                      </p>

                                      <div style={{ fontSize: '0.75rem', color: '#e2e8f0', marginTop: '6px' }}>
                                        {sq.steps.map((st, i) => (
                                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
                                            <span>{st}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {questObj && (
                                    <button
                                      onClick={() => onSelectQuest && onSelectQuest(questObj)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        background: 'rgba(34, 197, 94, 0.15)',
                                        color: '#4ade80',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <span>Ver Misión Completa</span>
                                      <ExternalLink style={{ width: '14px', height: '14px' }} />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 5. ⚔️ BATALLAS Y JEFES INTEGRADAS */}
                      {stage.bosses.length > 0 && (
                        <div style={{
                          background: '#090a0f',
                          padding: '16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(229, 57, 53, 0.3)'
                        }}>
                          <h3 style={{
                            fontSize: '0.82rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#f87171',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px'
                          }}>
                            <Swords style={{ width: '16px', height: '16px' }} />
                            <span>⚔️ BATALLAS Y COMBATES DE JEFE EN ESTA ETAPA</span>
                          </h3>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {stage.bosses.map((bRef) => {
                              const bKey = `boss_${stage.id}_${bRef.bossId}`;
                              const isBossChecked = !!currentChecked[bKey];
                              const bossObj = bossMap[bRef.bossId];
                              const isTeamOpen = !!expandedBossTeams[bRef.bossId];

                              return (
                                <div
                                  key={bRef.bossId}
                                  style={{
                                    padding: '14px',
                                    background: '#13141f',
                                    borderRadius: '12px',
                                    border: '1px solid #222436',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                  }}
                                >
                                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <button
                                        onClick={() => toggleCheck(bKey)}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isBossChecked ? '#ef4444' : '#6b7280' }}
                                        title="Marcar combate como ganado"
                                      >
                                        {isBossChecked ? <CheckCircle2 style={{ width: '22px', height: '22px' }} /> : <Circle style={{ width: '22px', height: '22px' }} />}
                                      </button>

                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: '#f87171' }}>
                                            VS. {bRef.trainerName}
                                          </span>
                                          <span style={{ fontSize: '0.72rem', padding: '2px 6px', borderRadius: '4px', background: '#202234', color: '#c5c9db', fontWeight: 700, border: '1px solid #2e314a' }}>
                                            {bRef.levelRange}
                                          </span>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#9499ad', margin: '2px 0 0 0' }}>
                                          {bRef.title} • {bRef.location}
                                        </p>
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      {bossObj && (
                                        <button
                                          onClick={() => toggleBossTeam(bRef.bossId)}
                                          style={{
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            background: '#1f2130',
                                            color: '#c5c9db',
                                            border: '1px solid #2e314a',
                                            fontSize: '0.78rem',
                                            fontWeight: 700,
                                            cursor: 'pointer'
                                          }}
                                        >
                                          {isTeamOpen ? 'Ocultar Equipo' : `Ver Equipo (${bossObj.team.length})`}
                                        </button>
                                      )}

                                      {bossObj && (
                                        <button
                                          onClick={() => onSelectBoss && onSelectBoss(bossObj)}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            background: 'rgba(229, 57, 53, 0.15)',
                                            color: '#f87171',
                                            border: '1px solid rgba(229, 57, 53, 0.3)',
                                            fontSize: '0.78rem',
                                            fontWeight: 700,
                                            cursor: 'pointer'
                                          }}
                                        >
                                          <span>Ficha del Jefe</span>
                                          <ExternalLink style={{ width: '14px', height: '14px' }} />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* DIFFICULTY NOTE */}
                                  <div style={{
                                    fontSize: '0.75rem',
                                    background: 'rgba(229, 57, 53, 0.1)',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(229, 57, 53, 0.25)',
                                    color: '#e2e8f0'
                                  }}>
                                    <strong style={{ color: '#f87171' }}>🔴 Dificultad: </strong>
                                    {bRef.difficultyNote}
                                  </div>

                                  {/* EXPANDED FULL TEAM VIEW */}
                                  {isTeamOpen && bossObj && (() => {
                                    const teamToDisplay = (difficulty === 'easy' && bossObj.easy_team && bossObj.easy_team.length > 0)
                                      ? bossObj.easy_team
                                      : (bossObj.hard_team && bossObj.hard_team.length > 0 ? bossObj.hard_team : bossObj.team);

                                    return (
                                      <div style={{ paddingTop: '10px', borderTop: '1px solid #222436' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: difficulty === 'hard' ? '#f87171' : '#4ade80' }}>
                                            {difficulty === 'hard' ? '🔴 EQUIPO MODO DIFÍCIL (Compensación competitiva)' : '🟢 EQUIPO MODO FÁCIL (Estándar)'}
                                          </span>
                                          <span style={{ fontSize: '0.7rem', color: '#9499ad' }}>
                                            {teamToDisplay.length} Pokémon
                                          </span>
                                        </div>
                                        <div style={{
                                          display: 'grid',
                                          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                          gap: '8px'
                                        }}>
                                          {teamToDisplay.map((poke, pIdx) => (
                                            <div
                                              key={pIdx}
                                              style={{
                                                padding: '10px',
                                                background: '#090a0f',
                                                borderRadius: '8px',
                                                border: difficulty === 'hard' ? '1px solid rgba(229, 57, 53, 0.25)' : '1px solid rgba(34, 197, 94, 0.25)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                              }}
                                            >
                                              <img
                                                src={getPokemonSprite(poke.name)}
                                                alt={poke.name}
                                                style={{ width: '42px', height: '42px', objectFit: 'contain' }}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                              />
                                              <div style={{ fontSize: '0.75rem', minWidth: 0, flex: 1 }}>
                                                <div style={{ fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                  <span>{poke.name}</span>
                                                  <span style={{ fontSize: '0.65rem', color: difficulty === 'hard' ? '#f87171' : '#4ade80', fontFamily: 'monospace' }}>Nv.{poke.level}</span>
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                  🎒 {poke.item || 'Sin objeto'}
                                                </div>
                                                {(poke.nature || poke.ability) && (
                                                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {poke.nature && poke.nature !== '-' && poke.nature !== 'No confirmada' ? `Nat: ${poke.nature} ` : ''}
                                                    {poke.ability && poke.ability !== '-' ? `• Hab: ${poke.ability}` : ''}
                                                  </div>
                                                )}
                                                {poke.moves && poke.moves.length > 0 && (
                                                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    ⚔️ {poke.moves.slice(0, 3).join(', ')}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 6. 🎒 OBJETOS IMPORTANTES */}
                      {stage.items.length > 0 && (
                        <div style={{
                          background: '#090a0f',
                          padding: '16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(192, 132, 252, 0.25)'
                        }}>
                          <h3 style={{
                            fontSize: '0.82rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#c084fc',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px'
                          }}>
                            <Package style={{ width: '16px', height: '16px' }} />
                            <span>🎒 OBJETOS CLAVE Y COMPETITIVOS DE ESTA ZONA</span>
                          </h3>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '8px'
                          }}>
                            {stage.items.map((it) => {
                              const itKey = `item_${stage.id}_${it.id}`;
                              const isItChecked = !!currentChecked[itKey];

                              return (
                                <div
                                  key={it.id}
                                  style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: isItChecked ? '1px solid rgba(192, 132, 252, 0.3)' : '1px solid #222436',
                                    background: isItChecked ? 'rgba(192, 132, 252, 0.08)' : '#13141f',
                                    opacity: isItChecked ? 0.75 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                >
                                  <button
                                    onClick={() => toggleCheck(itKey)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isItChecked ? '#c084fc' : '#6b7280' }}
                                    title="Marcar objeto recogido"
                                  >
                                    {isItChecked ? <CheckCircle2 style={{ width: '16px', height: '16px' }} /> : <Circle style={{ width: '16px', height: '16px' }} />}
                                  </button>

                                  <div style={{ minWidth: 0, flex: 1, fontSize: '0.75rem' }}>
                                    <div style={{ fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</span>
                                      {it.isMissable && (
                                        <span style={{ fontSize: '0.6rem', padding: '1px 4px', borderRadius: '4px', background: 'rgba(229, 57, 53, 0.2)', color: '#f87171', fontWeight: 800, border: '1px solid rgba(229, 57, 53, 0.4)' }}>
                                          PERDIBLE
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#9499ad', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      📍 {it.location}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 7. ⚠️ CONTENIDO PERDIBLE / ¡NO CONTINÚES TODAVÍA! */}
                      {stage.missables.length > 0 && (
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.4) 0%, rgba(234, 179, 8, 0.2) 100%)',
                          padding: '16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(239, 68, 68, 0.6)',
                          boxShadow: '0 4px 14px rgba(229, 57, 53, 0.2)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <AlertTriangle style={{ width: '20px', height: '20px', color: '#facc15' }} />
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: '#fde047', letterSpacing: '0.05em', margin: 0 }}>
                              ⚠️ ¡NO CONTINÚES TODAVÍA! — CONTENIDO PERDIBLE CRÍTICO
                            </h3>
                          </div>

                          {stage.missables.map((miss, mIdx) => (
                            <div key={mIdx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                              <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', margin: 0 }}>{miss.title}</h4>
                              <p style={{ fontSize: '0.78rem', color: '#e2e8f0', lineHeight: 1.5, background: 'rgba(0, 0, 0, 0.4)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(229, 57, 53, 0.3)', margin: 0 }}>
                                {miss.warning}
                              </p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' }}>
                                {miss.checklist.map((chk, cIdx) => (
                                  <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#fef08a' }}>
                                    <Check style={{ width: '14px', height: '14px', color: '#facc15', flexShrink: 0 }} />
                                    <span>{chk}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 8. 🔄 EVOLUCIONES ESPECIALES */}
                      {stage.specialEvolutionNote && (
                        <div style={{
                          background: '#090a0f',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(34, 211, 238, 0.3)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '0.78rem',
                          color: '#e2e8f0'
                        }}>
                          <Sparkles style={{ width: '16px', height: '16px', color: '#22d3ee', flexShrink: 0, marginTop: '2px' }} />
                          <p style={{ margin: 0, lineHeight: 1.5 }}>
                            <strong style={{ color: '#67e8f9' }}>🔄 Evolución Contextual: </strong>
                            {stage.specialEvolutionNote}
                          </p>
                        </div>
                      )}

                      {/* 9. ⚠️ ANTES DE SALIR DE ESTA ZONA */}
                      {stage.beforeLeavingChecklist.length > 0 && (
                        <div style={{
                          background: '#090a0f',
                          padding: '16px',
                          borderRadius: '12px',
                          border: '1px solid #222436'
                        }}>
                          <h4 style={{
                            fontSize: '0.78rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            color: '#e2e8f0',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '10px'
                          }}>
                            <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--color-rocket)' }} />
                            <span>⚠️ ANTES DE SALIR DE ESTA ZONA (CHECKLIST DEL 100%)</span>
                          </h4>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '8px'
                          }}>
                            {stage.beforeLeavingChecklist.map((task, tIdx) => {
                              const tKey = `leaving_${stage.id}_${tIdx}`;
                              const isTaskDone = !!currentChecked[tKey];

                              return (
                                <button
                                  key={tIdx}
                                  onClick={() => toggleCheck(tKey)}
                                  style={{
                                    textAlign: 'left',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: isTaskDone ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid #222436',
                                    background: isTaskDone ? 'rgba(34, 197, 94, 0.08)' : '#13141f',
                                    color: isTaskDone ? '#9499ad' : '#e2e8f0',
                                    textDecoration: isTaskDone ? 'line-through' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <div style={{
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '4px',
                                    border: isTaskDone ? '1px solid #22c55e' : '1px solid #4b5563',
                                    background: isTaskDone ? '#22c55e' : 'transparent',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    {isTaskDone && <Check style={{ width: '12px', height: '12px' }} />}
                                  </div>
                                  <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{task}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 10. ➡️ SIGUIENTE PASO */}
                      <div style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(90deg, rgba(139, 0, 0, 0.2) 0%, #13141f 100%)',
                        borderRadius: '10px',
                        border: '1px solid rgba(229, 57, 53, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        gap: '12px',
                        fontSize: '0.8rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                          <ArrowRight style={{ width: '16px', height: '16px', color: 'var(--color-rocket)', flexShrink: 0 }} />
                          <span><strong>➡️ Siguiente paso:</strong> {stage.nextStep}</span>
                        </div>

                        {!isStageCompleted && (
                          <button
                            onClick={() => toggleCheck(stageMasterKey)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: 'rgba(34, 197, 94, 0.2)',
                              color: '#4ade80',
                              border: '1px solid #22c55e',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              flexShrink: 0
                            }}
                          >
                            ✓ Marcar Etapa Completa
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: ⚠️ ELEMENTOS PERDIBLES (MISSABLES) */}
      {/* ========================================================================= */}
      {activeTabSub === 'missables' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'rgba(234, 179, 8, 0.08)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(234, 179, 8, 0.35)'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#facc15', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <AlertTriangle style={{ width: '24px', height: '24px', color: '#eab308' }} />
              <span>GUÍA COMPLETA DE ELEMENTOS PERDIBLES (MISSABLES)</span>
            </h2>
            <p style={{ color: '#c5c9db', fontSize: '0.88rem', marginTop: '6px', margin: '6px 0 0 0' }}>
              Todos los objetos, Pokémon y eventos de Pokémon Edición Team Rocket cuyo desbloqueo es irreversible si se omiten durante el recorrido, contrastados con la documentación oficial.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {[
              {
                title: "1. Repartir Experiencia (Exp Share)",
                location: "Cueva Perdida (Isla Inta - Acto I)",
                warning: "Al derrotar a la Cónsul en Cueva Perdida, el Repartir Experiencia cae al suelo. Debes recogerlo antes de tomar el barco a Kanto continental, o desaparecerá.",
                type: "Objeto Clave"
              },
              {
                title: "2. Meteorito de Phanpy por Duraludon",
                location: "Pilar Recuerdo (Isla Inta) ➔ Cabaña Secreta (Isla Exta)",
                warning: "El Phanpy entregado en la secundaria del Pilar Recuerdo lleva un Meteorito equipado. NO LO VENDAS NI TIRES. Es el requisito indispensable para entregárselo al científico en la cabaña secreta de Isla Exta y obtener a Duraludon Nv. 50.",
                type: "Objeto Clave & Pokémon"
              },
              {
                title: "3. La Estafa de Magikarp en Mt. Moon",
                location: "Centro Pokémon de Mt. Moon ➔ Ciudad Fucsia",
                warning: "Debes comprar el Magikarp por 500 Pokés en el Centro Pokémon de Mt. Moon ('dejarse estafar'). Si no lo compras, el científico en Ciudad Fucsia jamás te hablará sobre la red de estafadores, perdiendo a Charmander Nv. 5, Snorlax Nv. 30 y 200.000 Pokés.",
                type: "Evento & Pack Pokémon"
              },
              {
                title: "4. Secuencia Estricta de Sevii (Evita Softlock)",
                location: "Archipiélago Sete (Acto II)",
                warning: "Sigue el orden estricto: Zeus en Isla 4 ➔ Magno en Mt. Ascuas ➔ Aquiles en Valle Ruinas ➔ Zeus en Cueva Cambiante ➔ Interior de Mt. Ascuas.",
                type: "Secuencia de Historia"
              },
              {
                title: "5. Elección de los 2 Millones de Pokés",
                location: "Almacén Oculto de Olivo (Acto III)",
                warning: "Al derrotar a los estafadores en el almacén al sureste de Olivo, debes responder 'SÍ' en el cuadro de diálogo para recibir los 2.000.000 Pokés. Si respondes 'NO', no recibirás nada.",
                type: "Recompensa Monetaria"
              },
              {
                title: "6. Desbloqueo de Giovanni en el DLC",
                location: "Orquídea & Misiones 1, 2 y 3 (Acto IV)",
                warning: "Para activar la llamada de Giovanni es obligatorio haber completado Lago Furia, Vías de Tren y Torre Dun al 100%, y presenciar la escena con Tristana en Orquídea.",
                type: "Progresión DLC"
              }
            ].map((m, idx) => (
              <div key={idx} style={{
                padding: '16px',
                background: '#13141f',
                borderRadius: '12px',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontWeight: 900, color: '#fff', fontSize: '1rem', margin: 0 }}>{m.title}</h3>
                  <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', fontWeight: 800, border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                    {m.type}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9499ad', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin style={{ width: '14px', height: '14px', color: '#eab308' }} />
                  <span>{m.location}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.5, background: '#090a0f', padding: '10px', borderRadius: '8px', border: '1px solid #222436', margin: 0 }}>
                  {m.warning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: ⚔️ DIFERENCIAS DE DIFICULTAD DOCUMENTADAS */}
      {/* ========================================================================= */}
      {activeTabSub === 'differences' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.08)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.35)'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Shield style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              <span>TABLA COMPARATIVA DE DIFICULTAD DOCUMENTADA</span>
            </h2>
            <p style={{ color: '#c5c9db', fontSize: '0.88rem', marginTop: '6px', margin: '6px 0 0 0' }}>
              En estricto cumplimiento de la regla de no inventar datos: esta tabla refleja únicamente las diferencias documentadas en los archivos originales del hackrom.
            </p>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #282a3d' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem', color: '#e2e8f0' }}>
              <thead>
                <tr style={{ background: '#090a0f', color: '#9499ad', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em', borderBottom: '1px solid #282a3d' }}>
                  <th style={{ padding: '14px' }}>Mecánica / Parámetro</th>
                  <th style={{ padding: '14px', color: '#4ade80' }}>🟢 Modo Fácil</th>
                  <th style={{ padding: '14px', color: '#f87171' }}>🔴 Modo Difícil</th>
                  <th style={{ padding: '14px' }}>Cita en Archivos Originales</th>
                </tr>
              </thead>
              <tbody style={{ background: '#13141f' }}>
                {diffCompData.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #1f2130' }}>
                    <td style={{ padding: '14px', fontWeight: 800, color: '#fff' }}>{row.category}</td>
                    <td style={{ padding: '14px', color: '#86efac' }}>{row.easy}</td>
                    <td style={{ padding: '14px', color: '#fca5a5', fontWeight: 700 }}>{row.hard}</td>
                    <td style={{ padding: '14px', color: '#9499ad', fontSize: '0.75rem', fontStyle: 'italic' }}>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 4: 🏆 PANTALLA SUPREMA DE 100% COMPLETADO */}
      {/* ========================================================================= */}
      {activeTabSub === 'trophy' && (
        <div style={{
          background: 'linear-gradient(180deg, rgba(234, 179, 8, 0.15) 0%, rgba(19, 20, 31, 0.95) 50%, rgba(9, 10, 15, 1) 100%)',
          padding: '32px 24px',
          borderRadius: '24px',
          border: '1px solid rgba(234, 179, 8, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #facc15 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(234, 179, 8, 0.5)'
          }}>
            <Award style={{ width: '40px', height: '40px', color: '#000' }} />
          </div>

          <div>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              background: 'rgba(234, 179, 8, 0.2)',
              color: '#facc15',
              border: '1px solid rgba(234, 179, 8, 0.4)'
            }}>
              CERTIFICACIÓN OFICIAL TEAM ROCKET
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginTop: '8px' }}>
              🏆 ¡HAS COMPLETADO POKÉMON EDICIÓN TEAM ROCKET AL 100%!
            </h2>
            <p style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-rocket)', marginTop: '4px' }}>
              MODO: {difficulty === 'hard' ? '🔴 DIFÍCIL' : '🟢 FÁCIL'} • PROGRESO: 100%
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            width: '100%',
            background: '#090a0f',
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid rgba(234, 179, 8, 0.25)',
            fontSize: '0.75rem'
          }}>
            <div style={{ background: '#13141f', padding: '8px', borderRadius: '8px' }}>
              <span style={{ color: '#9499ad', display: 'block' }}>Jefes Batidos</span>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: '#fff' }}>{stats.totalBosses} / {stats.totalBosses}</span>
            </div>
            <div style={{ background: '#13141f', padding: '8px', borderRadius: '8px' }}>
              <span style={{ color: '#9499ad', display: 'block' }}>Secundarias</span>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: '#fff' }}>{stats.totalQuests} / {stats.totalQuests}</span>
            </div>
            <div style={{ background: '#13141f', padding: '8px', borderRadius: '8px' }}>
              <span style={{ color: '#9499ad', display: 'block' }}>Pokémon Clave</span>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: '#fff' }}>{stats.totalPokemon} / {stats.totalPokemon}</span>
            </div>
            <div style={{ background: '#13141f', padding: '8px', borderRadius: '8px' }}>
              <span style={{ color: '#9499ad', display: 'block' }}>Missables</span>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: '#facc15' }}>100% Asegurados</span>
            </div>
          </div>

          <p style={{ color: '#c5c9db', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
            Has demostrado ser el mayor estratega en la historia del Team Rocket. Desde tu bautismo novato en Isla Inta hasta el enfrentamiento contra el Investigador Oak y Giovanni en el simulador VR de Nivel Imposible.
          </p>

          <button
            onClick={() => setActiveTabSub('walkthrough')}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              background: '#1f2130',
              color: '#fff',
              border: '1px solid #2e314a',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            ← Volver al Recorrido
          </button>
        </div>
      )}
    </div>
  );
}
