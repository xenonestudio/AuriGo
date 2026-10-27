# 📋 Historial de Cambios (Changelog) - AuriGo

Todos los cambios notables, nuevas funciones, soluciones de errores y ajustes de rendimiento de este proyecto se documentarán en este archivo de manera continua.

---

## [v0.1.0] - 2026-10-27 (Lanzamiento Inicial de Arquitectura Base)

### 🚀 Nuevas Funcionalidades
- **Repositorio Oficial:** Creación e inicialización del repositorio GitHub en [xenonestudio/AuriGo](https://github.com/xenonestudio/AuriGo).
- **Backend Node.js + TypeScript:** Configuración del proyecto base con soporte para módulos modernos ESM y tipos estrictos.
- **Valet AI Conversacional (Google Gemini):**
  - Implementación con el SDK oficial `@google/genai`.
  - Estructuración de respuestas en JSON para guiar al usuario mediante chat en la selección de destino, vehículo y pago.
- **Administrador de Múltiples API Keys de Gemini (`GeminiKeyManager`):**
  - Rotación automática Round-Robin de keys para optimizar cuota.
  - Detección de errores 429 / Rate Limit con período de enfriamiento (*cooldown*) automático de 60 segundos.
  - Endpoint REST `/api/ai/add-key` para incorporar nuevas llaves en caliente sin reiniciar el servidor.
- **Módulo Geográfico Híbrido (`GeoService`):**
  - Soporte por defecto para **OpenStreetMap** (Nominatim para geocodificación y OSRM para cálculo de distancias/duración).
  - Soporte para **Google Maps Platform** (Geocoding API y Directions API).
  - Conmutador en caliente para cambiar de proveedor en tiempo de ejecución.
- **Motor de Precios y Multidivisa (`PricingService`):**
  - Catálogo de vehículos: **Moto** (1 pasajero), **Carro Estándar** (hasta 4 pasajeros) y **Camioneta / SUV** (hasta 6 pasajeros).
  - Cotización automática con desglose de moneda en **USD**, **VES (Bolívares)** y **COP (Pesos Colombianos)**.
- **Pasarelas de Pago:**
  - Configuración para **Pago Móvil**, **Transferencia Bancaria Nacional**, **Binance Pay**, **PayPal** y **Efectivo al Conductor**.
- **Lugares Frecuentes:**
  - Estructura y endpoints para guardar y consultar ubicaciones habituales (Casa, Trabajo).

### 🛠️ Correcciones y Estabilidad
- Estandarización de fallback con fórmula de Haversine ante indisponibilidad de servidores de enrutamiento externos.
