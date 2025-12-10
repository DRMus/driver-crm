import { RouterProvider } from 'react-router-dom';
import { router } from './router.config';

// Получаем base path из переменной окружения
const basePath = import.meta.env.VITE_BASE_PATH || '';

export const AppRouter = () => {
  return <RouterProvider router={router} basename={basePath} />;
};

