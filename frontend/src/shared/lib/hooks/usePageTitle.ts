import { useLocation } from 'react-router-dom';

/**
 * Хук для получения названия страницы на основе текущего маршрута
 */
export const usePageTitle = (): string => {
  const location = useLocation();
  const pathname = location.pathname;

  // Определяем название страницы на основе пути
  if (pathname === '/' || pathname === '') {
    return 'Автомобили';
  }

  // Ремонты (только детали и редактирование)
  if (pathname.startsWith('/repairs')) {
    if (pathname.includes('/edit')) {
      return 'Редактировать ремонт';
    }
    if (pathname.match(/\/repairs\/[^/]+$/)) {
      return 'Детали ремонта';
    }
    return 'Ремонт';
  }

  // Автомобили
  if (pathname.startsWith('/vehicles')) {
    if (pathname === '/vehicles' || pathname === '/vehicles/') {
      return 'Автомобили';
    }
    // Если есть вложенные маршруты (например, /vehicles/:id/repairs/new)
    if (pathname.match(/\/vehicles\/[^/]+\/repairs\/new$/)) {
      return 'Добавить ремонт';
    }
    if (pathname.includes('/new') && !pathname.includes('/repairs')) {
      return 'Добавить автомобиль';
    }
    if (pathname.includes('/edit')) {
      return 'Редактировать автомобиль';
    }
    if (pathname.match(/\/vehicles\/[^/]+$/)) {
      return 'Детали автомобиля';
    }
    return 'Автомобили';
  }

  // Клиенты (если будут использоваться)
  if (pathname.startsWith('/clients')) {
    if (pathname === '/clients' || pathname === '/clients/') {
      return 'Клиенты';
    }
    if (pathname.includes('/new')) {
      return 'Добавить клиента';
    }
    if (pathname.includes('/edit')) {
      return 'Редактировать клиента';
    }
    if (pathname.match(/\/clients\/[^/]+$/)) {
      return 'Детали клиента';
    }
    return 'Клиенты';
  }

  // Отчеты
  if (pathname.startsWith('/reports')) {
    return 'Отчеты';
  }

  // Календарь
  if (pathname.startsWith('/calendar')) {
    return 'Календарь';
  }

  return 'Driver CRM';
};

