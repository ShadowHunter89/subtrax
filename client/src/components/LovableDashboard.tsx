import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Paper,
  Stack,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  Dashboard,
  AccountBalance,
  TrendingUp,
  Settings,
  Notifications,
  Help,
  Logout,
  Menu,
  Add,
  MoreVert,
  CreditCard,
  Receipt,
  Analytics,
  PieChart,
  AttachMoney,
  Cancel,
  CheckCircle,
  Warning,
  Schedule,
} from '@mui/icons-material';

const drawerWidth = 280;

interface Subscription {
  id: string;
  name: string;
  cost: number;
  status: 'active' | 'cancelled' | 'pending';
  nextBilling: string;
  category: string;
  logo: string;
  color: string;
}

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    cost: 15.99,
    status: 'active',
    nextBilling: '2025-10-15',
    category: 'Entertainment',
    logo: '🎬',
    color: '#E50914',
  },
  {
    id: '2',
    name: 'Spotify',
    cost: 9.99,
    status: 'active',
    nextBilling: '2025-10-12',
    category: 'Music',
    logo: '🎵',
    color: '#1DB954',
  },
  {
    id: '3',
    name: 'Adobe Creative',
    cost: 52.99,
    status: 'active',
    nextBilling: '2025-10-20',
    category: 'Design',
    logo: '🎨',
    color: '#FF0000',
  },
  {
    id: '4',
    name: 'GitHub Pro',
    cost: 4.00,
    status: 'active',
    nextBilling: '2025-10-08',
    category: 'Development',
    logo: '💻',
    color: '#24292e',
  },
  {
    id: '5',
    name: 'Figma',
    cost: 12.00,
    status: 'cancelled',
    nextBilling: '2025-09-30',
    category: 'Design',
    logo: '🎨',
    color: '#F24E1E',
  },
];

const LovableDashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const totalMonthlySpend = mockSubscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.cost, 0);

  const activeSubscriptions = mockSubscriptions.filter(sub => sub.status === 'active').length;
  const cancelledSubscriptions = mockSubscriptions.filter(sub => sub.status === 'cancelled').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <Receipt /> },
    { id: 'analytics', label: 'Analytics', icon: <Analytics /> },
    { id: 'billing', label: 'Billing', icon: <AccountBalance /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
          SubTrax
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Subscription Management
        </Typography>
      </Box>
      
      <List sx={{ flex: 1, p: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={selectedTab === item.id}
            onClick={() => setSelectedTab(item.id)}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                bgcolor: alpha('#7F5AF0', 0.1),
                color: 'primary.main',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      
      <Divider />
      
      <List sx={{ p: 2 }}>
        <ListItemButton sx={{ borderRadius: 2 }}>
          <ListItemIcon><Help /></ListItemIcon>
          <ListItemText primary="Help & Support" />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 2 }}>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />;
      case 'cancelled':
        return <Cancel sx={{ color: 'error.main', fontSize: 20 }} />;
      case 'pending':
        return <Schedule sx={{ color: 'warning.main', fontSize: 20 }} />;
      default:
        return <Warning sx={{ color: 'grey.500', fontSize: 20 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: { md: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            SubTrax Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, md: 0 },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and manage all your subscriptions in one place
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton>
                <Notifications />
              </IconButton>
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{ borderRadius: 2 }}
              >
                Add Subscription
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      Monthly Spend
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ${totalMonthlySpend.toFixed(2)}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#7F5AF0', 0.1), color: 'primary.main' }}>
                    <AttachMoney />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      Active Subscriptions
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {activeSubscriptions}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#2CB67D', 0.1), color: 'success.main' }}>
                    <CheckCircle />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      Cancelled This Month
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {cancelledSubscriptions}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#FF5722', 0.1), color: 'error.main' }}>
                    <Cancel />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      Potential Savings
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                      $127.50
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#2CB67D', 0.1), color: 'success.main' }}>
                    <TrendingUp />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Subscriptions List */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Subscriptions
                  </Typography>
                  <Button variant="text" size="small">
                    View All
                  </Button>
                </Box>
                
                <Stack spacing={2}>
                  {mockSubscriptions.slice(0, 5).map((subscription) => (
                    <Paper
                      key={subscription.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'white',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(subscription.color, 0.1),
                              color: subscription.color,
                              width: 48,
                              height: 48,
                            }}
                          >
                            {subscription.logo}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {subscription.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {subscription.category} • Next billing: {subscription.nextBilling}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              ${subscription.cost}
                            </Typography>
                            <Chip
                              icon={getStatusIcon(subscription.status)}
                              label={subscription.status}
                              size="small"
                              color={getStatusColor(subscription.status) as any}
                              variant="outlined"
                            />
                          </Box>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar Content */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Quick Actions */}
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Add />}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Add New Subscription
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PieChart />}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      View Analytics
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<CreditCard />}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Manage Billing
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Spending Overview */}
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Spending This Month
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Entertainment</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>$25.98</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={65}
                      sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100' }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Design</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>$64.99</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100' }}
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Development</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>$4.00</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={20}
                      sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LovableDashboard;