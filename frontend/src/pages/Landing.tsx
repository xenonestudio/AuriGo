import { useEffect, useState, type CSSProperties } from 'react';
import { AuriGoLogo } from '../components/AuriGoLogo';
import './landing.css';

const goApp = () => { window.location.href = '/app'; };

const Arrow = () => (
  <svg className="lp-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CURRENCIES = ['COP', 'USD', 'VES'] as const;
type Currency = (typeof CURRENCIES)[number];

export default function Landing() {
  const [currency, setCurrency] = useState<Currency>('COP');
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.14, rootMargin: '0px 0px -36px 0px' }
    );
    document.querySelectorAll('.lp-reveal').forEach(el => io.observe(el));

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(1, Math.max(0, y / max)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const prices: Record<Currency, { main: string; sub: string }> = {
    COP: { main: '15.000 COP', sub: 'También puedes pagar $3,60 USD o 162,00 Bs.' },
    USD: { main: '$3,60 USD', sub: 'También puedes pagar 15.000 COP o 162,00 Bs.' },
    VES: { main: '162,00 Bs.', sub: 'También puedes pagar 15.000 COP o $3,60 USD' },
  };

  const activeIdx = CURRENCIES.indexOf(currency);

  return (
    <div className="lp">
      {/* LÍNEA SUTIL DE PROGRESO DE LECTURA */}
      <div
        className="lp-progress-bar"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      {/* CABECERA MINIMALISTA CON TRANSICIÓN DE VIDRIO AL HACER SCROLL */}
      <header className={`lp-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="lp-container lp-header-inner">
          <a href="/" aria-label="AuriGo inicio" className="lp-logo-link">
            <AuriGoLogo variant="light" size={26} />
          </a>
          <nav className="lp-nav" aria-label="Navegación principal">
            <a href="#experiencia">Experiencia</a>
            <a href="#proceso">Cómo funciona</a>
            <a href="#pagos">Pagos</a>
          </nav>
          <button type="button" className="lp-btn-top" onClick={goApp}>
            Pedir traslado
          </button>
        </div>
      </header>

      <main>
        {/* 1. HERO CENTRADO Y SERENO CON ENTRADA ESCALONADA */}
        <section className="lp-hero lp-container" aria-labelledby="hero-title">
          <div className="lp-hero-glow" aria-hidden="true" />

          <h1 id="hero-title" className="lp-display lp-enter lp-enter-1">
            Dile a dónde vas.<br />Nosotros te llevamos.
          </h1>
          <p className="lp-lead lp-enter lp-enter-2">
            AuriGo es la forma más sencilla de pedir un traslado en San Cristóbal.
            Hablas o escribes tu destino, conoces el precio exacto antes de salir y pagas en tu moneda.
          </p>

          <div className="lp-hero-actions lp-enter lp-enter-3">
            <button type="button" className="lp-btn-primary" onClick={goApp}>
              <span>¡Camine! Pedir mi AuriGo</span>
              <Arrow />
            </button>
            <a href="#proceso" className="lp-btn-secondary">
              Ver cómo funciona
            </a>
          </div>

          {/* VISTA PREVIA DE LA CONVERSACIÓN CON COREOGRAFÍA DE MENSAJES */}
          <div className="lp-showcase lp-enter lp-enter-4" aria-label="Ejemplo de conversación en AuriGo">
            <div className="lp-chat-card">
              <div className="lp-chat-row lp-chat-left lp-msg lp-msg-1">
                <span className="lp-chat-sender">Valet AuriGo</span>
                <p>Hola, ¿pa' dónde vamos hoy?</p>
              </div>

              <div className="lp-chat-row lp-chat-right lp-msg lp-msg-2">
                <p>Llévame al Sambil San Cristóbal</p>
              </div>

              <div className="lp-chat-row lp-chat-left lp-msg lp-msg-3">
                <span className="lp-chat-sender">Valet AuriGo</span>
                <p>Perfecto. Te recogemos en tu ubicación actual en 4 minutos.</p>
              </div>

              <div className="lp-chat-footer lp-msg lp-msg-4">
                <div key={currency} className="lp-price-morph">
                  <span className="lp-chat-label">Tarifa acordada</span>
                  <strong className="lp-chat-price">{prices[currency].main}</strong>
                  <small className="lp-chat-sub">{prices[currency].sub}</small>
                </div>

                <div className="lp-chat-controls">
                  <div
                    className="lp-cur-pills"
                    role="group"
                    aria-label="Ver tarifa en otra moneda"
                    style={{ '--pill-idx': activeIdx } as CSSProperties}
                  >
                    <span className="lp-cur-thumb" aria-hidden="true" />
                    {CURRENCIES.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCurrency(c)}
                        className={currency === c ? 'on' : ''}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="lp-chat-confirm" onClick={goApp}>
                    <span>Confirmar traslado</span>
                    <Arrow />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. EXPERIENCIA — DISEÑO EDITORIAL DE 3 COLUMNAS CON REVELACIÓN ESCALONADA */}
        <section id="experiencia" className="lp-section lp-container" aria-labelledby="exp-title">
          <div className="lp-sec-intro lp-reveal">
            <h2 id="exp-title" className="lp-h2">
              Todo lo que necesitas, sin lo que estorba.
            </h2>
            <p>
              Eliminamos los mapas confusos y las pantallas interminables para que pedir un viaje tome segundos.
            </p>
          </div>

          <div className="lp-features lp-reveal">
            {[
              [
                'Por voz o por texto',
                'Escribe o usa el micrófono como si enviaras un mensaje. Reconocemos urbanizaciones, comercios y referencias de toda la ciudad.',
              ],
              [
                'Precio claro desde el inicio',
                'Conoces el valor exacto del viaje antes de confirmarlo, expresado al instante en Pesos Colombianos, Dólares o Bolívares.',
              ],
              [
                'Conductores de confianza',
                'Cada socio conductor está registrado y verificado en San Cristóbal. Siempre recibes su nombre, vehículo y placa antes de subir.',
              ],
            ].map(([title, body], idx) => (
              <article
                className="lp-feature lp-reveal"
                style={{ '--delay': `${idx * 120}ms` } as CSSProperties}
                key={title}
              >
                <span className="lp-feature-bar" aria-hidden="true" />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 3. CÓMO FUNCIONA — TRAZO DE LÍNEA PROGRESIVO */}
        <section id="proceso" className="lp-section lp-container" aria-labelledby="proc-title">
          <div className="lp-sec-intro lp-reveal">
            <h2 id="proc-title" className="lp-h2">
              Tres pasos. Menos de un minuto.
            </h2>
          </div>

          <ol className="lp-steps">
            {[
              ['Dinos tu destino', 'Escríbelo, díctalo por micrófono o selecciona con un toque tu casa o trabajo.'],
              ['Elige tu traslado y moneda', 'Selecciona el vehículo que prefieras y revisa la tarifa cerrada en COP, USD o Bs.'],
              ['Confirma y viaja tranquilo', 'Te buscamos en tu ubicación actual por GPS o en el punto de encuentro que indiques.'],
            ].map(([title, desc], i) => (
              <li
                className="lp-step lp-reveal"
                style={{ '--delay': `${i * 110}ms` } as CSSProperties}
                key={title}
              >
                <span className="lp-step-num">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. MÉTODOS DE PAGO — MICRO-INTERACCIÓN EDITORIAL */}
        <section id="pagos" className="lp-section lp-container" aria-labelledby="pay-title">
          <div className="lp-pay-layout">
            <div className="lp-reveal">
              <h2 id="pay-title" className="lp-h2">
                Paga como te resulte más cómodo.
              </h2>
              <p className="lp-pay-copy">
                Aceptamos los medios de pago que usas todos los días en el Táchira, sin recargos ocultos.
              </p>
            </div>

            <ul className="lp-pay-list lp-reveal">
              {[
                ['Pago Móvil', 'Bolívares al instante a cualquier banco nacional'],
                ['Efectivo en Pesos (COP)', 'Moneda de circulación diaria'],
                ['Efectivo en Dólares (USD)', 'Monto exacto acordado en la app'],
                ['Binance Pay', 'Transferencia inmediata en USDT'],
                ['Transferencia Bancaria', 'Bancos nacionales venezolanos'],
                ['PayPal', 'Saldo internacional'],
              ].map(([name, detail], i) => (
                <li
                  key={name}
                  onClick={goApp}
                  className="lp-reveal"
                  style={{ '--delay': `${i * 70}ms` } as CSSProperties}
                >
                  <div>
                    <strong>{name}</strong>
                    <span>{detail}</span>
                  </div>
                  <span className="lp-pay-arrow-wrap" aria-hidden="true">
                    <Arrow />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. LLAMADO FINAL */}
        <section className="lp-container lp-cta-wrap lp-reveal" aria-labelledby="cta-title">
          <div className="lp-cta-banner">
            <div>
              <h2 id="cta-title">¿Listo para tu próximo traslado?</h2>
              <p>Sin descargas pesadas ni registros complicados.</p>
            </div>
            <button type="button" className="lp-btn-primary" onClick={goApp}>
              <span>¡Camine! Pedir mi AuriGo</span>
              <Arrow />
            </button>
          </div>
        </section>
      </main>

      <footer className="lp-footer lp-container">
        <AuriGoLogo variant="light" size={22} />
        <span>© {new Date().getFullYear()} AuriGo · San Cristóbal, Táchira</span>
      </footer>
    </div>
  );
}
