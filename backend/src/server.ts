import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, db } from './db/database.js';
import { GeoService, GeoProviderType } from './services/geo/geo.service.js';
import { GeminiKeyManager } from './services/gemini/gemini-key-manager.js';
import { GeminiValetService } from './services/gemini/gemini-valet.service.js';
import { PricingService } from './services/pricing/pricing.service.js';
import { PAYMENT_METHODS } from './services/payments/payment-methods.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 0. Inicializar Base de Datos SQLite (Persistencia local ultra rápida)
initDatabase();

// 1. Inicialización de Servicios
const geminiKeysRaw = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
const geminiKeys = geminiKeysRaw.split(',').map(k => k.trim()).filter(k => k.length > 0);
const geminiKeyManager = new GeminiKeyManager(geminiKeys);
const valetService = new GeminiValetService(geminiKeyManager);

const geoService = new GeoService(
  (process.env.GEO_PROVIDER as GeoProviderType) || 'osm',
  process.env.GOOGLE_MAPS_API_KEY || ''
);

const pricingService = new PricingService();

// ================= RUTAS API =================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'AuriGo API',
    database: 'SQLite (WAL Mode)',
    geoProvider: geoService.getCurrentProviderType(),
    geminiKeyStats: geminiKeyManager.getStats(),
  });
});

// 1. Configuración de Proveedor de Mapas (OSM vs Google Maps)
app.post('/api/config/geo-provider', (req: Request, res: Response) => {
  const { provider } = req.body;
  if (provider === 'osm' || provider === 'google') {
    geoService.setProvider(provider);
    return res.json({ success: true, activeProvider: provider });
  }
  res.status(400).json({ error: 'Proveedor inválido. Use "osm" o "google".' });
});

// 2. Administrador de API Keys de Gemini
app.get('/api/ai/keys-status', (req: Request, res: Response) => {
  res.json({ keys: geminiKeyManager.getStats() });
});

app.post('/api/ai/add-key', (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(400).json({ error: 'API key requerida.' });
  }
  geminiKeyManager.addKey(apiKey);
  res.json({ success: true, message: 'Key añadida exitosamente.', stats: geminiKeyManager.getStats() });
});

// 3. Valet Conversacional de AuriGo (Chat inteligente)
app.post('/api/ai/valet-chat', async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido.' });
    }

    const userId = context?.userId || 'default_user';
    const places = db.prepare('SELECT label, address, lat, lng FROM frequent_places WHERE user_id = ?').all(userId);

    const fullContext = {
      ...context,
      frequentPlaces: places,
    };

    const reply = await valetService.processUserMessage(message, fullContext);
    res.json(reply);
  } catch (error: any) {
    console.error('Error en /api/ai/valet-chat:', error);
    res.status(500).json({ error: error.message || 'Error en el asistente Valet.' });
  }
});

// 4. Búsqueda de Direcciones y Geocodificación
app.get('/api/geo/search', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q) return res.json([]);
    const results = await geoService.searchAddress(q);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: 'Error buscando dirección.' });
  }
});

app.get('/api/geo/reverse', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Coordenadas lat,lng inválidas.' });
    }
    const address = await geoService.reverseGeocode(lat, lng);
    res.json({ address });
  } catch (error: any) {
    res.status(500).json({ error: 'Error en geocodificación inversa.' });
  }
});

// 5. Cálculo de Ruta y Cotización de Tarifas
app.post('/api/trips/quote', async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origen y Destino requeridos.' });
    }

    const route = await geoService.calculateRoute(origin, destination);
    const fares = pricingService.calculateFares(route.distanceKm, route.durationMinutes);

    res.json({
      route,
      fares,
      exchangeRates: pricingService.getExchangeRates(),
      paymentMethods: PAYMENT_METHODS,
    });
  } catch (error: any) {
    console.error('Error calculando cotización:', error);
    res.status(500).json({ error: 'Error calculando cotización del traslado.' });
  }
});

// 6. Confirmación y Registro de Traslado en SQLite
app.post('/api/trips/confirm', (req: Request, res: Response) => {
  try {
    const {
      userId = 'default_user',
      originAddress,
      originLat,
      originLng,
      destinationAddress,
      destinationLat,
      destinationLng,
      vehicleType,
      distanceKm,
      durationMinutes,
      priceCop,
      priceUsd,
      priceVes,
      currency,
      paymentMethod,
    } = req.body;

    const tripId = `TRIP_${Date.now()}`;
    const insertTrip = db.prepare(`
      INSERT INTO trips (
        id, user_id, origin_address, origin_lat, origin_lng,
        destination_address, destination_lat, destination_lng,
        vehicle_type, distance_km, duration_minutes,
        price_cop, price_usd, price_ves, currency, payment_method,
        status, driver_name, driver_vehicle, driver_plate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertTrip.run(
      tripId,
      userId,
      originAddress || 'Ubicación GPS',
      originLat || null,
      originLng || null,
      destinationAddress,
      destinationLat || null,
      destinationLng || null,
      vehicleType,
      distanceKm || 4.2,
      durationMinutes || 12,
      priceCop || 15000,
      priceUsd || 3.6,
      priceVes || 162.0,
      currency || 'COP',
      paymentMethod || 'efectivo_pesos',
      'accepted',
      'Carlos Gómez (Socio Fundador)',
      vehicleType === 'AuriMoto' ? 'Bera SBR 150 (Amarillo/Negro)' : 'Chevrolet Optra Sedán',
      'AB123CD'
    );

    res.json({
      success: true,
      tripId,
      driver: {
        name: 'Carlos Gómez',
        vehicle: vehicleType === 'AuriMoto' ? 'Bera SBR 150 (Amarillo/Negro)' : 'Chevrolet Optra Sedán',
        plate: 'AB123CD',
        etaMinutes: 4,
      },
    });
  } catch (error: any) {
    console.error('Error registrando traslado en SQLite:', error);
    res.status(500).json({ error: 'Error al confirmar el traslado.' });
  }
});

// 7. Perfil y Lugares Frecuentes en SQLite
app.get('/api/users/profile', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const places = db.prepare('SELECT id, label, address, lat, lng FROM frequent_places WHERE user_id = ?').all(userId);
  res.json({ user, frequentPlaces: places });
});

app.post('/api/users/frequent-places', (req: Request, res: Response) => {
  const { userId = 'default_user', label, address, lat, lng } = req.body;
  if (!label || !address) {
    return res.status(400).json({ error: 'Etiqueta y dirección requeridas.' });
  }
  const result = db.prepare(
    'INSERT INTO frequent_places (user_id, label, address, lat, lng) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, label, address, lat || null, lng || null);

  const places = db.prepare('SELECT id, label, address, lat, lng FROM frequent_places WHERE user_id = ?').all(userId);
  res.json({ success: true, id: result.lastInsertRowid, places });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor AuriGo iniciado en http://localhost:${PORT}`);
  console.log(`📦 Base de Datos: SQLite (aurigo.sqlite con WAL mode)`);
  console.log(`🗺️ Proveedor de mapas: ${geoService.getCurrentProviderType().toUpperCase()}`);
  console.log(`🤖 Google Gemini API Keys configuradas: ${geminiKeys.length}`);
});
