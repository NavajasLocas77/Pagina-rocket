import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Play,
  Search,
  Award,
  Sparkles,
  BookOpen,
  Info,
  Check,
  Flame,
  Swords,
  Layers
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
        el.classList.add('pulse-active');
        setTimeout(() => el.classList.remove('pulse-active'), 3000);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ========================================================================= */}
      {/* HERO HEADER: TITLE, DIFFICULTY SWITCHER & MAIN NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-red-950/70 via-gray-900 to-black p-6 rounded-2xl border border-red-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Target className="w-64 h-64 text-red-500" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600/20 border border-red-500/30 rounded-xl text-red-500 shadow-inner">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-full bg-red-600 text-white">
                    Walkthrough Real 100%
                  </span>
                  <span className="text-xs text-gray-400">Edición Team Rocket</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide mt-1">
                  GUÍA 100% — RECORRIDO OFICIAL PASO A PASO
                </h1>
              </div>
            </div>

            {/* DUAL DIFFICULTY TOGGLE */}
            <div className="flex items-center bg-gray-950/80 p-1.5 rounded-xl border border-gray-800 shadow-lg">
              <button
                onClick={() => setDifficulty('easy')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  difficulty === 'easy'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-900/50 scale-102'
                    : 'text-gray-400 hover:text-green-400'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${difficulty === 'easy' ? 'bg-white' : 'bg-green-500'}`} />
                <span>🟢 MODO FÁCIL</span>
              </button>

              <button
                onClick={() => setDifficulty('hard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  difficulty === 'hard'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/50 scale-102'
                    : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${difficulty === 'hard' ? 'bg-white' : 'bg-red-500 animate-pulse'}`} />
                <span>🔴 MODO DIFÍCIL</span>
              </button>
            </div>
          </div>

          <p className="text-gray-300 text-sm md:text-base max-w-4xl leading-relaxed">
            {difficulty === 'hard' ? (
              <span className="text-gray-200">
                <strong className="text-red-400">Modo Difícil Activo:</strong> Recorrido cronológico integral optimizado para completar el 100% frente a equipos con IVs 31, 252 EVs y coberturas competitivas. Consulta en cada etapa la historia paso a paso, Pokémon obtenibles ahora, secundarias en su momento justo, objetos, batallas con sus fichas y contenido perdible.
              </span>
            ) : (
              <span className="text-gray-200">
                <strong className="text-green-400">Modo Fácil Activo:</strong> Recorrido guiado paso a paso con seguimiento independiente para completar el 100% de la historia, misiones y capturas.
              </span>
            )}
          </p>

          {/* SUB-TABS NAVIGATION */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/80">
            <button
              onClick={() => setActiveTabSub('walkthrough')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTabSub === 'walkthrough'
                  ? 'bg-gray-800 text-white border border-gray-700 shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
              }`}
            >
              <BookOpen className="w-4 h-4 text-red-400" />
              <span>🗺️ Recorrido Paso a Paso 100%</span>
            </button>

            <button
              onClick={() => setActiveTabSub('missables')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTabSub === 'missables'
                  ? 'bg-gray-800 text-yellow-400 border border-yellow-700/50 shadow-md'
                  : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-800/40'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span>⚠️ Elementos Perdibles (Missables)</span>
            </button>

            <button
              onClick={() => setActiveTabSub('differences')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTabSub === 'differences'
                  ? 'bg-gray-800 text-blue-400 border border-blue-700/50 shadow-md'
                  : 'text-gray-400 hover:text-blue-400 hover:bg-gray-800/40'
              }`}
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span>⚔️ Diferencias Documentadas</span>
            </button>

            {isGame100Completed && (
              <button
                onClick={() => setActiveTabSub('trophy')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-lg animate-bounce ml-auto"
              >
                <Award className="w-4 h-4 text-black" />
                <span>🏆 ¡VER PANTALLA 100%!</span>
              </button>
            )}

            <button
              onClick={resetCurrentProgress}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-400 hover:bg-red-950/20 ml-auto transition-colors"
              title="Reiniciar progreso del modo actual"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar {difficulty === 'easy' ? 'Fácil' : 'Difícil'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: WALKTHROUGH INTERACTIVO REAL */}
      {/* ========================================================================= */}
      {activeTabSub === 'walkthrough' && (
        <div className="space-y-6">
          {/* SYSTEM "¿QUÉ PUEDO HACER AHORA?" & "CONTINUAR MI PARTIDA" */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* WIDGET ¿QUÉ PUEDO HACER AHORA? */}
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 via-gray-950 to-black p-5 rounded-2xl border border-red-500/30 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider text-red-400">
                    📍 ¿QUÉ PUEDO HACER AHORA EN MI PARTIDA?
                  </span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                  {activeStage.actTitle}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-400">Zona actual según tu avance:</div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                    <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                    <span>{activeStage.location}</span>
                  </h3>
                  <div className="text-xs text-red-400 font-semibold mt-1">
                    🎯 Nivel recomendado: <span className="text-white font-bold">{activeStage.recommendedLevel}</span>
                  </div>
                </div>

                <button
                  onClick={scrollToActiveStage}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-lg shadow-red-900/40 transition-all transform hover:scale-103 shrink-0"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>▶ CONTINUAR EN ESTA ZONA</span>
                </button>
              </div>

              {/* QUICK COUNTERS AT THIS EXACT STAGE */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4 pt-3 border-t border-gray-800/80">
                <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800 text-center">
                  <span className="text-xs text-gray-400 block">Secundarias</span>
                  <span className="text-sm font-black text-green-400">
                    🟢 {activeStage.sidequests.length} Disp.
                  </span>
                </div>
                <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800 text-center">
                  <span className="text-xs text-gray-400 block">Pokémon</span>
                  <span className="text-sm font-black text-blue-400">
                    🐾 {activeStage.availablePokemon.length} Nuevos
                  </span>
                </div>
                <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800 text-center">
                  <span className="text-xs text-gray-400 block">Regalos</span>
                  <span className="text-sm font-black text-yellow-400">
                    🎁 {activeStage.gifts.length} Clave
                  </span>
                </div>
                <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800 text-center">
                  <span className="text-xs text-gray-400 block">Batallas</span>
                  <span className="text-sm font-black text-red-400">
                    ⚔️ {activeStage.bosses.length} Jefes
                  </span>
                </div>
                <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800 text-center">
                  <span className="text-xs text-gray-400 block">Objetos</span>
                  <span className="text-sm font-black text-purple-400">
                    🎒 {activeStage.items.length} Útiles
                  </span>
                </div>
                <div className="p-2 bg-gray-900/80 rounded-lg border border-gray-800 text-center">
                  <span className="text-xs text-gray-400 block">Perdibles</span>
                  <span className={`text-sm font-black ${activeStage.missables.length > 0 ? 'text-amber-400 animate-pulse' : 'text-gray-500'}`}>
                    ⚠️ {activeStage.missables.length}
                  </span>
                </div>
              </div>
            </div>

            {/* GLOBAL 100% PROGRESS CARD */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black p-5 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-gray-400">PROGRESO TOTAL {difficulty === 'hard' ? '🔴 DIFÍCIL' : '🟢 FÁCIL'}</span>
                  <span className="text-lg font-black text-red-400">{stats.percent}%</span>
                </div>
                <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden p-0.5 border border-gray-700">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      difficulty === 'hard' 
                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-amber-500' 
                        : 'bg-gradient-to-r from-green-600 to-emerald-400'
                    }`}
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-2 flex justify-between">
                  <span>Hitos completados:</span>
                  <span className="font-bold text-white">{stats.completedTasks} / {stats.totalTasks}</span>
                </div>
              </div>

              {/* STATS BREAKDOWN */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-gray-800 mt-3">
                <div className="flex justify-between text-gray-400">
                  <span>⚔️ Jefes:</span>
                  <span className="font-bold text-gray-200">{stats.completedBosses}/{stats.totalBosses}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>📜 Secundarias:</span>
                  <span className="font-bold text-gray-200">{stats.completedQuests}/{stats.totalQuests}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>🐾 Pokémon:</span>
                  <span className="font-bold text-gray-200">{stats.completedPokemon}/{stats.totalPokemon}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>🎁 Regalos:</span>
                  <span className="font-bold text-gray-200">{stats.completedGifts}/{stats.totalGifts}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SEARCH & ACT FILTERS */}
          {/* ========================================================================= */}
          <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Acto:
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                    activeAct === act.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar ciudad, Pokémon, jefe u objeto..."
                className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STAGES LIST: 38 COMPREHENSIVE CHRONOLOGICAL STAGES */}
          {/* ========================================================================= */}
          <div className="space-y-6">
            {filteredStages.map((stage) => {
              const isCollapsed = collapsedStages[stage.id];
              const stageMasterKey = `stage_${stage.id}`;
              const isStageCompleted = !!currentChecked[stageMasterKey];

              return (
                <div
                  key={stage.id}
                  id={`walkthrough-stage-${stage.id}`}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isStageCompleted
                      ? 'bg-gray-950/60 border-gray-800/80 opacity-90'
                      : 'bg-gray-900/90 border-gray-800 shadow-xl hover:border-red-500/40'
                  }`}
                >
                  {/* STAGE HEADER */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleCheck(stageMasterKey)}
                        className={`p-1.5 rounded-lg transition-transform hover:scale-110 ${
                          isStageCompleted ? 'text-green-500' : 'text-gray-500 hover:text-red-400'
                        }`}
                        title={isStageCompleted ? "Etapa marcada como completada" : "Marcar etapa completa"}
                      >
                        {isStageCompleted ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : (
                          <Circle className="w-7 h-7" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-xs font-black uppercase rounded bg-red-950 text-red-400 border border-red-800/50">
                            Paso #{stage.order}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">
                            {stage.actTitle}
                          </span>
                        </div>
                        <h2 className={`text-lg sm:text-xl font-black mt-0.5 flex items-center gap-2 ${
                          isStageCompleted ? 'line-through text-gray-500' : 'text-white'
                        }`}>
                          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                          <span>{stage.location}</span>
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Nivel recomendado:</span>
                        <span className="text-xs font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                          {stage.recommendedLevel}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleStageCollapse(stage.id)}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                        title={isCollapsed ? "Expandir etapa" : "Colapsar etapa"}
                      >
                        {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rotate-90" />}
                      </button>
                    </div>
                  </div>

                  {/* STAGE ACCORDION CONTENT */}
                  {!isCollapsed && (
                    <div className="p-4 sm:p-6 space-y-6">
                      {/* 1. 📖 HISTORIA PASO A PASO */}
                      <div className="bg-gray-950/70 p-4 rounded-xl border border-gray-800/80">
                        <h3 className="text-sm font-black uppercase tracking-wider text-red-400 flex items-center gap-2 mb-3">
                          <BookOpen className="w-4 h-4" />
                          <span>📖 HISTORIA PRINCIPAL — QUÉ HACER PASO A PASO</span>
                        </h3>
                        <div className="space-y-2">
                          {stage.storySteps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-200">
                              <span className="w-5 h-5 rounded-full bg-red-900/40 border border-red-700/50 text-red-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. 🐾 POKÉMON DISPONIBLES EN ESTE MOMENTO */}
                      {stage.availablePokemon.length > 0 && (
                        <div className="bg-gray-950/70 p-4 rounded-xl border border-blue-900/30">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                              <Compass className="w-4 h-4" />
                              <span>🐾 POKÉMON QUE PUEDES CONSEGUIR EN ESTE MOMENTO</span>
                            </h3>
                            <span className="text-xs text-gray-400">
                              {stage.availablePokemon.length} disponibles
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {stage.availablePokemon.map((pkmn, idx) => {
                              const pkmnKey = `pkmn_${stage.id}_${pkmn.name}`;
                              const isPkmnChecked = !!currentChecked[pkmnKey];

                              return (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                                    isPkmnChecked
                                      ? 'bg-blue-950/20 border-blue-800/40 opacity-70'
                                      : 'bg-gray-900 border-gray-800 hover:border-blue-500/50'
                                  }`}
                                >
                                  <button
                                    onClick={() => toggleCheck(pkmnKey)}
                                    className="text-gray-500 hover:text-blue-400 shrink-0"
                                    title="Marcar como obtenido"
                                  >
                                    {isPkmnChecked ? (
                                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                    ) : (
                                      <Circle className="w-5 h-5" />
                                    )}
                                  </button>

                                  <img
                                    src={getPokemonSprite(pkmn.name, pkmn.dexNum)}
                                    alt={pkmn.name}
                                    className="w-12 h-12 object-contain bg-black/40 rounded-lg p-1 border border-gray-800 shrink-0 cursor-pointer"
                                    onClick={() => onSelectPokemon && onSelectPokemon(pkmn.name)}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-black text-sm text-white truncate cursor-pointer hover:text-blue-400"
                                        onClick={() => onSelectPokemon && onSelectPokemon(pkmn.name)}
                                      >
                                        {pkmn.name}
                                      </span>
                                      {pkmn.is100Recommended && (
                                        <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                          100%
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5 truncate">
                                      {pkmn.method} • {pkmn.level}
                                    </div>
                                    <div className="text-[11px] text-gray-500 truncate">
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
                        <div className="bg-gradient-to-r from-amber-950/40 to-gray-950 p-4 rounded-xl border border-amber-700/40">
                          <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
                            <Gift className="w-4 h-4" />
                            <span>🎁 POKÉMON REGALADO DISPONIBLE EN ESTA ETAPA</span>
                          </h3>

                          <div className="space-y-3">
                            {stage.gifts.map((gift) => {
                              const giftKey = `gift_${stage.id}_${gift.id}`;
                              const isGiftChecked = !!currentChecked[giftKey];

                              return (
                                <div
                                  key={gift.id}
                                  className="p-4 bg-gray-900/90 rounded-xl border border-amber-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                  <div className="flex items-start gap-3">
                                    <button
                                      onClick={() => toggleCheck(giftKey)}
                                      className="mt-1 text-gray-500 hover:text-amber-400 shrink-0"
                                      title="Marcar como recibido"
                                    >
                                      {isGiftChecked ? (
                                        <CheckCircle2 className="w-6 h-6 text-amber-400" />
                                      ) : (
                                        <Circle className="w-6 h-6" />
                                      )}
                                    </button>

                                    <img
                                      src={getPokemonSprite(gift.name, gift.dexNum)}
                                      alt={gift.name}
                                      className="w-14 h-14 object-contain bg-black/60 rounded-xl p-1.5 border border-amber-800/40 shrink-0 cursor-pointer"
                                      onClick={() => onSelectPokemon && onSelectPokemon(gift.name)}
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />

                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-base font-black text-white hover:text-amber-400 cursor-pointer"
                                          onClick={() => onSelectPokemon && onSelectPokemon(gift.name)}
                                        >
                                          {gift.name} ({gift.level})
                                        </h4>
                                        <span className="text-xs px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 font-bold border border-amber-700/40">
                                          Objeto: {gift.heldItem}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-400 mt-1">
                                        👤 <strong>NPC:</strong> {gift.npc} | 📍 <strong>Ubicación:</strong> {gift.location}
                                      </p>
                                      <div className="text-xs text-gray-300 mt-2 space-y-1">
                                        <strong>Pasos para conseguirlo:</strong>
                                        {gift.steps.map((st, i) => (
                                          <div key={i} className="flex items-center gap-1.5 text-gray-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            <span>{st}</span>
                                          </div>
                                        ))}
                                      </div>
                                      {gift.warning && (
                                        <p className="text-xs font-bold text-amber-400 mt-2 bg-amber-950/60 p-2 rounded border border-amber-800/40">
                                          {gift.warning}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 4. 🎯 MISIONES SECUNDARIAS */}
                      {stage.sidequests.length > 0 && (
                        <div className="bg-gray-950/70 p-4 rounded-xl border border-green-900/30">
                          <h3 className="text-sm font-black uppercase tracking-wider text-green-400 flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4" />
                            <span>🎯 MISIONES SECUNDARIAS EN EL MOMENTO CORRECTO</span>
                          </h3>

                          <div className="space-y-3">
                            {stage.sidequests.map((sq) => {
                              const sqKey = `quest_${stage.id}_${sq.id}`;
                              const isSqChecked = !!currentChecked[sqKey];
                              const questObj = questMap[sq.questRefId];

                              return (
                                <div
                                  key={sq.id}
                                  className="p-4 bg-gray-900/90 rounded-xl border border-gray-800 hover:border-green-800/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                  <div className="flex items-start gap-3">
                                    <button
                                      onClick={() => toggleCheck(sqKey)}
                                      className="mt-1 text-gray-500 hover:text-green-400 shrink-0"
                                      title="Marcar como completada"
                                    >
                                      {isSqChecked ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                                      ) : (
                                        <Circle className="w-6 h-6" />
                                      )}
                                    </button>

                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h4 className="text-base font-black text-white">
                                          {sq.name}
                                        </h4>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                          sq.status === 'must_complete'
                                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                            : sq.status === 'unlocks_later'
                                            ? 'bg-gray-800 text-gray-400'
                                            : 'bg-green-950 text-green-400 border border-green-800'
                                        }`}>
                                          {sq.statusLabel}
                                        </span>
                                      </div>

                                      <p className="text-xs text-gray-400 mt-1">
                                        📍 <strong>Inicio:</strong> {sq.location} | 👤 <strong>NPC:</strong> {sq.npc}
                                      </p>
                                      <p className="text-xs text-amber-300/90 mt-0.5">
                                        🎁 <strong>Recompensa:</strong> {sq.rewards}
                                      </p>

                                      <div className="text-xs text-gray-300 mt-2 space-y-1">
                                        {sq.steps.map((st, i) => (
                                          <div key={i} className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            <span>{st}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {questObj && (
                                    <button
                                      onClick={() => onSelectQuest && onSelectQuest(questObj)}
                                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-950/60 hover:bg-green-900/60 text-green-400 border border-green-800/40 text-xs font-bold transition-colors shrink-0 self-start md:self-center"
                                    >
                                      <span>Ver Misión Completa</span>
                                      <ExternalLink className="w-3.5 h-3.5" />
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
                        <div className="bg-gray-950/70 p-4 rounded-xl border border-red-900/30">
                          <h3 className="text-sm font-black uppercase tracking-wider text-red-400 flex items-center gap-2 mb-3">
                            <Swords className="w-4 h-4" />
                            <span>⚔️ BATALLAS Y COMBATES DE JEFE EN ESTA ETAPA</span>
                          </h3>

                          <div className="space-y-4">
                            {stage.bosses.map((bRef) => {
                              const bKey = `boss_${stage.id}_${bRef.bossId}`;
                              const isBossChecked = !!currentChecked[bKey];
                              const bossObj = bossMap[bRef.bossId];
                              const isTeamOpen = !!expandedBossTeams[bRef.bossId];

                              return (
                                <div
                                  key={bRef.bossId}
                                  className="p-4 bg-gray-900/90 rounded-xl border border-gray-800 hover:border-red-800/50 transition-all space-y-3"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => toggleCheck(bKey)}
                                        className="text-gray-500 hover:text-red-400 shrink-0"
                                        title="Marcar combate como ganado"
                                      >
                                        {isBossChecked ? (
                                          <CheckCircle2 className="w-6 h-6 text-red-500" />
                                        ) : (
                                          <Circle className="w-6 h-6" />
                                        )}
                                      </button>

                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-black uppercase text-red-500">
                                            VS. {bRef.trainerName}
                                          </span>
                                          <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-bold border border-gray-700">
                                            {bRef.levelRange}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                          {bRef.title} • {bRef.location}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-start sm:self-center">
                                      {bossObj && (
                                        <button
                                          onClick={() => toggleBossTeam(bRef.bossId)}
                                          className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-colors"
                                        >
                                          {isTeamOpen ? 'Ocultar Equipo' : `Ver Equipo (${bossObj.team.length})`}
                                        </button>
                                      )}

                                      {bossObj && (
                                        <button
                                          onClick={() => onSelectBoss && onSelectBoss(bossObj)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-800/40 text-xs font-bold transition-colors"
                                        >
                                          <span>Ficha del Jefe</span>
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* DIFFICULTY NOTE */}
                                  <div className="text-xs bg-red-950/30 p-2.5 rounded-lg border border-red-900/40 text-gray-300">
                                    <strong className="text-red-400">🔴 Dificultad: </strong>
                                    {bRef.difficultyNote}
                                  </div>

                                  {/* EXPANDED FULL TEAM VIEW */}
                                  {isTeamOpen && bossObj && (
                                    <div className="pt-2 border-t border-gray-800">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {bossObj.team.map((poke, pIdx) => (
                                          <div
                                            key={pIdx}
                                            className="p-2.5 bg-black/50 rounded-lg border border-gray-800 flex items-center gap-3"
                                          >
                                            <img
                                              src={getPokemonSprite(poke.name)}
                                              alt={poke.name}
                                              className="w-10 h-10 object-contain shrink-0"
                                              onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                            <div className="text-xs min-w-0">
                                              <div className="font-bold text-white flex items-center gap-1">
                                                <span>{poke.name}</span>
                                                <span className="text-[10px] text-red-400 font-mono">Nv.{poke.level}</span>
                                              </div>
                                              <div className="text-[11px] text-gray-400 truncate">
                                                🎒 {poke.item || 'Sin objeto'}
                                              </div>
                                              {poke.moves && poke.moves.length > 0 && (
                                                <div className="text-[10px] text-gray-500 truncate">
                                                  ⚔️ {poke.moves.slice(0, 3).join(', ')}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 6. 🎒 OBJETOS IMPORTANTES */}
                      {stage.items.length > 0 && (
                        <div className="bg-gray-950/70 p-4 rounded-xl border border-purple-900/30">
                          <h3 className="text-sm font-black uppercase tracking-wider text-purple-400 flex items-center gap-2 mb-3">
                            <Package className="w-4 h-4" />
                            <span>🎒 OBJETOS CLAVE Y COMPETITIVOS DE ESTA ZONA</span>
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {stage.items.map((it) => {
                              const itKey = `item_${stage.id}_${it.id}`;
                              const isItChecked = !!currentChecked[itKey];

                              return (
                                <div
                                  key={it.id}
                                  className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                                    isItChecked
                                      ? 'bg-purple-950/20 border-purple-800/30 opacity-70'
                                      : 'bg-gray-900 border-gray-800'
                                  }`}
                                >
                                  <button
                                    onClick={() => toggleCheck(itKey)}
                                    className="text-gray-500 hover:text-purple-400 shrink-0"
                                    title="Marcar objeto recogido"
                                  >
                                    {isItChecked ? (
                                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                    ) : (
                                      <Circle className="w-4 h-4" />
                                    )}
                                  </button>

                                  <div className="min-w-0 flex-1 text-xs">
                                    <div className="font-bold text-white truncate flex items-center gap-1">
                                      <span>{it.name}</span>
                                      {it.isMissable && (
                                        <span className="text-[9px] px-1 rounded bg-red-950 text-red-400 font-bold border border-red-800">
                                          PERDIBLE
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-gray-400 truncate">
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
                        <div className="bg-gradient-to-r from-red-950/80 to-amber-950/80 p-4 rounded-xl border border-red-600/70 shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
                            <h3 className="text-sm font-black uppercase text-amber-300 tracking-wider">
                              ⚠️ ¡NO CONTINÚES TODAVÍA! — CONTENIDO PERDIBLE CRÍTICO
                            </h3>
                          </div>

                          {stage.missables.map((miss, mIdx) => (
                            <div key={mIdx} className="space-y-2 mt-2">
                              <h4 className="text-xs font-black text-white">{miss.title}</h4>
                              <p className="text-xs text-gray-200 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-red-800/40">
                                {miss.warning}
                              </p>
                              <div className="space-y-1 pt-1">
                                {miss.checklist.map((chk, cIdx) => (
                                  <div key={cIdx} className="flex items-center gap-2 text-xs font-bold text-amber-200">
                                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
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
                        <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-800 flex items-start gap-2.5 text-xs text-gray-300">
                          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <p>
                            <strong className="text-cyan-300">🔄 Evolución Contextual: </strong>
                            {stage.specialEvolutionNote}
                          </p>
                        </div>
                      )}

                      {/* 9. ⚠️ ANTES DE SALIR DE ESTA ZONA */}
                      {stage.beforeLeavingChecklist.length > 0 && (
                        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                          <h4 className="text-xs font-black uppercase text-gray-300 tracking-wider flex items-center gap-1.5 mb-2.5">
                            <CheckCircle2 className="w-4 h-4 text-red-500" />
                            <span>⚠️ ANTES DE SALIR DE ESTA ZONA (CHECKLIST DEL 100%)</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {stage.beforeLeavingChecklist.map((task, tIdx) => {
                              const tKey = `leaving_${stage.id}_${tIdx}`;
                              const isTaskDone = !!currentChecked[tKey];

                              return (
                                <button
                                  key={tIdx}
                                  onClick={() => toggleCheck(tKey)}
                                  className={`text-left p-2 rounded-lg border flex items-center gap-2 transition-all ${
                                    isTaskDone
                                      ? 'bg-gray-900/60 border-green-900/40 text-gray-400 line-through'
                                      : 'bg-gray-900 border-gray-800 text-gray-200 hover:border-gray-700'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    isTaskDone ? 'bg-green-600 border-green-500 text-white' : 'border-gray-600'
                                  }`}>
                                    {isTaskDone && <Check className="w-3 h-3" />}
                                  </div>
                                  <span className="text-xs font-semibold">{task}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 10. ➡️ SIGUIENTE PASO */}
                      <div className="p-3 bg-gradient-to-r from-red-950/40 via-gray-900 to-gray-950 rounded-xl border border-red-900/30 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-gray-300">
                          <ArrowRight className="w-4 h-4 text-red-500 shrink-0" />
                          <span><strong>➡️ Siguiente paso:</strong> {stage.nextStep}</span>
                        </div>

                        {!isStageCompleted && (
                          <button
                            onClick={() => toggleCheck(stageMasterKey)}
                            className="px-3 py-1.5 rounded-lg bg-green-950/80 hover:bg-green-900 text-green-400 border border-green-800 text-xs font-bold transition-colors shrink-0"
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
        <div className="space-y-6">
          <div className="bg-amber-950/30 p-5 rounded-2xl border border-amber-900/50">
            <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <span>GUÍA COMPLETA DE ELEMENTOS PERDIBLES (MISSABLES)</span>
            </h2>
            <p className="text-gray-300 text-sm mt-1">
              Todos los objetos, Pokémon y eventos de Pokémon Edición Team Rocket cuyo desbloqueo es irreversible si se omiten durante el recorrido, contrastados con la documentación oficial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div key={idx} className="p-4 bg-gray-900 rounded-xl border border-amber-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white text-base">{m.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold border border-amber-800">
                    {m.type}
                  </span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{m.location}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-2.5 rounded border border-gray-800">
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
        <div className="space-y-6">
          <div className="bg-blue-950/30 p-5 rounded-2xl border border-blue-900/50">
            <h2 className="text-xl font-black text-blue-400 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <span>TABLA COMPARATIVA DE DIFICULTAD DOCUMENTADA</span>
            </h2>
            <p className="text-gray-300 text-sm mt-1">
              En estricto cumplimiento de la regla de no inventar datos: esta tabla refleja únicamente las diferencias documentadas en los archivos originales del hackrom.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-950 text-gray-400 uppercase font-black tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-3.5">Mecánica / Parámetro</th>
                  <th className="p-3.5 text-green-400">🟢 Modo Fácil</th>
                  <th className="p-3.5 text-red-400">🔴 Modo Difícil</th>
                  <th className="p-3.5">Cita en Archivos Originales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 bg-gray-900/70">
                {diffCompData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/40">
                    <td className="p-3.5 font-bold text-white">{row.category}</td>
                    <td className="p-3.5 text-green-300">{row.easy}</td>
                    <td className="p-3.5 text-red-300 font-semibold">{row.hard}</td>
                    <td className="p-3.5 text-gray-400 text-[11px] italic">{row.notes}</td>
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
        <div className="bg-gradient-to-b from-yellow-950/40 via-gray-900 to-black p-8 rounded-3xl border border-yellow-600/50 shadow-2xl text-center space-y-6 max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-yellow-900/60 animate-pulse">
            <Award className="w-10 h-10 text-black" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              CERTIFICACIÓN OFICIAL TEAM ROCKET
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              🏆 ¡HAS COMPLETADO POKÉMON EDICIÓN TEAM ROCKET AL 100%!
            </h2>
            <p className="text-sm font-bold text-red-400 mt-1">
              MODO: {difficulty === 'hard' ? '🔴 DIFÍCIL' : '🟢 FÁCIL'} • PROGRESO: 100%
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/60 p-4 rounded-2xl border border-yellow-900/30 text-xs">
            <div className="p-2 bg-gray-900/80 rounded-lg">
              <span className="text-gray-400 block">Jefes Batidos</span>
              <span className="text-base font-black text-white">{stats.totalBosses} / {stats.totalBosses}</span>
            </div>
            <div className="p-2 bg-gray-900/80 rounded-lg">
              <span className="text-gray-400 block">Secundarias</span>
              <span className="text-base font-black text-white">{stats.totalQuests} / {stats.totalQuests}</span>
            </div>
            <div className="p-2 bg-gray-900/80 rounded-lg">
              <span className="text-gray-400 block">Pokémon Clave</span>
              <span className="text-base font-black text-white">{stats.totalPokemon} / {stats.totalPokemon}</span>
            </div>
            <div className="p-2 bg-gray-900/80 rounded-lg">
              <span className="text-gray-400 block">Missables</span>
              <span className="text-base font-black text-yellow-400">100% Asegurados</span>
            </div>
          </div>

          <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
            Has demostrado ser el mayor estratega en la historia del Team Rocket. Desde tu bautismo novato en Isla Inta hasta el enfrentamiento contra el Investigador Oak y Giovanni en el simulador VR de Nivel Imposible.
          </p>

          <button
            onClick={() => setActiveTabSub('walkthrough')}
            className="px-6 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs transition-colors"
          >
            ← Volver al Recorrido
          </button>
        </div>
      )}
    </div>
  );
}
