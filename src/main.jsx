import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/jost/latin-300.css';
import '@fontsource/jost/latin-400.css';
import '@fontsource/jost/latin-500.css';
import '@fontsource/jost/latin-400-italic.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/pages.css';
import './styles/overlays.css';
import App from './App';
import { startSite } from './lib/catalogue';

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Built pages arrive already rendered (scripts/prerender.mjs): attach to that HTML instead of redrawing it.
if (container.hasChildNodes()) ReactDOM.hydrateRoot(container, app);
else ReactDOM.createRoot(container).render(app);

// Then today's menu and prices: the copy saved in this browser at once, then the live data from the billing app
startSite();
