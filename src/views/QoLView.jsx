import React, { useState } from 'react';
import qolData from '../data/qol_faq.json';
import { HelpCircle, Coins, Sparkles, Zap, Package, MapPin, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function QoLView() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <HelpCircle size={26} color="#e53935" />
          <span>QOLS, MECÁNICAS Y PREGUNTAS FRECUENTES</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#8f94ad' }}>
          Documentación oficial del creador sobre mecánicas de farmeo, caramelos de experiencia, entrenamiento de IVs/EVs, mentas y solución a dudas comunes de avance.
        </p>
      </div>

      {/* Frequently Asked Questions Section */}
      <div className="rocket-panel" style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>❓ Preguntas Frecuentes Oficiales del Creador</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {qolData.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                style={{
                  background: '#141522',
                  border: '1px solid #25283c',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '0.92rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  className="hover:text-[#e53935]"
                >
                  <span>+ {faq.question}</span>
                  {isOpen ? <ChevronUp size={16} color="#e53935" /> : <ChevronDown size={16} color="#8a8fa6" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 18px 16px', fontSize: '0.85rem', color: '#cbd0e8', lineHeight: 1.6, borderTop: '1px solid #1f2130', paddingTop: '12px' }}>
                    <div style={{ whiteSpace: 'pre-line' }}>{faq.answer}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured QoL Guides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Money Farming */}
        <div className="rocket-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coins size={22} color="#eab308" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>Farmeo Masivo de Dinero</h3>
              <div style={{ fontSize: '0.72rem', color: '#8d92ab' }}>Estrategia óptima para ser millonario</div>
            </div>
          </div>

          <div style={{ fontSize: '0.84rem', color: '#cbd0e6', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>• <strong>Moneda Amuleto:</strong> Derrotar al Ayudante de Oak en la caseta de Ruta 16.</div>
            <div>• <strong>MT46 Ladrón:</strong> Encontrada en el interior de Mt. Moon.</div>
            <div style={{ background: '#12131e', padding: '10px', borderRadius: '6px', border: '1px solid #232538' }}>
              <strong style={{ color: '#fbbf24' }}>💰 Método Alto Rango en Isla Inta (Archi7):</strong>
              <p style={{ marginTop: '4px', fontSize: '0.8rem', color: '#a0a5be' }}>
                Combate repetible contra el recluta ascendido a Alto Rango. Usa Moneda Amuleto y Ladrón para robar la Pepita a su Nidoqueen + vende las 5 Super Balls que regala (Total: <strong>15,000 - 17,000 pokés por combate</strong>).
              </p>
            </div>
            <div style={{ background: '#12131e', padding: '10px', borderRadius: '6px', border: '1px solid #232538' }}>
              <strong style={{ color: '#fbbf24' }}>💰 Método Ejecutivo en DLC (Johto):</strong>
              <p style={{ marginTop: '4px', fontSize: '0.8rem', color: '#a0a5be' }}>
                Al ascender a Ejecutivo al inicio del DLC, combate contra el mismo recluta con Moneda Amuleto y roba la Maxipepita a su NidoqueenY + vende las 5 Ultra Balls que regala (Total: <strong>40,000 pokés por combate</strong>).
              </p>
            </div>
          </div>
        </div>

        {/* Experience Candies & Training Rooms */}
        <div className="rocket-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={22} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>Caramelos y Farmeo de Experiencia</h3>
              <div style={{ fontSize: '0.72rem', color: '#8d92ab' }}>Tiendas Rocket por franjas de nivel</div>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#cbd0e6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div>• <strong>Caramelo-XS (1,500 pokés):</strong> Sube nivel 1-15 (Base Guardería Ruta 5).</div>
            <div>• <strong>Caramelo-S (3,000 pokés):</strong> Sube nivel 15-30 (Base Rocket Profunda).</div>
            <div>• <strong>Caramelo-XM (4,500 pokés):</strong> Sube nivel 30-45 (Sala de Ejecutivos Base Profunda).</div>
            <div>• <strong>Caramelo-M (6,000 pokés):</strong> Sube nivel 45-65 (Sala Entrenamiento Base Profunda).</div>
            <div>• <strong>Caramelo-L (7,500 pokés):</strong> Sube nivel 65-75 (Base Rocket Johto).</div>
            <div>• <strong>Caramelo-XL (8,500 pokés):</strong> Sube nivel 75-85 (Segunda Planta Base Johto).</div>
            <div>• <strong>Supercaramelo (9,500 pokés):</strong> Sube nivel 85-95 (Base Rocket Hoenn).</div>
            <div>• <strong>Hipercaramelo (10,500 pokés):</strong> Sube nivel 95-105 (Torre Radio Lavanda).</div>

            <div style={{ background: '#12131e', padding: '10px', borderRadius: '6px', border: '1px solid #232538', marginTop: '6px' }}>
              <strong style={{ color: '#60a5fa' }}>🥊 Salas de Entrenamiento:</strong>
              <div style={{ fontSize: '0.78rem', color: '#a0a5bf', marginTop: '4px' }}>
                <div>• 6 Chansey Nv. 50: Disponible a partir de entrar a Calle Victoria.</div>
                <div>• 6 Blissey Nv. 75: Disponible al acabar Johto.</div>
                <div>• 6 Blissey Nv. 90: Disponible al acabar el DLC.</div>
              </div>
            </div>
          </div>
        </div>

        {/* IVs, EVs and Nature Mints */}
        <div className="rocket-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} color="#22c55e" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>IVs Perfectos 31 y Entrenamiento</h3>
              <div style={{ fontSize: '0.72rem', color: '#8d92ab' }}>Optimización competitiva oficial</div>
            </div>
          </div>

          <div style={{ fontSize: '0.84rem', color: '#cbd0e6', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              • <strong>Planta 2 Base Johto (5ta Medalla):</strong> Permite poner <strong style={{ color: '#4ade80' }}>31 IVs en todas las estadísticas</strong> a cualquier Pokémon por <strong>100,000 pokés</strong>.
            </div>
            <div>
              • <strong>Vitaminas de EVs:</strong> A la venta en Base Profunda por 3,000 pokés. Funcionan hasta los <strong>250 EVs directos</strong>, evitando el farmeo manual.
            </div>
            <div>
              • <strong>Mentas y Bayas de Naturaleza:</strong> Obtenibles gratis tras la secundaria del Cazabichos de Plateada en el jardín de Carmín (se regeneran con cada misión principal). También a la venta por 20,000 pokés en la Torre Radio Lavanda (DLC Misión 9).
            </div>
            <div>
              • <strong>Movimientos Huevo:</strong> Disponibles en la Sala de Ejecutivos de Base Profunda por 5,000 pokés tras la misión de Zapdos.
            </div>
          </div>
        </div>

        {/* Move Reminders and Mini Mushrooms */}
        <div className="rocket-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={22} color="#ef4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>Recuerda Movimientos y Mini Setas</h3>
              <div style={{ fontSize: '0.72rem', color: '#8d92ab' }}>Ubicaciones de tutores y setas</div>
            </div>
          </div>

          <div style={{ fontSize: '0.84rem', color: '#cbd0e6', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              • <strong>Ubicación de Recuerda Movimientos:</strong> Casa de Isla Secunda (Archi7) y Pueblo Azalea (Johto). Piden 1 Mini Seta.
            </div>
            <div style={{ background: '#12131e', padding: '10px', borderRadius: '6px', border: '1px solid #232538' }}>
              <strong style={{ color: '#f87171' }}>🍄 Dónde conseguir Mini Setas antes de Johto:</strong>
              <div style={{ fontSize: '0.78rem', color: '#a0a5bf', marginTop: '4px' }}>
                <div>1. Equipadas en Paras salvajes de Mt. Moon.</div>
                <div>2. 2 unidades en Base Rocket Ruta 5.</div>
                <div>3. 2 unidades en el Jardín de las mentas (Carmín).</div>
                <div>4. 2 unidades en Base Rocket Profunda (Sala Potencial Máximo).</div>
                <div>5. 3 unidades en Secundaria Estafadores Kanto.</div>
                <div>6. 2 unidades en el Bosque de la secundaria de Atlas (Archi7).</div>
                <div style={{ marginTop: '4px', color: '#4ade80' }}>Al llegar a Johto se venden de forma ilimitada en la tienda al oeste de Ruta 45.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
