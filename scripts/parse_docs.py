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

# 1. PARSE BOSSES
def parse_boss_files():
    bosses = []
    
    files = [
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

    boss_id_counter = 1

    for file_path, category, region in files:
        if not os.path.exists(file_path):
            continue
        content = read_file(file_path)
        lines = content.splitlines()

        current_location = "Ubicación inicial"
        current_section = ""
        current_boss = None

        for line_num, raw_line in enumerate(lines, 1):
            line = raw_line.strip()
            if not line:
                continue

            # Check if this line is a location/header
            if line.startswith('---'):
                continue
            
            # Check if line looks like location/section header
            # Usually all uppercase or title before "VS "
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

            # Check for boss match
            if line.startswith('VS ') or line.startswith('COMBATE ') or line.startswith('BATALLA '):
                if current_boss:
                    bosses.append(current_boss)

                trainer_title = line
                if trainer_title.startswith('VS '):
                    trainer_title = trainer_title[3:].strip()
                elif trainer_title.startswith('COMBATE '):
                    trainer_title = trainer_title
                
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
                    'source': {
                        'file': os.path.basename(file_path),
                        'line': line_num
                    }
                }
                boss_id_counter += 1
                continue

            # Check if current line is a Pokémon entry: e.g., "- Blastoise (Nv. 50) | Restos | Nat: Osada"
            if current_boss is not None:
                if line.startswith('- ') and ('(Nv.' in line or '(Nv ' in line or 'Nv.' in line):
                    # parse pokemon line
                    # Format: - Name (Nv. XX) | Item | Nat: Nature
                    m = re.match(r'^-\s*([^(\n\r]+?)(?:\s*\((?:Nv\.?|Nv)\s*(\d+)\))?(?:\s*\|\s*([^|\n\r]+?))?(?:\s*\|\s*Nat:\s*([^|\n\r]+?))?$', line)
                    if m:
                        pkmn_name = m.group(1).strip()
                        pkmn_lvl = int(m.group(2)) if m.group(2) else None
                        pkmn_item = m.group(3).strip() if m.group(3) else 'No item'
                        pkmn_nat = m.group(4).strip() if m.group(4) else 'No confirmada'
                    else:
                        # Fallback parsing
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
                        'ivs': 'Dato no confirmado',
                        'evs': 'Dato no confirmado',
                        'ability': None,
                        'notes': None
                    }
                    current_boss['team'].append(current_pkmn)
                    continue

                # Check for moves line: "Mov: Surf, Terremoto..."
                if current_boss['team'] and line.startswith('Mov:'):
                    moves_str = line[4:].strip()
                    moves = [m.strip() for m in moves_str.split(',') if m.strip()]
                    current_boss['team'][-1]['moves'] = moves
                    continue

                # Check for IVs / EVs: "IVs: 31/31 | EVs: 252 At..."
                if current_boss['team'] and ('IVs:' in line or 'EVs:' in line):
                    parts = line.split('|')
                    for p in parts:
                        p = p.strip()
                        if p.startswith('IVs:'):
                            current_boss['team'][-1]['ivs'] = p[4:].strip()
                        elif p.startswith('EVs:'):
                            current_boss['team'][-1]['evs'] = p[4:].strip()
                    continue

                # Check for Ability or other notes
                if current_boss['team'] and (line.startswith('Habilidad:') or line.startswith('Hab:')):
                    current_boss['team'][-1]['ability'] = line.split(':', 1)[1].strip()
                    continue
                elif current_boss['team'] and line.startswith('Nota:'):
                    current_boss['team'][-1]['notes'] = line[5:].strip()
                    continue

        if current_boss:
            bosses.append(current_boss)

    # Compute min_level and max_level
    for b in bosses:
        lvls = [p['level'] for p in b['team'] if p.get('level') is not None]
        if lvls:
            b['min_level'] = min(lvls)
            b['max_level'] = max(lvls)
        else:
            b['min_level'] = None
            b['max_level'] = None

    return bosses

