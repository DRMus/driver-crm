import { useEffect } from 'react';
import { syncService } from '../sync';
import { useOfflineStore } from '../store';
// import { db } from '../indexeddb'; // Используется в syncService

/**
 * Хук для управления офлайн-синхронизацией
 */
export const useOfflineSync = () => {
  const { setIsOnline, setLastSyncTime, setPendingMutationsCount } = useOfflineStore();

  useEffect(() => {
    // Обновляем статус онлайн/офлайн
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      setIsOnline(isOnline);

      if (isOnline) {
        // При появлении сети запускаем синхронизацию
        syncService.sync().then((result) => {
          if (result) {
            setLastSyncTime(new Date());
          }
        });
      }
    };

    // Обновляем счетчик ожидающих мутаций
    const updatePendingCount = async () => {
      const pending = await syncService.getPendingMutations();
      setPendingMutationsCount(pending.length);
    };

    // Слушаем события онлайн/офлайн
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Обновляем статус при монтировании
    updateOnlineStatus();
    updatePendingCount();

    // Периодически обновляем счетчик ожидающих мутаций
    const countInterval = setInterval(updatePendingCount, 5000);

    // Запускаем автоматическую синхронизацию
    syncService.startAutoSync(30000); // Каждые 30 секунд

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(countInterval);
      syncService.stopAutoSync();
    };
  }, [setIsOnline, setLastSyncTime, setPendingMutationsCount]);
};

