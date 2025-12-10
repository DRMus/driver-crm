import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Регистрация Service Worker для PWA
if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      // Можно показать уведомление о доступном обновлении
      console.log('Доступно обновление PWA')
    },
    onOfflineReady() {
      console.log('PWA готов к работе офлайн')
    },
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

