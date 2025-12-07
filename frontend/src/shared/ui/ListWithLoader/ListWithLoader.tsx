import { ReactNode } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Stack } from '@mui/material';

interface ListWithLoaderProps<T> {
  isLoading: boolean;
  items: T[];
  emptyMessage: string;
  loadingComponent?: ReactNode;
  children: (item: T) => ReactNode;
  spacing?: number;
  getItemKey?: (item: T, index: number) => string | number;
}

export const ListWithLoader = <T,>({
  isLoading,
  items,
  emptyMessage,
  loadingComponent,
  children,
  spacing = 2,
  getItemKey,
}: ListWithLoaderProps<T>) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {loadingComponent || <CircularProgress />}
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            {emptyMessage}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={spacing}>
      {items.map((item, index) => (
        <Box key={getItemKey ? getItemKey(item, index) : index}>
          {children(item)}
        </Box>
      ))}
    </Stack>
  );
};

