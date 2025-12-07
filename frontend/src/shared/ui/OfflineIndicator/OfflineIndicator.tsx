import { Chip, Tooltip } from '@mui/material';
import { CloudOff, Cloud, Sync } from '@mui/icons-material';
import { useOfflineStore } from '@/shared/lib/store';

export const OfflineIndicator = () => {
  const { isOnline, lastSyncTime, pendingMutationsCount } = useOfflineStore();

  if (isOnline && pendingMutationsCount === 0 && !lastSyncTime) {
    return null; // Не показываем индикатор, если все синхронизировано
  }

  const getSyncStatusText = () => {
    if (!isOnline) {
      return 'Офлайн';
    }
    if (pendingMutationsCount > 0) {
      return `Ожидает синхронизации: ${pendingMutationsCount}`;
    }
    if (lastSyncTime) {
      const minutesAgo = Math.floor((Date.now() - lastSyncTime.getTime()) / 60000);
      if (minutesAgo < 1) return 'Синхронизировано только что';
      if (minutesAgo < 60) return `Синхронизировано ${minutesAgo} мин. назад`;
      const hoursAgo = Math.floor(minutesAgo / 60);
      return `Синхронизировано ${hoursAgo} ч. назад`;
    }
    return 'Синхронизация...';
  };

  return (
    <Tooltip title={getSyncStatusText()}>
      <Chip
        icon={!isOnline ? <CloudOff /> : pendingMutationsCount > 0 ? <Sync /> : <Cloud />}
        label={
          !isOnline
            ? 'Офлайн'
            : pendingMutationsCount > 0
              ? `${pendingMutationsCount}`
              : 'Онлайн'
        }
        color={!isOnline ? 'error' : pendingMutationsCount > 0 ? 'warning' : 'success'}
        size="small"
        sx={{ cursor: 'pointer', ml: 1 }}
      />
    </Tooltip>
  );
};