# 2. PARSE SIDE QUESTS
def parse_sidequests():
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

        # Detect Region header
        reg_match = re.search(r'╔═+\╗\s*\n\s*([^╚\n\r]+?)\s*\n\s*╚═+╝', body)
        if reg_match:
            current_region = reg_match.group(1).strip()

        # Split by separator: ══════════════════════════════════════════════════════
        blocks = re.split(r'═{20,}', body)
        for b in blocks:
            b = b.strip()
            if not b:
                continue
            # Remove region box if in block
            b_clean = re.sub(r'╔═+╗\s*\n\s*[^╚\n\r]+?\s*\n\s*╚═+╝', '', b).strip()
            if not b_clean or len(b_clean) < 15:
                continue

            # Let's check if this is "Subcategoría: ENTRENADORES ESPECIALES"
            if 'ENTRENADORES ESPECIALES' in b_clean:
                # Special trainers section
                lines_b = [l.strip() for l in b_clean.splitlines() if l.strip()]
                special_desc = []
                special_items = []
                for lb in lines_b:
                    if lb.startswith('•'):
                        special_items.append(lb.lstrip('•').strip())
                    elif 'Video tutorial' in lb:
                        vt = lb.replace('Video tutorial:', '').strip()
                    else:
                        special_desc.append(lb)

                quests.append({
                    'id': f'quest-{quest_id_counter}',
                    'order': quest_id_counter,
                    'region': current_region,
                    'name': 'Entrenadores Especiales de Kanto (Tutores de Objetos Competitivos)',
                    'npc': 'Varios Tutores convertidos en Entrenadores Competitivos',
                    'location': 'Kanto / Sevii (8 gimnasios completados)',
                    'requirements': 'Debe haberse conseguido las 8 medallas de Kanto para que accedan a batallar.',
                    'description': ' '.join(special_desc),
                    'steps': [
                        'Llamaesfera: Derrotar al anciano de Ciudad Azulona tras cruzar un pequeño charco.',
                        'Lodo negro: Derrotar al NPC en Ciudad Verde tras surfear el charco o cortar el árbol.',
                        'Gafas elegidas: Derrotar a la copiona en Ciudad Azafrán.',
                        'Cinta elegida: Derrotar al científico en la parte trasera del museo de Ciudad Plateada.',
                        'Cinta experto: Derrotar al cazabichos en Ciudad Fucsia observando el Kangaskhan.',
                        'Chaleco asalto: Derrotar al científico en laboratorio de Isla Canela.',
                        'MT32 Roca Afilada: Derrotar al entrenador en lo profundo del Túnel Roca.',
                        'Vidaesfera: Derrotar al entrenador guay al final de Calle Victoria.',
                        'Lupa: Derrotar a la exorcista al norte de Isla Secunda (Sevii).',
                        'Pañuelo Elegido: Derrotar al entrenador guay en el puente sur de Isla Sétima (Sevii).'
                    ],
                    'rewards': {
                        'pokemon': [],
                        'items': ['Llamaesfera', 'Lodo negro', 'Gafas elegidas', 'Cinta elegida', 'Cinta experto', 'Chaleco asalto', 'MT32 Roca Afilada', 'Vidaesfera', 'Lupa', 'Pañuelo Elegido'],
                        'money': None,
                        'badges': None,
                        'access': None
                    },
                    'video_tutorial': 'Entrenadores especiales de Kanto',
                    'page': page_num
                })
                quest_id_counter += 1
                continue

            # Standard quest parsing
            # Usually: QuestName: Description. Recompensa: ... Video tutorial: ...
            lines_b = [l.strip() for l in b_clean.splitlines() if l.strip()]
            first_line = lines_b[0]
            
            title = first_line
            desc_lines = []
            reward_lines = []
            video_tut = "No disponible"
            prereq = "Ninguno especificado"
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

            # Extract rewards detail
            pkmn_rewards = []
            item_rewards = []
            money_reward = None
            badge_reward = None
            access_reward = None

            for r in reward_lines:
                r_clean = r.lstrip('- ').strip()
                if not r_clean: continue
                # Check for pokés / money
                m_money = re.search(r'([\d.,]+)\s*(?:millones?|k|mil)?\s*pok[ée]s', r_clean, re.IGNORECASE)
                if m_money or 'pokés' in r_clean.lower() or 'pokes' in r_clean.lower():
                    money_reward = r_clean
                elif 'medalla' in r_clean.lower():
                    badge_reward = r_clean
                elif 'acceso' in r_clean.lower():
                    access_reward = r_clean
                elif 'Nv' in r_clean or 'Nv.' in r_clean or 'nivel' in r_clean.lower() or any(pk in r_clean for pk in ['Eevees', 'Tirtouga', 'Archen', 'Poipole', 'Calyrex', 'Phanpy', 'Pinsir', 'Squirtle', 'Charmander', 'Snorlax', 'Hitmonlee', 'Hitmonchan', 'Magikarp', 'Duraludon', 'Nihilego', 'Guzzlord', 'Cranidos', 'Skorupi', 'Piplup', 'Bomushikaa', 'Blacephaleon', 'Fennekin', 'Marshadow', 'Chimchar', 'Froakie', 'Pidgeotita', 'Litten', 'Madaamu', 'Relicanth', 'Anorith']):
                    pkmn_rewards.append(r_clean)
                else:
                    item_rewards.append(r_clean)

            quests.append({
                'id': f'quest-{quest_id_counter}',
                'order': quest_id_counter,
                'region': current_region,
                'name': title,
                'npc': 'NPC indicado en descripción',
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
                'page': page_num
            })
            quest_id_counter += 1

    return quests

