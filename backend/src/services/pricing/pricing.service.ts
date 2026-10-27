export type VehicleType = 'AuriMoto' | 'AuriClasico' | 'AuriClima' | 'AuriClavellina';
export type Currency = 'COP' | 'USD' | 'VES';

export interface VehicleRate {
  type: VehicleType;
  name: string;
  badge?: string;
  icon: string;
  baseFareCop: number;
  ratePerKmCop: number;
  ratePerMinCop: number;
  minFareCop: number;
  capacity: string;
  description: string;
}

export interface CurrencyRates {
  COP_TO_USD: number; // 1 USD = 4100 COP -> COP_TO_USD = 1/4100
  COP_TO_VES: number; // 1 VES = 90 COP -> COP_TO_VES = 1/90
}

export interface FareCalculation {
  vehicleType: VehicleType;
  vehicleName: string;
  badge?: string;
  icon: string;
  distanceKm: number;
  durationMinutes: number;
  prices: {
    COP: number;
    USD: number;
    VES: number;
  };
}

export class PricingService {
  // Tasas de cambio comerciales de San Cristóbal / Frontera
  private exchangeRateUsdCop = 4150.0; // 1 USD = 4150 COP
  private exchangeRateUsdVes = 45.0;   // 1 USD = 45 VES

  private vehicleCatalog: Record<VehicleType, VehicleRate> = {
    AuriMoto: {
      type: 'AuriMoto',
      name: 'AuriMoto',
      badge: 'Rápido',
      icon: '🛵',
      baseFareCop: 5000,
      ratePerKmCop: 1800,
      ratePerMinCop: 150,
      minFareCop: 6000,
      capacity: '1 pasajero',
      description: 'Traslado ágil para las cuestas. Incluye casco e impermeable por si llueve.',
    },
    AuriClasico: {
      type: 'AuriClasico',
      name: 'AuriClásico',
      icon: '🚗',
      baseFareCop: 10000,
      ratePerKmCop: 2800,
      ratePerMinCop: 250,
      minFareCop: 12000,
      capacity: 'Hasta 4 pasajeros',
      description: 'Sedán cómodo y seguro para moverte por la ciudad sin regateos.',
    },
    AuriClima: {
      type: 'AuriClima',
      name: 'AuriClima',
      badge: 'A/C Garantizado',
      icon: '❄️',
      baseFareCop: 14000,
      ratePerKmCop: 3500,
      ratePerMinCop: 350,
      minFareCop: 16000,
      capacity: 'Hasta 4 pasajeros',
      description: 'Carro climatizado con aire acondicionado activo durante todo el trayecto.',
    },
    AuriClavellina: {
      type: 'AuriClavellina',
      name: 'AuriClavellina',
      badge: 'Mujeres y Niños',
      icon: '🌸',
      baseFareCop: 11000,
      ratePerKmCop: 2900,
      ratePerMinCop: 260,
      minFareCop: 13000,
      capacity: 'Hasta 4 pasajeros',
      description: 'Servicio conducido por conductoras verificadas exclusivo para mujeres y niños.',
    },
  };

  public getExchangeRates() {
    return {
      USD_TO_COP: this.exchangeRateUsdCop,
      USD_TO_VES: this.exchangeRateUsdVes,
      COP_TO_VES: Math.round((this.exchangeRateUsdVes / this.exchangeRateUsdCop) * 10000) / 10000,
    };
  }

  public getVehicleCatalog(): VehicleRate[] {
    return Object.values(this.vehicleCatalog);
  }

  public calculateFares(distanceKm: number, durationMinutes: number): FareCalculation[] {
    return Object.values(this.vehicleCatalog).map(vehicle => {
      const rawPriceCop =
        vehicle.baseFareCop +
        distanceKm * vehicle.ratePerKmCop +
        durationMinutes * vehicle.ratePerMinCop;

      // Redondeo comercial en miles de pesos
      const finalPriceCop = Math.max(vehicle.minFareCop, Math.round(rawPriceCop / 500) * 500);
      const finalPriceUsd = Math.round((finalPriceCop / this.exchangeRateUsdCop) * 100) / 100;
      const finalPriceVes = Math.round((finalPriceUsd * this.exchangeRateUsdVes) * 100) / 100;

      return {
        vehicleType: vehicle.type,
        vehicleName: vehicle.name,
        badge: vehicle.badge,
        icon: vehicle.icon,
        distanceKm,
        durationMinutes,
        prices: {
          COP: finalPriceCop,
          USD: finalPriceUsd,
          VES: finalPriceVes,
        },
      };
    });
  }
}
