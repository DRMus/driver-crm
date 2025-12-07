// Background Sync для синхронизации данных
// Этот файл будет включен в Service Worker через Workbox

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Получаем все pending mutations из IndexedDB
    const db = await openIndexedDB();
    const mutations = await getAllPendingMutations(db);
    
    if (mutations.length === 0) {
      return;
    }

    // Отправляем на сервер
    const response = await fetch('/api/sync/mutations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mutations }),
    });

    if (response.ok) {
      const result = await response.json();
      // Обрабатываем результат синхронизации
      await processSyncResult(db, result);
    }
  } catch (error) {
    console.error('Ошибка синхронизации в Background Sync:', error);
    throw error; // Повторная попытка будет автоматически
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('driver-crm-db', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllPendingMutations(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingMutations'], 'readonly');
    const store = transaction.objectStore('pendingMutations');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function processSyncResult(db, result) {
  // Удаляем успешно синхронизированные мутации
  const transaction = db.transaction(['pendingMutations'], 'readwrite');
  const store = transaction.objectStore('pendingMutations');
  
  for (const syncResult of result.results) {
    if (syncResult.success && !syncResult.conflict) {
      await new Promise((resolve, reject) => {
        const deleteRequest = store.delete(syncResult.id);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      });
    }
  }
}

