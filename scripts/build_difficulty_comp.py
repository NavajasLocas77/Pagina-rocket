import json

difficulty_comparison = [
    {
        "element": "Equipos de los Jefes",
        "easy": "Mismos equipos y especies documentadas en los archivos del juego.",
        "hard": "Mismos equipos con distribución competitiva completa (IVs 31/31, EVs 252 y objetos de combate).",
        "docStatus": "Documentado en COMBATES DE JEFE (Base competitiva unificada)"
    },
    {
        "element": "Nivel y Curva de Experiencia",
        "easy": "Curva estándar con acceso a Caramelos XS a Hipercaramelo en Tiendas Rocket.",
        "hard": "Sin Huevo Suerte permitido (según FAQ oficial: 'Rompería toda la progresión de nivel, estando al 100 antes de Johto').",
        "docStatus": "Documentado en Preguntas Frecuentes.txt & QOLS.txt"
    },
    {
        "element": "Modificación de IVs y EVs",
        "easy": "Vitaminas utilizables hasta 250 EVs directos en Base Profunda.",
        "hard": "P2 Base Johto permite 31 IVs perfectos a cambio de 100,000 pokés tras la 5ta Medalla.",
        "docStatus": "Documentado en QOLS.txt"
    },
    {
        "element": "Entrenadores Especiales (Tutores)",
        "easy": "Combates para obtener objetos competitivos (Vidaesfera, Pañuelo Elegido, etc.).",
        "hard": "Requisito estricto: 8 medallas de Kanto obligatorias antes de que acepten combatir.",
        "docStatus": "Documentado en SECUNDARIAS TRE.pdf (Pág 3)"
    },
    {
        "element": "Eventos de Fuerte Vínculo",
        "easy": "Fuerte Vínculo accesible para el protagonista (Crobat-&).",
        "hard": "Rival Andra, Lance, Giovanni y líderes poseen sus propias formas vínculo de alta dificultad.",
        "docStatus": "Documentado en Fuertes Vínculo.txt & FAQ"
    },
    {
        "element": "Combate Final",
        "easy": "Simuladores VR de Nivel 7 a 10 en Laboratorio de Oak.",
        "hard": "Simulador Nivel Imposible + Combate Final Doble contra Investigador Oak y Jefe Giovanni (Nv. 120+).",
        "docStatus": "Documentado en T5 - HOENN.txt"
    }
]

with open('src/data/difficulty_comparison.json', 'w', encoding='utf-8') as f:
    json.dump(difficulty_comparison, f, indent=2, ensure_ascii=False)

print("Saved src/data/difficulty_comparison.json successfully!")
