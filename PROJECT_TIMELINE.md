# AuriGo - Línea de Tiempo y Roadmap Dinámico (PROJECT_TIMELINE.md)

> **Propósito:** Mantener la visión global e histórica del proyecto AuriGo. Responde en todo momento a las preguntas: **¿De dónde venimos?**, **¿Qué estamos haciendo?** y **¿A dónde vamos?**.

---

## ⏪ 1. De Dónde Venimos (Historial de Hitos Completados)

* **[2026-10-27] v0.1.0 - Lanzamiento de Arquitectura Base e Identidad Oficial:**
  * Creación y sincronización del repositorio oficial en GitHub (`https://github.com/xenonestudio/AuriGo`).
  * Backend Node.js con TypeScript y configuración ESM estricta.
  * Valet AI conversacional con `@google/genai` y conmutación de claves `GeminiKeyManager`.
  * Motor híbrido de geocodificación con OpenStreetMap (Nominatim/OSRM) y Google Maps API.
  * Motor de cotización multidivisa (COP / USD / VES) y catálogo de vehículos (`AuriMoto`, `AuriClasico`, `AuriClima`, `AuriClavellina`).
  * Implementación del Design System oficial AuriGo basado en el Manual de Identidad Corporativa (Táchira) y Soft Glassmorphism (Regla 60-30-10, Plus Jakarta Sans, Inter, Isotipo "El Pin Andino en Marcha").
  * Web App (React + Vite + TypeScript) con interfaz de Chat-Wizard, selector dinámico de vehículos y reconocimiento de voz (Web Speech API).

* **[2026-10-27] v0.2.0 - Persistencia SQLite & Gobernanza Técnica:**
  * Implementación de base de datos local SQLite con `better-sqlite3` en modo WAL para alto rendimiento.
  * Esquemas relacionales creados: `users`, `frequent_places`, `trips` y `gemini_keys`.
  * Integración de las reglas maestras de gobernanza técnica:
    - `PROJECT_INDEX.md` (Índice central para ahorro de tokens y navegación sin escaneo total).
    - `PROJECT_TIMELINE.md` (Bitácora dinámica de sprints y trazabilidad histórica).

---

* **[2026-10-27] v0.3.0 - Landing pública + SEO:**
  * Landing `/` (`frontend/src/pages/Landing.tsx` + `landing.css`) inspirada en la referencia Soft Clean UI, adaptada a AuriGo (gradiente aurora amarillo/ámbar/azul Táchira, CTA Amarillo Aurinegro, botones Obsidiana).
  * Web App de traslados movida a `/app` con carga diferida (code-splitting).
  * SEO: metas title/description, canonical, Open Graph/Twitter, geo local (VE-S), JSON-LD (Organization, TaxiService, MobileApplication), `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, HTML semántico con jerarquía H1-H3.
  * Rediseño v0.3.1: landing minimalista y editorial (sin emojis ni datos inventados, íconos de línea, divisores finos, amarillo solo como acento de acción). Sección de categorías de vehículos eliminada. Efectos: titular palabra a palabra, chat animado, revelado en scroll escalonado, resplandor que sigue al cursor, hover con desplazamiento; respeta `prefers-reduced-motion`.

## ⚡ 2. Qué Estamos Haciendo (Estado Actual & Sprint Activo)

* **Sprint Activo:** `Sprint 02 - Refinamiento de la Experiencia Conversacional y Trazado de Rutas en Vivo`
* **Objetivo:** Perfeccionar la interacción del usuario con el Valet AI, la visualización en mapa interactivo de OpenStreetMap y el registro completo del flujo de viaje.
* **Estado de Tareas:**
  * [x] Integración de base de datos SQLite persistente (`aurigo.sqlite`).
  * [x] Creación y adopción estricta de `PROJECT_INDEX.md` y `PROJECT_TIMELINE.md`.
  * [x] Gobernanza de ahorro extremo de tokens (Heurística local + Caché + Minificación de prompts).
  * [ ] Conexión del trazado de ruta interactivo con Leaflet en la Web App durante el Wizard.
  * [ ] Panel de métricas del estado y balance de API Keys de Gemini.

---

## 🚀 3. A Dónde Vamos (Roadmap Futuro)

### Hito 1: Aplicación Móvil Android (Primer Objetivo de Despliegue Nativo)
* Desarrollo del cliente móvil Android para conductores y pasajeros.
* Geolocalización en segundo plano con GPS y brújula de orientación.
* Notificaciones Push para avisar al pasajero cuando el conductor está afuera (*"🟡⚫ ¡Tu AuriGo ya está afuera!"*).

### Hito 2: Despacho de Conductores y Modo Conductor
* Aplicación o vista para conductores afiliados ("Socios Conductores AuriGo").
* Aceptación de viajes en tiempo real, navegación hacia el punto de recogida y confirmación de cobro en efectivo/Pago Móvil.

### Hito 3: Automatización de Pagos y Multidivisa Avanzada
* Conciliación automática de transferencias y Pago Móvil mediante API bancaria o webhooks.
* Integración directa con Binance Pay Merchant API para cobros cripto instantáneos.
