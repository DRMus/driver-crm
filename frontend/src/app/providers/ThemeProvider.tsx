import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  CssBaseline,
  responsiveFontSizes,
} from '@mui/material';
import { ReactNode } from 'react';

// Базовая тема с mobile-first подходом
let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e3a8a',      // Глубокий синий (доверие, профессионализм)
      light: '#3b82f6',     // Яркий синий
      dark: '#1e40af',      // Темно-синий
    },
    secondary: {
      main: '#64748b',      // Сланцево-серый (нейтральность)
      light: '#94a3b8',     // Светло-серый
      dark: '#475569',      // Темно-серый
    },
    background: {
      default: '#f8fafc',   // Очень светло-серый
      paper: '#ffffff',     // Белый
    },
    error: {
      main: '#dc2626',      // Красный для ошибок/отмененных
    },
    warning: {
      main: '#f59e0b',      // Янтарный для предупреждений
    },
    success: {
      main: '#10b981',      // Зеленый для завершенных
    },
    info: {
      main: '#3b82f6',      // Синий для информации
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    // Mobile-first типографика
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  // Mobile-first breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  // Компоненты с mobile-first стилями
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.9375rem',
          minHeight: 40, // Touch-friendly размер
        },
        sizeLarge: {
          minHeight: 48,
          padding: '12px 24px',
        },
        sizeSmall: {
          minHeight: 36,
          padding: '6px 12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontSize: '1rem', // Предотвращает zoom на iOS
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 12, // Touch-friendly размер (минимум 44x44px)
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          minHeight: 48, // Touch-friendly размер
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: 0, // Убираем скругление краев
        },
      },
    },
  },
  // Spacing для мобильных устройств
  spacing: 4,
});

// Делаем типографику адаптивной
theme = responsiveFontSizes(theme);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
