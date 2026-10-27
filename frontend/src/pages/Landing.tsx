import { useEffect } from 'react';
import { AuriGoLogo } from '../components/AuriGoLogo';
import './landing.css';

const goApp = () => { window.location.href = '/app'; };

const Arrow = () => (
  <svg className="lp-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const icons = {
  voice: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  ),
  pin: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  wallet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7a2 2 0 0 1 2-2h12v4M4 7v10a2 2 0 0 0 2 2h14V9H6a2 2 0 0 1-2-2Z" /><circle cx="16.5" cy="14" r="1" />
    </svg>
  ),
};

const features = [
  { icon: icons.voice, title: 'Habla o escribe tu destino', text: 'Dile al Valet a dónde vas como si hablaras con un operador de confianza. Reconoce sectores, referencias y tus lugares favoritos.' },
  { icon: icons.pin, title: 'Recogida GPS precisa', text: 'Detectamos tu ubicación al instante o te permitimos elegir otro punto de encuentro con total exactitud.' },
  { icon: icons.wallet, title: 'Tarifa clara multimoneda', text: 'Visualiza el monto exacto en Pesos (COP), Dólares (USD) o Bolívares antes de confirmar tu traslado.' },
];

const steps = [
  ['Indica tu destino', 'Escríbelo o usa el micrófono. El Valet confirma el punto exacto contigo al instante.'],
  ['Elige cómo viajar', 'Selecciona la unidad ideal para tu traslado y consulta la tarifa cerrada sin regateos.'],
  ['Confirma y viaja', 'Recibe los datos de tu conductor verificado y sigue su llegada en tiempo real.'],
];

const payments = ['Pago Móvil Interbancario', 'Transferencia Bancaria', 'Binance Pay (USDT)', 'PayPal', 'Efectivo en Pesos (COP)', 'Efectivo en Dólares (USD)'];

