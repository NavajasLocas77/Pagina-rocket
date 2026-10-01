import json
import os

walkthrough_data = [
    {
        "id": "act-1",
        "act_number": 1,
        "region": "Kanto",
        "title": "Acto I: El Ascenso en Kanto (Temporada 1)",
        "summary": "Comienzas como un recluta novato del Team Rocket en Isla Inta. A través de robos, misiones encomendadas por Giovanni y enfrentamientos contra entrenadores legendarios, te abrirás camino por Kanto hasta alcanzar el rango de Ejecutivo y desafiar la Liga Pokémon.",
        "level_range": "Nv. 7 - Nv. 65",
        "steps": [
            {
                "step": 1,
                "title": "Bautismo de Fuego en Isla Inta",
                "location": "Isla Inta / Cueva Perdida",
                "boss_ids": ["boss-1", "boss-2"],
                "description": "Comienzas la aventura en la base de operaciones de Isla Inta. Te enfrentas por primera vez a tu Rival Andra (Nv. 7). Acto seguido, la primera misión oficial consiste en asaltar a la Cónsul (Nv. 11). Al derrotarla, se le cae el Repartir Experiencia mientras es trasladada a Cueva Perdida.",
                "rewards": "Repartir Experiencia",
                "key_unlocks": "Desbloqueo de viaje a Kanto continental"
            },
            {
                "step": 2,
                "title": "Operaciones Subterráneas y el Asalto al Mt. Moon",
                "location": "Vía Subterránea / Mt. Moon",
                "boss_ids": ["boss-3", "boss-4", "boss-5"],
                "description": "En la Vía Subterránea hacia Ciudad Carmín vuelves a cruzar camino con Andra (Nv. 13-15). En Mt. Moon se ejecuta la misión de extracción de fósiles: enfréntate a los científicos y al Alto Rango Frank (Nv. 18-20). Aquí puedes conseguir la MT46 Ladrón, clave para farmear dinero.",
                "rewards": "MT46 Ladrón, Fósiles",
                "key_unlocks": "Paso libre a Ciudad Celeste"
            },
            {
                "step": 3,
                "title": "La Patente del Teletransporte y el S.S. Anne",
                "location": "Jardín de Bill / Ciudad Carmín (S.S. Anne)",
                "boss_ids": ["boss-6", "boss-7", "boss-8", "boss-9"],
                "description": "Asalto a la cabaña de Bill para robar la tecnología de transferencia de PC. Derrotas a Bill (Nv. 22-24) y a Azul (Nv. 23-25). Posteriormente, abordas el S.S. Anne en Carmín para arrebatar el frasco secreto del Capitán, derrotando a Trevor y a Andra (Nv. 24-26).",
                "rewards": "Patente de Teletransporte, Frasco Secreto",
                "key_unlocks": "Acceso a Ciudad Azafrán y Carmín"
            },
            {
                "step": 4,
                "title": "Infiltración en Lavanda y Silph S.A.",
                "location": "Ruta 10 / Torre Pokémon / Silph S.A.",
                "boss_ids": ["boss-10", "boss-11", "boss-12", "boss-13", "boss-14"],
                "description": "Enfrentamiento contra Azul en Ruta 10 (Nv. 28-30). En la Torre Pokémon de Pueblo Lavanda investigas fenómenos paranormales junto al Científico Miguel. A continuación, el Team Rocket ejecuta el gran asalto a Silph S.A. en Ciudad Azafrán, culminando con la derrota del Científico Miguel y Andra (Nv. 35-37).",
                "rewards": "Master Ball (Silph S.A.), Ascenso dentro de la organización",
                "key_unlocks": "Apertura de la Base Rocket Profunda"
            },
            {
                "step": 5,
                "title": "La Caza de Medallas y las Aves Legendarias",
                "location": "Gimnasios de Kanto / Central de Energía / Islas Espuma",
                "boss_ids": ["boss-15", "boss-16", "boss-17", "boss-18", "boss-19", "boss-20", "boss-21", "boss-22", "boss-23", "boss-24", "boss-25"],
                "description": "Para afianzar el poder de la organización, derrotas a los Líderes de Gimnasio oficiales (Erika, Sabrina, Koga, Brock, Misty, Lt. Surge y Blaine). En paralelo, realizas misiones de captura y control de las aves legendarias: Zapdos en Central Energía, Articuno en Islas Espuma y Moltres en Calle Victoria. En el Gimnasio de Ciudad Verde combates contra el mismísimo Administrador Jefe Atlas (Nv. 54-56).",
                "rewards": "8 Medallas de Kanto, acceso a Sala de Ejecutivos y Movimientos Huevo en Base Profunda",
                "key_unlocks": "Paso a la Calle Victoria de Kanto"
            },
            {
                "step": 6,
                "title": "Calle Victoria y el Clímax de la Liga Pokémon",
                "location": "Calle Victoria / Meseta Añil",
                "boss_ids": ["boss-26", "boss-27", "boss-28", "boss-29", "boss-30", "boss-31", "boss-32", "boss-33"],
                "description": "En Calle Victoria despachas a Azul (Nv. 56-58) y a tu Rival Andra (Nv. 58-60). En la Meseta Añil combates consecutivamente contra el Alto Mando: Lorelei (Nv. 61-63), Bruno (Nv. 62-64), Agatha (Nv. 63-65) y Lance (Nv. 64-66). Tras derrotar al Campeón Rojo (Nv. 66-68), Lance desata su verdadero poder como Emperador Lance (Nv. 67-70). Al vencerlo, te coronas como el mandamás indiscutible de Kanto.",
                "rewards": "Título de Campeón, Hall de la Fama, Desbloqueo de Bomushikaa (Secundaria Atlas)",
                "key_unlocks": "Desbloqueo de Temporada 2: Archi7 (Islas Sete)"
            }
        ]
    },
    {
        "id": "act-2",
        "act_number": 2,
        "region": "Archi7 / Sevii",
        "title": "Acto II: La Expansión en Archi7 (Temporada 2)",
        "summary": "El Team Rocket extiende sus garras al archipiélago de Islas Sete. Organizaciones rivales (Equipo Magma y Equipo Aqua), cultos ancestrales y secretos de Giovanni salen a la luz.",
        "level_range": "Nv. 65 - Nv. 75",
        "steps": [
            {
                "step": 1,
                "title": "Retorno a Sevii y la Reunión en Isla Sétima",
                "location": "Isla Inta / Isla Sétima / Cueva Cambiante Isla Exta",
                "boss_ids": ["boss-45", "boss-46", "boss-47"],
                "description": "Vuelves a Isla Inta para sofocar a Azul (Nv. 67). En Isla Sétima te mides con Andra (Nv. 69). En la Cueva Cambiante de Isla Exta aparece el misterioso Viajero Zeus (Nv. 70), advirtiendo sobre anomalías temporales y energéticas en el archipiélago.",
                "rewards": "Información estratégica de Sevii",
                "key_unlocks": "Desbloqueo de eventos de Mt. Ascuas y Cueva Punteada"
            },
            {
                "step": 2,
                "title": "Guerra Territorial: Magma vs Aqua en Sevii",
                "location": "Mt. Ascuas (Isla Prima) / Cueva Punteada (Isla Exta)",
                "boss_ids": ["boss-48", "boss-49", "boss-50", "boss-51"],
                "description": "El Equipo Magma intenta tomar el volcán de Mt. Ascuas: liquidas a Tatiano (Nv. 71) y al Líder Magno (Nv. 72-73). En la Cueva Punteada / Valle Ruinas el Equipo Aqua busca despertar reliquias submarinas: aplastas al Almirante Tolo (Nv. 71) y al Líder Aquiles (Nv. 72-73).",
                "rewards": "Control total de los recursos geotérmicos de Sevii",
                "key_unlocks": "Acceso a los pisos subterráneos secretos de Silph S.A."
            },
            {
                "step": 3,
                "title": "Secretos Ocultos de Silph S.A. y el Culto de Lavanda",
                "location": "Silph S.A. Subterráneos / Culto Pueblo Lavanda / Roca Ombligo",
                "boss_ids": ["boss-52", "boss-53", "boss-54", "boss-55", "boss-56", "boss-57", "boss-58"],
                "description": "En los pisos subterráneos de Silph S.A. desmantelas a la resistencia: Presidente Silph, Científico Miguel y Bill. En el Culto de Pueblo Lavanda enfrentas a Ghost, al Cultista 'M' y al Líder Secta Laireb (Nv. 74). En Roca Ombligo doblegas al Legendario Lugia (Nv. 75).",
                "rewards": "Lugia, Acceso a laboratorios secretos de clonación",
                "key_unlocks": "Despacho de Giovanni en Base Profunda"
            },
            {
                "step": 4,
                "title": "El Desafío de Giovanni y la Cara Oculta de Mansión Canela",
                "location": "Base Rocket Profunda / Mansión Canela Cara Oculta",
                "boss_ids": ["boss-59", "boss-60", "boss-61", "boss-62"],
                "description": "Giovanni te pone a prueba personalmente en su despacho de la Base Profunda (Nv. 75). Posteriormente, investigas la cara oculta de la Mansión Canela donde enfrentas a la Entrenadora Dalia, al Líder Blaine con sus experimentos de fuego y al Investigador Pokémon Oak.",
                "rewards": "Reconocimiento como Comandante de Élite Rocket",
                "key_unlocks": "Desbloqueo de la región de Johto (Temporada 3)"
            }
        ]
    },
    {
        "id": "act-3",
        "act_number": 3,
        "region": "Johto",
        "title": "Acto III: La Conquista de Johto (Temporada 3)",
        "summary": "Incursión masiva en la región de Johto. Derrota a los líderes de gimnasio tradicionales, doblega al Alto Mando, desafía a Rojo en Mt. Plateado y despierta a los dioses primigenios en las Cámaras Selladas de Ruinas Alfa.",
        "level_range": "Nv. 75 - Nv. 95",
        "steps": [
            {
                "step": 1,
                "title": "Malva, Unión y el Pozo Slowpoke",
                "location": "Ciudad Malva / Cueva Unión / Pozo Slowpoke / Azalea",
                "boss_ids": ["boss-63", "boss-64", "boss-65", "boss-66", "boss-67"],
                "description": "Comienzas en Malva derrotando al Maestro Torre Bellsprout y al Líder Pegaso (Nv. 76). En Cueva Unión neutralizas al Profesor Elm (Nv. 77). En Pozo Slowpoke despachas al Pokemaníaco Louis y en Azalea derribas al Líder César (Nv. 78).",
                "rewards": "Medallas Céfiro y Colmena",
                "key_unlocks": "Paso hacia Ciudad Trigal"
            },
            {
                "step": 2,
                "title": "Trigal, las Chicas Kimono y la Torre Quemada",
                "location": "Ciudad Trigal / Ciudad Iris",
                "boss_ids": ["boss-68", "boss-69", "boss-70", "boss-71", "boss-72", "boss-73", "boss-74"],
                "description": "En Trigal derrotas a Valeria (Nv. 80). En Iris superas a las 5 Chicas Kimono consecutivamente (Nv. 80-81). En lo profundo de la Torre Quemada combates nuevamente contra el Viajero Zeus (Nv. 82).",
                "rewards": "Medalla Planicie",
                "key_unlocks": "Rutas costeras hacia Olivo y Orquídea"
            },
            {
                "step": 3,
                "title": "El Faro de Olivo, Gimnasios de Acero y Lucha, y la Torre Radio",
                "location": "Ciudad Olivo / Ciudad Orquídea / Torre Radio Trigal",
                "boss_ids": ["boss-75", "boss-76", "boss-77", "boss-78", "boss-79"],
                "description": "En el Faro de Olivo derrotas al Farero Kepler, al Líder Crom (Nv. 83) y al Capitán del Barco. Cruzas el mar hacia Orquídea y vences al Líder Aníbal (Nv. 84). Regresas a Trigal para la gran toma de la Torre Radio, donde mides fuerzas contra el Ejecutivo Protón (Nv. 85). Con 5 medallas consigues acceso al P2 de la Base Johto (IVs perfectos, Megapiedras y bayas).",
                "rewards": "Acceso a P2 Base Johto (IVs 31 a cambio de 100k)",
                "key_unlocks": "Desbloqueo de Monte Plateado y Torre Campana"
            },
            {
                "step": 4,
                "title": "Monte Plateado y la Cumbre de la Torre Campana",
                "location": "Ruta 28 / Monte Plateado / Torre Campana Iris",
                "boss_ids": ["boss-80", "boss-81", "boss-82", "boss-83", "boss-84"],
                "description": "En Monte Plateado vences a Andra (Nv. 86) y en la cumbre profunda derrotas al legendario Entrenador Rojo (Nv. 88). En la Torre Campana de Iris superas a la Ex Alto Mando Agatha (Nv. 87), al Líder Jaden (Nv. 88) y a Zeus (Nv. 89).",
                "rewards": "Reconocimiento supremo",
                "key_unlocks": "Ruta 44 y Caoba"
            },
            {
                "step": 5,
                "title": "Caoba, Mirto, Endrino y el Clímax de Ruinas Alfa",
                "location": "Pueblo Caoba / Ruta 44 / Ciudad Endrino / Ruinas Alfa",
                "boss_ids": ["boss-85", "boss-86", "boss-87", "boss-88", "boss-89", "boss-90", "boss-91", "boss-92", "boss-93", "boss-94", "boss-95", "boss-96", "boss-97", "boss-98", "boss-99"],
                "description": "Derrotas al Líder Fredo (Nv. 90), al Campeón Mirto en Ruta 44 (Nv. 91), a Laireb en Lavanda (Nv. 92) y al Maestro Dragón en la Guarida Dragón de Endrino (Nv. 92). Finalmente, desciendes a las Cámaras Selladas de Ruinas Alfa: superas a los 5 Guardianes, al Unown Áureo (Nv. 94), Ho-Oh Primigenio (Nv. 95), Lugia Primigenio (Nv. 95), Zeus (Nv. 95), Rey Unown (Nv. 95) y al mismísimo Dios Laireb (Nv. 96).",
                "rewards": "Desbloqueo de formas primigenias y conclusión de Johto",
                "key_unlocks": "Acceso al DLC de Johto (Temporada 4)"
            }
        ]
    },
    {
        "id": "act-4",
        "act_number": 4,
        "region": "DLC (Johto DLC)",
        "title": "Acto IV: Las Conspiraciones del DLC (Temporada 4)",
        "summary": "Tras los eventos de Johto, la Corporación Devon y células rebeldes inician experimentos prohibidos con ADN primigenio y clones de Mewtwo. Giovanni te encomienda 9 misiones de alto secreto.",
        "level_range": "Nv. 95 - Nv. 105",
        "steps": [
            {
                "step": 1,
                "title": "Las Tres Misiones Iniciales de Giovanni",
                "location": "Lago Furia / Vías de Tren / Ruta 47 & Torre Dun",
                "boss_ids": ["boss-100", "boss-101", "boss-102", "boss-103", "boss-104", "boss-105", "boss-106", "boss-107", "boss-108", "boss-109", "boss-110", "boss-111"],
                "description": "Completar al 100% las 3 misiones obligatorias: 1) Lago Furia: Derrotar al Admin Devon Amatista (Nv. 96) y capturar/derrotar a Akueria (Nv. 97). 2) Vías de Tren: Derrotar a Pegaso (Nv. 96) y al Ave Sagrada Zapdos-P (Nv. 97). 3) Ruta 47 y Torre Dun: Derrotar a Eusine (Nv. 96), al Dragón Sagrado (Nv. 97), a Andra (Nv. 98) y escalar la Torre Dun batiendo a sus 4 Altos Mandos y al Gran Maestro (Nv. 98). Luego presenciar la escena con Tristana en Orquídea.",
                "rewards": "Kurusu (regalo pescador), Acceso a misiones avanzadas de Giovanni",
                "key_unlocks": "Llamada de Giovanni a su despacho"
            },
            {
                "step": 2,
                "title": "Base Hoenn y los Prototipos del Volcán de Canela",
                "location": "Base Hoenn / Volcán Isla Canela",
                "boss_ids": ["boss-112", "boss-113", "boss-114", "boss-115", "boss-116", "boss-117", "boss-118", "boss-119"],
                "description": "Misión 4 en Base Hoenn contra Admin Rubí (Nv. 98). Misión 5 en las instalaciones secretas del Volcán Canela: penetrar las 5 cabinas de seguridad, eliminar al Primer Prototipo de Nivel II (Nv. 99) y a los Proyectos Prohibidos de Mewtwo (Nv. 100).",
                "rewards": "Datos genéticos de prototipos Rocket",
                "key_unlocks": "Neo Central de Energía y Subterráneos de Kanto"
            },
            {
                "step": 3,
                "title": "Rebelión en la Red Subterránea de Kanto",
                "location": "Neo Central Energía / Subterráneos Kanto",
                "boss_ids": ["boss-120", "boss-121", "boss-122", "boss-123", "boss-124", "boss-125", "boss-126", "boss-127", "boss-128", "boss-129"],
                "description": "Misión 6: En la Neo Central derrotas a Atlas (Nv. 100) y sometes a Zapdos Primigenio (Nv. 101). Misión 7: En los subterráneos te emboscan Lt. Surge con sus trampas explosivas (Nv. 100), bandas de motoristas armados, Líder Koga (Nv. 101) y el traidor Administrador Petrel (Nv. 101).",
                "rewards": "Restablecimiento del orden en Kanto",
                "key_unlocks": "Misiones finales en Pueblo Lavanda"
            },
            {
                "step": 4,
                "title": "El Asedio a la Torre Radio Lavanda",
                "location": "Cementerio Lavanda / Torre Radio Lavanda (9 pisos)",
                "boss_ids": ["boss-130", "boss-131", "boss-132", "boss-133", "boss-134", "boss-135", "boss-136"],
                "description": "Misión 8: En el cementerio derrotas a Eusine, Azul (Nv. 102) y al temible Ghost Primigenio (Nv. 103). Misión 9: Asaltas los 9 pisos de la Torre Radio Lavanda. Despachas a Bill, al Científico Miguel, a Mewtwo Armadura (Nv. 104) y al mismísimo Giovanni en combate decisivo (Nv. 105).",
                "rewards": "Apertura de tiendas definitivas en Piso 9: Piedras Rocket (2.5M) y Master Balls (300k); venta de mentas de naturalezas (20k)",
                "key_unlocks": "Desbloqueo de Hoenn (Temporada 5)"
            }
        ]
    },
    {
        "id": "act-5",
        "act_number": 5,
        "region": "Hoenn",
        "title": "Acto V: El Frente de Hoenn y la Batalla Final (Temporada 5)",
        "summary": "La cúspide del juego. Operaciones en Monte Cenizo, Malvalona, Puntaneva y la Cámara Sellada contra toda la cúpula de Devon Corporation y los Ases del Frente de Batalla, culminando en los Simuladores VR del Laboratorio de Oak y el Combate Final Definitivo.",
        "level_range": "Nv. 105 - Nv. 120+",
        "steps": [
            {
                "step": 1,
                "title": "Despertar en Monte Cenizo y la Caída de Malvalona",
                "location": "Monte Cenizo / Ciudad Malvalona / Nao Abandonada",
                "boss_ids": ["boss-137", "boss-138", "boss-139", "boss-140", "boss-141", "boss-142"],
                "description": "Misión 1: Vences a Groudon Primigenio (Nv. 120) y a Candela (Nv. 105). Misión 2: En Malvalona derrotas al Dr. Rasmus, Líder Erico (Nv. 106) y Ariana en su casino (Nv. 107). Misión 3: En la Nao Abandonada desmantelas a Admin Devon Zafiro (Nv. 108).",
                "rewards": "Supercaramelos (85-95) a la venta en Base Hoenn",
                "key_unlocks": "Acceso a Azuliza y Puntaneva"
            },
            {
                "step": 2,
                "title": "Operaciones en Azuliza, Puntaneva, Arborada y Algaria",
                "location": "Pueblo Azuliza / Puntaneva / Arborada / Algaria / Fosa Abisal",
                "boss_ids": ["boss-143", "boss-144", "boss-145", "boss-146", "boss-147", "boss-148", "boss-149", "boss-150"],
                "description": "Derrotas a Marcial y Admin Esmeralda en Azuliza; en Puntaneva a Dracón, Admin Amatista e Inverna; en Arborada a Alana; en Algaria a Vito y Leti en combate doble; y en la Fosa Abisal sometes a Kyogre Primigenio (Nv. 120).",
                "rewards": "Control total de los titanes elementales",
                "key_unlocks": "Desbloqueo de la Cámara Sellada de Hoenn"
            },
            {
                "step": 3,
                "title": "La Batalla de la Cámara Sellada",
                "location": "Cámara Sellada (Hoenn)",
                "boss_ids": ["boss-151", "boss-152", "boss-153", "boss-154", "boss-155", "boss-156"],
                "description": "Enfrentamiento en la Cámara Sellada contra la alianza completa: Admin Devon Rubí, As del Frente Valente, combates dobles extremos contra Zafiro y Esmeralda, Miguel y Rasmus, Admin Amatista, y finalmente la Cronista Tristana (Nv. 112).",
                "rewards": "Desbloqueo de tecnología de simulación VR en Pallet",
                "key_unlocks": "Laboratorio de Oak (Simuladores y Combate Final)"
            },
            {
                "step": 4,
                "title": "Laboratorio de Oak: Simuladores VR y el Combate Final",
                "location": "Pueblo Pallet (Laboratorio Secreto de Oak)",
                "boss_ids": ["boss-157", "boss-158", "boss-159", "boss-160", "boss-161", "boss-162", "boss-163", "boss-164"],
                "description": "La prueba de maestría definitiva. Superas los Simuladores VR de Niveles 7, 8, 9 y 10; el combate doble contra Eusine y Bill; el temido Simulador Nivel Imposible en combate doble; y como broche de oro supremo de todo el juego: COMBATE FINAL VS INVESTIGADOR OAK Y JEFE ROCKET GIOVANNI (Combate Doble Nv. 120+ con Arceus Primigenio, Ultimate Project y legendarios vínculo).",
                "rewards": "100% de la historia completada, reconocimiento como la mayor leyenda del Team Rocket",
                "key_unlocks": "Acceso a todo el postgame y desafíos de revancha"
            }
        ]
    }
]

with open('src/data/walkthrough.json', 'w', encoding='utf-8') as f:
    json.dump(walkthrough_data, f, indent=2, ensure_ascii=False)

print("Saved src/data/walkthrough.json successfully!")
