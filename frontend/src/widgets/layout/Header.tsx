import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useMobileMenuStore } from '@/shared/lib/store';
import { usePageTitle } from '@/shared/lib/hooks/usePageTitle';
import { OfflineIndicator } from '@/shared/ui/OfflineIndicator';

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { toggle } = useMobileMenuStore();
  const pageTitle = usePageTitle();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggle}
            sx={{ mr: 2 }}
            aria-label="открыть меню"
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: { xs: 1, md: 0 } }}>
          {pageTitle}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <OfflineIndicator />
        {/* Здесь можно добавить уведомления, профиль и т.д. */}
      </Toolbar>
    </AppBar>
  );
};
