import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// 1. Inicialización de Servicios
// Soporte de múltiples API Keys separadas por coma en el .env: GEMINI_API_KEYS="key1,key2,key3"
const geminiKeysRaw = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
const geminiKeys = geminiKeysRaw.split(',').map(k => k.trim()).filter(k => k.length > 0);
const geminiKeyManager = new GeminiKeyManager(geminiKeys);
const valetService = new GeminiValetService(geminiKeyManager);

const geoService = new GeoService(
  (process.env.GEO_PROVIDER as GeoProviderType) || 'osm',
  process.env.GOOGLE_MAPS_API_KEY || ''
);

const pricingService = new PricingService();

// Mock en memoria para lugares frecuentes de usuario (perfil rápido)
const userProfiles: Record<string, any> = {
  default_user: {
    id: 'default_user',
    name: 'Usuario AuriGo',
    frequentPlaces: [
      { label: 'Casa', address: 'Calle Principal, Edif. Auri, Apt 4B', lat: 10.4806, lng: -66.9036 },
      { label: 'Trabajo', address: 'Torre Empresarial Centro, Piso 8', lat: 10.4950, lng: -66.8650 },
    ],
  },
};

// ================= RUTAS API =================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'AuriGo API',
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

// 2. Administrador de API Keys de Gemini (agregar o ver estadísticas)
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
    const { message, context, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido.' });
    }

    const userId = context?.userId || 'default_user';
    const profile = userProfiles[userId] || userProfiles.default_user;

    const fullContext = {
      ...context,
      frequentPlaces: profile.frequentPlaces,
    };

    const reply = await valetService.processUserMessage(message, fullContext, history);
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

// 6. Métodos de Pago y Tasas
app.get('/api/payments/methods', (req: Request, res: Response) => {
  res.json({
    methods: PAYMENT_METHODS,
    exchangeRates: pricingService.getExchangeRates(),
  });
});

// 7. Perfil y Lugares Frecuentes
app.get('/api/users/profile', (req: Request, res: Response) => {
  res.json(userProfiles.default_user);
});

app.post('/api/users/frequent-places', (req: Request, res: Response) => {
  const { label, address, lat, lng } = req.body;
  if (!label || !address) {
    return res.status(400).json({ error: 'Etiqueta y dirección requeridas.' });
  }
  userProfiles.default_user.frequentPlaces.push({ label, address, lat, lng });
  res.json({ success: true, places: userProfiles.default_user.frequentPlaces });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor AuriGo iniciado en http://localhost:${PORT}`);
  console.log(`🗺️ Proveedor de mapas actual: ${geoService.getCurrentProviderType().toUpperCase()}`);
  console.log(`🤖 Google Gemini API Keys configuradas: ${geminiKeys.length}`);
});
