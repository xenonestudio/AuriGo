import Database from 'better-sqlite3';
import path from 'path';

// Base de datos en archivo local persistente en la raíz del proyecto
const dbPath = path.resolve(process.cwd(), 'aurigo.sqlite');
export const db = new Database(dbPath);

// Configuración de rendimiento de SQLite (WAL mode para alta concurrencia)
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

/**
 * Inicialización de esquemas de AuriGo en SQLite
 */
export function initDatabase() {
  console.log(`[AuriGo SQLite] Conectado a la base de datos en: ${dbPath}`);

  // 1. Usuarios y Preferencias (Lugares frecuentes)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS frequent_places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      label TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL,
      lng REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    -- 2. Historial y Estado de Traslados
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      origin_address TEXT NOT NULL,
      origin_lat REAL,
      origin_lng REAL,
      destination_address TEXT NOT NULL,
      destination_lat REAL,
      destination_lng REAL,
      vehicle_type TEXT NOT NULL,
      distance_km REAL,
      duration_minutes INTEGER,
      price_cop REAL,
      price_usd REAL,
      price_ves REAL,
      currency TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- pending, accepted, on_the_way, completed, cancelled
      driver_name TEXT,
      driver_vehicle TEXT,
      driver_plate TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Métricas y Estadísticas de API Keys de Gemini
    CREATE TABLE IF NOT EXISTS gemini_keys (
      api_key TEXT PRIMARY KEY,
      calls_count INTEGER DEFAULT 0,
      last_used DATETIME,
      is_rate_limited INTEGER DEFAULT 0,
      rate_limited_until DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insertar usuario por defecto si no existe
  const defaultUser = db.prepare('SELECT id FROM users WHERE id = ?').get('default_user');
  if (!defaultUser) {
    db.prepare('INSERT INTO users (id, name, phone) VALUES (?, ?, ?)').run(
      'default_user',
      'Usuario AuriGo',
      '+584141234567'
    );

    const insertPlace = db.prepare(
      'INSERT INTO frequent_places (user_id, label, address, lat, lng) VALUES (?, ?, ?, ?, ?)'
    );
    insertPlace.run('default_user', '🏠 Casa', 'Calle Principal, Edif. Auri, Barrio Obrero', 7.7712, -72.2250);
    insertPlace.run('default_user', '💼 Trabajo', 'Av. 19 de Abril, Torre Centro, San Cristóbal', 7.7650, -72.2300);
    insertPlace.run('default_user', '🛍️ Sambil', 'Centro Comercial Sambil San Cristóbal', 7.7950, -72.2150);

    console.log('[AuriGo SQLite] Usuario por defecto y lugares frecuentes inicializados.');
  }
}
