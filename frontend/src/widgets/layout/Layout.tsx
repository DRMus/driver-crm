import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: { xs: 'column', md: 'row' } }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - 280px)` },
          marginTop: { xs: '56px', sm: '64px' },
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
          <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', md: '750px' },
            px: { xs: 0, sm: 2 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
