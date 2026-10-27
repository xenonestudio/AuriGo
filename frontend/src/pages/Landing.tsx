import { useEffect, useState } from 'react';
import { AuriGoLogo } from '../components/AuriGoLogo';
import './landing.css';

const goApp = () => { window.location.href = '/app'; };

const ArrowUpRight = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VOICE_PROMPTS = [
  'Llévame al Sambil San Cristóbal',
  'Voy a Barrio Obrero, carrera 19',
  'Recógeme en el Hospital Central',
  'Traslado hacia Táriba por la autopista',
];

export default function Landing() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [activeCur, setActiveCur] = useState<'COP' | 'USD' | 'VES'>('COP');

  useEffect(() => {
    // 1. Revelado progresivo con desenfoque óptico (Blur-to-Sharp)
    const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.14, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.lp-reveal').forEach(el => io.observe(el));

    // 2. Rotación pausada de ejemplos de voz en la tarjeta Bento (cada 4.2s)
    const promptTimer = setInterval(() => {
      setPromptIdx(i => (i + 1) % VOICE_PROMPTS.length);
    }, 4200);

    // 3. Alternancia suave de moneda en la tarjeta Bento (cada 3.6s)
    const curList: ('COP' | 'USD' | 'VES')[] = ['COP', 'USD', 'VES'];
    let cIdx = 0;
    const curTimer = setInterval(() => {
      cIdx = (cIdx + 1) % curList.length;
      setActiveCur(curList[cIdx]);
    }, 3600);

    return () => {
      io.disconnect();
      clearInterval(promptTimer);
      clearInterval(curTimer);
    };
  }, []);

  const priceMap = {
    COP: { amount: '15.000 COP', sub: 'Efectivo en Pesos · Tarifa cerrada' },
    USD: { amount: '$3.60 USD', sub: 'Efectivo, Binance Pay o PayPal' },
    VES: { amount: '162,00 Bs.', sub: 'Pago Móvil o Transferencia al instante' },
  };

  return (
    <div className="lp">
      {/* 1. NAVBAR "FLUID ISLAND" DESPRENDIDA DEL BORDE SUPERIOR */}
      <div className="lp-island-wrap">
        <header className="lp-island">
          <a href="/" aria-label="AuriGo, inicio" className="lp-brand">
            <AuriGoLogo variant="light" size={26} />
          </a>
          <nav className="lp-links" aria-label="Navegación principal">
            <a href="#arquitectura">Experiencia</a>
            <a href="#proceso">Proceso</a>
            <a href="#pagos">Pagos</a>
          </nav>
          <button className="lp-cta-pill lp-cta-dark" onClick={goApp}>
            <span>Pedir traslado</span>
            <span className="lp-cta-icon"><ArrowUpRight /></span>
          </button>
        </header>
      </div>

      <main>
        {/* 2. HERO CON ARQUITECTURA DOUBLE-BEZEL (DOPPELRAND) */}
        <section className="lp-hero lp-wrap" aria-labelledby="hero-title">
          <div className="lp-hero-copy">
            <div className="lp-eyebrow-pill">
              <span className="lp-dot-live" />
              <span>SAN CRISTÓBAL · ESTADO TÁCHIRA</span>
            </div>
            <h1 id="hero-title" className="lp-h1">
              Tu traslado, con solo decir a dónde vas.
            </h1>
            <p className="lp-lead">
              AuriGo reemplaza los formularios interminables y el regateo por una conversación directa.
              Hablas o escribes tu destino, conoces el precio exacto en tu moneda y viajas con conductores verificados.
            </p>
            <div className="lp-actions">
              <button className="lp-cta-pill lp-cta-yellow" onClick={goApp}>
                <span>¡Camine! Pedir mi AuriGo</span>
                <span className="lp-cta-icon"><ArrowUpRight /></span>
              </button>
              <a className="lp-link-quiet" href="#proceso">
                <span>Cómo funciona</span>
                <ArrowUpRight />
              </a>
            </div>
          </div>

          <div className="lp-stage" role="img" aria-label="Vista previa del asistente Valet AuriGo">
            <div className="lp-ambient-glow" />
            {/* Double-Bezel Hardware Frame */}
            <div className="lp-bezel-outer lp-phone-shell">
              <div className="lp-bezel-inner lp-phone-core">
                <div className="lp-phone-top">
                  <div className="lp-phone-status">
                    <span className="lp-dot-live" />
                    <strong>Valet AuriGo</strong>
                  </div>
                  <span className="lp-phone-tag">Respuesta inmediata</span>
                </div>

                <div className="lp-chat-stream">
                  <div className="lp-bubble v" style={{ ['--d' as string]: '0.3s' }}>
                    ¿Pa' dónde vamos hoy?
                  </div>
                  <div className="lp-bubble u" style={{ ['--d' as string]: '1.0s' }}>
                    Llévame al Sambil San Cristóbal
                  </div>
                  <div className="lp-bubble v" style={{ ['--d' as string]: '1.7s' }}>
                    Ubicación confirmada por GPS. Tu tarifa cerrada es:
                  </div>
                </div>

                <div className="lp-quote-box" style={{ ['--d' as string]: '2.3s' }}>
                  <div>
                    <small>TOTAL DEL TRASLADO</small>
                    <strong>15.000 COP</strong>
                  </div>
                  <div className="lp-quote-equiv">
                    <span>$3,60 USD</span>
                    <span>162,00 Bs.</span>
                  </div>
                </div>

                <button className="lp-phone-cta" onClick={goApp} style={{ ['--d' as string]: '2.8s' }}>
                  <span>Confirmar unidad</span>
                  <ArrowUpRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. BENTO GRID 2.0 ASIMÉTRICO CON MICRO-INTERACCIONES VIVAS */}
        <section id="arquitectura" className="lp-section lp-wrap" aria-labelledby="bento-title">
          <div className="lp-sec-head lp-reveal">
            <span className="lp-eyebrow">DISEÑADO AL DETALLE</span>
            <h2 id="bento-title" className="lp-h2">
              Tecnología silenciosa. Hospitalidad tachirense.
            </h2>
          </div>

          <div className="lp-bento">
            {/* Tarjeta 1 (Ancha 7 col): Comando conversacional en vivo */}
            <article className="lp-bezel-outer lp-bento-span7 lp-reveal">
              <div className="lp-bezel-inner lp-bento-card">
                <div className="lp-bento-visual">
                  <div className="lp-cmd-bar">
                    <span className="lp-mic-wave" aria-hidden="true">
                      <i /><i /><i /><i />
                    </span>
                    <span className="lp-cmd-text" key={promptIdx}>
                      “{VOICE_PROMPTS[promptIdx]}”
                    </span>
                    <span className="lp-cmd-badge">Voz / Texto</span>
                  </div>
                  <div className="lp-places-row">
                    <span className="lp-place-chip">Casa · Barrio Obrero</span>
                    <span className="lp-place-chip">Trabajo · Centro</span>
                    <span className="lp-place-chip">Sambil</span>
                  </div>
                </div>
                <div className="lp-bento-meta">
                  <h3>Comprende cómo hablas</h3>
                  <p>
                    No necesitas escribir direcciones exactas con código postal. Menciona puntos de referencia,
                    urbanizaciones o elige tus lugares frecuentes con un solo toque.
                  </p>
                </div>
              </div>
            </article>

            {/* Tarjeta 2 (5 col): Conmutador Multimoneda en tiempo real */}
            <article className="lp-bezel-outer lp-bento-span5 lp-reveal" style={{ ['--d' as string]: '0.12s' }}>
              <div className="lp-bezel-inner lp-bento-card">
                <div className="lp-bento-visual">
                  <div className="lp-cur-switcher" role="tablist" aria-label="Monedas soportadas">
                    {(['COP', 'USD', 'VES'] as const).map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setActiveCur(c)}
                        className={`lp-cur-tab ${activeCur === c ? 'on' : ''}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="lp-cur-display" key={activeCur}>
                    <strong>{priceMap[activeCur].amount}</strong>
                    <span>{priceMap[activeCur].sub}</span>
                  </div>
                </div>
                <div className="lp-bento-meta">
                  <h3>Triple moneda sin fricciones</h3>
                  <p>
                    Alterna entre Pesos Colombianos, Dólares y Bolívares al instante. Cero confusiones con el cambio al llegar.
                  </p>
                </div>
              </div>
            </article>

            {/* Tarjeta 3 (5 col): Trazado GPS sobre las cuestas */}
            <article className="lp-bezel-outer lp-bento-span5 lp-reveal">
              <div className="lp-bezel-inner lp-bento-card">
                <div className="lp-bento-visual lp-map-stage">
                  <svg className="lp-route-svg" viewBox="0 0 320 110" fill="none" aria-hidden="true">
                    <path
                      d="M20 88 C 85 88, 95 26, 165 42 C 225 55, 240 18, 298 22"
                      stroke="#E2E8F0"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      className="lp-route-line"
                      d="M20 88 C 85 88, 95 26, 165 42 C 225 55, 240 18, 298 22"
                      stroke="#0284C7"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <circle cx="20" cy="88" r="6" fill="#0F172A" />
                    <circle cx="298" cy="22" r="7" fill="#FFB800" stroke="#0F172A" strokeWidth="2.5" />
                  </svg>
                  <div className="lp-route-caption">
                    <span>Punto de recogida GPS</span>
                    <strong>Llegada estimada: 4 min</strong>
                  </div>
                </div>
                <div className="lp-bento-meta">
                  <h3>Precisión en cada cuesta</h3>
                  <p>
                    Te recogemos exactamente donde estás mediante GPS o en el punto de referencia que indiques antes de salir.
                  </p>
                </div>
              </div>
            </article>

            {/* Tarjeta 4 (7 col): Seguridad y verificación en sede */}
            <article className="lp-bezel-outer lp-bento-span7 lp-reveal" style={{ ['--d' as string]: '0.12s' }}>
              <div className="lp-bezel-inner lp-bento-card">
                <div className="lp-bento-visual">
                  <div className="lp-driver-card">
                    <div className="lp-driver-avatar">CG</div>
                    <div className="lp-driver-info">
                      <strong>Socio Conductor Verificado</strong>
                      <span>Inspección física · Placa visible · Ruta monitoreada</span>
                    </div>
                    <span className="lp-verified-pill">Verificado</span>
                  </div>
                </div>
                <div className="lp-bento-meta">
                  <h3>La palabra empeñada cuenta</h3>
                  <p>
                    Cada unidad y conductor pasa por revisión presencial en San Cristóbal. Siempre conoces nombre, vehículo y placa antes de abordar.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* 4. PROCESO EDITORIAL DE 3 PASOS */}
        <section id="proceso" className="lp-section lp-wrap" aria-labelledby="como-title">
          <div className="lp-sec-head lp-reveal">
            <span className="lp-eyebrow">PROCESO DIRECTO</span>
            <h2 id="como-title" className="lp-h2">Tres pasos. Menos de un minuto.</h2>
          </div>
          <ol className="lp-steps">
            {[
              ['Indica tu destino', 'Escríbelo o usa el micrófono. El Valet confirma el lugar exacto contigo al instante.'],
              ['Revisa tu tarifa cerrada', 'Elige la modalidad de traslado que necesitas y visualiza el monto en COP, USD o Bs.'],
              ['Confirma y aborda seguro', 'Recibe los datos de tu conductor verificado y sigue su llegada en tiempo real.'],
            ].map(([t, d], i) => (
              <li className="lp-step lp-reveal" style={{ ['--d' as string]: `${i * 0.14}s` }} key={t}>
                <span className="lp-num">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 5. MÉTODOS DE PAGO CON DOUBLE-BEZEL */}
        <section id="pagos" className="lp-section lp-wrap lp-pay-grid" aria-labelledby="pagos-title">
          <div className="lp-reveal">
            <span className="lp-eyebrow">FLEXIBILIDAD REGIONAL</span>
            <h2 id="pagos-title" className="lp-h2">Paga a tu manera.</h2>
            <p className="lp-lead">
              Adaptado a la realidad comercial del Táchira. Sin recargos ocultos ni discusiones por el vuelto.
            </p>
          </div>

          <div className="lp-bezel-outer lp-reveal" style={{ ['--d' as string]: '0.14s' }}>
            <ul className="lp-bezel-inner lp-paylist">
              {[
                ['Pago Móvil Interbancario', 'Bolívares (VES) · Confirmación inmediata'],
                ['Efectivo en Pesos (COP)', 'Moneda corriente en todo el estado'],
                ['Efectivo en Dólares (USD)', 'Tarifa exacta sin regateos'],
                ['Binance Pay (USDT)', 'Transferencia cripto sin comisión'],
                ['Transferencia Bancaria', 'Bancos nacionales venezolanos'],
                ['PayPal', 'Pagos digitales internacionales'],
              ].map(([name, desc]) => (
                <li key={name} onClick={goApp}>
                  <div>
                    <strong>{name}</strong>
                    <span>{desc}</span>
                  </div>
                  <span className="lp-row-arrow"><ArrowUpRight /></span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 6. CTA FINAL EN DOUBLE-BEZEL OSCURO */}
        <section className="lp-wrap lp-cta-sec" aria-labelledby="cta-title">
          <div className="lp-bezel-outer lp-cta-outer lp-reveal">
            <div className="lp-cta">
              <div className="lp-cta-copy">
                <span className="lp-eyebrow" style={{ color: '#FFB800' }}>LA RUTA CORDIAL DEL TÁCHIRA</span>
                <h2 id="cta-title">Listo cuando tú lo estés.</h2>
              </div>
              <button className="lp-cta-pill lp-cta-yellow" onClick={goApp}>
                <span>¡Camine! Pedir mi AuriGo</span>
                <span className="lp-cta-icon"><ArrowUpRight /></span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-foot lp-wrap">
        <AuriGoLogo variant="light" size={24} />
        <span>© {new Date().getFullYear()} AuriGo · San Cristóbal, Estado Táchira</span>
      </footer>
    </div>
  );
}
