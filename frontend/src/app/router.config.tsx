import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/widgets/layout";
// import { DashboardPage } from '@/pages/dashboard'; // Временно скрыто
import {
  VehiclesListPage,
  VehicleDetailPage,
  CreateVehiclePage,
} from "@/pages/vehicles";
import { RepairDetailPage, CreateRepairPage } from "@/pages/repairs";
import { ReportsPage } from "@/pages/reports";
import { CalendarPage } from "@/pages/calendar";

// Получаем base path из переменной окружения
const basePath = import.meta.env.VITE_BASE_PATH || "";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <VehiclesListPage />,
        },
        // Автомобили
        {
          path: "vehicles",
          children: [
            {
              index: true,
              element: <VehiclesListPage />,
            },
            {
              path: "new",
              element: <CreateVehiclePage />,
            },
            {
              path: ":id",
              element: <VehicleDetailPage />,
            },
            {
              path: ":id/edit",
              element: <CreateVehiclePage />,
            },
            {
              path: ":id/repairs/new",
              element: <CreateRepairPage />,
            },
          ],
        },
        // Ремонты (только детали и редактирование)
        {
          path: "repairs",
          children: [
            {
              path: ":id",
              element: <RepairDetailPage />,
            },
            {
              path: ":id/edit",
              element: <CreateRepairPage />,
            },
          ],
        },
        // Отчеты
        {
          path: "reports",
          element: <ReportsPage />,
        },
        // Календарь
        {
          path: "calendar",
          element: <CalendarPage />,
        },
      ],
    },
  ],
  { basename: basePath }
);

