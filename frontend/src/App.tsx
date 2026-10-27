import { useState, useEffect, useRef } from 'react';
import { AuriGoLogo } from './components/AuriGoLogo';
import { 
  Send, 
  Mic, 
  MicOff, 
  MapPin, 
  Navigation, 
  Sparkles, 
  RotateCcw,
  ChevronRight
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'valet' | 'user';
  text: string;
  timestamp: string;
  actionRequired?: string;
  quickSuggestions?: string[];
}

interface Vehicle {
  type: string;
  name: string;
  badge?: string;
  icon: string;
  capacity: string;
  description: string;
  prices: {
    COP: number;
    USD: number;
    VES: number;
  };
}

interface PaymentMethod {
  id: string;
  name: string;
  badge?: string;
  icon: string;
  description: string;
  currencies: string[];
}

export function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'valet',
      text: "¡Hola! Bienvenido a AuriGo, la ruta cordial del Táchira. 👋 ¿Pa' dónde vamos hoy? Puedes escribir o usar el micrófono.",
      timestamp: 'Ahora',
      actionRequired: 'confirm_destination',
      quickSuggestions: ['🏠 Casa', '💼 Trabajo', 'Sambil San Cristóbal', 'Barrio Obrero', 'Táriba'],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'VES'>('COP');

  // Estado del viaje (Wizard)
  const [step, setStep] = useState<'destination' | 'vehicle' | 'origin' | 'payment' | 'confirmed'>('destination');
  const [destination, setDestination] = useState<string>('');
  const [origin, setOrigin] = useState<string>('Ubicación actual por GPS');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('AuriClasico');
  const [selectedPayment, setSelectedPayment] = useState<string>('efectivo_pesos');
  const [isLoading, setIsLoading] = useState(false);

  // Catálogo de vehículos con precios dinámicos
  const [vehicles] = useState<Vehicle[]>([
    {
      type: 'AuriMoto',
      name: 'AuriMoto',
      badge: 'Rápido',
      icon: '🛵',
      capacity: '1 pasajero',
      description: 'Ágil en las cuestas. Casco e impermeable incluido.',
      prices: { COP: 8000, USD: 1.95, VES: 87.75 },
    },
    {
      type: 'AuriClasico',
      name: 'AuriClásico',
      icon: '🚗',
      capacity: '4 pasajeros',
      description: 'Sedán confortable sin regateos con maletero.',
      prices: { COP: 15000, USD: 3.60, VES: 162.00 },
    },
    {
      type: 'AuriClima',
      name: 'AuriClima',
      badge: 'A/C Activo',
      icon: '❄️',
      capacity: '4 pasajeros',
      description: 'Viaje fresco y climatizado para el clima de montaña.',
      prices: { COP: 18000, USD: 4.35, VES: 195.75 },
    },
    {
      type: 'AuriClavellina',
      name: 'AuriClavellina',
      badge: 'Mujeres y Niños',
      icon: '🌸',
      capacity: '4 pasajeros',
      description: 'Conductora verificada en sede física.',
      prices: { COP: 15500, USD: 3.75, VES: 168.75 },
    },
  ]);

  const [paymentMethods] = useState<PaymentMethod[]>([
    { id: 'efectivo_pesos', name: 'Efectivo en Pesos (COP)', badge: 'Común', icon: '💵', description: 'Paga exacto o pide vuelto al conductor', currencies: ['COP'] },
    { id: 'pago_movil', name: 'Pago Móvil (Bs)', badge: 'Instantáneo', icon: '📱', description: 'Todos los bancos venezolanos (BDV, Banesco, etc.)', currencies: ['VES'] },
    { id: 'efectivo_usd', name: 'Efectivo en Dólares ($)', icon: '💵', description: 'Billetes en buen estado', currencies: ['USD'] },
    { id: 'binance_pay', name: 'Binance Pay (USDT)', badge: '0% Comisión', icon: '🟡', description: 'Sin recargo ni comisiones', currencies: ['USD'] },
    { id: 'transferencia_bancaria', name: 'Transferencia Bancaria', icon: '🏦', description: 'Transferencia nacional en bolívares', currencies: ['VES'] },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Saldo PayPal internacional', currencies: ['USD'] },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Manejo de reconocimiento de voz por micrófono (Web Speech API nativa sin costo de tokens)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz directo. Puedes escribir tu destino con total comodidad.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-VE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript);
    };

    recognition.start();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    // Agregar mensaje del usuario
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Ahora',
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/ai/valet-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            userName: 'Viajero',
            currentTripDraft: { destination, origin, vehicleType: selectedVehicle, currency },
          },
        }),
      });

      const data = await res.json();

      const valetMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'valet',
        text: data.replyText,
        timestamp: 'Ahora',
        actionRequired: data.extractedData?.actionRequired,
        quickSuggestions: data.extractedData?.quickSuggestions,
      };

      setMessages(prev => [...prev, valetMsg]);

      // Avance inteligente en el Wizard
      if (data.extractedData?.destination) {
        setDestination(data.extractedData.destination);
        setStep('vehicle');
      } else if (step === 'destination') {
        setDestination(query);
        setStep('vehicle');
      }

      if (data.extractedData?.vehicleType) {
        setSelectedVehicle(data.extractedData.vehicleType);
        setStep('origin');
      }
    } catch {
      // Fallback local elegante
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'valet',
          text: `¡Entendido! Vamos para "${query}". ¿Qué tipo de unidad prefieres para tu viaje?`,
          timestamp: 'Ahora',
        },
      ]);
      setDestination(query);
      setStep('vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  const getVehiclePriceDisplay = (v: Vehicle) => {
    if (currency === 'COP') return `${v.prices.COP.toLocaleString()} COP`;
    if (currency === 'USD') return `$${v.prices.USD.toFixed(2)}`;
    return `${v.prices.VES.toFixed(2)} Bs.`;
  };

  const currentVehicleObj = vehicles.find(v => v.type === selectedVehicle) || vehicles[1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8FAFC' }}>
      {/* 1. Header Oficial AuriGo */}
      <header
        style={{
          background: '#0F172A',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #FFB800',
        }}
      >
        <AuriGoLogo variant="dark" size={36} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Selector de Moneda Tabular (COP / USD / VES) */}
          <div
            style={{
              background: '#1E293B',
              padding: '4px',
              borderRadius: '9999px',
              display: 'flex',
              gap: '4px',
            }}
          >
            {(['COP', 'USD', 'VES'] as const).map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                style={{
                  background: currency === c ? '#FFB800' : 'transparent',
                  color: currency === c ? '#0F172A' : '#94A3B8',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setStep('destination');
              setDestination('');
              setMessages([
                {
                  id: Date.now().toString(),
                  sender: 'valet',
                  text: "¡Traslado reiniciado! ¿Pa' dónde vamos hoy?",
                  timestamp: 'Ahora',
                  quickSuggestions: ['🏠 Casa', '💼 Trabajo', 'Sambil San Cristóbal'],
                },
              ]);
            }}
            title="Nuevo traslado"
            style={{
              background: '#1E293B',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFB800',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* 2. Área Conversacional / Chat de Traslado */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '14px 18px',
                borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                background: msg.sender === 'user' ? '#0F172A' : '#FFFFFF',
                color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                fontSize: '14.5px',
                lineHeight: 1.45,
              }}
            >
              {msg.sender === 'valet' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Sparkles size={14} color="#FFB800" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>
                    Valet AuriGo
                  </span>
                </div>
              )}
              {msg.text}
            </div>

            {/* Sugerencias Rápidas */}
            {msg.quickSuggestions && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {msg.quickSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '9999px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#0F172A',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748B', fontSize: '13px' }}>
            <div style={{ width: '8px', height: '8px', background: '#FFB800', borderRadius: '50%' }} />
            <span>Valet AuriGo consultando la ruta...</span>
          </div>
        )}

        {/* 3. Componente Wizard Dinámico (Selector de Vehículo, Origen y Pago) */}
        {step !== 'destination' && (
          <div
            className="card-cordial"
            style={{
              padding: '18px',
              marginTop: '10px',
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
            }}
          >
            {/* Destino Seleccionado */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingBottom: '12px',
                borderBottom: '1px solid #F1F5F9',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  background: '#E0F2FE',
                  padding: '8px',
                  borderRadius: '10px',
                  color: '#0284C7',
                }}
              >
                <MapPin size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                  Destino Confirmado
                </span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{destination}</div>
              </div>
            </div>

            {/* Paso 1: Selección de Vehículo */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Elige tu tipo de traslado:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {vehicles.map(v => {
                  const isSelected = selectedVehicle === v.type;
                  return (
                    <div
                      key={v.type}
                      onClick={() => {
                        setSelectedVehicle(v.type);
                        if (step === 'vehicle') setStep('origin');
                      }}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #FFB800' : '1px solid #E2E8F0',
                        background: isSelected ? '#FFFDF5' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px' }}>{v.icon}</span>
                        {v.badge && (
                          <span
                            style={{
                              fontSize: '9px',
                              background: v.type === 'AuriClavellina' ? '#FFE4E6' : '#FEF3C7',
                              color: v.type === 'AuriClavellina' ? '#E11D48' : '#D97706',
                              padding: '2px 6px',
                              borderRadius: '9999px',
                              fontWeight: 700,
                            }}
                          >
                            {v.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '6px', color: '#0F172A' }}>
                        {v.name}
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '14px', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>
                        {getVehiclePriceDisplay(v)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Paso 2: Punto de Recogida (GPS o Personalizado) */}
            <div
              style={{
                background: '#F8FAFC',
                padding: '12px',
                borderRadius: '12px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Navigation size={16} color="#0284C7" />
                <div>
                  <span style={{ fontSize: '10px', color: '#64748B', display: 'block', fontWeight: 600 }}>PUNTO DE RECOGIDA</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{origin}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const custom = prompt('Ingresa tu punto de recogida o referencia:');
                  if (custom) setOrigin(custom);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284C7',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cambiar
              </button>
            </div>

            {/* Paso 3: Método de Pago */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Forma de pago:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {paymentMethods.map(pm => {
                  const isSelected = selectedPayment === pm.id;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => setSelectedPayment(pm.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #FFB800' : '1px solid #E2E8F0',
                        background: isSelected ? '#FFFDF5' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{pm.icon}</span>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{pm.name}</div>
                          <div style={{ fontSize: '10px', color: '#64748B' }}>{pm.description}</div>
                        </div>
                      </div>
                      {pm.badge && (
                        <span style={{ fontSize: '10px', background: '#F1F5F9', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                          {pm.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Botón de Acción Principal (10% Amarillo Aurinegro) */}
            <button
              className="btn-aurigo-cta"
              onClick={() => {
                setStep('confirmed');
                setMessages(prev => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    sender: 'valet',
                    text: `🟡⚫ ¡Listo! Conductor asignado en un ${currentVehicleObj.name}. Llega en 4 minutos a ${origin}. Recuerda verificar la placa al subir. ¡Camine seguro!`,
                    timestamp: 'Ahora',
                  },
                ]);
              }}
            >
              <span>¡Camine! Pedir mi AuriGo ({getVehiclePriceDisplay(currentVehicleObj)})</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Barra Inferior de Entrada (Texto + Micrófono) */}
      <footer
        style={{
          background: '#FFFFFF',
          padding: '12px 16px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <button
          onClick={toggleSpeechRecognition}
          style={{
            background: isRecording ? '#EF4444' : '#F1F5F9',
            color: isRecording ? '#FFFFFF' : '#0F172A',
            border: 'none',
            borderRadius: '12px',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
          title={isRecording ? 'Detener grabación' : 'Hablar por micrófono'}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="¿A dónde te diriges hoy? Escribe o habla..."
          style={{
            flex: 1,
            height: '46px',
            borderRadius: '12px',
            border: '1px solid #CBD5E1',
            padding: '0 16px',
            fontSize: '14px',
            outline: 'none',
          }}
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          style={{
            background: '#0F172A',
            color: '#FFB800',
            border: 'none',
            borderRadius: '12px',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            opacity: inputText.trim() ? 1 : 0.4,
            flexShrink: 0,
          }}
        >
          <Send size={18} />
        </button>
      </footer>
    </div>
  );
}
export default App;
