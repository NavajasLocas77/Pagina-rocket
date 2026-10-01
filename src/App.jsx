import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GlobalSearchModal from './components/GlobalSearchModal';
import MoveDetailModal from './components/MoveDetailModal';

// Views
import HomeView from './views/HomeView';
import Guide100View from './views/Guide100View';
import WalkthroughView from './views/WalkthroughView';
import BossesView from './views/BossesView';
import BossTeamsView from './views/BossTeamsView';
import SidequestsView from './views/SidequestsView';
import PokedexView from './views/PokedexView';
import GiftsView from './views/GiftsView';
import CustomPokemonView from './views/CustomPokemonView';
import EvolutionsView from './views/EvolutionsView';
import ItemsView from './views/ItemsView';
import MovesView from './views/MovesView';
import QoLView from './views/QoLView';
import CreditsView from './views/CreditsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMoveModal, setActiveMoveModal] = useState(null);

  // Cross-reference filters
  const [targetPokemonSearch, setTargetPokemonSearch] = useState('');
  const [targetBossId, setTargetBossId] = useState(null);
  const [targetItemSearch, setTargetItemSearch] = useState('');
  const [targetMoveSearch, setTargetMoveSearch] = useState('');

  // Persistent user state in LocalStorage
  const [spoilerMode, setSpoilerMode] = useState(() => {
    return localStorage.getItem('tre_spoiler_mode') === 'true';
  });

  const [completedBosses, setCompletedBosses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tre_completed_bosses')) || [];
    } catch {
      return [];
    }
  });

  const [completedQuests, setCompletedQuests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tre_completed_quests')) || [];
    } catch {
      return [];
    }
  });

  const [completedGifts, setCompletedGifts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tre_completed_gifts')) || [];
    } catch {
      return [];
    }
  });

  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tre_completed_steps')) || [];
    } catch {
      return [];
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('tre_spoiler_mode', spoilerMode);
  }, [spoilerMode]);

  useEffect(() => {
    localStorage.setItem('tre_completed_bosses', JSON.stringify(completedBosses));
  }, [completedBosses]);

  useEffect(() => {
    localStorage.setItem('tre_completed_quests', JSON.stringify(completedQuests));
  }, [completedQuests]);

  useEffect(() => {
    localStorage.setItem('tre_completed_gifts', JSON.stringify(completedGifts));
  }, [completedGifts]);

  useEffect(() => {
    localStorage.setItem('tre_completed_steps', JSON.stringify(completedSteps));
  }, [completedSteps]);

  // Toggle handlers
  const toggleBossCompleted = (id) => {
    setCompletedBosses(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleQuestCompleted = (id) => {
    setCompletedQuests(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleGiftCompleted = (id) => {
    setCompletedGifts(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleStepCompleted = (id) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const resetProgress = () => {
    if (window.confirm('¿Estás seguro de que deseas reiniciar todo el progreso guardado?')) {
      setCompletedBosses([]);
      setCompletedQuests([]);
      setCompletedGifts([]);
      setCompletedSteps([]);
    }
  };

  // Cross-reference navigations
  const handleSelectPokemon = (name) => {
    setTargetPokemonSearch(name);
    setActiveTab('pokedex');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBoss = (bossId) => {
    setTargetBossId(bossId);
    setActiveTab('bosses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectQuest = (questId) => {
    setActiveTab('sidequests');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMove = (moveName) => {
    setActiveMoveModal(moveName);
  };

  const handleSelectItem = (itemName) => {
    setTargetItemSearch(itemName);
    setActiveTab('items');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab, param) => {
    setActiveTab(tab);
    if (tab === 'pokedex') setTargetPokemonSearch(param || '');
    if (tab === 'bosses') setTargetBossId(param || null);
    if (tab === 'items') setTargetItemSearch(param || '');
    if (tab === 'moves') setTargetMoveSearch(param || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate Overall Progress
  const totalBossesCount = 200;
  const totalQuestsCount = 33;
  const totalGiftsCount = 23;
  const actsCount = 5;

  const bossesDone = completedBosses.length;
  const questsDone = completedQuests.length;
  const giftsDone = completedGifts.length;
  const stepsDone = completedSteps.length;
  const actsDone = Math.min(actsCount, Math.floor(stepsDone / 4));

  const totalScore = (bossesDone / totalBossesCount) * 50 + 
                     (questsDone / totalQuestsCount) * 35 + 
                     (giftsDone / totalGiftsCount) * 15;
  const percentage = Math.min(100, Math.round(totalScore));

  const progressStats = {
    percentage,
    bossesDone,
    questsDone,
    giftsDone,
    actsDone
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        spoilerMode={spoilerMode}
        setSpoilerMode={setSpoilerMode}
        setIsSearchOpen={setIsSearchOpen}
        progressStats={progressStats}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          setIsSearchOpen={setIsSearchOpen}
          spoilerMode={spoilerMode}
          setSpoilerMode={setSpoilerMode}
        />

        <main style={{ flex: 1, paddingBottom: '60px' }}>
          {activeTab === 'home' && (
            <HomeView
              setActiveTab={setActiveTab}
              progressStats={progressStats}
              resetProgress={resetProgress}
            />
          )}

          {activeTab === 'guide-100' && (
            <Guide100View
              onSelectBoss={handleSelectBoss}
              onSelectQuest={handleSelectQuest}
              onSelectPokemon={handleSelectPokemon}
              onSelectItem={handleSelectItem}
            />
          )}

          {activeTab === 'walkthrough' && (
            <WalkthroughView
              onSelectBoss={handleSelectBoss}
              onSelectPokemon={handleSelectPokemon}
              completedSteps={completedSteps}
              toggleStepCompleted={toggleStepCompleted}
            />
          )}

          {activeTab === 'bosses' && (
            <BossesView
              onSelectPokemon={handleSelectPokemon}
              onSelectMove={handleSelectMove}
              onSelectItem={handleSelectItem}
              spoilerMode={spoilerMode}
              completedBosses={completedBosses}
              toggleBossCompleted={toggleBossCompleted}
              initialBossId={targetBossId}
            />
          )}

          {activeTab === 'boss-teams' && (
            <BossTeamsView
              onSelectPokemon={handleSelectPokemon}
              onSelectMove={handleSelectMove}
              onSelectItem={handleSelectItem}
            />
          )}

          {activeTab === 'sidequests' && (
            <SidequestsView
              onSelectPokemon={handleSelectPokemon}
              onSelectBoss={handleSelectBoss}
              onSelectItem={handleSelectItem}
              completedQuests={completedQuests}
              toggleQuestCompleted={toggleQuestCompleted}
            />
          )}

          {activeTab === 'pokedex' && (
            <PokedexView
              onSelectPokemon={handleSelectPokemon}
              onSelectMove={handleSelectMove}
              onSelectItem={handleSelectItem}
              initialSearch={targetPokemonSearch}
            />
          )}

          {activeTab === 'gifts' && (
            <GiftsView
              onSelectPokemon={handleSelectPokemon}
              completedGifts={completedGifts}
              toggleGiftCompleted={toggleGiftCompleted}
            />
          )}

          {activeTab === 'custom-pkmn' && (
            <CustomPokemonView
              onSelectPokemon={handleSelectPokemon}
            />
          )}

          {activeTab === 'evolutions' && (
            <EvolutionsView
              onSelectPokemon={handleSelectPokemon}
            />
          )}

          {activeTab === 'items' && (
            <ItemsView
              initialSearch={targetItemSearch}
            />
          )}

          {activeTab === 'moves' && (
            <MovesView
              onSelectBoss={handleSelectBoss}
              initialSearch={targetMoveSearch}
            />
          )}

          {activeTab === 'qol' && (
            <QoLView />
          )}

          {activeTab === 'credits' && (
            <CreditsView />
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Move Detail Modal */}
      <MoveDetailModal
        moveName={activeMoveModal}
        onClose={() => setActiveMoveModal(null)}
        onNavigateToBoss={handleSelectBoss}
      />
    </div>
  );
}
