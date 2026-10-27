import { useEffect, useRef } from 'react';
import { AuriGoLogo } from '../components/AuriGoLogo';
import './landing.css';

const goApp = () => { window.location.href = '/app'; };

const Arrow = () => (
  <svg className="lp-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const icons = {
  voice: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  ),
  pin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  wallet: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7a2 2 0 0 1 2-2h12v4M4 7v10a2 2 0 0 0 2 2h14V9H6a2 2 0 0 1-2-2Z" /><circle cx="16.5" cy="14" r="1" />
    </svg>
  ),
};

const features = [
  { icon: icons.voice, title: 'Habla o escribe', text: 'Dile al Valet a dónde vas, como lo harías con un operador. Entiende lugares, referencias y tus sitios frecuentes.' },
  { icon: icons.pin, title: 'Recogida precisa', text: 'Usamos tu ubicación actual o el punto que indiques. Siempre sabrás quién llega y en cuánto tiempo.' },
  { icon: icons.wallet, title: 'Paga como prefieras', text: 'Precio claro antes de pedir, en Pesos, Dólares o Bolívares, con los medios de pago que ya usas.' },
];

const steps = [
  ['Indica tu destino', 'Escríbelo o díctalo. Confirmamos el lugar contigo antes de continuar.'],
  ['Elige tu traslado', 'Selecciona el tipo de vehículo y revisa el precio final en la moneda que quieras.'],
  ['Confirma y viaja', 'Te asignamos un conductor verificado y sigues su llegada en tiempo real.'],
];

const payments = ['Pago Móvil', 'Transferencia bancaria', 'Binance Pay', 'PayPal', 'Efectivo en COP', 'Efectivo en USD'];

export default function Landing() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Aparición progresiva al hacer scroll
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.lp-reveal').forEach(el => io.observe(el));

    // Resplandor sutil que sigue al cursor en el hero
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.current?.style.setProperty('--x', `${e.clientX}px`);
        glow.current?.style.setProperty('--y', `${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove', move, { passive: true });

    // Barra de navegación con borde al hacer scroll
    const nav = document.querySelector('.lp-nav');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const headline = 'Tu traslado, con solo decir a dónde vas.'.split(' ');

  return (
    <div className="lp">
      <div className="lp-glow" ref={glow} aria-hidden="true" />

      <header className="lp-nav">
        <div className="lp-wrap lp-nav-in">
          <a href="/" aria-label="AuriGo, inicio"><AuriGoLogo variant="light" size={28} /></a>
          <nav className="lp-links" aria-label="Principal">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#ventajas">Ventajas</a>
            <a href="#pagos">Pagos</a>
          </nav>
          <button className="lp-btn lp-btn-dark" onClick={goApp}>Pedir un traslado</button>
        </div>
      </header>

      <main>
        <section className="lp-hero lp-wrap" aria-labelledby="hero-title">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow">San Cristóbal · Táchira</p>
            <h1 id="hero-title" className="lp-h1">
              {headline.map((w, i) => (
                <span className="lp-word" key={i} style={{ ['--i' as string]: i }}>{w}&nbsp;</span>
              ))}
            </h1>
            <p className="lp-lead">
              AuriGo convierte pedir un traslado en una conversación. Sin formularios,
              sin regateos: dices tu destino, confirmas el precio y listo.
            </p>
            <div className="lp-actions">
              <button className="lp-btn lp-btn-yellow" onClick={goApp}>Pedir mi AuriGo <Arrow /></button>
              <a className="lp-btn lp-btn-text" href="#como-funciona">Cómo funciona</a>
            </div>
          </div>

          <div className="lp-stage" role="img" aria-label="Conversación de ejemplo con el asistente de AuriGo">
            <div className="lp-phone">
              <div className="lp-phone-bar"><span /><i>Valet AuriGo</i></div>
              <div className="lp-msg v" style={{ ['--d' as string]: '0.9s' }}>¿A dónde vamos hoy?</div>
              <div className="lp-msg u" style={{ ['--d' as string]: '1.9s' }}>Al Sambil San Cristóbal</div>
              <div className="lp-msg v" style={{ ['--d' as string]: '2.9s' }}>Perfecto. Te recogemos en tu ubicación actual. Total estimado:</div>
              <div className="lp-price" style={{ ['--d' as string]: '3.7s' }}>
                <span>15.000 COP</span><small>$3,60 · 162 Bs.</small>
              </div>
              <div className="lp-confirm" style={{ ['--d' as string]: '4.3s' }}>Confirmar traslado</div>
            </div>
          </div>
        </section>

        <section id="ventajas" className="lp-section lp-wrap" aria-labelledby="ventajas-title">
          <h2 id="ventajas-title" className="lp-h2 lp-reveal">Pensado para que moverte sea lo más fácil del día.</h2>
          <div className="lp-cols">
            {features.map((f, i) => (
              <article className="lp-col lp-reveal" style={{ ['--d' as string]: `${i * 0.1}s` }} key={f.title}>
                <div className="lp-ico">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="lp-section lp-wrap" aria-labelledby="como-title">
          <h2 id="como-title" className="lp-h2 lp-reveal">Tres pasos. Menos de un minuto.</h2>
          <ol className="lp-steps">
            {steps.map(([t, d], i) => (
              <li className="lp-step lp-reveal" style={{ ['--d' as string]: `${i * 0.1}s` }} key={t}>
                <span className="lp-num">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="pagos" className="lp-section lp-wrap lp-pay" aria-labelledby="pagos-title">
          <div className="lp-reveal">
            <h2 id="pagos-title" className="lp-h2">Paga a tu manera.</h2>
            <p className="lp-lead">Ves el precio en Pesos, Dólares o Bolívares y eliges cómo pagar. Sin sorpresas al llegar.</p>
          </div>
          <ul className="lp-paylist lp-reveal" style={{ ['--d' as string]: '0.1s' }}>
            {payments.map(p => <li key={p}><span>{p}</span><Arrow /></li>)}
          </ul>
        </section>

        <section className="lp-wrap" aria-labelledby="cta-title">
          <div className="lp-cta lp-reveal">
            <h2 id="cta-title">Listo cuando tú lo estés.</h2>
            <button className="lp-btn lp-btn-yellow" onClick={goApp}>Pedir mi AuriGo <Arrow /></button>
          </div>
        </section>
      </main>

      <footer className="lp-foot lp-wrap">
        <AuriGoLogo variant="light" size={22} />
        <span>© {new Date().getFullYear()} AuriGo · San Cristóbal, Táchira</span>
      </footer>
    </div>
  );
}
