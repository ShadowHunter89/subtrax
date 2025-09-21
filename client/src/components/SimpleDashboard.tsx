// Simple working dashboard with subscription management
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Fab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Avatar,
  Divider,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MonetizationOn as MoneyIcon,
  Subscriptions as SubscriptionsIcon,
  Savings as SavingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import DatabaseService, { 
  Subscription, 
  AIRecommendation
} from '../services/DatabaseService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SimpleDashboard: React.FC = () => {
  const { userProfile, updatePreferences } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [stats, setStats] = useState({
    totalSpending: 0,
    activeSubscriptions: 0,
    totalSavings: 0,
    averageCost: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    currency: 'USD',
    billingCycle: 'monthly',
    category: '',
    providerName: ''
  });

  const categories = [
    'Entertainment', 'Productivity', 'Gaming', 'Music', 'Video Streaming',
    'Cloud Storage', 'Software', 'News', 'Education', 'Health & Fitness', 'Other'
  ];

  const billingCycles = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'PKR', 'CAD', 'AUD'];

  // Load dashboard data
  useEffect(() => {
    if (userProfile) {
      loadDashboardData();
    }
  }, [userProfile]);

  const loadDashboardData = async () => {
    if (!userProfile) return;
    
    try {
      setLoading(true);
      setError(null);

      // Load data in parallel
      const [
        subscriptionsData,
        recommendationsData,
        statsData
      ] = await Promise.all([
        DatabaseService.getUserSubscriptions(userProfile.uid),
        DatabaseService.getUserRecommendations(userProfile.uid, 'pending'),
        DatabaseService.getUserStats(userProfile.uid)
      ]);

      setSubscriptions(subscriptionsData);
      setRecommendations(recommendationsData);
      setStats(statsData);

    } catch (err: any) {
      setError('Failed to load dashboard data');
      // eslint-disable-next-line no-console
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new subscription
  const handleAddSubscription = async () => {
    if (!userProfile || !formData.name || !formData.cost || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError(null);
      const subscriptionData = {
        userId: userProfile.uid,
        name: formData.name,
        description: formData.description,
        cost: parseFloat(formData.cost),
        currency: formData.currency,
        billingCycle: formData.billingCycle as Subscription['billingCycle'],
        category: formData.category,
        status: 'active' as const,
        provider: {
          name: formData.providerName || formData.name,
          website: '',
          color: '#1976d2'
        },
        billing: {
          startDate: new Date() as any,
          nextBilling: calculateNextBilling(formData.billingCycle),
        },
        usage: {
          frequency: 'monthly' as const,
          usageScore: 50
        },
        aiInsights: {
          recommendation: 'keep' as const,
          confidence: 0.5,
          reasoning: ['New subscription, monitoring usage patterns']
        },
        notifications: {
          renewalReminder: true,
          usageAlerts: true,
          priceChangeAlerts: true
        }
      };

      await DatabaseService.createSubscription(subscriptionData);
      await loadDashboardData();
      resetForm();
      setAddDialogOpen(false);
      showSnackbar('Subscription added successfully!');
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error adding subscription:', err);
      setError('Failed to add subscription');
    }
  };

  // Update subscription
  const handleUpdateSubscription = async () => {
    if (!selectedSubscription || !formData.name || !formData.cost || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError(null);
      const updateData = {
        name: formData.name,
        description: formData.description,
        cost: parseFloat(formData.cost),
        currency: formData.currency,
        billingCycle: formData.billingCycle as Subscription['billingCycle'],
        category: formData.category,
        provider: {
          name: formData.providerName || formData.name,
          website: selectedSubscription.provider.website || '',
          color: selectedSubscription.provider.color || '#1976d2'
        }
      };

      await DatabaseService.updateSubscription(selectedSubscription.id, updateData);
      await loadDashboardData();
      resetForm();
      setEditDialogOpen(false);
      setSelectedSubscription(null);
      showSnackbar('Subscription updated successfully!');
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error updating subscription:', err);
      setError('Failed to update subscription');
    }
  };

  // Delete subscription
  const handleDeleteSubscription = async (id: string) => {
    try {
      setError(null);
      await DatabaseService.deleteSubscription(id);
      await loadDashboardData();
      showSnackbar('Subscription deleted successfully!');
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error deleting subscription:', err);
      setError('Failed to delete subscription');
    }
  };

  // Calculate next billing date
  const calculateNextBilling = (cycle: string) => {
    const now = new Date();
    switch (cycle) {
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) as any;
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()) as any;
      case 'quarterly':
        return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()) as any;
      case 'yearly':
        return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()) as any;
      default:
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()) as any;
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cost: '',
      currency: 'USD',
      billingCycle: 'monthly',
      category: '',
      providerName: ''
    });
  };

  // Edit subscription
  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setFormData({
      name: subscription.name,
      description: subscription.description || '',
      cost: subscription.cost.toString(),
      currency: subscription.currency,
      billingCycle: subscription.billingCycle,
      category: subscription.category,
      providerName: subscription.provider.name
    });
    setEditDialogOpen(true);
  };

  // Show snackbar
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome back, {userProfile?.displayName}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your subscriptions and track your spending
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<AnalyticsIcon />} label="Overview" />
          <Tab icon={<SubscriptionsIcon />} label="Subscriptions" />
          <Tab icon={<PersonIcon />} label="Profile" />
          <Tab icon={<SettingsIcon />} label="Settings" />
        </Tabs>
      </Paper>

      {/* Overview Tab */}
      <TabPanel value={activeTab} index={0}>
        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Typography variant="h6">Total Spending</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                ${stats.totalSpending.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly average
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <SubscriptionsIcon />
                </Avatar>
                <Typography variant="h6">Active Subscriptions</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {stats.activeSubscriptions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently active
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <SavingsIcon />
                </Avatar>
                <Typography variant="h6">Total Savings</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                ${stats.totalSavings.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lifetime savings
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <SubscriptionsIcon />
                </Avatar>
                <Typography variant="h6">Average Cost</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                ${stats.averageCost.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Per subscription
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              AI Insights & Recommendations
            </Typography>
            <List>
              {recommendations.slice(0, 3).map((rec) => (
                <ListItem key={rec.id}>
                  <ListItemText
                    primary={rec.title}
                    secondary={rec.description}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={`Save $${rec.impact.savings}`}
                      color="primary"
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </TabPanel>

      {/* Subscriptions Tab */}
      <TabPanel value={activeTab} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Your Subscriptions</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add Subscription
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          {subscriptions.map((subscription) => (
            <Card key={subscription.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {subscription.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditSubscription(subscription)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteSubscription(subscription.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="h5" color="primary" gutterBottom>
                  ${subscription.cost.toFixed(2)}/{subscription.billingCycle}
                </Typography>
                
                <Chip
                  label={subscription.category}
                  size="small"
                  sx={{ mb: 1 }}
                />
                
                {subscription.billing.nextBilling && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Next billing: {new Date(subscription.billing.nextBilling.seconds * 1000).toLocaleDateString()}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <CheckIcon
                    color={subscription.status === 'active' ? 'success' : 'disabled'}
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant="body2"
                    color={subscription.status === 'active' ? 'success.main' : 'text.secondary'}
                  >
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {subscriptions.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SubscriptionsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No subscriptions yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add your first subscription to start tracking your spending
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
            >
              Add Your First Subscription
            </Button>
          </Box>
        )}
      </TabPanel>

      {/* Profile Tab */}
      <TabPanel value={activeTab} index={2}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
                {userProfile?.displayName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">{userProfile?.displayName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {userProfile?.email}
                </Typography>
                <Chip
                  label={userProfile?.tier?.toUpperCase()}
                  size="small"
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Member since: {userProfile?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Statistics
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="h4" color="primary">
                  {userProfile?.metadata.subscriptionCount || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Subscriptions
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" color="success.main">
                  ${userProfile?.metadata.totalSavings?.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Savings
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={activeTab} index={3}>
        <Typography variant="h5" gutterBottom>
          Settings & Preferences
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            {userProfile?.preferences && (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userProfile.preferences.notifications.email}
                      onChange={(e) => updatePreferences({
                        notifications: {
                          ...userProfile.preferences.notifications,
                          email: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Email Notifications"
                />
                <br />
                <FormControlLabel
                  control={
                    <Switch
                      checked={userProfile.preferences.notifications.renewalReminders}
                      onChange={(e) => updatePreferences({
                        notifications: {
                          ...userProfile.preferences.notifications,
                          renewalReminders: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Renewal Reminders"
                />
                <br />
                <FormControlLabel
                  control={
                    <Switch
                      checked={userProfile.preferences.notifications.savingsAlerts}
                      onChange={(e) => updatePreferences({
                        notifications: {
                          ...userProfile.preferences.notifications,
                          savingsAlerts: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Savings Alerts"
                />
              </>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Display Preferences
            </Typography>
            {userProfile?.preferences && (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userProfile.preferences.display.darkMode}
                      onChange={(e) => updatePreferences({
                        display: {
                          ...userProfile.preferences.display,
                          darkMode: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Dark Mode"
                />
                <br />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Default Currency</InputLabel>
                  <Select
                    value={userProfile.preferences.display.currency}
                    onChange={(e) => updatePreferences({
                      display: {
                        ...userProfile.preferences.display,
                        currency: e.target.value
                      }
                    })}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency} value={currency}>
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Paper>
        </Box>
      </TabPanel>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add subscription"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Add Subscription Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Subscription</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Subscription Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Cost"
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Billing Cycle</InputLabel>
              <Select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
              >
                {billingCycles.map((cycle) => (
                  <MenuItem key={cycle.value} value={cycle.value}>
                    {cycle.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Provider Name"
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
            />
          </Box>
          <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSubscription} variant="contained">
            Add Subscription
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subscription Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Subscription</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Subscription Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Cost"
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Billing Cycle</InputLabel>
              <Select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
              >
                {billingCycles.map((cycle) => (
                  <MenuItem key={cycle.value} value={cycle.value}>
                    {cycle.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Provider Name"
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
            />
          </Box>
          <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateSubscription} variant="contained">
            Update Subscription
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default SimpleDashboard;