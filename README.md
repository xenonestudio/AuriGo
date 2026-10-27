# AuriGo 🚀
> **Plataforma de Traslados Inteligente con Valet AI Conversacional**

AuriGo redefine la experiencia de solicitar un viaje de traslado urbano e interurbano (estilo Uber), ofreciendo una interfaz sumamente amigable e intuitiva basada en un **Chat-Wizard interactivo** asistido por inteligencia artificial con la API de **Google Gemini (Google AI Studio)**.

El usuario puede simplemente escribir o hablar por micrófono ("Valet, llévame al Sambil Chacao"), confirmar visualmente el destino, elegir el tipo de vehículo (Moto, Carro o Camioneta), usar su geolocalización GPS en un toque y abonar mediante múltiples pasarelas locales e internacionales (Pago Móvil, Transferencia bancaria en Venezuela, Binance Pay, PayPal y Efectivo al conductor en USD, Bs. o Pesos).

---

## 🌟 Características Principales

1. **Valet AI Conversacional Multimodal:**
   - Asistente inteligente alimentado por Google Gemini.
   - Soporte para entrada de texto y reconocimiento de voz (micrófono).
   - Extracción semántica automática de destinos, vehículos y puntos de encuentro.
2. **Sistema de Rotación Inteligente de API Keys (Google AI Studio):**
   - Pool configurable de múltiples llaves API de Gemini (`GEMINI_API_KEYS`).
   - Algoritmo Round-Robin con enfriamiento automático (*cooldown*) ante límites de cuota (Rate Limits / 429).
   - Capacidad de agregar nuevas claves en caliente mediante endpoint `/api/ai/add-key`.
3. **Motor Híbrido de Geocodificación y Rutas:**
   - Implementación por defecto sin costo con **OpenStreetMap** (Nominatim + OSRM).
   - Conmutación en caliente con **Google Maps Platform** (`geoService.setProvider('google' | 'osm')`).
4. **Cotización Dinámica Multidivisa:**
   - Tarifas en tiempo real para **Moto**, **Carro** y **Camioneta / SUV**.
   - Conversión inmediata a **Dólares (USD)**, **Bolívares (VES)** y **Pesos Colombianos (COP)**.
5. **Métodos de Pago Adaptados a la Región:**
   - 📱 **Pago Móvil** (Bancos venezolanos).
   - 🏦 **Transferencia Bancaria Nacional**.
   - 🟡 **Binance Pay** (USDT).
   - 🅿️ **PayPal**.
   - 💵 **Efectivo al Conductor** (USD, Bs. o COP).
6. **Lugares Frecuentes y Preferencias:**
   - Botones de acceso directo en 1 clic: `[Casa]`, `[Trabajo]`, `[Destinos recientes]`.

---

## 🏛️ Arquitectura Técnica

- **Backend:** Node.js, TypeScript, Express, `@google/genai` (SDK oficial de Gemini), Axios, OSRM/Nominatim.
- **Frontend Web App:** React / Vite con Tailwind CSS, interfaz conversacional fluida, grabación por micrófono y mapas interactivos.
- **Móvil (En roadmap):** Arquitectura de endpoints REST y WebSockets lista para el desarrollo de la aplicación nativa Android.

---

## 📚 Documentación de Control y Evolución

- [Bitácora de Versiones y Cambios (CHANGELOG.md)](./CHANGELOG.md)
- [Hoja de Ruta y Próximas Integraciones (ROADMAP.md)](./ROADMAP.md)
- [Documentación de la API Backend](./docs/API.md)
- [Registro de Problemas, Soluciones y FAQ](./docs/TROUBLESHOOTING.md)

---

## 🛠️ Instalación y Puesta en Marcha

### Requisitos Previos
- Node.js v20+ o v24+
- Clave de API de Google AI Studio ([Google AI Studio](https://aistudio.google.com/))

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

El servidor iniciará en `http://localhost:4000`.
