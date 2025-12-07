import { useEffect, useState } from 'react';
import {
  Snackbar,
  Alert,
  Button,
  Box,
} from '@mui/material';
import { usePushNotifications } from '@/shared/lib/pwa';

const PUSH_DISMISSED_KEY = 'pwa-push-dismissed';

export const PushNotificationPrompt = () => {
  const { isSupported, isSubscribed, subscribe } = usePushNotifications();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Проверяем, было ли уведомление отклонено ранее
    const wasDismissed = localStorage.getItem(PUSH_DISMISSED_KEY);
    if (wasDismissed === 'true') {
      setDismissed(true);
      return;
    }

    // Показываем промпт только если:
    // 1. Push-уведомления поддерживаются
    // 2. Пользователь еще не подписан
    // 3. Пользователь еще не отклонил промпт
    if (isSupported && !isSubscribed && !dismissed) {
      // Задержка перед показом, чтобы не мешать пользователю
      const timer = setTimeout(() => {
        setOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, isSubscribed, dismissed]);

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      setOpen(false);
    }
  };

  const handleDismiss = () => {
    setOpen(false);
    setDismissed(true);
    localStorage.setItem(PUSH_DISMISSED_KEY, 'true');
  };

  if (!isSupported || isSubscribed || dismissed) {
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
            <Button color="inherit" size="small" onClick={handleSubscribe}>
              Включить
            </Button>
            <Button color="inherit" size="small" onClick={handleDismiss}>
              Позже
            </Button>
          </Box>
        }
        sx={{ width: '100%' }}
      >
        Включите push-уведомления для получения напоминаний
      </Alert>
    </Snackbar>
  );
};

