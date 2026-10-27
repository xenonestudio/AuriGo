import { GoogleGenAI } from '@google/genai';

interface KeyStats {
  key: string;
  callsCount: number;
  lastUsed: number;
  isRateLimited: boolean;
  rateLimitedUntil: number;
}

export class GeminiKeyManager {
  private keys: KeyStats[] = [];
  private currentIndex: number = 0;

  constructor(apiKeys: string[]) {
    this.initKeys(apiKeys);
  }

  public initKeys(apiKeys: string[]) {
    const validKeys = apiKeys
      .map(k => k.trim())
      .filter(k => k.length > 0);

    this.keys = validKeys.map(key => ({
      key,
      callsCount: 0,
      lastUsed: 0,
      isRateLimited: false,
      rateLimitedUntil: 0,
    }));

    console.log(`[AuriGo AI Manager] Inicializadas ${this.keys.length} API keys de Google Gemini.`);
  }

  public addKey(newKey: string) {
    const trimmed = newKey.trim();
    if (trimmed && !this.keys.some(k => k.key === trimmed)) {
      this.keys.push({
        key: trimmed,
        callsCount: 0,
        lastUsed: 0,
        isRateLimited: false,
        rateLimitedUntil: 0,
      });
      console.log(`[AuriGo AI Manager] Nueva API key añadida. Total disponibles: ${this.keys.length}`);
    }
  }

  /**
   * Obtiene la mejor API Key disponible utilizando una estrategia Round-Robin
   * con detección inteligente de Rate Limiting y menor carga.
   */
  public getNextAvailableClient(): { client: GoogleGenAI; key: string } {
    if (this.keys.length === 0) {
      throw new Error('No hay API keys de Google Gemini configuradas. Configure GEMINI_API_KEYS en el archivo .env');
    }

    const now = Date.now();
    // Rehabilitar keys que hayan superado el tiempo de enfriamiento (cooldown de 60s)
    for (const k of this.keys) {
      if (k.isRateLimited && now > k.rateLimitedUntil) {
        k.isRateLimited = false;
        k.rateLimitedUntil = 0;
      }
    }

    // Filtrar keys utilizables
    const activeKeys = this.keys.filter(k => !k.isRateLimited);
    if (activeKeys.length === 0) {
      console.warn('[AuriGo AI Manager] Todas las keys están temporalmente en cooldown. Forzando reintento con la más antigua.');
      // Fallback a la key con lastUsed más lejano
      this.keys.sort((a, b) => a.lastUsed - b.lastUsed);
      const fallbackKey = this.keys[0];
      fallbackKey.isRateLimited = false;
      fallbackKey.lastUsed = now;
      fallbackKey.callsCount++;
      return { client: new GoogleGenAI({ apiKey: fallbackKey.key }), key: fallbackKey.key };
    }

    // Estrategia Round-Robin ponderada por disponibilidad
    this.currentIndex = (this.currentIndex + 1) % activeKeys.length;
    const selected = activeKeys[this.currentIndex];
    selected.lastUsed = now;
    selected.callsCount++;

    return {
      client: new GoogleGenAI({ apiKey: selected.key }),
      key: selected.key,
    };
  }

  /**
   * Marca una key como limitada por cuota (Rate Limit / 429) por un período determinado
   */
  public markRateLimited(key: string, cooldownMs: number = 60000) {
    const target = this.keys.find(k => k.key === key);
    if (target) {
      target.isRateLimited = true;
      target.rateLimitedUntil = Date.now() + cooldownMs;
      console.warn(`[AuriGo AI Manager] Key ...${key.slice(-4)} marcada con Rate Limit. Cooldown de ${cooldownMs / 1000}s.`);
    }
  }

  public getStats() {
    return this.keys.map(k => ({
      keySuffix: `...${k.key.slice(-4)}`,
      callsCount: k.callsCount,
      isRateLimited: k.isRateLimited,
      cooldownRemainingSec: Math.max(0, Math.round((k.rateLimitedUntil - Date.now()) / 1000)),
    }));
  }
}
