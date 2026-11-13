import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Polices auto-hébergées (licence SIL OFL) : aucune requête vers un service tiers.
import '@fontsource/atkinson-hyperlegible/latin-400.css';
import '@fontsource/atkinson-hyperlegible/latin-700.css';
import '@fontsource-variable/bricolage-grotesque/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/screens.css';
import './styles/missions.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
