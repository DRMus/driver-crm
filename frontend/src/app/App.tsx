import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppRouter } from './AppRouter';
import { useOfflineSync } from '@/shared/lib/hooks';
import { InstallPrompt, PushNotificationPrompt } from '@/widgets/pwa';

function AppContent() {
  // Инициализируем офлайн-синхронизацию
  useOfflineSync();

  return (
    <>
      <AppRouter />
      <InstallPrompt />
      <PushNotificationPrompt />
    </>
  );
}

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;