export default function Landing() {
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.lp-reveal').forEach(el => io.observe(el));

    const nav = document.querySelector('.lp-nav');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-wrap lp-nav-in">
          <a href="/" aria-label="AuriGo, inicio"><AuriGoLogo variant="light" size={28} /></a>
          <nav className="lp-links" aria-label="Principal">
            <a href="#ventajas">Ventajas</a>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#pagos">Métodos de pago</a>
          </nav>
          <button className="lp-btn lp-btn-dark" onClick={goApp}>Pedir un traslado <Arrow /></button>
        </div>
      </header>

      <main>
        {/* HERO ESTILO APPLE — Tipografía limpia, sin palabras fragmentadas */}
        <section className="lp-hero lp-wrap" aria-labelledby="hero-title">
          <div className="lp-hero-copy">
            <div className="lp-badge-live">
              <span className="lp-dot-live" />
              <span>San Cristóbal · Táchira</span>
            </div>
            <h1 id="hero-title" className="lp-h1">
              Tu traslado, con solo decir a dónde vas.
            </h1>
            <p className="lp-lead">
              AuriGo transforma la solicitud de tu viaje en una conversación natural.
              Sin formularios complejos ni regateos: indicas tu destino, confirmas la tarifa y viajas seguro.
            </p>
            <div className="lp-actions">
              <button className="lp-btn lp-btn-yellow" onClick={goApp}>¡Camine! Pedir mi AuriGo <Arrow /></button>
              <a className="lp-btn lp-btn-text" href="#como-funciona">Ver cómo funciona</a>
            </div>
          </div>

          <div className="lp-stage" role="img" aria-label="Conversación interactiva con el Valet AuriGo">
            <div className="lp-ambient" />

            <div className="lp-phone">
              <div className="lp-phone-bar">
                <span />
                <i>Valet AuriGo</i>
                <small>En línea</small>
              </div>
              <div className="lp-msg v" style={{ ['--d' as string]: '0.35s' }}>¿Pa' dónde vamos hoy?</div>
              <div className="lp-msg u" style={{ ['--d' as string]: '1.15s' }}>Llévame al Sambil San Cristóbal</div>
              <div className="lp-msg v" style={{ ['--d' as string]: '2.05s' }}>
                ¡Listo! Pasamos por ti en tu ubicación actual. Tarifa cerrada:
              </div>
              <div className="lp-price" style={{ ['--d' as string]: '2.85s' }}>
                <span>15.000 COP</span>
                <small>$3,60 · 162 Bs.</small>
              </div>
              <button className="lp-confirm" onClick={goApp} style={{ ['--d' as string]: '3.55s' }}>
                Confirmar traslado <Arrow />
              </button>
            </div>
          </div>
        </section>

        {/* FRANJA DE CONFIANZA ESTÁTICA Y ELEGANTE (Sin marquesina rápida) */}
        <section className="lp-trust" aria-label="Cobertura y garantías">
          <div className="lp-wrap lp-trust-in">
            <div><strong>San Cristóbal y área metropolitana</strong><span>Barrio Obrero · Sambil · Táriba · La Concordia</span></div>
            <span className="lp-trust-sep" />
            <div><strong>Tarifa cerrada antes de subir</strong><span>En Pesos (COP), Dólares (USD) o Bolívares</span></div>
            <span className="lp-trust-sep" />
            <div><strong>Conductores verificados</strong><span>Atención cordial y seguimiento por GPS</span></div>
          </div>
        </section>

        {/* VENTAJAS */}
        <section id="ventajas" className="lp-section lp-wrap" aria-labelledby="ventajas-title">
          <div className="lp-sec-head lp-reveal">
            <p className="lp-eyebrow">Experiencia sin fricciones</p>
            <h2 id="ventajas-title" className="lp-h2">Pensado para que moverte sea lo más fácil del día.</h2>
          </div>
          <div className="lp-cols">
            {features.map((f, i) => (
              <article
                className="lp-col lp-reveal"
                style={{ ['--d' as string]: `${i * 0.18}s` }}
                key={f.title}
              >
                <div className="lp-ico">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* PASOS */}
        <section id="como-funciona" className="lp-section lp-wrap" aria-labelledby="como-title">
          <div className="lp-sec-head lp-reveal">
            <p className="lp-eyebrow">Proceso directo</p>
            <h2 id="como-title" className="lp-h2">Tres pasos. Menos de un minuto.</h2>
          </div>
          <ol className="lp-steps">
            {steps.map(([t, d], i) => (
              <li className="lp-step lp-reveal" style={{ ['--d' as string]: `${i * 0.16}s` }} key={t}>
                <span className="lp-num">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* MÉTODOS DE PAGO */}
        <section id="pagos" className="lp-section lp-wrap lp-pay" aria-labelledby="pagos-title">
          <div className="lp-reveal">
            <p className="lp-eyebrow">Flexibilidad total</p>
            <h2 id="pagos-title" className="lp-h2">Paga a tu manera.</h2>
            <p className="lp-lead">Conoces el monto exacto en Pesos, Dólares o Bolívares antes de abordar y eliges cómo pagar sin complicaciones.</p>
          </div>
          <ul className="lp-paylist lp-reveal" style={{ ['--d' as string]: '0.18s' }}>
            {payments.map(p => (
              <li key={p} onClick={goApp}>
                <span>{p}</span>
                <Arrow />
              </li>
            ))}
          </ul>
        </section>

        {/* CTA FINAL */}
        <section className="lp-wrap" aria-labelledby="cta-title">
          <div className="lp-cta lp-reveal">
            <div>
              <p className="lp-eyebrow" style={{ color: '#FFB800', marginBottom: 10 }}>La ruta cordial del Táchira</p>
              <h2 id="cta-title">Listo cuando tú lo estés.</h2>
            </div>
            <button className="lp-btn lp-btn-yellow" onClick={goApp}>¡Camine! Pedir mi AuriGo <Arrow /></button>
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
