import os
import re
import json
import sys

def read_file(path):
    with open(path, 'rb') as f:
        raw = f.read()
    for enc in ['utf-8', 'latin1', 'cp1252', 'iso-8859-1']:
        try:
            return raw.decode(enc)
        except Exception:
            continue
    return raw.decode('latin1', errors='replace')

# -------------------------------------------------------------
# 1. PARSE BOSSES & TEAMS
# -------------------------------------------------------------
def parse_all_bosses():
    boss_files = [
        ('docs_originales/ COMBATES DE JEFE/COMBATES PRINCIPALES/T1 - KANTO.txt', 'main', 'T1: Kanto'),
        ('docs_originales/ COMBATES DE JEFE/COMBATES PRINCIPALES/T2 - ARCHI7.txt', 'main', 'T2: Archi7 (Islas Sete)'),
        ('docs_originales/ COMBATES DE JEFE/COMBATES PRINCIPALES/T3 - JOHTO.txt', 'main', 'T3: Johto'),
        ('docs_originales/ COMBATES DE JEFE/COMBATES PRINCIPALES/T4 - DLC.txt', 'main', 'T4: DLC (Johto DLC)'),
        ('docs_originales/ COMBATES DE JEFE/COMBATES PRINCIPALES/T5 - HOENN.txt', 'main', 'T5: Hoenn'),
        ('docs_originales/ COMBATES DE JEFE/MISIONES SECUNDARIAS/KANTO.txt', 'side', 'Secundarias: Kanto'),
        ('docs_originales/ COMBATES DE JEFE/MISIONES SECUNDARIAS/ARCHI7.txt', 'side', 'Secundarias: Archi7'),
        ('docs_originales/ COMBATES DE JEFE/MISIONES SECUNDARIAS/JOHTO.txt', 'side', 'Secundarias: Johto'),
        ('docs_originales/ COMBATES DE JEFE/MISIONES SECUNDARIAS/DLC.txt', 'side', 'Secundarias: DLC'),
        ('docs_originales/ COMBATES DE JEFE/MISIONES SECUNDARIAS/HOENN.txt', 'side', 'Secundarias: Hoenn'),
    ]

    bosses = []
    boss_id_counter = 1

    for file_path, category, region in boss_files:
        if not os.path.exists(file_path):
            continue
        content = read_file(file_path)
        lines = content.splitlines()

        current_location = "Ubicación no especificada"
        current_boss = None

        for line_num, raw_line in enumerate(lines, 1):
            line = raw_line.strip()
            if not line:
                continue

            if line.startswith('---'):
                continue

            # Header detection
            is_header = False
            if line.isupper() and not line.startswith('VS ') and not line.startswith('COMBATE ') and not line.startswith('MOV:') and not line.startswith('IVS:') and not line.startswith('- ') and not line.startswith('TIPO:') and not line.startswith('HABILIDAD:'):
                is_header = True
            elif line.startswith('MISIÓN ') or line.startswith('SECUNDARIA ') or line.startswith('GIMNASIO ') or line.startswith('INTERIOR ') or line.startswith('FINAL '):
                is_header = True
            elif ' - ' in line and not line.startswith('- ') and not line.startswith('VS ') and not line.startswith('COMBATE ') and ('CIUDAD' in line or 'ISLA' in line or 'RUTA' in line or 'MT.' in line or 'CUEVA' in line or 'TORRE' in line or 'LABORATORIO' in line or 'GURÚ' in line or 'CAZABICHOS' in line):
                is_header = True

            if is_header:
                current_location = line
                continue

            # Boss detection
            if line.startswith('VS ') or line.startswith('COMBATE ') or line.startswith('BATALLA '):
                if current_boss:
                    bosses.append(current_boss)

                trainer_title = line
                if trainer_title.startswith('VS '):
                    trainer_title = trainer_title[3:].strip()

                current_boss = {
                    'id': f'boss-{boss_id_counter}',
                    'title': line,
                    'trainer_name': trainer_title,
                    'category': category,
                    'region': region,
                    'location': current_location,
                    'team': [],
                    'min_level': None,
                    'max_level': None,
                    'notes': None,
                    'source': {
                        'file': os.path.basename(file_path),
                        'line': line_num
                    }
                }
                boss_id_counter += 1
                continue

            # Pokemon line detection
            if current_boss is not None:
                if line.startswith('- ') and ('(Nv.' in line or '(Nv ' in line or 'Nv.' in line or 'Nv ' in line):
                    parts = line.lstrip('- ').split('|')
                    pkmn_name_part = parts[0].strip()
                    lvl_match = re.search(r'\((?:Nv\.?|Nv)\s*(\d+)\)', pkmn_name_part)
                    pkmn_lvl = int(lvl_match.group(1)) if lvl_match else None
                    pkmn_name = re.sub(r'\(.*?\)', '', pkmn_name_part).strip()
                    
                    pkmn_item = parts[1].strip() if len(parts) > 1 else 'No item'
                    pkmn_nat = 'No confirmada'
                    if len(parts) > 2 and 'Nat:' in parts[2]:
                        pkmn_nat = parts[2].replace('Nat:', '').strip()
                    elif len(parts) > 2:
                        pkmn_nat = parts[2].strip()

                    current_pkmn = {
                        'name': pkmn_name,
                        'level': pkmn_lvl,
                        'item': pkmn_item,
                        'nature': pkmn_nat,
                        'moves': [],
                        'ivs': 'Dato no confirmado en archivos',
                        'evs': 'Dato no confirmado en archivos',
                        'ability': None,
                        'notes': None
                    }
                    current_boss['team'].append(current_pkmn)
                    continue

                if current_boss['team'] and line.startswith('Mov:'):
                    moves_str = line[4:].strip()
                    moves = [m.strip() for m in moves_str.split(',') if m.strip()]
                    current_boss['team'][-1]['moves'] = moves
                    continue

                if current_boss['team'] and ('IVs:' in line or 'EVs:' in line):
                    parts = line.split('|')
                    for p in parts:
                        p = p.strip()
                        if p.startswith('IVs:'):
                            current_boss['team'][-1]['ivs'] = p[4:].strip()
                        elif p.startswith('EVs:'):
                            current_boss['team'][-1]['evs'] = p[4:].strip()
                    continue

                if current_boss['team'] and (line.startswith('Habilidad:') or line.startswith('Hab:')):
                    current_boss['team'][-1]['ability'] = line.split(':', 1)[1].strip()
                    continue

                if current_boss['team'] and line.startswith('Nota:'):
                    current_boss['team'][-1]['notes'] = line[5:].strip()
                    continue

        if current_boss:
            bosses.append(current_boss)

    for b in bosses:
        lvls = [p['level'] for p in b['team'] if p.get('level') is not None]
        if lvls:
            b['min_level'] = min(lvls)
            b['max_level'] = max(lvls)
        else:
            b['min_level'] = None
            b['max_level'] = None

    return bosses

