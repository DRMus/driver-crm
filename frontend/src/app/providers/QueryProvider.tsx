import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { queryClient } from '@/shared/lib/react-query/queryClient';
import { restoreQueryClient } from '@/shared/lib/indexeddb';

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  useEffect(() => {
    // Восстанавливаем кеш из IndexedDB при загрузке приложения
    restoreQueryClient(queryClient);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

