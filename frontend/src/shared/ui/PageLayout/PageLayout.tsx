import { ReactNode } from 'react';
import { Box, Typography, Alert, Fab } from '@mui/material';

interface PageLayoutProps {
  title?: string;
  titleSuffix?: string;
  actionButton?: {
    onClick: () => void;
    icon: ReactNode;
  };
  error?: boolean;
  errorMessage?: string;
  children: ReactNode;
}

export const PageLayout = ({
  title,
  titleSuffix,
  actionButton,
  error,
  errorMessage = 'Ошибка при загрузке данных',
  children,
}: PageLayoutProps) => {
  return (
    <Box sx={{ position: 'relative', pb: 10 }}>
      {title && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1">
            {title}
            {titleSuffix && ` ${titleSuffix}`}
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {children}

      {actionButton && (
        <Fab
          color="primary"
          aria-label="Добавить"
          onClick={actionButton.onClick}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            zIndex: 1000,
          }}
        >
          {actionButton.icon}
        </Fab>
      )}
    </Box>
  );
};

