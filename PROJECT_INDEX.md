# AuriGo - Índice Maestro del Proyecto (PROJECT_INDEX.md)

> **Propósito:** Fuente central de verdad técnica para desarrolladores e Inteligencia Artificial. Permite ubicar componentes, contratos, servicios, DTOs y tipos sin necesidad de escanear la totalidad del repositorio, reduciendo drásticamente el consumo de tokens y evitando exploraciones innecesarias.

---

## 1. Árbol de Estructura de Módulos Core (Backend)

| Directorio / Archivo | Responsabilidad Única | Dependencias Clave |
| :--- | :--- | :--- |
| `backend/src/db/database.ts` | Inicialización de SQLite (WAL mode), esquemas (`users`, `frequent_places`, `trips`, `gemini_keys`) y transacciones. | `better-sqlite3`, `path` |
| `backend/src/services/gemini/` | Gestor de múltiples API Keys (`gemini-key-manager.ts`), rotación Round-Robin, cooldown de 60s, y orquestador del Valet AI (`gemini-valet.service.ts`) con 3 niveles de ahorro de tokens. | `@google/genai` |
| `backend/src/services/geo/` | Interfaz unificada `geo.interface.ts`, proveedor OpenStreetMap (`osm.provider.ts`) y Google Maps (`google.provider.ts`) con conmutación dinámica en `geo.service.ts`. | `axios` |
| `backend/src/services/pricing/` | Cálculo de cotizaciones multidivisa (COP / USD / VES) y catálogo de vehículos (`AuriMoto`, `AuriClasico`, `AuriClima`, `AuriClavellina`). | Ninguna |
| `backend/src/services/payments/` | Definición de pasarelas locales e internacionales (`payment-methods.ts`). | Ninguna |
| `backend/src/server.ts` | Entrada del servidor Express, middlewares, endpoints REST y enlace de servicios. | `express`, `cors`, `dotenv` |

---

## 2. Árbol de Componentes de Frontend Web App

| Archivo | Responsabilidad Única | Dependencias Clave |
| :--- | :--- | :--- |
| `frontend/src/App.tsx` | Contenedor principal del Wizard-Chat interactivo, selector de vehículos, métodos de pago, moneda (COP/USD/VES) y reconocimiento de voz (Web Speech API). | `lucide-react`, `leaflet` |
| `frontend/src/components/AuriGoLogo.tsx` | Imagotipo oficial AuriGo ("El Pin Andino en Marcha", ángulo 15° y CamelCase AuriGo). | Ninguna |
| `frontend/src/index.css` | Design System y tokens oficiales (Regla 60-30-10, fuentes Plus Jakarta Sans, Inter y números tabulares). | CSS nativo |
| `frontend/src/main.tsx` | Punto de entrada React 18/19 con StrictMode. | `react`, `react-dom` |

---

## 3. Diccionario de Contratos, DTOs e Interfaces Globales

| Nombre de Interfaz / DTO | Ubicación Exacta | Propósito / Uso |
| :--- | :--- | :--- |
| `IGeoProvider` | `backend/src/services/geo/geo.interface.ts` | Contrato para búsqueda de direcciones, reverse geocode y matriz de ruta. |
| `LocationCoord` | `backend/src/services/geo/geo.interface.ts` | DTO con lat, lng, address y displayName. |
| `RouteResult` | `backend/src/services/geo/geo.interface.ts` | DTO con distancia en km, duración en minutos y proveedor usado ('osm' \| 'google'). |
| `ValetAIContext` | `backend/src/services/gemini/gemini-valet.service.ts` | Contexto de usuario, ubicación GPS, favoritos y borrador del traslado. |
| `ValetAIResponse` | `backend/src/services/gemini/gemini-valet.service.ts` | Respuesta estructurada del Valet AI (texto, destino, origen, vehículo, acción requerida). |
| `VehicleRate` | `backend/src/services/pricing/pricing.service.ts` | Tarifas base, por km, por minuto y capacidades del catálogo de vehículos. |
| `PaymentMethodConfig` | `backend/src/services/payments/payment-methods.ts` | Configuración de pasarelas de pago y divisas admitidas. |

---

## 4. Mapa de Constantes y Umbrales Globales

| Archivo | Constantes Exportadas | Descripción de Uso |
| :--- | :--- | :--- |
| `backend/src/services/pricing/pricing.service.ts` | `exchangeRateUsdCop = 4150.0`, `exchangeRateUsdVes = 45.0` | Tasas oficiales de conversión comercial en frontera/Táchira. |
| `backend/src/services/gemini/gemini-key-manager.ts` | `cooldownMs = 60000` | Tiempo de enfriamiento para claves con Rate Limit (429 / Cuota). |
| `backend/src/services/gemini/gemini-valet.service.ts` | `maxOutputTokens = 250`, `temperature = 0.1` | Umbrales de bajo consumo de tokens para respuestas ágiles de IA. |
| `docs/SISTEMA_DE_DISENO_AURIGO.md` | Tokens de color 60-30-10 | `#FFFFFF` (60%), `#0F172A` (30%), `#FFB800` (10% conversión). |

---

## 5. Matriz de Adaptadores y Terceros

* **AI Provider:** Google Gemini API (`@google/genai`) con soporte para múltiples llaves y rotación Round-Robin.
* **Database Client:** SQLite en modo WAL (`better-sqlite3`) en `aurigo.sqlite`.
* **Geo Providers:** OpenStreetMap (OSRM + Nominatim) por defecto; Google Maps API como proveedor conmutable.
