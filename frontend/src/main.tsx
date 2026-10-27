import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Enrutado mínimo sin dependencias: "/" landing pública (SEO), "/app" Web App de traslados
const isApp = window.location.pathname.startsWith('/app');
const Page = isApp ? lazy(() => import('./App.tsx')) : lazy(() => import('./pages/Landing.tsx'));
if (!isApp) document.body.classList.add('is-landing');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  </StrictMode>
);