# 3. PARSE POKÉMON ACQUISITION
def parse_pokemon_acquisition():
    path = 'docs_originales/POKÉMON/OBTENCIÓN  TODOS  PKMN.txt'
    content = read_file(path)
    entries = []
    
    lines = content.splitlines()
    for line_num, raw_line in enumerate(lines, 1):
        line = raw_line.strip()
        if not line: continue
        # Pattern: NAME - NUMBER - METHOD
        parts = line.split(' - ')
        if len(parts) >= 3:
            name = parts[0].strip()
            num_str = parts[1].strip()
            method = ' - '.join(parts[2:]).strip()
            try:
                num = int(num_str)
            except:
                num = None
            
            # Detect tags
            tags = []
            ml = method.lower()
            if 'regalo' in ml or 'entregado' in ml:
                tags.append('Regalo')
            if 'salvaje' in ml:
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
            if any(l in name.lower() for l in ['primigenio', '-p', '-&', '-z', '-x', '-y', 'mewtwo', 'arceus', 'lugia', 'ho-oh', 'zapdos', 'articuno', 'moltres', 'kyogre', 'groudon', 'kyurem', 'regigigas', 'poipole', 'calyrex', 'marshadow', 'nihilego', 'guzzlord', 'blacephaleon']):
                tags.append('Legendario / Especial')

            entries.append({
                'dex_num': num,
                'name': name,
                'method': method,
                'tags': tags if tags else ['Otros'],
                'line': line_num
            })
        elif len(parts) == 2 and parts[1].strip().isdigit():
            name = parts[0].strip()
            num = int(parts[1].strip())
            entries.append({
                'dex_num': num,
                'name': name,
                'method': 'Dato no encontrado en los archivos analizados.',
                'tags': ['Dato no confirmado'],
                'line': line_num
            })

    return entries

# 4. PARSE POKEMON CHANGES
def parse_pokemon_changes():
    path = 'docs_originales/POKÉMON/CAMBIOS en STATS, TIPOS y HABILIDADES.txt'
    content = read_file(path)
    lines = [l.strip() for l in content.splitlines() if l.strip()]
    
    changes = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check if line is a pokemon name header (usually single or two words, uppercase)
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
                    # Next pokemon
                    break
                i += 1
            changes.append(entry)
        else:
            i += 1
    return changes

