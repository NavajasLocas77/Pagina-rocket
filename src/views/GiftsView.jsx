import React, { useState } from 'react';
import pokemonData from '../data/pokemon.json';
import sidequestsData from '../data/sidequests.json';
import { getPokemonSprite } from '../utils/pokemon';
import { Gift, CheckCircle2, Circle, Search, MapPin, Sparkles, ExternalLink, List, Grid } from 'lucide-react';

export default function GiftsView({ 
  onSelectPokemon, 
  completedGifts, 
  toggleGiftCompleted 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Curated list of high-profile gift/event pokemon directly derived from files
  const curatedGifts = [
    {
      id: 'gift-bulbasaur',
      pokemon: 'Bulbasaur',
      location: 'Laboratorio de Oak (Pueblo Pallet)',
      npc: 'Laboratorio del Profesor Oak',
      requirements: 'Inicio del juego / Misión inicial',
      moment: 'Acto 1 - Kanto (Comienzo)',
      level: 5,
      item: 'No item',
      nature: 'Aleatoria / Modificable con mentas',
      ability: 'Espesura',
      method: 'Robo directo al Profesor Oak',
      steps: [
        'Comenzar la aventura y recibir órdenes del Team Rocket.',
        'Infiltrarse en el Laboratorio del Profesor Oak en Pueblo Pallet.',
        'Robar la Poké Ball que contiene a Bulbasaur en la mesa.'
      ]
    },
    {
      id: 'gift-phanpy',
      pokemon: 'Phanpy',
      location: 'Pilar Recuerdo (Isla Inta)',
      npc: 'Persona lamentándose junto al Pilar',
      requirements: 'Ninguno especial',
      moment: 'Acto 1 - Isla Inta',
      level: 8,
      item: 'Meteorito (Vital para conseguir a Duraludon más adelante)',
      nature: 'Seria / Modificable',
      ability: 'Recogida',
      method: 'Regalo por secundaria de limonadas',
      steps: [
        'Hablar con la persona junto al pilar recuerdo en Isla Inta.',
        'Ir al Centro Pokémon de Isla Inta y derrotar al cocinero en combate.',
        'Regresar con las limonadas para recibir a Phanpy equipado con el METEORITO.'
      ]
    },
    {
      id: 'gift-magikarp',
      pokemon: 'Magikarp',
      location: 'Ciudad Carmín',
      npc: 'Pescador de Caña Vieja',
      requirements: 'Visitar Ciudad Carmín',
      moment: 'Acto 1 - Carmín',
      level: 5,
      item: 'No item',
      nature: 'No confirmada',
      ability: 'Nado Rápido',
      method: 'Regalo tras encomienda del pescador',
      steps: [
        'Hablar con el pescador de Caña Vieja en Ciudad Carmín.',
        'Seguir sus instrucciones para completar la encomienda.',
        'Recibir a Magikarp Nv. 5.'
      ]
    },
    {
      id: 'gift-pinsir',
      pokemon: 'Pinsir',
      location: 'Bosque Verde (Suroeste)',
      npc: 'Entrenadores Guay',
      requirements: 'Derrotar en combate doble',
      moment: 'Acto 1 - Kanto',
      level: 15,
      item: 'No item',
      nature: 'No confirmada',
      ability: 'Corte Fuerte / Rompemoldes',
      method: 'Recompensa por combate doble',
      steps: [
        'Ir al suroeste de Bosque Verde.',
        'Desafiar a los dos entrenadores Guay en combate doble.',
        'Al derrotarlos, entregan a Pinsir Nv. 15.'
      ]
    },
    {
      id: 'gift-hitmonlee',
      pokemon: 'Hitmonlee',
      location: 'Ciudad Carmín (Terreno plano)',
      npc: 'Anciano del Machamp / Machop',
      requirements: 'Haber obtenido el Alto Rango en el Team Rocket',
      moment: 'Acto 1 - Post Silph S.A.',
      level: 20,
      item: 'Bono Bici incluido',
      nature: 'Firme / Seria',
      ability: 'Flexibilidad',
      method: 'Recompensa por vengar al anciano',
      steps: [
        'Conseguir Alto Rango y hablar con el anciano en el terreno plano de Carmín.',
        'Derrotar al Presidente del Club de Fans y al Domador de la Tienda de Bicis.',
        'Regresar con el anciano para recibir a Hitmonlee Nv. 20 y el Bono Bici.'
      ]
    },
    {
      id: 'gift-squirtle',
      pokemon: 'Squirtle',
      location: 'Caseta sur de Ruta 12 (Kanto)',
      npc: 'Gurú Pescador de Ruta 12',
      requirements: 'Derrotar al Gurú de Fucsia y al Guarda Safari Slowpoke',
      moment: 'Acto 1 - Fucsia',
      level: 5,
      item: 'No item',
      nature: 'Modesta / Osada',
      ability: 'Torrente',
      method: 'Recompensa de misión secundaria',
      steps: [
        'Hablar con el Gurú Pescador en la caseta sur de Ruta 12.',
        'Viajar a Ciudad Fucsia y vencer al Gurú Pescador y al Guarda Safari.',
        'Volver a hablar con el pescador de Ruta 12 para recibir a Squirtle Nv. 5.'
      ]
    },
    {
      id: 'gift-charmander-snorlax',
      pokemon: 'Charmander & Snorlax',
      location: 'Centro Pkmn Mt. Moon / Fucsia / Mansión Canela',
      npc: 'Científico de Ciudad Fucsia',
      requirements: 'Haber sido estafado por el vendedor del Magikarp en Mt. Moon',
      moment: 'Acto 1 - Canela',
      level: 'Charmander Nv. 5 / Snorlax Nv. 30',
      item: '10 Proteínas, 3 Caramelos Raros, 200,000 Pokés',
      nature: 'No confirmada',
      ability: 'Mar Llamas / Sebo',
      method: 'Recuperar el dinero estafado',
      steps: [
        'Dejarse estafar comprando el Magikarp en el Centro Pokémon del Mt. Moon.',
        'Hablar con el científico en Fucsia mirando al Lapras.',
        'Ir a la Mansión Pokémon de Isla Canela y batir a los 3 Estafadores en combate triple.',
        'Recibir a Charmander Nv. 5, Snorlax Nv. 30, 200k pokés, proteínas y caramelos.'
      ]
    },
    {
      id: 'gift-hitmonchan',
      pokemon: 'Hitmonchan',
      location: 'Ciudad Azafrán (Norte)',
      npc: 'Motorista de Azafrán',
      requirements: 'Disponible a partir del asalto a SILPH S.A.',
      moment: 'Acto 1 - Azafrán',
      level: 37,
      item: 'No item',
      nature: 'Firme',
      ability: 'Puño Férreo',
      method: 'Recompensa de misión secundaria en vías subterráneas',
      steps: [
        'Tras el asalto a Silph S.A., hablar con el motorista al norte de Azafrán.',
        'Investigar las vías subterráneas y completar la encomienda.',
        'Recibir a Hitmonchan Nv. 37.'
      ]
    },
    {
      id: 'gift-eevees',
      pokemon: '5 Eevees',
      location: 'Laboratorio de Isla Canela',
      npc: 'Científico en sala de foto de Fuji',
      requirements: 'Derrotar al Pokemaníaco Matías en Subterráneo Ruta 5',
      moment: 'Acto 1 - Canela',
      level: 25,
      item: 'No item',
      nature: 'Adaptables a sus 5 evoluciones',
      ability: 'Fuga / Adaptable',
      method: 'Recuperación de los Eevees robados',
      steps: [
        'Hablar con el científico junto a la foto de Fuji en el laboratorio de Canela.',
        'Rastrear y vencer al Pokemaníaco Matías en el subterráneo de Ruta 5.',
        'Regresar al laboratorio para recibir el pack de 5 Eevees Nv. 25.'
      ]
    },
    {
      id: 'gift-duraludon',
      pokemon: 'Duraludon',
      location: 'Cabaña secreta al oeste de Isla Exta',
      npc: 'Científico Oculto de Sevii',
      requirements: 'Poseer el METEORITO equipado en el Phanpy de Isla Inta',
      moment: 'Acto 2 - Archi7',
      level: 50,
      item: 'No item',
      nature: 'Modesta / Firme',
      ability: 'Metal Pesado / Metal Liviano',
      method: 'Entrega del Meteorito para su investigación',
      steps: [
        'Surfear hacia la izquierda desde el muelle de Isla Exta para hallar la entrada oculta.',
        'Entrar a la cabaña y hablar con el investigador.',
        'Entregarle el METEORITO de Phanpy para recibir a Duraludon Nv. 50.'
      ]
    },
    {
      id: 'gift-nihilego-guzzlord',
      pokemon: 'Nihilego & Guzzlord',
      location: 'Centro Pokémon Isla Prima / Playa Tesoro',
      npc: 'Hombres trajeados (Trajeado de Verde)',
      requirements: 'Exploración de la gruta secreta de Playa Tesoro',
      moment: 'Acto 2 - Archi7',
      level: 50,
      item: 'No item',
      nature: 'Miedosa (Nihilego) / Firme (Guzzlord)',
      ability: 'Ultraimpulso',
      method: 'Recompensa y captura ultraente',
      steps: [
        'Hablar con el trajeado de verde en el Centro Pokémon de Isla Prima.',
        'Ir a la gruta secreta de Playa Tesoro y derrotar a los rivales Devon.',
        'Recibir a Nihilego Nv. 50 y la oportunidad de capturar a Guzzlord Nv. 50.'
      ]
    },
    {
      id: 'gift-cranidos-skorupi-piplup',
      pokemon: 'Cranidos, Skorupi & Piplup',
      location: 'Isla Tera (Primera casa a la izquierda)',
      npc: 'Dueños de Recreativos',
      requirements: 'Completar negocios en Sevii',
      moment: 'Acto 2 - Archi7',
      level: 'Cranidos Nv. 25, Skorupi Nv. 35, Piplup Nv. 15',
      item: 'No item',
      nature: 'No confirmada',
      ability: 'Habilidades base',
      method: 'Recompensa por resolver el conflicto de negocios',
      steps: [
        'Hablar con los dos dueños de los recreativos en Isla Tera.',
        'Cumplir la encomienda encomendada en el archipiélago.',
        'Recibir el trío de Pokémon de Sinnoh.'
      ]
    },
    {
      id: 'gift-bomushikaa',
      pokemon: 'Bomushikaa (Beta 97 Fuego/Agua)',
      location: 'Isla Inta / Isla Sete',
      npc: 'Administrador Jefe Atlas',
      requirements: 'Haber ingresado al Hall de la Fama de la Liga Pokémon',
      moment: 'Acto 2 - Post Liga',
      level: 60,
      item: '300,000 Pokés + Medalla Sevii',
      nature: 'Modesta',
      ability: 'Absorber Agua',
      method: 'Misión especial de Atlas y la anciana de Sete',
      steps: [
        'Tras ganar la Liga Pokémon, hablar con Atlas en Isla Inta.',
        'Cumplir la misión encomendada relacionada con una anciana en Isla Sete.',
        'Volver a hablar con Atlas para recibir 300,000 pokés, la Medalla y a Bomushikaa Nv. 60.'
      ]
    },
    {
      id: 'gift-fennekin-blacephalon',
      pokemon: 'Fennekin & Blacephaleon',
      location: 'Bosque Baya (Isla Tera)',
      npc: 'Pasaje Secreto del Bosque',
      requirements: 'Explorar pasadizo secreto',
      moment: 'Acto 2 - Archi7',
      level: 'Fennekin Nv. 15 / Blacephaleon Nv. 50',
      item: 'Medalla de Gimnasio de Sevii',
      nature: 'No confirmada',
      ability: 'Ultraimpulso / Mar Llamas',
      method: 'Descubrir secretos del Bosque Baya',
      steps: [
        'Ir a Bosque Baya en Isla Tera y seguir a la persona que entra al pasaje secreto.',
        'Superar los desafíos internos del pasaje.',
        'Recibir la Medalla de Sevii, a Fennekin Nv. 15 y capturar a Blacephaleon Nv. 50.'
      ]
    },
    {
      id: 'gift-tirtouga-archen',
      pokemon: 'Tirtouga & Archen',
      location: 'Ruinas Alfa / Laboratorio Secreto de Iris',
      npc: 'Científico de sprite distinto',
      requirements: 'Descubrir laboratorio tras puerta sospechosa junto a Torre Quemada',
      moment: 'Acto 3 - Johto',
      level: 'Tirtouga Nv. 30 / Archen Nv. 35',
      item: 'No item',
      nature: 'No confirmada',
      ability: 'Roca Sólida / Flaqueza',
      method: 'Recompensa por investigación de fósiles prehistóricos',
      steps: [
        'Hablar con el científico de sprite único en el centro de investigación de Ruinas Alfa.',
        'Localizar la puerta sospechosa al lado derecho de la Torre Quemada en Ciudad Iris.',
        'Derrotar al científico del laboratorio para recibir a Tirtouga y Archen.'
      ]
    },
    {
      id: 'gift-marshadow',
      pokemon: 'Marshadow (Luchador Sombrío)',
      location: 'Cabaña escondida al sur de Ruta 34 (tras rocas marinas)',
      npc: 'Exorcista escondida',
      requirements: 'Objeto extraviado en lo profundo del Bosque Baya',
      moment: 'Acto 3 - Johto / Sevii',
      level: 80,
      item: 'No item',
      nature: 'Firme / Alegre',
      ability: 'Experto',
      method: 'Devolver el colgante extraviado',
      steps: [
        'Al sur de Ciudad Trigal (Ruta 34), surfear hacia el sur cruzando un laberinto de rocas.',
        'Entrar a la cabaña y hablar con la exorcista sobre su colgante.',
        'Viajar a lo profundo de Bosque Baya en Sevii para recuperar el colgante.',
        'Regresar con la exorcista para recibir a Marshadow Nv. 80.'
      ]
    },
    {
      id: 'gift-chimchar-froakie',
      pokemon: 'Chimchar & Froakie',
      location: 'Restaurante Marino de Ciudad Olivo',
      npc: 'Motorista en la esquina del restaurante',
      requirements: 'Completar misión de Poketráfico',
      moment: 'Acto 3 - Olivo',
      level: 15,
      item: '2.25 millones de Pokés',
      nature: 'No confirmada',
      ability: 'Mar Llamas / Torrente',
      method: 'Desarticular red de tráfico',
      steps: [
        'Hablar con el motorista en la esquina del restaurante marino de Ciudad Olivo.',
        'Derrotar al Caballero dueño de la red de poketráfico en Trigal.',
        'Recibir a Chimchar Nv. 15, Froakie Nv. 15 y 2,250,000 pokés.'
      ]
    },
    {
      id: 'gift-litten-madaamu',
      pokemon: 'Litten & Madaamu (Beta 97 Planta/Volador)',
      location: 'Cabaña noreste de Pueblo Caoba',
      npc: 'Ancianos de Caoba',
      requirements: 'Resolver encomienda del carbón de Azalea',
      moment: 'Acto 3 - Caoba',
      level: 'Litten Nv. 15 / Madaamu Nv. 70',
      item: 'No item',
      nature: 'Firme (Madaamu)',
      ability: 'Intimidación / Afortunado',
      method: 'Recompensa tradicional de los ancianos',
      steps: [
        'Hablar con el anciano en la cabaña al noreste de Pueblo Caoba.',
        'Derrotar al empresario del carbón en Azalea.',
        'Volver con los ancianos para recibir a Litten Nv. 15 y al legendario Madaamu Nv. 70.'
      ]
    },
    {
      id: 'gift-kurusu',
      pokemon: 'Kurusu (Beta 97)',
      location: 'Lago Furia',
      npc: 'Pescador del Lago',
      requirements: 'Completar la misión obligatoria 1 del DLC (Derrotar a Amatista y Akueria)',
      moment: 'Acto 4 - DLC Johto',
      level: 40,
      item: 'No item',
      nature: 'Modesta',
      ability: 'Torrente (Evoluciona a Akua al 40 y Akueria al 64)',
      method: 'Regalo directo del pescador',
      steps: [
        'Comenzar la Misión 1 del DLC en Lago Furia encomendada por Giovanni.',
        'Vencer al Admin Devon Amatista y al Legendario Akueria.',
        'Hablar con el pescador de la orilla para recibir a Kurusu.'
      ]
    },
    {
      id: 'gift-poipole',
      pokemon: 'Poipole',
      location: 'Ruta 50 (Cabaña noroeste)',
      npc: 'Anciana de Ruta 50',
      requirements: 'Escuchar la vieja leyenda',
      moment: 'Acto 4 - DLC Johto',
      level: 50,
      item: 'No item',
      nature: 'Miedosa / Modesta',
      ability: 'Ultraimpulso',
      method: 'Regalo directo de la anciana',
      steps: [
        'En la Ruta 50 del DLC, entrar a la casa en la esquina noroeste.',
        'Hablar con la anciana y escuchar su relato sobre las viejas leyendas.',
        'La anciana te entrega a Poipole Nv. 50.'
      ]
    },
    {
      id: 'gift-calyrex',
      pokemon: 'Calyrex',
      location: 'Bosque secreto en Vías del Tren (Johto)',
      npc: 'Ex Alto Mando Agatha',
      requirements: 'Derrotar al Zapdos Primigenio por primera vez y a Atlas en las vías del tren',
      moment: 'Acto 4 - DLC Johto',
      level: 70,
      item: 'Riendas Unión obtenibles al oeste del mar de C. Cerezo',
      nature: 'Miedosa',
      ability: 'Unnerve / Corona Imperial',
      method: 'Encuentro con Agatha y su maestra',
      steps: [
        'Derrotar a Zapdos Primigenio y a Atlas en las vías de tren.',
        'Avanzar por el bosque secreto desbloqueado hasta la casa escondida.',
        'Hablar con Agatha para recibir a Calyrex Nv. 70.'
      ]
    },
    {
      id: 'gift-relicanth',
      pokemon: 'Relicanth',
      location: 'Museo de Ciudad Portual (Hoenn)',
      npc: 'Artista que bloquea la puerta',
      requirements: 'Resolver la inquietud del artista',
      moment: 'Acto 5 - Hoenn',
      level: 60,
      item: '1,000,000 de Pokés',
      nature: 'Firme',
      ability: 'Cabeza Roca',
      method: 'Recompensa por solucionar problema del museo',
      steps: [
        'Hablar con el artista que bloquea la puerta en el museo de Portual.',
        'Completar el encargo artístico en la región.',
        'Recibir 1,000,000 de pokés y a Relicanth Nv. 60.'
      ]
    },
    {
      id: 'gift-anorith',
      pokemon: 'Anorith',
      location: 'Pueblo Azuliza',
      npc: 'Niño en casa de Azuliza',
      requirements: 'Resolver queja sobre niña mimada de Portual',
      moment: 'Acto 5 - Hoenn',
      level: 60,
      item: 'No item',
      nature: 'Firme / Alegre',
      ability: 'Armadura Batalla',
      method: 'Recompensa de misión secundaria',
      steps: [
        'Hablar con el niño en una casa de Pueblo Azuliza que se queja de una niña mimada.',
        'Viajar al puesto de aguas frescas de Ciudad Portual y encarar a la niña.',
        'Regresar con el niño para recibir a Anorith Nv. 60.'
      ]
    }
  ];

  const filtered = curatedGifts.filter(g => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return g.pokemon.toLowerCase().includes(q) || 
           g.location.toLowerCase().includes(q) || 
           g.npc.toLowerCase().includes(q) ||
           g.method.toLowerCase().includes(q);
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Gift size={26} color="#22c55e" />
              <span>TODOS LOS POKÉMON OBTENIBLES POR REGALO</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#8f94ad' }}>
              Guía exhaustiva de todos los Pokémon regalados por NPCs, recompensas de misiones, eventos ocultos y fósiles.
            </p>
          </div>

          <div style={{ display: 'flex', background: '#161724', border: '1px solid #282a3d', borderRadius: '8px', padding: '3px' }}>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'cards' ? '#22c55e' : 'transparent',
                color: viewMode === 'cards' ? '#000' : '#8d92ab',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}
            >
              <Grid size={14} /> Fichas Detalladas
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'table' ? '#22c55e' : 'transparent',
                color: viewMode === 'table' ? '#000' : '#8d92ab',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}
            >
              <List size={14} /> Tabla Resumen
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} color="#8a8fa6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar Pokémon regalado por nombre, zona o NPC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '38px' }}
          />
        </div>
      </div>

      {viewMode === 'table' ? (
        /* TABLE VIEW (Requirement 11) */
        <div style={{ background: '#13141f', border: '1px solid var(--border-color)', borderRadius: '10px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#181926', borderBottom: '1px solid #272a3d', color: '#8f94ad', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 16px', width: '50px' }}>Obtenido</th>
                <th style={{ padding: '12px 16px' }}>Pokémon</th>
                <th style={{ padding: '12px 16px' }}>Nivel</th>
                <th style={{ padding: '12px 16px' }}>Ubicación</th>
                <th style={{ padding: '12px 16px' }}>Entregado por</th>
                <th style={{ padding: '12px 16px' }}>Momento / Región</th>
                <th style={{ padding: '12px 16px' }}>Objeto</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => {
                const isClaimed = completedGifts.includes(g.id);
                return (
                  <tr key={g.id} style={{ borderBottom: '1px solid #1f2130', backgroundColor: isClaimed ? 'rgba(34, 197, 94, 0.04)' : 'transparent' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => toggleGiftCompleted(g.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        {isClaimed ? <CheckCircle2 size={18} color="#22c55e" /> : <Circle size={18} color="#606680" />}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={getPokemonSprite(g.pokemon)} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        <button onClick={() => onSelectPokemon(g.pokemon)} style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: '700', cursor: 'pointer' }} className="hover:text-[#22c55e]">
                          {g.pokemon}
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'Chakra Petch', fontWeight: '700', color: '#4ade80' }}>
                      Nv. {g.level}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#cbd0e6' }}>{g.location}</td>
                    <td style={{ padding: '12px 16px', color: '#a0a5bf' }}>{g.npc}</td>
                    <td style={{ padding: '12px 16px', color: '#ff6b6b' }}>{g.moment}</td>
                    <td style={{ padding: '12px 16px', color: '#eab308' }}>{g.item}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* CARDS VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
          {filtered.map(g => {
            const isClaimed = completedGifts.includes(g.id);
            return (
              <div 
                key={g.id}
                className="rocket-panel"
                style={{
                  borderColor: isClaimed ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-color)',
                  backgroundColor: isClaimed ? '#10171a' : 'var(--bg-card)'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '54px', height: '54px', background: '#1c1e2e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #282a40' }}>
                      <img src={getPokemonSprite(g.pokemon)} alt={g.pokemon} style={{ width: '46px', height: '46px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div>
                      <button
                        onClick={() => onSelectPokemon(g.pokemon)}
                        style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: '800', fontSize: '1.15rem', cursor: 'pointer', textAlign: 'left' }}
                        className="hover:text-[#22c55e]"
                      >
                        {g.pokemon}
                      </button>
                      <div style={{ color: '#22c55e', fontWeight: '700', fontSize: '0.85rem', fontFamily: 'Chakra Petch' }}>
                        Nivel: {g.level}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleGiftCompleted(g.id)}
                    style={{
                      background: isClaimed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${isClaimed ? '#22c55e' : '#2b2e42'}`,
                      color: isClaimed ? '#4ade80' : '#8e93ae',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {isClaimed ? '✓ Obtenido' : 'Marcar Obtenido'}
                  </button>
                </div>

                {/* Details Breakdown */}
                <div style={{ background: '#12131e', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>📍 <strong>Dónde:</strong> <span style={{ color: '#cbd0e6' }}>{g.location}</span></div>
                  <div>👤 <strong>Quién lo entrega:</strong> <span style={{ color: '#cbd0e6' }}>{g.npc}</span></div>
                  <div>⏱️ <strong>Momento:</strong> <span style={{ color: '#ff7b7b' }}>{g.moment}</span></div>
                  <div>🔒 <strong>Requisitos:</strong> <span style={{ color: '#cbd0e6' }}>{g.requirements}</span></div>
                  <div>🎒 <strong>Objeto equipado:</strong> <span style={{ color: '#facc15' }}>{g.item}</span></div>
                  <div>🧬 <strong>Habilidad:</strong> <span style={{ color: '#cbd0e6' }}>{g.ability}</span></div>
                </div>

                {/* Steps to get it */}
                <div style={{ fontSize: '0.76rem', color: '#a0a5bf' }}>
                  <div style={{ fontWeight: '700', color: '#fff', textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '4px' }}>
                    Pasos exactos para conseguirlo:
                  </div>
                  <ol style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {g.steps.map((st, si) => (
                      <li key={si} style={{ color: '#cbd0e6' }}>{st}</li>
                    ))}
                  </ol>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
