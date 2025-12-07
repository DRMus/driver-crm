import { useEffect, useState } from 'react';
import {
  Snackbar,
  Alert,
  Button,
  Box,
} from '@mui/material';
import { usePWAInstall } from '@/shared/lib/pwa';

export const InstallPrompt = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Показываем промпт только если приложение можно установить и пользователь еще не отклонил
    if (isInstallable && !isInstalled && !dismissed) {
      // Задержка перед показом, чтобы не мешать пользователю
      const timer = setTimeout(() => {
        setOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, dismissed]);

  const handleInstall = async () => {
    const installed = await install();
    if (installed) {
      setOpen(false);
    }
  };

  const handleDismiss = () => {
    setOpen(false);
    setDismissed(true);
    // Сохраняем в localStorage, чтобы не показывать снова
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  useEffect(() => {
    // Проверяем, был ли промпт отклонен ранее
    const wasDismissed = localStorage.getItem('pwa-install-dismissed');
    if (wasDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={handleDismiss}
    >
      <Alert
        severity="info"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" size="small" onClick={handleInstall}>
              Установить
            </Button>
            <Button color="inherit" size="small" onClick={handleDismiss}>
              Позже
            </Button>
          </Box>
        }
        sx={{ width: '100%' }}
      >
        Установите приложение для быстрого доступа
      </Alert>
    </Snackbar>
  );
};

