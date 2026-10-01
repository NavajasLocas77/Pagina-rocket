import React from 'react';
import { 
  Home, 
  Map, 
  Skull, 
  Users, 
  Compass, 
  BookOpen, 
  Gift, 
  Package, 
  Zap, 
  Dna, 
  RefreshCw, 
  HelpCircle, 
  Award,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  Target
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen, 
  spoilerMode, 
  setSpoilerMode,
  setIsSearchOpen,
  progressStats
}) {
  const navItems = [
    { id: 'home', label: 'Inicio / Panel', icon: Home },
    { id: 'guide-100', label: 'Guía 100% (Fácil / Difícil)', icon: Target, badge: '100%' },
    { id: 'walkthrough', label: 'Guía Paso a Paso', icon: Map },
    { id: 'bosses', label: 'Jefes y Líderes', icon: Skull, badge: '200' },
    { id: 'boss-teams', label: 'Equipos de Jefes', icon: Users },
    { id: 'sidequests', label: 'Misiones Secundarias', icon: Compass, badge: '33' },
    { id: 'pokedex', label: 'Pokédex / Obtención', icon: BookOpen, badge: '978' },
    { id: 'gifts', label: 'Pokémon Regalados', icon: Gift },
    { id: 'custom-pkmn', label: 'Formas Rocket y Especiales', icon: Dna, badge: '79' },
    { id: 'evolutions', label: 'Evoluciones Modificadas', icon: RefreshCw },
    { id: 'items', label: 'Objetos y Tiendas', icon: Package, badge: '401' },
    { id: 'moves', label: 'Ataques Modificados', icon: Zap, badge: '47' },
    { id: 'qol', label: 'QoL y Preguntas Frecuentes', icon: HelpCircle },
    { id: 'credits', label: 'Créditos y Origen', icon: Award }
  ];

  return (
    <>
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 35 }}
          className="mobile-backdrop"
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px', 
            background: 'linear-gradient(135deg, #1e202e 0%, #111219 100%)', 
            border: '1px solid #e53935',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(229, 57, 53, 0.4)'
          }}>
            <span style={{ color: '#e53935', fontWeight: '900', fontSize: '1.4rem', fontFamily: 'Chakra Petch' }}>R</span>
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', letterSpacing: '0.04em', lineHeight: 1.2 }}>TEAM ROCKET</div>
            <div style={{ fontSize: '0.72rem', color: '#e53935', fontWeight: '600', letterSpacing: '0.08em' }}>GUÍA DEFINITIVA</div>
          </div>
        </div>

        {/* Global Search Quick Trigger */}
        <div style={{ padding: '12px 14px' }}>
          <button 
            onClick={() => setIsSearchOpen(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: '#171926',
              border: '1px solid #2b2e44',
              borderRadius: '6px',
              color: '#8f94ad',
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={15} color="#e53935" />
              <span>Buscador global...</span>
            </span>
            <kbd style={{ background: '#25283b', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: '#cbd0e6' }}>Ctrl K</kbd>
          </button>
        </div>

        {/* Progress Mini Widget */}
        <div style={{ padding: '0 14px 12px' }}>
          <div style={{ background: '#141522', border: '1px solid #25283c', borderRadius: '6px', padding: '10px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.75rem' }}>
              <span style={{ color: '#a0a5bd', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={13} color="#22c55e" /> Progreso Guía
              </span>
              <span style={{ color: '#22c55e', fontWeight: '700' }}>{progressStats.percentage}%</span>
            </div>
            <div style={{ width: '100%', height: '5px', background: '#222538', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${progressStats.percentage}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #22c55e, #10b981)',
                  transition: 'width 0.4s ease'
                }} 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.68rem', color: '#7e839e' }}>
              <span>{progressStats.bossesDone}/200 Jefes</span>
              <span>{progressStats.questsDone}/33 Misiones</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={17} className="nav-icon" />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ 
                    fontSize: '0.68rem', 
                    padding: '1px 6px', 
                    borderRadius: '10px', 
                    background: isActive ? '#e53935' : '#222538', 
                    color: '#fff',
                    fontWeight: '700'
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer & Spoiler Mode Switch */}
        <div style={{ padding: '14px', borderTop: '1px solid var(--border-color)', backgroundColor: '#0e0f17' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {spoilerMode ? <Eye size={16} color="#e53935" /> : <EyeOff size={16} color="#8f94ad" />}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Modo Spoilers</div>
                <div style={{ fontSize: '0.68rem', color: '#7a7f98' }}>{spoilerMode ? 'Todo visible' : 'Ocultando secretos'}</div>
              </div>
            </div>
            <button
              onClick={() => setSpoilerMode(!spoilerMode)}
              style={{
                width: '38px',
                height: '20px',
                borderRadius: '10px',
                background: spoilerMode ? '#e53935' : '#27293d',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              <div 
                style={{ 
                  width: '14px', 
                  height: '14px', 
                  borderRadius: '50%', 
                  background: '#fff', 
                  position: 'absolute', 
                  top: '3px', 
                  left: spoilerMode ? '21px' : '3px',
                  transition: 'left 0.2s ease'
                }} 
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
