import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Info as AboutIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import GlobalSearch from './GlobalSearch';
import NotificationSystem from './NotificationSystem';

interface NavigationProps {
  onNavigate: (path: string) => void;
  currentPath?: string;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentPath = '/' }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { path: '/', label: 'Home', icon: <HomeIcon />, public: true },
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon />, public: false },
    { path: '/analytics', label: 'Analytics', icon: <AnalyticsIcon />, public: false },
    { path: '/billing', label: 'Billing', icon: <PaymentIcon />, public: false },
    { path: '/about', label: 'About', icon: <AboutIcon />, public: true },
    { path: '/help', label: 'Help', icon: <HelpIcon />, public: true }
  ];

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('/');
      handleProfileMenuClose();
    } catch (error) {
      // Handle logout error
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const renderDesktopNavigation = () => (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        borderBottom: '1px solid',
        borderBottomColor: 'divider'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => onNavigate('/')}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mr: 4
            }}
          >
            Subtrax
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          {menuItems
            .filter(item => item.public || currentUser)
            .map((item) => (
              <Button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                sx={{
                  color: currentPath === item.path ? 'primary.main' : 'text.primary',
                  fontWeight: currentPath === item.path ? 600 : 400,
                  borderBottom: currentPath === item.path ? 2 : 0,
                  borderBottomColor: 'primary.main',
                  borderRadius: 0,
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search - only for authenticated users */}
          {currentUser && (
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <GlobalSearch onNavigate={onNavigate} />
            </Box>
          )}

          {/* Notifications - only for authenticated users */}
          {currentUser && (
            <NotificationSystem userId={currentUser.uid} />
          )}

          {/* User Menu or Auth Buttons */}
          {currentUser ? (
            <>
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  src={(userProfile as any)?.photoURL || undefined}
                  sx={{ width: 40, height: 40 }}
                >
                  {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {userProfile?.displayName || 'User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {currentUser.email}
                  </Typography>
                  <Badge
                    badgeContent={userProfile?.tier?.toUpperCase() || 'FREE'}
                    color="primary"
                    sx={{ mt: 1, display: 'block' }}
                  />
                </Box>
                <Divider />
                <MenuItem onClick={() => { onNavigate('/profile'); handleProfileMenuClose(); }}>
                  <AccountIcon sx={{ mr: 2 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { onNavigate('/settings'); handleProfileMenuClose(); }}>
                  <SettingsIcon sx={{ mr: 2 }} />
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 2 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => onNavigate('/auth')}
                sx={{ borderRadius: 2 }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => onNavigate('/auth')}
                sx={{ borderRadius: 2 }}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );

  const renderMobileNavigation = () => (
    <>
      <AppBar 
        position="sticky"
        sx={{ 
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuToggle}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}
          >
            Subtrax
          </Typography>
          
          {currentUser && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton>
                <SearchIcon />
              </IconButton>
              <NotificationSystem userId={currentUser.uid} />
              <IconButton onClick={handleProfileMenuOpen}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: { width: 280 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Subtrax
          </Typography>
          {currentUser && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'action.hover', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={(userProfile as any)?.photoURL || undefined}>
                  {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {userProfile?.displayName || 'User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {userProfile?.tier?.toUpperCase() || 'FREE'} Plan
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        
        <Divider />
        
        <List>
          {menuItems
            .filter(item => item.public || currentUser)
            .map((item) => (
              <ListItem
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  setMobileDrawerOpen(false);
                }}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: currentPath === item.path ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          
          {currentUser && (
            <>
              <Divider />
              <ListItem 
                onClick={() => { onNavigate('/settings'); setMobileDrawerOpen(false); }}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
              <ListItem 
                onClick={handleLogout}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItem>
            </>
          )}
          
          {!currentUser && (
            <>
              <Divider />
              <ListItem 
                onClick={() => { onNavigate('/auth'); setMobileDrawerOpen(false); }}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <ListItemIcon><AccountIcon /></ListItemIcon>
                <ListItemText primary="Sign In" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );

  return isMobile ? renderMobileNavigation() : renderDesktopNavigation();
};

export default Navigation;