import React from 'react';
import { Menu, Search, Eye, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setSidebarOpen, 
  setIsSearchOpen, 
  spoilerMode, 
  setSpoilerMode 
}) {
  const titles = {
    home: 'Panel Principal & Inicio',
    'guide-100': 'Guía 100% de Completado (Modo Fácil / Difícil)',
    walkthrough: 'Guía de Historia Paso a Paso',
    bosses: 'Base de Datos de Jefes y Líderes',
    'boss-teams': 'Visualizador Rápido de Equipos Rivales',
    sidequests: 'Misiones Secundarias (Orden Cronológico)',
    pokedex: 'Pokédex y Métodos de Obtención (978 Pokémon)',
    gifts: 'Pokémon Regalados, Fósiles y Eventos',
    'custom-pkmn': 'Formas Rocket, Vínculo, Megas y Primigenios',
    evolutions: 'Evoluciones y Métodos Modificados',
    items: 'Objetos, Tiendas y Precios',
    moves: 'Ataques con Estadísticas Alteradas',
    qol: 'QoLs, Farmeo y Preguntas Frecuentes',
    credits: 'Créditos, Agradecimientos e Inspiración'
  };

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(17, 18, 25, 0.85)',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{titles[activeTab] || 'Guía Definitiva'}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#8d92ab' }}>
            Documentación Extraída 100% de Archivos Oficiales
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Quick Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#161724',
            border: '1px solid #2d3045',
            color: '#cbd0e8',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          <Search size={15} color="#e53935" />
          <span className="hidden sm:inline">Buscar (Jefes, Pokémon, Objetos...)</span>
        </button>

        {/* Spoiler Toggle Quick Badge */}
        <button
          onClick={() => setSpoilerMode(!spoilerMode)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: spoilerMode ? 'rgba(229, 57, 53, 0.12)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${spoilerMode ? 'rgba(229, 57, 53, 0.4)' : '#2d3045'}`,
            color: spoilerMode ? '#ff5252' : '#9499b0',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '0.78rem',
            cursor: 'pointer'
          }}
          title={spoilerMode ? 'Modo Spoiler Activado: Se muestran jefes finales y secretos' : 'Modo Spoiler Desactivado: Se ocultan identidades de jefes tardíos'}
        >
          {spoilerMode ? <Eye size={14} /> : <EyeOff size={14} />}
          <span className="hidden md:inline">{spoilerMode ? 'Spoilers On' : 'Sin Spoilers'}</span>
        </button>
      </div>
    </header>
  );
}
