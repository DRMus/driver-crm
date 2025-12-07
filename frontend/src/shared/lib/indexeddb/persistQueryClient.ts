import { QueryClient } from '@tanstack/react-query';

const QUERY_CACHE_KEY = 'react-query-cache';

/**
 * Сохранить кеш React Query в IndexedDB
 */
export async function persistQueryClient(queryClient: QueryClient): Promise<void> {
  const queryCache = queryClient.getQueryCache();
  const queries = queryCache.getAll();

  const cacheData = queries.map((query) => ({
    queryKey: query.queryKey,
    queryHash: query.queryHash,
    state: query.state,
    dataUpdatedAt: query.state.dataUpdatedAt,
  }));

  // Сохраняем в IndexedDB (используем простой подход через localStorage для начала)
  // В будущем можно использовать отдельную таблицу в IndexedDB
  try {
    localStorage.setItem(QUERY_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to persist query cache:', error);
  }
}

/**
 * Восстановить кеш React Query из IndexedDB
 */
export async function restoreQueryClient(queryClient: QueryClient): Promise<void> {
  try {
    const cacheDataStr = localStorage.getItem(QUERY_CACHE_KEY);
    if (!cacheDataStr) return;

    const cacheData = JSON.parse(cacheDataStr);

    // Восстанавливаем запросы из кеша
    for (const queryData of cacheData) {
      if (queryData.state.data) {
        queryClient.setQueryData(queryData.queryKey, queryData.state.data);
      }
    }
  } catch (error) {
    console.error('Failed to restore query cache:', error);
  }
}

/**
 * Очистить сохраненный кеш
 */
export async function clearPersistedCache(): Promise<void> {
  try {
    localStorage.removeItem(QUERY_CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear persisted cache:', error);
  }
}

