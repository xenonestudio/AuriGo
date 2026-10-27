export interface PaymentMethodConfig {
  id: string;
  name: string;
  badge?: string;
  category: 'local_cop' | 'venezuela_bs' | 'crypto_usd' | 'international' | 'cash';
  currencies: ('COP' | 'USD' | 'VES')[];
  icon: string;
  headline: string;
  description: string;
}

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'efectivo_pesos',
    name: 'Efectivo en Pesos (COP)',
    badge: 'Más Usado',
    category: 'cash',
    currencies: ['COP'],
    icon: '💵',
    headline: 'Efectivo al Conductor en Pesos',
    description: 'Paga exacto o recibe vuelto al subir a la unidad.',
  },
  {
    id: 'pago_movil',
    name: 'Pago Móvil (Bs)',
    badge: 'Al Instante',
    category: 'venezuela_bs',
    currencies: ['VES'],
    icon: '📱',
    headline: 'Pago Móvil Interbancario',
    description: 'Banesco, BDV, Mercantil, Provincial y bancos nacionales.',
  },
  {
    id: 'efectivo_usd',
    name: 'Efectivo en Dólares ($)',
    category: 'cash',
    currencies: ['USD'],
    icon: '💵',
    headline: 'Dólares en Efectivo',
    description: 'Billetes en buen estado sin tachaduras.',
  },
  {
    id: 'binance_pay',
    name: 'Binance Pay (USDT)',
    badge: '0% Comisión',
    category: 'crypto_usd',
    currencies: ['USD'],
    icon: '🟡',
    headline: 'Transferencia Cripto Inmediata',
    description: 'Envía vía Binance Pay ID al instante.',
  },
  {
    id: 'transferencia_bancaria',
    name: 'Transferencia Bancaria Nacional',
    category: 'venezuela_bs',
    currencies: ['VES'],
    icon: '🏦',
    headline: 'Transferencia en Bolívares',
    description: 'Cuentas corrientes o ahorros en bancos venezolanos.',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'international',
    currencies: ['USD'],
    icon: '🅿️',
    headline: 'Saldo PayPal Internacional',
    description: 'Para clientes internacionales o visitas a la frontera.',
  },
];
