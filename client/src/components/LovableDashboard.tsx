import React, { useState, useEffect } from 'react';
import {
  Box,

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

  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Paper,
  Stack,
  LinearProgress,
  alpha,

  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

  CreditCard,
  Receipt,
  Analytics,
  PieChart,
  AttachMoney,
  Cancel,
  CheckCircle,
  Warning,
  Schedule,

  Delete,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.tsx';
import ApiService from '../services/api.ts';
import ComprehensiveApiManager, { GoogleAnalyticsAPI } from '../services/ComprehensiveApiService.ts';

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
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    cost: '',
    billingCycle: 'monthly',
    category: 'Other',
    nextBillingDate: '',
  });
  const [currency] = useState('USD');

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [subscriptionsData, analyticsData] = await Promise.all([
        ApiService.getSubscriptions(),
        ApiService.getDashboardAnalytics(),
      ]);

      if (subscriptionsData.success) {
        const subs = subscriptionsData.subscriptions || [];
        setSubscriptions(subs);
        
        // Enrich subscriptions with company data
        // Enrich subscription data
        await enrichSubscriptionsData(subs);
        // Company data enriched successfully
        
        // Track analytics
        GoogleAnalyticsAPI.trackEvent('dashboard_loaded', {
          subscription_count: subs.length,
          currency: currency,
        });
      }

      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      }
      
        // Exchange rates fetched successfully
    } catch (err) {
      setError('Failed to load dashboard data');
      // Fallback to mock data for demo
      setSubscriptions(mockSubscriptions);
      setAnalytics({
        totalMonthly: 94.98,
        totalYearly: 1139.76,
        activeSubscriptions: 4,
        categoriesBreakdown: {
          Entertainment: 25.98,
          Design: 64.99,
          Development: 4.00,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async () => {
    try {
      const result = await ApiService.createSubscription({
        ...newSubscription,
        cost: parseFloat(newSubscription.cost),
        nextBillingDate: new Date(newSubscription.nextBillingDate),
      });

      if (result.success) {
        setAddDialogOpen(false);
        setNewSubscription({
          name: '',
          cost: '',
          billingCycle: 'monthly',
          category: 'Other',
          nextBillingDate: '',
        });
        loadDashboardData(); // Refresh data
      }
    } catch (err) {
      setError('Failed to add subscription');
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      const result = await ApiService.deleteSubscription(id);
      if (result.success) {
        // Track analytics
        GoogleAnalyticsAPI.trackSubscriptionCancelled(id);
        
        // Send notification
        await ComprehensiveApiManager.sendNotification(
          'email',
          currentUser?.email || '',
          'Subscription Cancelled',
          `Your subscription has been successfully cancelled.`
        );
        
        loadDashboardData(); // Refresh data
      }
    } catch (err) {
      setError('Failed to delete subscription');
    }
  };

  const enrichSubscriptionsData = async (subscriptions: any[]) => {
    const enriched = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          const enrichment = await ComprehensiveApiManager.enrichSubscriptionData(sub.name);
          return { ...sub, enrichment };
        } catch {
          return sub;
        }
      })
    );
    return enriched;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const totalMonthlySpend = analytics?.totalMonthly || 0;
  const activeSubscriptions = analytics?.activeSubscriptions || 0;
  const cancelledSubscriptions = subscriptions.filter(sub => sub.status === 'cancelled').length;
  const potentialSavings = analytics?.potentialSavings || 127.50;

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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
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
                onClick={() => setAddDialogOpen(true)}
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
                      {loading ? "..." : `$${totalMonthlySpend.toFixed(2)}`}
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
                      {loading ? "..." : activeSubscriptions}
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
                      {loading ? "..." : cancelledSubscriptions}
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
                      {loading ? "..." : `$${potentialSavings.toFixed(2)}`}
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
                  {loading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography>Loading subscriptions...</Typography>
                    </Box>
                  ) : subscriptions.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No subscriptions found</Typography>
                    </Box>
                  ) : (
                    subscriptions.slice(0, 5).map((subscription) => (
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
                          <IconButton 
                            size="small"
                            onClick={() => handleDeleteSubscription(subscription.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))
                  )}
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

      {/* Add Subscription Dialog */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Subscription</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subscription Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newSubscription.name}
            onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Monthly Cost"
            type="number"
            fullWidth
            variant="outlined"
            value={newSubscription.cost}
            onChange={(e) => setNewSubscription({...newSubscription, cost: e.target.value})}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={newSubscription.category}
              label="Category"
              onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
            >
              <MenuItem value="Entertainment">Entertainment</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
              <MenuItem value="Development">Development</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Next Billing Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={newSubscription.nextBillingDate}
            onChange={(e) => setNewSubscription({...newSubscription, nextBillingDate: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSubscription} variant="contained">Add Subscription</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LovableDashboard;