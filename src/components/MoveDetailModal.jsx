import React from 'react';
import movesData from '../data/moves.json';
import { Zap, X, Shield, Swords, Sparkles } from 'lucide-react';

export default function MoveDetailModal({ moveName, onClose, onNavigateToBoss }) {
  if (!moveName) return null;

  const moveObj = movesData.find(m => 
    m.name.toLowerCase().trim() === moveName.toLowerCase().trim()
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '520px' }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={20} color="#eab308" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
              {moveObj ? moveObj.name : moveName}
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#888d9f', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {moveObj ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px', fontSize: '0.8rem' }}>
                {/* Official */}
                <div style={{ background: '#12131d', border: '1px solid #222538', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ color: '#7a7f98', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '6px' }}>
                    Oficial
                  </div>
                  <div>Tipo: <strong style={{ color: '#cbd0e6' }}>{moveObj.official.type || 'Normal'}</strong></div>
                  <div>Potencia: <strong style={{ color: '#cbd0e6' }}>{moveObj.official.power || '-'}</strong></div>
                  <div>Precisión: <strong style={{ color: '#cbd0e6' }}>{moveObj.official.accuracy || '-'}</strong></div>
                  <div>PP: <strong style={{ color: '#cbd0e6' }}>{moveObj.official.pp || '-'}</strong></div>
                  <div style={{ marginTop: '6px', color: '#8d92aa', fontSize: '0.74rem' }}>
                    Efecto: {moveObj.official.effect || 'Ninguno'}
                  </div>
                </div>

                {/* Hackrom */}
                <div style={{ background: '#191522', border: '1px solid rgba(229, 57, 53, 0.4)', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ color: '#ff6b6b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '6px' }}>
                    Team Rocket Ed.
                  </div>
                  <div>Tipo: <strong style={{ color: '#ff8a8a' }}>{moveObj.hackrom.type || moveObj.official.type}</strong></div>
                  <div>Potencia: <strong style={{ color: '#4ade80' }}>{moveObj.hackrom.power || moveObj.official.power}</strong></div>
                  <div>Precisión: <strong style={{ color: '#4ade80' }}>{moveObj.hackrom.accuracy || moveObj.official.accuracy}</strong></div>
                  <div>PP: <strong style={{ color: '#4ade80' }}>{moveObj.hackrom.pp || moveObj.official.pp}</strong></div>
                  <div style={{ marginTop: '6px', color: '#ffd6d6', fontSize: '0.74rem', fontWeight: '500' }}>
                    Efecto: {moveObj.hackrom.effect || 'Sin cambios adicionales'}
                  </div>
                </div>
              </div>

              <div style={{ background: '#13141f', border: '1px solid #232538', borderRadius: '6px', padding: '10px 12px', fontSize: '0.78rem', color: '#9da2bd' }}>
                ℹ️ Este movimiento cuenta con rebalanceo documentado en los archivos de la edición Team Rocket.
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                {moveName}
              </div>
              <p style={{ fontSize: '0.84rem', color: '#8d92aa', lineHeight: 1.5 }}>
                Este movimiento mantiene sus estadísticas estándar de los juegos oficiales (Gen 3 / Motor CFRU/Pokeemerald). No figura con modificaciones en el archivo <em>CAMBIOS en MOVIMIENTOS.txt</em>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
