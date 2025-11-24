import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { registerSW } from 'virtual:pwa-register';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const updateSW = registerSW({
  onRegistered() {},
  onNeedRefresh() { console.info('Nova versão disponível. Atualize.'); },
  onOfflineReady() { console.info('App pronto para uso offline.'); }
});
