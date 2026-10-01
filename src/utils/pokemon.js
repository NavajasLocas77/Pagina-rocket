// Utility helpers for Pokémon names, types, sprites and cross-references

export const TYPE_COLORS = {
  acero: '#5a8ea2',
  agua: '#3399ff',
  bicho: '#729f3f',
  dragon: '#5060e1',
  dragón: '#5060e1',
  electrico: '#eab308',
  eléctrico: '#eab308',
  fantasma: '#7b62a3',
  fuego: '#f08030',
  hada: '#f48fb1',
  hielo: '#4dd0e1',
  lucha: '#d34237',
  normal: '#9fa19f',
  planta: '#4e8234',
  psiquico: '#f85888',
  psíquico: '#f85888',
  roca: '#b8a038',
  siniestro: '#49392f',
  tierra: '#927d44',
  veneno: '#a040a0',
  volador: '#81b9ef'
};

// Map custom/clean names to standard dex numbers for sprite resolution
const CUSTOM_SPRITE_MAP = {
  'nidoran-f': 29,
  'nidoran-m': 32,
  'farfetchd': 83,
  'mr-mime': 122,
  'deoxys': 386,
  'giratina': 487,
  'shaymin': 492,
  'tornadus': 641,
  'thundurus': 642,
  'landorus': 645,
  'keldeo': 647,
  'meloetta': 648,
  'meowstic': 678,
  'aegislash': 681,
  'pumpkaboo': 710,
  'gourgeist': 711,
  'zygarde': 718,
  'oricorio': 741,
  'lycanroc': 745,
  'wishiwashi': 746,
  'silvally': 773,
  'minior': 774,
  'mimikyu': 778,
  'dhelmise': 781,
  'tapu-koko': 785,
  'tapu-lele': 786,
  'tapu-bulu': 787,
  'tapu-fini': 788,
  'nihilego': 793,
  'buzzwole': 794,
  'pheromosa': 795,
  'xurkitree': 796,
  'celesteela': 797,
  'kartana': 798,
  'guzzlord': 799,
  'necrozma': 800,
  'poipole': 803,
  'naganadel': 804,
  'stakataka': 805,
  'blacephalon': 806,
  'blacephaleon': 806,
  'zeraora': 807,
  'meltan': 808,
  'melmetal': 809,
  'grookey': 810,
  'thwackey': 811,
  'rillaboom': 812,
  'scorbunny': 813,
  'raboot': 814,
  'cinderace': 815,
  'sobble': 816,
  'drizzile': 817,
  'inteleon': 818,
  'corviknight': 823,
  'orbeetle': 826,
  'drednaw': 834,
  'coalossal': 839,
  'flapple': 841,
  'appletun': 842,
  'sandaconda': 844,
  'cramorant': 845,
  'toxtricity': 849,
  'centiskorch': 851,
  'hatterene': 858,
  'grimmsnarl': 861,
  'alcremie': 869,
  'duraludon': 884,
  'zacian': 888,
  'zamazenta': 889,
  'eternatus': 890,
  'urshifu': 892,
  'zarude': 893,
  'regieleki': 894,
  'regidrago': 895,
  'glastrier': 896,
  'spectrier': 897,
  'calyrex': 898,
  'wyrdeer': 899,
  'kleavor': 900,
  'ursaluna': 901,
  'basculegion': 902,
  'sneasler': 903,
  'overqwil': 904,
  'enamorus': 905,
  'sprigatito': 906,
  'floragato': 907,
  'meowscarada': 908,
  'fuecoco': 909,
  'crocalor': 910,
  'skeledirge': 911,
  'quaxly': 912,
  'quaxwell': 913,
  'quaquaval': 914,
  'annihilape': 979,
  'clodsire': 980,
  'farigiraf': 981,
  'dudunsparce': 982,
  'kingambit': 983,
  'archaludon': 1018,
  'hydrapple': 1019
};

export function getPokemonSprite(name, dexNum = null) {
  if (!name && !dexNum) return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

  // If first argument is a number, treat it directly as dexNum
  if (typeof name === 'number') {
    if (name > 0 && name <= 1025) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${name}.png`;
    }
    dexNum = name;
    name = '';
  }

  if (dexNum && typeof dexNum === 'number' && dexNum > 0 && dexNum <= 1025) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexNum}.png`;
  }

  // Normalize name
  let clean = String(name || '').toLowerCase().trim()
    .replace(/[♀]/g, '-f')
    .replace(/[♂]/g, '-m')
    .replace(/['’.]/g, '')
    .replace(/\s+/g, '-');

  if (!clean) return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

  // Check base forms of variants
  if (clean.includes('-x') || clean.includes('-y') || clean.includes('-z') || clean.includes('-&') || clean.includes('-p') || clean.includes('-m')) {
    const baseName = clean.split('-')[0];
    if (CUSTOM_SPRITE_MAP[baseName]) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${CUSTOM_SPRITE_MAP[baseName]}.png`;
    }
  }

  // Spaceworld 97 or custom forms with base forms
  if (clean.startsWith('mega-')) {
    const baseName = clean.replace('mega-', '');
    if (CUSTOM_SPRITE_MAP[baseName]) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${CUSTOM_SPRITE_MAP[baseName]}.png`;
    }
  }

  if (CUSTOM_SPRITE_MAP[clean]) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${CUSTOM_SPRITE_MAP[clean]}.png`;
  }

  // Fallback to Showdown/PokeAPI by clean name
  return `https://play.pokemonshowdown.com/sprites/gen5/${clean.split('-')[0]}.png`;
}

export function parseTypes(typeString) {
  if (!typeString) return ['normal'];
  const parts = typeString.split(/[\/,]/).map(t => t.trim().toLowerCase());
  return parts.filter(Boolean);
}
