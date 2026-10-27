import { GeminiKeyManager } from './gemini-key-manager.js';

export interface ValetAIContext {
  userName?: string;
  userCurrentLocation?: { lat: number; lng: number; address?: string };
  frequentPlaces?: { label: string; address: string }[];
  currentTripDraft?: {
    destination?: string;
    origin?: string;
    vehicleType?: 'AuriMoto' | 'AuriClasico' | 'AuriClima' | 'AuriClavellina';
    currency?: 'COP' | 'USD' | 'VES';
  };
}

export interface ValetAIResponse {
  replyText: string;
  extractedData?: {
    destination?: string;
    origin?: string;
    vehicleType?: 'AuriMoto' | 'AuriClasico' | 'AuriClima' | 'AuriClavellina';
    actionRequired?: 'confirm_destination' | 'select_vehicle' | 'confirm_origin' | 'select_payment' | 'confirm_trip';
    quickSuggestions?: string[];
  };
  cached?: boolean;
}

export class GeminiValetService {
  private keyManager: GeminiKeyManager;
  // Memoria caché volátil para consultas idénticas (Ahorro radical de tokens)
  private responseCache: Map<string, { res: ValetAIResponse; expiry: number }> = new Map();

  constructor(keyManager: GeminiKeyManager) {
    this.keyManager = keyManager;
  }

  /**
   * Resuelve heurísticamente intenciones comunes sin consumir tokens de Gemini
   */
  private checkLocalHeuristics(cleanMsg: string, userName: string, context: ValetAIContext): ValetAIResponse | null {
    // 1. Saludos iniciales o "hola"
    if (/^(hola|buenos d[ií]as|buenas tardes|buenas noches|epale|buenas|que mas|qu[eé] tal)$/i.test(cleanMsg)) {
      return {
        replyText: `¡Hola, ${userName}! ¿Pa' dónde vamos hoy? Cuéntame tu destino o elige tus lugares frecuentes.`,
        extractedData: {
          actionRequired: 'confirm_destination',
          quickSuggestions: ['🏠 Casa', '💼 Trabajo', 'Sambil San Cristóbal', 'Barrio Obrero'],
        },
      };
    }

    // 2. Selección directa de vehículos
    if (/^(moto|aurimoto|en moto|la moto)$/i.test(cleanMsg)) {
      return {
        replyText: `¡Excelente! AuriMoto seleccionada. Traslado rápido con casco e impermeable listo. ¿Dónde te recogemos?`,
        extractedData: {
          vehicleType: 'AuriMoto',
          actionRequired: 'confirm_origin',
          quickSuggestions: ['📍 Usar mi ubicación actual', '🏠 Casa', 'Cambiar origen'],
        },
      };
    }

    if (/^(carro|auriclasico|auto|taxi|sedan)$/i.test(cleanMsg)) {
      return {
        replyText: `¡Listo! AuriClásico seleccionado. Sedán cómodo para viajar sin regateos. ¿Te buscamos en tu ubicación actual?`,
        extractedData: {
          vehicleType: 'AuriClasico',
          actionRequired: 'confirm_origin',
          quickSuggestions: ['📍 Usar mi ubicación actual', '🏠 Casa', 'Cambiar origen'],
        },
      };
    }

    if (/^(con aire|aire|clima|auriclima|con a\/c)$/i.test(cleanMsg)) {
      return {
        replyText: `¡Perfecto! AuriClima seleccionado con aire acondicionado para subir las cuestas con frescura. ¿Dónde te buscamos?`,
        extractedData: {
          vehicleType: 'AuriClima',
          actionRequired: 'confirm_origin',
          quickSuggestions: ['📍 Usar mi ubicación actual', 'Cambiar origen'],
        },
      };
    }

    // 3. Confirmación de origen GPS
    if (/^(si|aqu[ií]|mi ubicaci[oó]n|ubicacion actual|gps|usar mi ubicacion|en mi casa)$/i.test(cleanMsg)) {
      const originName = context.userCurrentLocation?.address || 'Ubicación actual por GPS';
      return {
        replyText: `¡Entendido! Pasamos por ti en: "${originName}". Aquí tienes tu cotización y métodos de pago:`,
        extractedData: {
          origin: originName,
          actionRequired: 'select_payment',
          quickSuggestions: ['Pesos (COP)', 'Pago Móvil (Bs)', 'Efectivo en Dólares'],
        },
      };
    }

    return null;
  }

  async processUserMessage(
    userMessage: string,
    context: ValetAIContext
  ): Promise<ValetAIResponse> {
    const userName = context.userName || 'pariente';
    const cleanMsg = userMessage.trim();

    // 1. Ahorro Nivel 1: Heurística local (0 Tokens consumidos)
    const localHit = this.checkLocalHeuristics(cleanMsg, userName, context);
    if (localHit) {
      return localHit;
    }

    // 2. Ahorro Nivel 2: Caché de respuestas recientes idénticas (TTL 10 min)
    const cacheKey = `${cleanMsg.toLowerCase()}_${context.currentTripDraft?.destination || ''}`;
    const cached = this.responseCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return { ...cached.res, cached: true };
    }

    // 3. Ahorro Nivel 3: Prompt ultracompacto (Token Minification)
    // Reduce drásticamente el consumo de tokens de entrada manteniendo la directiva
    const minifiedPrompt = `Actúa como "AuriGo Valet" (movilidad San Cristóbal/Táchira). Tono cordial andino ("¿Pa' dónde vamos hoy?", "¡Camine!").
Vehículos: AuriMoto, AuriClasico, AuriClima, AuriClavellina.
Monedas: COP, USD, VES.
Usuario: ${userName}.
Borrador: Destino=${context.currentTripDraft?.destination || 'N/A'}, Origen=${context.currentTripDraft?.origin || 'N/A'}.

Mensaje del usuario: "${cleanMsg}"

Devuelve estrictamente JSON sin markdown:
{"replyText":"...","extractedData":{"destination":"... o null","origin":"... o null","vehicleType":"AuriMoto|AuriClasico|AuriClima|AuriClavellina|null","actionRequired":"confirm_destination|select_vehicle|confirm_origin|select_payment|confirm_trip|null","quickSuggestions":["..."]}}`;

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      const { client, key } = this.keyManager.getNextAvailableClient();

      try {
        const response = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: minifiedPrompt }] }],
          config: {
            temperature: 0.1, // Mínima varianza para respuestas directas y concisas
            maxOutputTokens: 250, // Límite estricto de tokens de salida para evitar derroche
          },
        });

        const rawText = response.text || '{}';
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
          const parsed = JSON.parse(cleanedText);
          const result: ValetAIResponse = {
            replyText: parsed.replyText || `¡Listo, ${userName}! Vamos para allá.`,
            extractedData: parsed.extractedData,
          };
          // Guardar en caché 10 minutos
          this.responseCache.set(cacheKey, { res: result, expiry: Date.now() + 600000 });
          return result;
        } catch {
          return { replyText: cleanedText };
        }
      } catch (error: any) {
        attempt++;
        if (error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED')) {
          this.keyManager.markRateLimited(key, 60000);
        }
        if (attempt >= maxRetries) {
          throw new Error('Todas las API keys de Gemini fallaron o están en cooldown.');
        }
      }
    }

    return {
      replyText: `¿Pa' dónde vamos hoy, ${userName}? Dime tu destino o selecciona uno de tus favoritos.`,
    };
  }
}
