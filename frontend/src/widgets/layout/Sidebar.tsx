import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material';
import {
  // Dashboard as DashboardIcon, // Временно скрыто
  DirectionsCar as CarIcon,
  CalendarMonth as CalendarIcon,
  Assessment as ReportIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMobileMenuStore } from '@/shared/lib/store';

const drawerWidth = 280;

const menuItems = [
  // { text: 'Дашборд', icon: <DashboardIcon />, path: '/' }, // Временно скрыто
  { text: 'Автомобили', icon: <CarIcon />, path: '/' },
  { text: 'Календарь', icon: <CalendarIcon />, path: '/calendar' },
  { text: 'Отчеты', icon: <ReportIcon />, path: '/reports' },
];

export const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, close } = useMobileMenuStore();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      close();
    }
  };

  const drawerContent = (
    <>
      <Toolbar />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          // Для главной страницы проверяем точное совпадение или начало пути
          const isActive = item.path === '/' 
            ? location.pathname === '/' || location.pathname === '/vehicles'
            : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? 'inherit' : 'text.primary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="навигация"
    >
      {/* Мобильный drawer */}
      <Drawer
        variant="temporary"
        open={isMobile && isOpen}
        onClose={close}
        ModalProps={{
          keepMounted: true, // Лучше для мобильных устройств
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Десктопный drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};
