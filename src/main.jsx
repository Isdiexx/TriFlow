import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.jsx'

// Sentry: solo en producción (triflow.cl)
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    environment: 'production',
    // Captura 20% de transacciones para no exceder free tier
    tracesSampleRate: 0.2,
    // No enviar en dev
    enabled: !!import.meta.env.VITE_SENTRY_DSN,
    // Ignora errores de red y extensiones del browser
    ignoreErrors: [
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      'ResizeObserver loop',
      /^chrome-extension/,
    ],
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={
      <div style={{padding:40,textAlign:'center',fontFamily:"'DM Sans',sans-serif"}}>
        <div style={{fontSize:32,marginBottom:16}}>Algo salió mal</div>
        <p style={{color:'#666',marginBottom:20}}>Ha ocurrido un error inesperado. Intenta recargar la página.</p>
        <button onClick={()=>window.location.reload()} style={{padding:'12px 24px',borderRadius:99,background:'#7C9E87',border:'none',color:'#fff',fontSize:14,cursor:'pointer'}}>Recargar</button>
      </div>
    }>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
)