# -------------------------------------------------------------
# 2. PARSE SIDE QUESTS & GIFTS
# -------------------------------------------------------------
def parse_all_sidequests(bosses):
    with open('secundarias_extracted.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    pages = text.split('=== PAGINA ')
    quests = []
    quest_id_counter = 1
    current_region = "Kanto"

    for p in pages[1:]:
        lines = p.splitlines()
        page_num = lines[0].split(' ===')[0].strip()
        body = '\n'.join(lines[1:])

        reg_match = re.search(r'╔═+\╗\s*\n\s*([^╚\n\r]+?)\s*\n\s*╚═+╝', body)
        if reg_match:
            current_region = reg_match.group(1).strip()

        blocks = re.split(r'═{20,}', body)
        for b in blocks:
            b = b.strip()
            if not b:
                continue
            b_clean = re.sub(r'╔═+╗\s*\n\s*[^╚\n\r]+?\s*\n\s*╚═+╝', '', b).strip()
            if not b_clean or len(b_clean) < 15:
                continue

            # Special Trainers entry
            if 'ENTRENADORES ESPECIALES' in b_clean:
                quests.append({
                    'id': f'quest-{quest_id_counter}',
                    'order': quest_id_counter,
                    'region': current_region,
                    'name': 'Entrenadores Especiales de Kanto y Sevii (Tutores Competitivos)',
                    'npc': 'Varios antiguos tutores de movimientos',
                    'location': 'Kanto / Sevii (Repartidos)',
                    'requirements': 'Debe haberse conseguido las 8 medallas de Kanto para que accedan a batallar.',
                    'description': 'Estos entrenadores (que en el juego base son tutores de ciertos movimientos), ahora otorgan objetos orientados al competitivo una vez los derrotemos.',
                    'steps': [
                        'Llamaesfera: Derrotar al anciano de Ciudad Azulona tras cruzar un pequeño charco.',
                        'Lodo negro: Derrotar al NPC en Ciudad Verde tras surfear el pequeño charco o cortar el árbol.',
                        'Gafas elegidas: Derrotar a la copiona en una de las casas de Ciudad Azafrán.',
                        'Cinta elegida: Derrotar al científico en la parte trasera del museo de Ciudad Plateada.',
                        'Cinta experto: Derrotar al cazabichos en Ciudad Fucsia observando el Kangaskhan.',
                        'Chaleco asalto: Derrotar al científico en una de las salas de investigación de Isla Canela.',
                        'MT32 Roca Afilada: Derrotar al entrenador en lo profundo del Túnel Roca.',
                        'Vidaesfera: Derrotar al entrenador guay al final de Calle Victoria.',
                        'Lupa: Derrotar a la exorcista en la casa al norte de Isla Secunda (Sevii).',
                        'Pañuelo Elegido: Derrotar al entrenador guay en el puente al sur de Isla Sétima (Sevii).'
                    ],
                    'rewards': {
                        'pokemon': [],
                        'items': ['Llamaesfera', 'Lodo negro', 'Gafas elegidas', 'Cinta elegida', 'Cinta experto', 'Chaleco asalto', 'MT32 Roca Afilada', 'Vidaesfera', 'Lupa', 'Pañuelo Elegido'],
                        'money': None,
                        'badges': None,
                        'access': None
                    },
                    'video_tutorial': 'Entrenadores especiales de Kanto',
                    'page': page_num,
                    'connected_boss_ids': []
                })
                quest_id_counter += 1
                continue

            lines_b = [l.strip() for l in b_clean.splitlines() if l.strip()]
            first_line = lines_b[0]
            
            title = first_line
            desc_lines = []
            reward_lines = []
            video_tut = "No disponible"
            prereq = "Información no encontrada en los archivos proporcionados."
            in_rewards = False

            if ':' in first_line and not first_line.startswith('Recompensa') and not first_line.startswith('Video tutorial'):
                parts = first_line.split(':', 1)
                title = parts[0].strip()
                if parts[1].strip():
                    desc_lines.append(parts[1].strip())
                rest_lines = lines_b[1:]
            else:
                rest_lines = lines_b[1:]

            for lb in rest_lines:
                if lb.startswith('Video tutorial:'):
                    video_tut = lb.replace('Video tutorial:', '').strip()
                    in_rewards = False
                elif lb.startswith('Recompensa:') or lb.startswith('Recompensas:'):
                    in_rewards = True
                elif lb.startswith('Prerrequisito:') or lb.startswith('Prerrequisitos:') or lb.startswith('Requisito:'):
                    prereq = lb.split(':', 1)[1].strip()
                    in_rewards = False
                elif in_rewards:
                    reward_lines.append(lb)
                else:
                    desc_lines.append(lb)

            pkmn_rewards = []
            item_rewards = []
            money_reward = None
            badge_reward = None
            access_reward = None

            for r in reward_lines:
                r_clean = r.lstrip('- ').strip()
                if not r_clean: continue
                if any(m in r_clean.lower() for m in ['pokés', 'pokes', 'millones', 'poké']):
                    money_reward = r_clean
                elif 'medalla' in r_clean.lower():
                    badge_reward = r_clean
                elif 'acceso' in r_clean.lower():
                    access_reward = r_clean
                elif 'Nv' in r_clean or 'Nv.' in r_clean or 'nivel' in r_clean.lower() or any(pk in r_clean for pk in ['Eevees', 'Tirtouga', 'Archen', 'Poipole', 'Calyrex', 'Phanpy', 'Pinsir', 'Squirtle', 'Charmander', 'Snorlax', 'Hitmonlee', 'Hitmonchan', 'Magikarp', 'Duraludon', 'Nihilego', 'Guzzlord', 'Cranidos', 'Skorupi', 'Piplup', 'Bomushikaa', 'Blacephaleon', 'Fennekin', 'Marshadow', 'Chimchar', 'Froakie', 'Pidgeotita', 'Litten', 'Madaamu', 'Relicanth', 'Anorith']):
                    pkmn_rewards.append(r_clean)
                else:
                    item_rewards.append(r_clean)

            # Match connected boss battles
            matched_bosses = []
            title_lower = title.lower()
            for b in bosses:
                if b['category'] == 'side':
                    loc_l = b['location'].lower()
                    t_l = b['title'].lower()
                    if ('machop' in title_lower and 'machop' in loc_l) or \
                       ('pescador ciudad carmín' in title_lower and 'pescador carmín' in loc_l) or \
                       ('cazabichos' in title_lower and 'cazabichos' in loc_l) or \
                       ('pescador ruta 12' in title_lower and 'pescador ruta 12' in loc_l) or \
                       ('científico de isla canela' in title_lower and 'laboratorio canela' in loc_l) or \
                       ('científico de ciudad fucsia' in title_lower and 'científico fucsia' in loc_l) or \
                       ('discípulo de pegaso' in title_lower and 'discípulo pegaso' in t_l) or \
                       ('ancianos de pueblo caoba' in title_lower and 'carbón azalea' in loc_l) or \
                       ('ruinas alfa' in title_lower and 'ruinas alfa' in loc_l) or \
                       ('tunel roca' in title_lower and 'neo túnel roca' in loc_l) or \
                       ('estafadores' in title_lower and 'estafador' in t_l):
                        matched_bosses.append(b['id'])

            quests.append({
                'id': f'quest-{quest_id_counter}',
                'order': quest_id_counter,
                'region': current_region,
                'name': title,
                'npc': 'NPC indicado en los pasos',
                'location': current_region,
                'requirements': prereq,
                'description': ' '.join(desc_lines),
                'rewards': {
                    'raw': reward_lines,
                    'pokemon': pkmn_rewards,
                    'items': item_rewards,
                    'money': money_reward,
                    'badges': badge_reward,
                    'access': access_reward
                },
                'video_tutorial': video_tut,
                'page': page_num,
                'connected_boss_ids': matched_bosses
            })
            quest_id_counter += 1

    return quests

# -------------------------------------------------------------
# 3. PARSE COMPLETE POKÉDEX & ACQUISITION
# -------------------------------------------------------------
def parse_all_pokemon():
    path = 'docs_originales/POKÉMON/OBTENCIÓN  TODOS  PKMN.txt'
    content = read_file(path)
    lines = content.splitlines()

    entries = []
    current_entry = None

    for line_num, raw_line in enumerate(lines, 1):
        line = raw_line.strip()
        if not line or line.startswith('---'):
            continue

        # Regex for main pattern: NAME - NUM - METHOD
        m = re.match(r'^([A-Z0-9_\'\-\s&.]+?)\s*(?:-|–|\s)\s*(\d+)\s*(?:-|–)\s*(.*)$', line)
        if m:
            if current_entry:
                entries.append(current_entry)
            p_name = m.group(1).strip()
            dex_num = int(m.group(2))
            method = m.group(3).strip()
            current_entry = {
                'dex_num': dex_num,
                'name': p_name,
                'method': method,
                'line': line_num
            }
        else:
            # Check if this is an edge-case header like CALYREX JINETE GLACIAL/ESPECTRAL
            if ' - ' in line and any(k in line for k in ['CALYREX', 'AERODACTYL_SKAL']):
                if current_entry:
                    entries.append(current_entry)
                parts = line.split(' - ', 1)
                current_entry = {
                    'dex_num': None,
                    'name': parts[0].strip(),
                    'method': parts[1].strip(),
                    'line': line_num
                }
            elif current_entry is not None:
                # Continuation line
                current_entry['method'] += ' ' + line

    if current_entry:
        entries.append(current_entry)

    # Classify tags & gifts
    for e in entries:
        tags = []
        ml = e['method'].lower()
        if 'regalo' in ml or 'entregado' in ml or 'dar' in ml or 'recompensa' in ml:
            tags.append('Regalo')
        if 'salvaje' in ml or 'hierba' in ml or 'pesca' in ml or 'surf' in ml:
            tags.append('Salvaje')
        if 'evoluci' in ml:
            tags.append('Evolución')
        if 'misi' in ml or 'secundaria' in ml:
            tags.append('Misión Secundaria')
        if 'robado' in ml:
            tags.append('Robado / Historia')
        if 'fósil' in ml or 'fosil' in ml:
            tags.append('Fósil')
        if 'casino' in ml:
            tags.append('Casino')
        if any(l in e['name'].lower() for l in ['primigenio', '-p', '-&', '-z', '-x', '-y', 'mewtwo', 'arceus', 'lugia', 'ho-oh', 'zapdos', 'articuno', 'moltres', 'kyogre', 'groudon', 'kyurem', 'regigigas', 'poipole', 'calyrex', 'marshadow', 'nihilego', 'guzzlord', 'blacephaleon']):
            tags.append('Legendario / Especial')
        e['tags'] = tags if tags else ['Normal']

    return entries

# -------------------------------------------------------------
# 4. PARSE STAT CHANGES, CUSTOM POKEMON, EVOLUTIONS, MOVES, ITEMS
# -------------------------------------------------------------
def parse_stat_changes():
    path = 'docs_originales/POKÉMON/CAMBIOS en STATS, TIPOS y HABILIDADES.txt'
    content = read_file(path)
    lines = [l.strip() for l in content.splitlines() if l.strip()]
    changes = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.startswith('Oficial:') and not line.startswith('Hackrom:') and not line.startswith('Tipo:') and not line.startswith('Habilidad:') and not line.startswith('Nota:'):
            p_name = line
            entry = {'name': p_name, 'official': None, 'hackrom': None, 'type': None, 'ability': None, 'notes': None}
            i += 1
            while i < len(lines):
                sub = lines[i]
                if sub.startswith('Oficial:'):
                    entry['official'] = sub.replace('Oficial:', '').strip()
                elif sub.startswith('Hackrom:'):
                    entry['hackrom'] = sub.replace('Hackrom:', '').strip()
                elif sub.startswith('Tipo:'):
                    entry['type'] = sub.replace('Tipo:', '').strip()
                elif sub.startswith('Habilidad:'):
                    entry['ability'] = sub.replace('Habilidad:', '').strip()
                elif sub.startswith('Nota:'):
                    entry['notes'] = sub.replace('Nota:', '').strip()
                else:
                    break
                i += 1
            changes.append(entry)
        else:
            i += 1
    return changes

def parse_custom_pokemon():
    custom = []
    files = [
        ('docs_originales/POKÉMON/NUEVOS POKEMON/Experimentos Rocket.txt', 'Experimento Rocket', 'Prototipos creados artificialmente por científicos del Team Rocket'),
        ('docs_originales/POKÉMON/NUEVOS POKEMON/Fuertes Vínculo.txt', 'Fuerte Vínculo', 'Transformaciones por lazo extremo entre Entrenador y Pokémon'),
        ('docs_originales/POKÉMON/NUEVOS POKEMON/Nuevas Megaevoluciones.txt', 'Megaevolución Inédita', 'Nuevas Megaevoluciones exclusivas'),
        ('docs_originales/POKÉMON/NUEVOS POKEMON/Primigenios y Antiguos.txt', 'Forma Primigenia / Beta 97', 'Formas Primigenias y diseños históricos de Spaceworld 97 Beta Oro/Plata')
    ]

    for fpath, cat_title, cat_desc in files:
        if not os.path.exists(fpath): continue
        content = read_file(fpath)
        blocks = re.split(r'\n(?=[A-Z0-9\-_&ÁÉÍÓÚ\s]{3,35}:?\n)', content)
        for b in blocks:
            b = b.strip()
            if not b: continue
            lines = [l.strip() for l in b.splitlines() if l.strip()]
            header = lines[0].rstrip(':')
            if 'PROTOTIPOS' in header or 'POKEMON ANTIGUOS' in header or 'FORMAS PRIMIGENIAS' in header or 'FUERTES VÍNCULO' in header or header.startswith('-'):
                continue

            stats_lines = []
            pkmn_type = None
            pkmn_ability = None
            notes = []

            for l in lines[1:]:
                if l.startswith('Tipo:'):
                    parts = l.split('|')
                    for p in parts:
                        p = p.strip()
                        if p.startswith('Tipo:'):
                            pkmn_type = p.replace('Tipo:', '').strip()
                        elif p.startswith('Habilidad:'):
                            pkmn_ability = p.replace('Habilidad:', '').strip()
                elif l.startswith('Habilidad:'):
                    pkmn_ability = l.replace('Habilidad:', '').strip()
                elif 'Ps ' in l or 'Total ' in l:
                    stats_lines.append(l)
                else:
                    notes.append(l)

            custom.append({
                'name': header,
                'category': cat_title,
                'category_description': cat_desc,
                'stats_breakdown': stats_lines,
                'type': pkmn_type or 'Dato no confirmado en archivos',
                'ability': pkmn_ability or 'Dato no confirmado en archivos',
                'notes': ' '.join(notes) if notes else None
            })
    return custom

def parse_evolutions():
    path = 'docs_originales/POKÉMON/EVOLUCIÓN TODOS PKMN.txt'
    content = read_file(path)
    evos = []
    lines = [l.strip() for l in content.splitlines() if l.strip()]
    for line_num, l in enumerate(lines, 1):
        if l.startswith('NOTA:') or l.startswith('---'): continue
        if ' a ' in l and ' - ' in l:
            parts = l.split(' - ')
            pair = parts[0].strip()
            method = parts[1].strip()
            from_p, to_p = pair.split(' a ', 1)
            evos.append({
                'from': from_p.strip(),
                'to': to_p.strip(),
                'method': method,
                'line': line_num
            })
        elif ' - ' in l:
            parts = l.split(' - ')
            evos.append({
                'from': parts[0].strip(),
                'to': 'Ver método',
                'method': parts[1].strip(),
                'line': line_num
            })
    return evos

def parse_moves():
    path = 'docs_originales/CAMBIOS en MOVIMIENTOS.txt'
    content = read_file(path)
    moves = []
    blocks = content.split('----------------------------------------------')
    for b in blocks:
        b = b.strip()
        if not b: continue
        lines = [l.strip() for l in b.splitlines() if l.strip()]
        if not lines: continue
        move_name = lines[0]
        
        official_data = {'type': 'No especificado', 'power': '-', 'accuracy': '-', 'effect': '-', 'pp': '-'}
        hackrom_data = {'type': 'No especificado', 'power': '-', 'accuracy': '-', 'effect': '-', 'pp': '-'}
        current_target = None

        for l in lines[1:]:
            if 'Oficial' in l:
                current_target = official_data
                m_type = re.search(r'\((?:Tipo\s*)?([^)]+)\)', l, re.IGNORECASE)
                if m_type:
                    current_target['type'] = m_type.group(1).replace('Tipo', '').strip()
                continue
            elif 'Hackrom' in l:
                current_target = hackrom_data
                m_type = re.search(r'\((?:Tipo\s*)?([^)]+)\)', l, re.IGNORECASE)
                if m_type:
                    current_target['type'] = m_type.group(1).replace('Tipo', '').strip()
                continue

            if current_target is not None and '-' in l:
                k, v = l.split('-', 1)
                k = k.strip().lower()
                v = v.strip()
                if 'potencia' in k:
                    current_target['power'] = v
                elif 'precisi' in k:
                    current_target['accuracy'] = v
                elif 'ef.secundario' in k or 'efecto' in k:
                    current_target['effect'] = v
                elif 'pp' in k:
                    current_target['pp'] = v

        moves.append({
            'name': move_name,
            'official': official_data,
            'hackrom': hackrom_data
        })
    return moves

def parse_items():
    path = 'docs_originales/OBJETOS/OBTENCIÓN OBJETOS.txt'
    content = read_file(path)
    items = []
    current_category = "General"
    lines = content.splitlines()

    for line_num, raw_line in enumerate(lines, 1):
        line = raw_line.strip()
        if not line or line.startswith('---'): continue
        if line.isupper() and len(line) > 3 and not ':' in line and not line.startswith('MT') and not line.startswith('MO'):
            current_category = line
            continue

        if ':' in line:
            parts = line.split(':', 1)
            item_name = parts[0].strip()
            item_loc = parts[1].strip()
            items.append({
                'category': current_category,
                'name': item_name,
                'location_and_method': item_loc,
                'source': {'file': 'OBTENCIÓN OBJETOS.txt', 'line': line_num}
            })
        elif line.startswith('- ') and items:
            items[-1]['location_and_method'] += ' ' + line

    cambios_path = 'docs_originales/OBJETOS/CAMBIOS en OBJETOS.txt'
    if os.path.exists(cambios_path):
        c_content = read_file(cambios_path)
        c_lines = c_content.splitlines()
        current_cat = "Objetos Potenciadores de Ciertos Pokémon"
        for line_num, raw_line in enumerate(c_lines, 1):
            line = raw_line.strip()
            if not line or line.startswith('---'): continue
            if line.isupper() and len(line) > 3 and not ':' in line:
                current_cat = line
                continue
            if ':' in line:
                p = line.split(':', 1)
                items.append({
                    'category': current_cat,
                    'name': p[0].strip(),
                    'location_and_method': p[1].strip(),
                    'source': {'file': 'CAMBIOS en OBJETOS.txt', 'line': line_num}
                })

    return items

def parse_qol_and_faq():
    faq_text = read_file('docs_originales/Preguntas Frecuentes.txt')
    qol_text = read_file('docs_originales/QOLS.txt')
    credits_text = read_file('docs_originales/Creditos.rtf')

    # Parse FAQs
    faqs = []
    faq_blocks = faq_text.split('+ ')
    for b in faq_blocks:
        b = b.strip()
        if not b or b.startswith('PREGUNTAS'): continue
        parts = b.split('- ', 1)
        q = parts[0].strip()
        ans = parts[1].strip() if len(parts) > 1 else 'Dato no confirmado.'
        faqs.append({'question': q, 'answer': ans})

    return {
        'faqs': faqs,
        'raw_qols': qol_text,
        'raw_faq': faq_text,
        'raw_credits': credits_text
    }

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    data_dir = 'src/data'
    os.makedirs(data_dir, exist_ok=True)

    print("Building complete consolidated databases...")
    bosses = parse_all_bosses()
    sidequests = parse_all_sidequests(bosses)
    pokemon = parse_all_pokemon()
    stat_changes = parse_stat_changes()
    custom_pkmn = parse_custom_pokemon()
    evolutions = parse_evolutions()
    moves = parse_moves()
    items = parse_items()
    qol_faq = parse_qol_and_faq()

    # Save databases
    with open(f'{data_dir}/bosses.json', 'w', encoding='utf-8') as f:
        json.dump(bosses, f, indent=2, ensure_ascii=False)
    with open(f'{data_dir}/sidequests.json', 'w', encoding='utf-8') as f:
        json.dump(sidequests, f, indent=2, ensure_ascii=False)
    with open(f'{data_dir}/pokemon.json', 'w', encoding='utf-8') as f:
        json.dump(pokemon, f, indent=2, ensure_ascii=False)
    with open(f'{data_dir}/stat_changes.json', 'w', encoding='utf-8') as f:
        json.dump(stat_changes, f, indent=2, ensure_ascii=False)
    with open(f'{data_dir}/custom_pokemon.json', 'w', encoding='utf-8') as f:
        json.dump(custom_pkmn, f, indent=2, ensure_ascii=False)
    with open(f'{data_dir}/evolutions.json', 'w', encoding='utf-8') as f:
        json.dump(evolutions, f, indent=2, ensure_ascii=False)
    with open(f'{data_dir}/moves.json', 'w', encoding='utf-8') as f:
        json.dump(moves, f, indent=2, ensure_ascii=False)
    with open(f'{data_dir}/items.json', 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
    with open(f'{data_dir}/qol_faq.json', 'w', encoding='utf-8') as f:
        json.dump(qol_faq, f, indent=2, ensure_ascii=False)

    print(f"DONE! Statistics:")
    print(f"- Bosses: {len(bosses)}")
    print(f"- Side Quests: {len(sidequests)}")
    print(f"- Pokémon entries: {len(pokemon)}")
    print(f"- Stat Changes: {len(stat_changes)}")
    print(f"- Custom Pokémon: {len(custom_pkmn)}")
    print(f"- Evolutions: {len(evolutions)}")
    print(f"- Moves: {len(moves)}")
    print(f"- Items: {len(items)}")
    print(f"- FAQs: {len(qol_faq['faqs'])}")

if __name__ == '__main__':
    main()
