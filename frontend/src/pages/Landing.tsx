import { useEffect, useState } from 'react';
import { AuriGoLogo } from '../components/AuriGoLogo';
import './landing.css';

const goApp = () => { window.location.href = '/app'; };

const Arrow = () => (
  <svg className="lp-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Landing() {
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'VES'>('COP');

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.lp-reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const prices = {
    COP: { main: '15.000 COP', sub: 'También puedes pagar $3,60 USD o 162,00 Bs.' },
    USD: { main: '$3,60 USD', sub: 'También puedes pagar 15.000 COP o 162,00 Bs.' },
    VES: { main: '162,00 Bs.', sub: 'También puedes pagar 15.000 COP o $3,60 USD' },
  };

  return (
    <div className="lp">
      {/* CABECERA MINIMALISTA Y LIMPIA */}
      <header className="lp-header">
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
        {/* 1. HERO CENTRADO Y SERENO — CERO ADORNOS ARTIFICIALES */}
        <section className="lp-hero lp-container" aria-labelledby="hero-title">
          <h1 id="hero-title" className="lp-display">
            Dile a dónde vas.<br />Nosotros te llevamos.
          </h1>
          <p className="lp-lead">
            AuriGo es la forma más sencilla de pedir un traslado en San Cristóbal.
            Hablas o escribes tu destino, conoces el precio exacto antes de salir y pagas en tu moneda.
          </p>

          <div className="lp-hero-actions">
            <button type="button" className="lp-btn-primary" onClick={goApp}>
              <span>¡Camine! Pedir mi AuriGo</span>
              <Arrow />
            </button>
            <a href="#proceso" className="lp-btn-secondary">
              Ver cómo funciona
            </a>
          </div>

          {/* VISTA PREVIA LIMPIA Y HUMANA DEL CHAT */}
          <div className="lp-showcase" aria-label="Ejemplo de conversación en AuriGo">
            <div className="lp-chat-card">
              <div className="lp-chat-row lp-chat-left">
                <span className="lp-chat-sender">Valet AuriGo</span>
                <p>Hola, ¿pa' dónde vamos hoy?</p>
              </div>

              <div className="lp-chat-row lp-chat-right">
                <p>Llévame al Sambil San Cristóbal</p>
              </div>

              <div className="lp-chat-row lp-chat-left">
                <span className="lp-chat-sender">Valet AuriGo</span>
                <p>Perfecto. Te recogemos en tu ubicación actual en 4 minutos.</p>
              </div>

              <div className="lp-chat-footer">
                <div>
                  <span className="lp-chat-label">Tarifa acordada</span>
                  <strong className="lp-chat-price">{prices[currency].main}</strong>
                  <small className="lp-chat-sub">{prices[currency].sub}</small>
                </div>

                <div className="lp-chat-controls">
                  <div className="lp-cur-pills" role="group" aria-label="Ver tarifa en otra moneda">
                    {(['COP', 'USD', 'VES'] as const).map(c => (
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

        {/* 2. EXPERIENCIA — DISEÑO EDITORIAL DE 3 COLUMNAS LIMPIAS */}
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
            <article className="lp-feature">
              <h3>Por voz o por texto</h3>
              <p>
                Escribe o usa el micrófono como si enviaras un mensaje. Reconocemos urbanizaciones,
                comercios y referencias de toda la ciudad.
              </p>
            </article>

            <article className="lp-feature">
              <h3>Precio claro desde el inicio</h3>
              <p>
                Conoces el valor exacto del viaje antes de confirmarlo, expresado al instante en
                Pesos Colombianos, Dólares o Bolívares.
              </p>
            </article>

            <article className="lp-feature">
              <h3>Conductores de confianza</h3>
              <p>
                Cada socio conductor está registrado y verificado en San Cristóbal. Siempre recibes su
                nombre, vehículo y placa antes de subir.
              </p>
            </article>
          </div>
        </section>

        {/* 3. CÓMO FUNCIONA */}
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
              <li className="lp-step lp-reveal" key={title}>
                <span className="lp-step-num">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. MÉTODOS DE PAGO */}
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
              ].map(([name, detail]) => (
                <li key={name} onClick={goApp}>
                  <div>
                    <strong>{name}</strong>
                    <span>{detail}</span>
                  </div>
                  <Arrow />
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