# 5. PARSE CUSTOM POKÉMON
def parse_custom_pokemon():
    custom = {
        'experimentos_rocket': [],
        'fuertes_vinculo': [],
        'nuevas_megas': [],
        'primigenios_antiguos': []
    }

    files = [
        ('docs_originales/POKÉMON/NUEVOS POKEMON/Experimentos Rocket.txt', 'experimentos_rocket'),
        ('docs_originales/POKÉMON/NUEVOS POKEMON/Fuertes Vínculo.txt', 'fuertes_vinculo'),
        ('docs_originales/POKÉMON/NUEVOS POKEMON/Nuevas Megaevoluciones.txt', 'nuevas_megas'),
        ('docs_originales/POKÉMON/NUEVOS POKEMON/Primigenios y Antiguos.txt', 'primigenios_antiguos'),
    ]

    for fpath, key in files:
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

            custom[key].append({
                'name': header,
                'stats_breakdown': stats_lines,
                'type': pkmn_type or 'No modificado / Dato no confirmado',
                'ability': pkmn_ability or 'Dato no confirmado',
                'notes': ' '.join(notes) if notes else None,
                'category': key
            })

    return custom

# 6. PARSE EVOLUTIONS
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

# 7. PARSE MOVES
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
        
        official_data = {}
        hackrom_data = {}
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

# 8. PARSE ITEMS
def parse_items():
    path = 'docs_originales/OBJETOS/OBTENCIÓN OBJETOS.txt'
    content = read_file(path)
    items = []
    
    current_category = "General"
    lines = content.splitlines()
    for line_num, raw_line in enumerate(lines, 1):
        line = raw_line.strip()
        if not line or line.startswith('---'): continue
        
        # Check if line is a category header
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
        elif line.startswith('- '):
            # sub note or continuation
            if items:
                items[-1]['location_and_method'] += ' ' + line

    # Also parse CAMBIOS en OBJETOS.txt
    cambios_path = 'docs_originales/OBJETOS/CAMBIOS en OBJETOS.txt'
    if os.path.exists(cambios_path):
        c_content = read_file(cambios_path)
        c_lines = c_content.splitlines()
        current_cat = "Cambios en Objetos"
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

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    print("Parsing all data from original documents...")
    
    bosses = parse_boss_files()
    print(f"Parsed {len(bosses)} bosses.")

    sidequests = parse_sidequests()
    print(f"Parsed {len(sidequests)} side quests.")

    pkmn_acq = parse_pokemon_acquisition()
    print(f"Parsed {len(pkmn_acq)} Pokémon acquisition entries.")

    pkmn_changes = parse_pokemon_changes()
    print(f"Parsed {len(pkmn_changes)} Pokémon stat/ability change entries.")

    pkmn_custom = parse_custom_pokemon()
    total_custom = sum(len(v) for v in pkmn_custom.values())
    print(f"Parsed {total_custom} custom Pokémon dossiers.")

    evos = parse_evolutions()
    print(f"Parsed {len(evos)} modified evolution entries.")

    moves = parse_moves()
    print(f"Parsed {len(moves)} modified move entries.")

    items = parse_items()
    print(f"Parsed {len(items)} item acquisition entries.")

    # Save to src/data
    data_dir = 'src/data'
    os.makedirs(data_dir, exist_ok=True)

    with open(f'{data_dir}/bosses.json', 'w', encoding='utf-8') as f:
        json.dump(bosses, f, indent=2, ensure_ascii=False)

    with open(f'{data_dir}/sidequests.json', 'w', encoding='utf-8') as f:
        json.dump(sidequests, f, indent=2, ensure_ascii=False)

    with open(f'{data_dir}/pokemon_acquisition.json', 'w', encoding='utf-8') as f:
        json.dump(pkmn_acq, f, indent=2, ensure_ascii=False)

    with open(f'{data_dir}/pokemon_changes.json', 'w', encoding='utf-8') as f:
        json.dump(pkmn_changes, f, indent=2, ensure_ascii=False)

    with open(f'{data_dir}/pokemon_custom.json', 'w', encoding='utf-8') as f:
        json.dump(pkmn_custom, f, indent=2, ensure_ascii=False)

    with open(f'{data_dir}/evolutions.json', 'w', encoding='utf-8') as f:
        json.dump(evos, f, indent=2, ensure_ascii=False)

    with open(f'{data_dir}/moves.json', 'w', encoding='utf-8') as f:
        json.dump(moves, f, indent=2, ensure_ascii=False)

    with open(f'{data_dir}/items.json', 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    print("All JSON databases saved successfully in src/data/")

if __name__ == '__main__':
    main()
