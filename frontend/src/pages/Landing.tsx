import { useEffect } from 'react';
import { AuriGoLogo } from '../components/AuriGoLogo';
import './landing.css';

const goApp = () => { window.location.href = '/app'; };

export default function Landing() {
  // Animación de aparición al hacer scroll (IntersectionObserver, sin librerías)
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.lp-reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="lp">
      <div className="lp-shell">
        <div className="lp-frame">
          <header className="lp-nav">
            <a href="/" aria-label="AuriGo inicio"><AuriGoLogo variant="light" size={30} /></a>
            <nav className="lp-links" aria-label="Navegación principal">
              <a href="#como-funciona">Cómo funciona</a>
              <a href="#flota">Flota</a>
              <a href="#pagos">Pagos</a>
              <a href="#conductores">Conductores</a>
            </nav>
            <button className="lp-btn lp-btn-dark" onClick={goApp}>Pedir mi AuriGo</button>
            <button className="lp-burger" aria-label="Abrir menú" onClick={goApp}>☰</button>
          </header>

          <main>
            {/* HERO */}
            <section className="lp-hero" aria-labelledby="hero-title">
              <div>
                <span className="lp-pill"><span className="lp-pill-dot">➤</span>Movilidad cordial en San Cristóbal</span>
                <h1 id="hero-title" className="lp-h1">
                  Dile a dónde vas. <em>Nosotros</em> nos encargamos del resto.
                </h1>
                <p className="lp-lead">
                  AuriGo es la app de traslados del Táchira que funciona como hablar con un operador:
                  escribe o dicta tu destino, elige moto o carro y paga en Pesos, Dólares o Pago Móvil.
                  Sin regateos, en minutos.
                </p>
                <div className="lp-actions">
                  <a className="lp-btn lp-btn-ghost" href="#como-funciona">Ver cómo funciona</a>
                  <button className="lp-btn lp-btn-yellow" onClick={goApp}>¡Camine! Pedir mi AuriGo ›</button>
                </div>
              </div>

              <div className="lp-visual" role="img" aria-label="Vista previa del chat de traslados AuriGo">
                <div className="lp-float c"><i>🛵</i><div>Llega en 4 min<span>Placa AB123CD</span></div></div>
                <div className="lp-phone">
                  <div className="lp-phone-notch" />
                  <div className="lp-bubble v"><small>VALET AURIGO</small>¿Pa' dónde vamos hoy, María?</div>
                  <div className="lp-bubble u" style={{ animationDelay: '.4s' }}>Al Sambil San Cristóbal 🎙️</div>
                  <div className="lp-bubble v" style={{ animationDelay: '.8s' }}><small>VALET AURIGO</small>¡Listo! ¿En qué te llevamos?</div>
                  <div className="lp-chips">
                    <div className="lp-chip">🛵 Moto<b>8.000</b></div>
                    <div className="lp-chip on">🚗 Clásico<b>15.000</b></div>
                  </div>
                  <button className="lp-btn lp-btn-yellow" onClick={goApp}>¡Camine! Pedir mi AuriGo</button>
                </div>
                <div className="lp-float a"><i>✓</i><div>Pago Móvil<span>Confirmado al instante</span></div></div>
                <div className="lp-float b"><i>★</i><div>Conductor verificado<span>4.9 · 1.2k viajes</span></div></div>
              </div>
            </section>

            {/* PAGOS */}
            <section id="pagos" aria-label="Métodos de pago aceptados" className="lp-logos">
              <span>Pago Móvil</span><span>Banesco</span><span>BDV</span><span>Binance Pay</span><span>PayPal</span><span>Efectivo COP · USD</span>
            </section>

            {/* PANEL */}
            <section className="lp-center lp-reveal" aria-labelledby="panel-title">
              <span className="lp-pill"><span className="lp-pill-dot">AI</span>Valet inteligente con Google Gemini ›</span>
              <h2 id="panel-title" className="lp-h1">El futuro de la movilidad tachirense, tan simple como conversar</h2>
            </section>
            <div className="lp-stage lp-reveal">
              <div className="lp-dash" aria-hidden="true">
                <div className="lp-side"><div className="on" /><div /><div /><div /></div>
                <div>
                  <strong style={{ fontSize: 14 }}>Panel de traslados</strong>
                  <div style={{ fontSize: 11, color: '#64748B' }}>San Cristóbal · Hoy</div>
                  <div className="lp-kpis">
                    <div className="lp-kpi"><small>Viajes completados</small><strong>1.530</strong></div>
                    <div className="lp-kpi"><small>Tiempo medio de llegada</small><strong>4,2 min</strong></div>
                    <div className="lp-kpi hl"><small>Pagos conciliados</small><strong>98,7%</strong></div>
                  </div>
                  <div className="lp-panels">
                    <div className="lp-panel"><h4>Viajes por categoría</h4><div className="lp-donut"><b>1530</b></div></div>
                    <div className="lp-panel"><h4>Demanda por hora</h4>
                      <div className="lp-bars">{[35, 60, 45, 80, 55, 95, 70, 50].map((h, i) => <div key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} />)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PASOS */}
            <section id="como-funciona" className="lp-steps lp-reveal" aria-labelledby="steps-title">
              <div>
                <h2 id="steps-title" className="lp-h1" style={{ fontSize: 'clamp(28px,3.2vw,40px)' }}>Pide tu traslado en 4 pasos</h2>
                {[
                  ['Dile tu destino', 'Escribe o usa el micrófono. El Valet entiende “llévame a Barrio Obrero”.'],
                  ['Confirma y elige vehículo', 'AuriMoto, AuriClásico, AuriClima o AuriClavellina.'],
                  ['Te buscamos por GPS', 'Usamos tu ubicación actual o el punto que prefieras.'],
                  ['Paga a tu manera', 'Pesos, Dólares, Pago Móvil, Binance, PayPal o efectivo.'],
                ].map(([t, d], i) => (
                  <div className="lp-step" key={t}><b>{i + 1}</b><div><h4>{t}</h4><p>{d}</p></div></div>
                ))}
              </div>
              <div className="lp-offer-wrap">
                <div className="lp-offer">
                  <h3>Tus favoritos, a un toque</h3>
                  <ul><li>🏠 Casa</li><li>💼 Trabajo</li><li>Destinos frecuentes</li></ul>
                  <button className="lp-btn lp-btn-dark" onClick={goApp}>➤ Empezar a viajar</button>
                </div>
              </div>
            </section>

            {/* FLOTA */}
            <section id="flota" className="lp-fleet lp-reveal" aria-label="Categorías de vehículos AuriGo">
              {[
                ['🛵', 'AuriMoto', 'Ágil en las cuestas. Casco e impermeable incluidos.', 'Rápido', ''],
                ['🚗', 'AuriClásico', 'Sedán cómodo hasta 4 pasajeros, sin regateos.', 'Popular', ''],
                ['❄️', 'AuriClima', 'Aire acondicionado garantizado todo el trayecto.', 'A/C', ''],
                ['🌸', 'AuriClavellina', 'Conducido por y para mujeres y niños.', 'Mujeres y niños', 'pink'],
              ].map(([i, n, d, t, c]) => (
                <article className={`lp-car ${c}`} key={n}><div className="ico">{i}</div><h3>{n}</h3><p>{d}</p><span className="tag">{t}</span></article>
              ))}
            </section>

            {/* CTA */}
            <section id="conductores" className="lp-cta" aria-labelledby="cta-title">
              <h2 id="cta-title">¿Pa' dónde vamos hoy? Tu AuriGo está a una frase de distancia.</h2>
              <button className="lp-btn lp-btn-yellow" onClick={goApp}>¡Camine! Pedir mi AuriGo</button>
            </section>
          </main>

          <footer className="lp-foot">
            <span>© {new Date().getFullYear()} AuriGo · San Cristóbal, Táchira</span>
            <span>La ruta cordial</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
