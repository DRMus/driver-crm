import { useState, useEffect } from 'react';
import { apiClient } from '@/shared/api/axios';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем поддержку push-уведомлений
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
      fetchPublicKey();
    }
  }, []);

  const fetchPublicKey = async () => {
    try {
      const response = await apiClient.get<{ publicKey: string }>('/notifications/public-key');
      setPublicKey(response.data.publicKey);
    } catch (error) {
      console.error('Ошибка получения публичного ключа:', error);
    }
  };

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Ошибка проверки подписки:', error);
    }
  };

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported || !publicKey) {
      console.error('Push-уведомления не поддерживаются или ключ не получен');
      return false;
    }

    try {
      // Запрашиваем разрешение
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Разрешение на уведомления не предоставлено');
        return false;
      }

      // Регистрируем Service Worker
      const registration = await navigator.serviceWorker.ready;

      // Создаем подписку
      const keyArray = urlBase64ToUint8Array(publicKey);
      // Создаем новый ArrayBuffer для правильного типа
      const keyBuffer = new Uint8Array(keyArray).buffer;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyBuffer,
      });

      // Отправляем подписку на сервер
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
        },
      };

      await apiClient.post('/notifications/subscribe', subscriptionData);
      setIsSubscribed(true);
      return true;
    } catch (error) {
      console.error('Ошибка подписки на push-уведомления:', error);
      return false;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await apiClient.delete(`/notifications/unsubscribe/${encodeURIComponent(subscription.endpoint)}`);
        setIsSubscribed(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка отписки от push-уведомлений:', error);
      return false;
    }
  };

  return {
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe,
  };
};

// Вспомогательные функции
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

