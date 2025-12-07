import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const usePWAUpdate = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  const {
    offlineReady: swOfflineReady,
    needRefresh: swNeedRefresh,
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('Service Worker зарегистрирован:', r);
    },
    onRegisterError(error: Error) {
      console.error('Ошибка регистрации Service Worker:', error);
    },
    onNeedRefresh() {
      setNeedRefresh(true);
    },
    onOfflineReady() {
      setOfflineReady(true);
    },
  });

  useEffect(() => {
    setNeedRefresh(swNeedRefresh);
    setOfflineReady(swOfflineReady);
  }, [swNeedRefresh, swOfflineReady]);

  const update = async () => {
    try {
      await updateServiceWorker(true);
      // Не сбрасываем needRefresh сразу, так как обновление может занять время
      // Состояние обновится после перезагрузки страницы
    } catch (error) {
      console.error('Ошибка при обновлении Service Worker:', error);
      throw error;
    }
  };

  return {
    needRefresh,
    offlineReady,
    update,
  };
};

