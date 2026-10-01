# 🚀 Pokémon Edición Team Rocket — Guía Definitiva & Wiki Web

Una aplicación web completa, interactiva y profesional diseñada como la **guía definitiva y base de datos** para **Pokémon Edición Team Rocket**. 

Toda la información contenida en esta aplicación está basada rigurosamente en la documentación y archivos oficiales del juego provistos por el creador.

---

## ✨ Características Principales

* **🎯 Guía 100% (Modo Fácil & Modo Difícil)**:
  * Sistema de checklist interactivo para completar el juego al 100%.
  * Seguimiento de progreso independiente para ambos modos guardado en `localStorage`.
  * Botón inteligente **«▶ Siguiente Objetivo»** que localiza y enfoca el próximo hito pendiente.
  * Sección exclusiva de **⚠️ Elementos Perdibles (Missables)**: Repartir Exp, Meteorito en Phanpy, Magikarp de 500 pokés, orden de islas Sevii, decisión de los 2M de pokés, etc.
  * Tabla comparativa detallada de **⚔️ Diferencias de Dificultad Documentadas**.
* **🏠 Dashboard / Centro de Mando**: Resumen de progreso, accesos rápidos y estadísticas globales.
* **📖 Walkthrough Paso a Paso**: Los 5 Actos completos (Kanto, Archipiélago Sete, Johto, Expansión DLC y Hoenn / Postgame).
* **⚔️ Jefes y Entrenadores Clave**: Más de 200 combates detallados con equipos completos, niveles, ataques, objetos, IVs y EVs.
* **📜 Misiones Secundarias**: 33 misiones documentadas con requisitos, pasos, ubicaciones y recompensas.
* **📕 Pokédex Completa**: 978 Pokémon con tipos, estadísticas base, cambios de estadísticas documentados, habilidades y métodos de obtención.
* **🎁 Pokémon Regalados y Especiales**: 79 formas especiales y lista completa de Pokémon entregados por NPCs.
* **🎒 Objetos y MTs/MOs**: Base de datos de más de 400 objetos clasificados (Clave, Batalla, Bayas, MT/MO) con ubicaciones exactas.
* **⚡ Cambios en Movimientos**: Tabla comparativa de potencia, precisión y tipos modificados respecto a la franquicia base.
* **💡 QoL & Preguntas Frecuentes**: Respuestas oficiales sobre mecánicas, Huevo Suerte, Caramelos Raros y calidad de vida.
* **🔍 Buscador Global**: Acceso instantáneo a cualquier jefe, Pokémon, misión u objeto desde la barra superior.
* **🛡️ Modo Spoiler**: Control de visibilidad para no arruinar sorpresas de la trama o postgame.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Iconografía**: [Lucide React](https://lucide.dev/)
* **Procesamiento de Datos**: Scripts en Python para extracción y normalización de textos técnicos y PDFs.

---

## 🚀 Instalación y Uso Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/TU_USUARIO/pokemon-edicion-team-rocket-guia.git
   cd pokemon-edicion-team-rocket-guia
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Compilar para producción**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 📂 Estructura del Proyecto

```text
├── docs_originales/        # Documentación y archivos de texto fuente
├── scripts/                # Scripts de parsing y extracción de datos
├── src/
│   ├── assets/             # Recursos visuales
│   ├── components/         # Header, Sidebar, GlobalSearch, Modales
│   ├── data/               # Archivos JSON estructurados (jefes, pokédex, etc.)
│   ├── views/              # Vistas principales (Home, Walkthrough, Guide100, Bosses...)
│   ├── App.jsx             # Componente raíz y enrutador de vistas
│   └── main.jsx            # Punto de entrada
├── package.json
└── vite.config.js
```

---

## 📜 Créditos

Basado en el ROM hack **Pokémon Edición Team Rocket** desarrollado por su creador y comunidad. Toda la información ha sido recopilada con fines de consulta y documentación.
