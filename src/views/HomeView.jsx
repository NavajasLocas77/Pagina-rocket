import React from 'react';
import { 
  ShieldAlert, 
  Map, 
  Skull, 
  Compass, 
  BookOpen, 
  Gift, 
  Dna, 
  Package, 
  Zap, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Coins, 
  Sparkles,
  RotateCcw,
  Target
} from 'lucide-react';

export default function HomeView({ setActiveTab, onOpenGuide100, progressStats, resetProgress }) {
  return (
    <div style={{ padding: '28px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(229, 57, 53, 0.16) 0%, rgba(18, 19, 28, 0.95) 70%)',
        border: '1px solid rgba(229, 57, 53, 0.35)',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          right: '-20px',
          top: '-30px',
          fontSize: '12rem',
          fontWeight: '900',
          color: 'rgba(229, 57, 53, 0.05)',
          fontFamily: 'Chakra Petch',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          R
        </div>

        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(229, 57, 53, 0.2)', border: '1px solid #e53935', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: '#ff6b6b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            <Sparkles size={13} /> Base de Datos & Walkthrough 100%
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#fff', marginBottom: '12px', lineHeight: 1.15, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            POKÉMON EDICIÓN TEAM ROCKET
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#b6bad2', marginBottom: '20px', lineHeight: 1.6 }}>
            Bienvenido a la guía definitiva y wiki técnica del juego. Consulta cada combate de jefe, sus niveles exactos, sets de movimientos competitivos, las 33 misiones secundarias en orden cronológico, y la obtención de los 978 Pokémon.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => setActiveTab('walkthrough')}
              className="btn-rocket"
              style={{ fontSize: '0.92rem', padding: '10px 20px' }}
            >
              <span>Comenzar Guía Paso a Paso</span>
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => setActiveTab('bosses')}
              className="btn-secondary"
              style={{ fontSize: '0.92rem', padding: '10px 18px' }}
            >
              <Skull size={17} color="#e53935" />
              <span>Ver Todos los Jefes (200)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strict Documentation Disclaimer */}
      <div style={{
        background: '#13141f',
        border: '1px solid #292c40',
        borderLeft: '4px solid #3b82f6',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <ShieldAlert size={22} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: '#cbd0e6', lineHeight: 1.5 }}>
          <strong style={{ color: '#fff' }}>Garantía de Fidelidad a los Archivos:</strong> Toda la información contenida en esta guía ha sido extraída y estructurada directamente a partir de los documentos oficiales del hackrom (combates principales y secundarios, cambios de movimientos, objetos, experimentos Rocket, evoluciones y archivo de obtención). <span style={{ color: '#93c5fd' }}>Si un dato no existía en los archivos analizados, se indica explícitamente como "Dato no confirmado en archivos" en lugar de inventar valores.</span>
        </div>
      </div>

      {/* Interactive Progress Tracking Section */}
      <div className="rocket-panel" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} color="#22c55e" /> Tu Progreso Personal en la Guía
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#8d92ab' }}>
              Guarda tus avances directamente en tu navegador (LocalStorage). Marca jefes derrotados, misiones y regalos.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#22c55e', fontFamily: 'Chakra Petch' }}>
              {progressStats.percentage}%
            </span>
            <button
              onClick={resetProgress}
              title="Reiniciar progreso guardado"
              style={{
                background: '#1d1f2e',
                border: '1px solid #30334d',
                color: '#8e93ae',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.75rem'
              }}
            >
              <RotateCcw size={12} /> Reiniciar
            </button>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: '#202336', borderRadius: '4px', overflow: 'hidden', marginBottom: '18px' }}>
          <div style={{ width: `${progressStats.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #10b981)', transition: 'width 0.4s ease' }} />
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ background: '#171926', padding: '14px', borderRadius: '8px', border: '1px solid #282a3d' }}>
            <div style={{ fontSize: '0.75rem', color: '#8a8fa7', marginBottom: '4px' }}>Jefes Derrotados</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', fontFamily: 'Chakra Petch' }}>
              {progressStats.bossesDone} <span style={{ fontSize: '0.85rem', color: '#686d85' }}>/ 200</span>
            </div>
          </div>
          <div style={{ background: '#171926', padding: '14px', borderRadius: '8px', border: '1px solid #282a3d' }}>
            <div style={{ fontSize: '0.75rem', color: '#8a8fa7', marginBottom: '4px' }}>Misiones Secundarias</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', fontFamily: 'Chakra Petch' }}>
              {progressStats.questsDone} <span style={{ fontSize: '0.85rem', color: '#686d85' }}>/ 33</span>
            </div>
          </div>
          <div style={{ background: '#171926', padding: '14px', borderRadius: '8px', border: '1px solid #282a3d' }}>
            <div style={{ fontSize: '0.75rem', color: '#8a8fa7', marginBottom: '4px' }}>Regalos y Fósiles</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', fontFamily: 'Chakra Petch' }}>
              {progressStats.giftsDone} <span style={{ fontSize: '0.85rem', color: '#686d85' }}>Obtenidos</span>
            </div>
          </div>
          <div style={{ background: '#171926', padding: '14px', borderRadius: '8px', border: '1px solid #282a3d' }}>
            <div style={{ fontSize: '0.75rem', color: '#8a8fa7', marginBottom: '4px' }}>Capítulos Completados</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', fontFamily: 'Chakra Petch' }}>
              {progressStats.actsDone} <span style={{ fontSize: '0.85rem', color: '#686d85' }}>/ 5 Actos</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN GUÍA 100% MODO FÁCIL & DIFÍCIL */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Target size={22} color="#e53935" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff' }}>
            GUÍA 100% — POKÉMON EDICIÓN TEAM ROCKET
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#9da2bd', marginBottom: '16px' }}>
          Esta sección contiene el recorrido necesario para completar el juego al 100% según la información disponible en los archivos de la edición.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {/* Card Modo Fácil */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, #131522 100%)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            borderRadius: '10px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', marginBottom: '10px' }}>
                🟢 MODO FÁCIL
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                Guía Completa al 100%
              </h3>
              <ul style={{ fontSize: '0.82rem', color: '#cbd0e6', lineHeight: 1.7, paddingLeft: '18px', marginBottom: '18px' }}>
                <li>Historia principal</li>
                <li>Jefes</li>
                <li>Misiones secundarias</li>
                <li>Pokémon</li>
                <li>Pokémon regalados</li>
                <li>Objetos</li>
                <li>Eventos</li>
                <li>Secretos</li>
                <li>Postgame</li>
                <li>Contenido opcional</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenGuide100 ? onOpenGuide100('easy') : setActiveTab('guide-100')}
              style={{
                background: '#166534',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.25)'
              }}
            >
              <span>COMENZAR GUÍA FÁCIL</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card Modo Difícil */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(229, 57, 53, 0.12) 0%, #131522 100%)',
            border: '1px solid rgba(229, 57, 53, 0.35)',
            borderRadius: '10px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', marginBottom: '10px' }}>
                🔴 MODO DIFÍCIL
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                Guía Completa al 100%
              </h3>
              <ul style={{ fontSize: '0.82rem', color: '#cbd0e6', lineHeight: 1.7, paddingLeft: '18px', marginBottom: '18px' }}>
                <li>Historia principal</li>
                <li>Jefes</li>
                <li>Misiones secundarias</li>
                <li>Pokémon</li>
                <li>Pokémon regalados</li>
                <li>Objetos</li>
                <li>Eventos</li>
                <li>Secretos</li>
                <li>Postgame</li>
                <li>Contenido opcional</li>
                <li>Diferencias específicas del modo difícil</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenGuide100 ? onOpenGuide100('hard') : setActiveTab('guide-100')}
              style={{
                background: '#b91c1c',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(229, 57, 53, 0.25)'
              }}
            >
              <span>COMENZAR GUÍA DIFÍCIL</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Section Hub Cards */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Exploración de la Guía</span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '36px' }}>
        <div className="rocket-card-interactive" onClick={() => setActiveTab('walkthrough')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Map size={22} color="#3b82f6" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: '4px' }}>5 ACTOS</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>Guía Paso a Paso</h3>
          <p style={{ fontSize: '0.82rem', color: '#9da2bd', lineHeight: 1.5 }}>
            Recorrido cronológico completo: Kanto, Archi7 (Islas Sete), Johto, DLC de Johto y Hoenn con el gran final.
          </p>
        </div>

        <div className="rocket-card-interactive" onClick={() => setActiveTab('bosses')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(229, 57, 53, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Skull size={22} color="#e53935" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ff4d4d', background: 'rgba(229,57,53,0.1)', padding: '2px 8px', borderRadius: '4px' }}>200 JEFES</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>Jefes y Líderes</h3>
          <p style={{ fontSize: '0.82rem', color: '#9da2bd', lineHeight: 1.5 }}>
            Fichas detalladas con equipos, niveles, objetos equipados, naturalezas, 4 movimientos, IVs y EVs.
          </p>
        </div>

        <div className="rocket-card-interactive" onClick={() => setActiveTab('sidequests')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Compass size={22} color="#eab308" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#eab308', background: 'rgba(234,179,8,0.1)', padding: '2px 8px', borderRadius: '4px' }}>33 MISIONES</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>Misiones Secundarias</h3>
          <p style={{ fontSize: '0.82rem', color: '#9da2bd', lineHeight: 1.5 }}>
            Ordenadas en estricto orden cronológico con ubicaciones, NPCs, requisitos, combates y video tutoriales.
          </p>
        </div>

        <div className="rocket-card-interactive" onClick={() => setActiveTab('pokedex')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={22} color="#a855f7" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#c084fc', background: 'rgba(168,85,247,0.1)', padding: '2px 8px', borderRadius: '4px' }}>978 ENTRADAS</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>¿Dónde Conseguir Cada Pokémon?</h3>
          <p style={{ fontSize: '0.82rem', color: '#9da2bd', lineHeight: 1.5 }}>
            Buscador instantáneo por nombre y métodos de obtención: salvajes, robos, casino, fósiles y eventos.
          </p>
        </div>

        <div className="rocket-card-interactive" onClick={() => setActiveTab('gifts')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gift size={22} color="#22c55e" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4ade80', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: '4px' }}>REGALOS</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>Pokémon Regalados</h3>
          <p style={{ fontSize: '0.82rem', color: '#9da2bd', lineHeight: 1.5 }}>
            Recopilación exhaustiva de todos los Pokémon entregados gratuitamente por NPCs, misiones e historia.
          </p>
        </div>

        <div className="rocket-card-interactive" onClick={() => setActiveTab('custom-pkmn')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dna size={22} color="#ef4444" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: '4px' }}>79 FORMAS</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>Formas Rocket & Especiales</h3>
          <p style={{ fontSize: '0.82rem', color: '#9da2bd', lineHeight: 1.5 }}>
            Prototipos Nivel I/II/III, Formas Fuerte Vínculo, Nuevas Megaevoluciones, Pokémon Beta 97 y Primigenios.
          </p>
        </div>
      </div>

      {/* Featured Insights & QoL Highlights */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Flame size={20} color="#e53935" /> Información Estratégica Clave
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {/* Farmeo de dinero */}
        <div className="rocket-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Coins size={20} color="#eab308" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#fff' }}>Farmeo Masivo de Dinero</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#a0a5bf', lineHeight: 1.5, marginBottom: '12px' }}>
            Consigue la <strong>Moneda Amuleto</strong> derrotando al Ayudante de Oak en Ruta 16 y la <strong>MT46 Ladrón</strong> en Mt. Moon. En Archi7 roba la Pepita al Nidoqueen del recluta (15k-17k por combate); en el DLC roba Maxipepitas al NidoqueenY (40k por combate).
          </p>
          <button 
            onClick={() => setActiveTab('qol')} 
            style={{ background: 'transparent', border: 'none', color: '#e53935', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Ver Guía Completa de Farmeo <ArrowRight size={13} />
          </button>
        </div>

        {/* IVs y EVs */}
        <div className="rocket-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Zap size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#fff' }}>IVs Perfectos 31 y Vitaminas</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#a0a5bf', lineHeight: 1.5, marginBottom: '12px' }}>
            Las vitaminas en Base Profunda funcionan hasta los 250 EVs directos (sin necesidad de entrenamiento manual). A partir de la 5ta medalla en Johto, el <strong>P2 de la Base Johto</strong> permite poner <strong>31 IVs en todas las estadísticas</strong> a cualquier Pokémon por 100,000 pokés.
          </p>
          <button 
            onClick={() => setActiveTab('qol')} 
            style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Consultar Mecánicas Competitivas <ArrowRight size={13} />
          </button>
        </div>

        {/* Caramelos y Entrenamiento */}
        <div className="rocket-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Package size={20} color="#10b981" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#fff' }}>Caramelos y Salas de Chansey/Blissey</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#a0a5bf', lineHeight: 1.5, marginBottom: '12px' }}>
            Las tiendas Rocket venden caramelos por franjas de nivel: Caramelo-XS (1-15), S (15-30), XM (30-45), L (65-75), XL (75-85), Supercaramelo (85-95) e Hipercaramelo (95-105). La sala de entrenamiento cuenta con 6 Chansey Nv. 50 (Calle Victoria) y 6 Blissey Nv. 75/90 (Post-Johto y DLC).
          </p>
          <button 
            onClick={() => setActiveTab('qol')} 
            style={{ background: 'transparent', border: 'none', color: '#10b981', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Ver Tiendas y Niveles <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
