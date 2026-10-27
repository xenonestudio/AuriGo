# 🗺️ Hoja de Ruta e Integraciones Futuras (Roadmap) - AuriGo

Este documento detalla la línea de tiempo, evolución estratégica y próximas características para el ecosistema de AuriGo.

---

## 📌 Fase 1: MVP Web App & Backend Core (En Progreso)
- [x] Arquitectura Backend en Node.js + TypeScript con Express y Axios.
- [x] Repositorio oficial en GitHub sincronizado (`xenonestudio/AuriGo`).
- [x] Conector híbrido OpenStreetMap (Nominatim/OSRM) y Google Maps API.
- [x] Gestor inteligente de rotación y enfriamiento de múltiples API Keys de Google AI Studio.
- [x] Motor de cotización dinámica y multidivisa (USD / VES / COP).
- [x] Métodos de pago venezolanos e internacionales.
- [ ] Desarrollo de la Web App frontend con chat dinámico tipo Wizard y botón de micrófono (Web Speech API / Gemini Audio).
- [ ] Visualizador de mapa interactivo con OpenStreetMap Leaflet en el frontend.

---

## 📌 Fase 2: Aplicación Móvil Android (Primer Objetivo Móvil)
- [ ] Desarrollo de la aplicación nativa o Flutter/React Native para Android.
- [ ] Geolocalización en segundo plano y rastreo del conductor en tiempo real.
- [ ] Integración de notificaciones Push (Firebase Cloud Messaging) para avisos de llegada del conductor.
- [ ] Soporte offline para consultar viajes anteriores o pedir traslados por SMS/WhatsApp como canal de contingencia.

---

## 📌 Fase 3: Panel de Conductores & Administración
- [ ] App / Modo Conductor ("AuriGo Conductor"):
  - Aceptación de viajes con vista previa de tarifa y método de pago elegido.
  - Navegación asistida GPS.
  - Billetera de conductor y balance de comisiones.
- [ ] Panel Web de Administración y Despacho:
  - Monitoreo en vivo de viajes activos en el mapa.
  - Ajuste de tarifas base y tasas de cambio del día (USD a VES / COP).
  - Métricas de uso y rendimiento de las API Keys de Gemini.

---

## 📌 Fase 4: Integraciones Avanzadas
- [ ] **Llamadas y Notas de Voz en Vivo con Gemini Live:**
  - Conversación bidireccional por voz sin tocar la pantalla para usuarios que van caminando o con prisa.
- [ ] **Pasarelas Automáticas:**
  - Conciliación automática de Pago Móvil con API bancaria venezolana.
  - Verificación por Webhooks de Binance Pay.
- [ ] **Flotas Corporativas:**
  - Facturación para empresas y cuentas corporativas de traslado de personal.
