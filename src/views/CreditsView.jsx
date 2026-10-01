import React from 'react';
import { Award, Heart, Globe, Users, Code, Terminal, Sparkles } from 'lucide-react';

export default function CreditsView() {
  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Award size={26} color="#e53935" />
          <span>CRÉDITOS, AGRADECIMIENTOS E INSPIRACIÓN DEL JUEGO</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#8f94ad' }}>
          Documento oficial de créditos y menciones de desarrollo de Pokémon Edición Team Rocket.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Origin and Inspiration */}
        <div className="rocket-panel" style={{ borderLeft: '4px solid #e53935' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Heart size={20} color="#e53935" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
              Inspiración Original del Hackrom
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#cbd0e6', lineHeight: 1.6, marginBottom: '10px' }}>
            En primer lugar gracias a <strong>Colonelsalt</strong>, el creador del hackrom original <em>Pokémon Team Rocket Edition</em> de la comunidad inglesa en PokéCommunity (2019), por expandir el potencial de la región de Kanto e inspirar la creación de esta magna versión extendida en español.
          </p>
          <a 
            href="https://www.pokecommunity.com/showthread.php?t=360725" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#ff6b6b', fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            Hilo oficial de Colonelsalt en PokéCommunity →
          </a>
        </div>

        {/* Core Contributors */}
        <div className="rocket-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Users size={20} color="#3b82f6" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
              Equipo de Desarrollo y Colaboradores Principales
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#12131e', padding: '14px', borderRadius: '8px', border: '1px solid #232538' }}>
              <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>@kakarotto & @Annatar</div>
              <p style={{ fontSize: '0.8rem', color: '#9da2bd', marginTop: '6px', lineHeight: 1.5 }}>
                Desarrollo del modificador de IVs, cambio de overworld al ser ascendido en el Team Rocket, inserción de todo el mapa de Johto con puntos de vuelo y curación, y apoyo incondicional en el proyecto.
              </p>
            </div>

            <div style={{ background: '#12131e', padding: '14px', borderRadius: '8px', border: '1px solid #232538' }}>
              <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>@KevinXDE & @Polar</div>
              <p style={{ fontSize: '0.8rem', color: '#9da2bd', marginTop: '6px', lineHeight: 1.5 }}>
                Testers incansables durante la temporada de Johto y corrección de guión. @KevinXDE aportó sus conocimientos clave sobre descompilación para allanar el camino técnico del DLC.
              </p>
            </div>

            <div style={{ background: '#12131e', padding: '14px', borderRadius: '8px', border: '1px solid #232538' }}>
              <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>Alexander Daniel & Scar'99</div>
              <p style={{ fontSize: '0.8rem', color: '#9da2bd', marginTop: '6px', lineHeight: 1.5 }}>
                Creación de incontables sprites personalizados, minis de personajes en overworld y recursos artísticos exclusivos.
              </p>
            </div>
          </div>
        </div>

        {/* Translation and Engine */}
        <div className="rocket-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Code size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
              Traducción y Expansión del Motor de Batalla (RHH Pokeemerald)
            </h2>
          </div>

          <p style={{ fontSize: '0.84rem', color: '#9da2bd', marginBottom: '12px' }}>
            Agradecimientos especiales al equipo encargado de la traducción del motor de batalla al español:
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Master Yuri', 'Fran Presencio', 'Glace', 'Óscar Brock', 'Jack Johnson', 'Servalsanz', 'Danicintas', 'JesManCar', 'Manurocker', 'ReoNeky', 'Samu'].map((name, i) => (
              <span key={i} style={{ background: '#192425', border: '1px solid #26433e', color: '#4ade80', padding: '3px 10px', borderRadius: '4px', fontSize: '0.78rem' }}>
                {name}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#8e93ac' }}>
            <strong>Modo Debug:</strong> TheXaman, Ketsuban, Pyredrid, AsparagusEduardo, Ghoulslash, ExboSeed, Sierraffinity, Jaizu.
          </div>
        </div>
      </div>
    </div>
  );
}
