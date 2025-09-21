import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Add,
  MoreVert,
  Notifications,
  Settings,
  Logout,
  AccountCircle,
  Dashboard as DashboardIcon,
  Insights,
  MonetizationOn,
  Cancel,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  category: string;
  status: 'active' | 'cancelled' | 'paused';
  nextBilling: Date;
  icon?: string;
  color?: string;
}

interface DashboardStats {
  totalSpending: number;
  activeSubscriptions: number;
  potentialSavings: number;
  monthlyTrend: number;
}

export default function Dashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSpending: 0,
    activeSubscriptions: 0,
    potentialSavings: 0,
    monthlyTrend: 0
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    cost: '',
    billingCycle: 'monthly',
    category: '',
    status: 'active'
  });

  // Sample data for demonstration
  useEffect(() => {
    const sampleSubscriptions: Subscription[] = [
      {
        id: '1',
        name: 'Netflix',
        cost: 15.99,
        billingCycle: 'monthly',
        category: 'Entertainment',
        status: 'active',
        nextBilling: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        icon: '🎬',
        color: '#E50914'
      },
      {
        id: '2',
        name: 'Spotify',
        cost: 9.99,
        billingCycle: 'monthly',
        category: 'Music',
        status: 'active',
        nextBilling: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        icon: '🎵',
        color: '#1DB954'
      },
      {
        id: '3',
        name: 'Adobe Creative Cloud',
        cost: 52.99,
        billingCycle: 'monthly',
        category: 'Software',
        status: 'active',
        nextBilling: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        icon: '🎨',
        color: '#FF0000'
      },
      {
        id: '4',
        name: 'Dropbox',
        cost: 99.99,
        billingCycle: 'yearly',
        category: 'Storage',
        status: 'paused',
        nextBilling: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        icon: '📁',
        color: '#0061FF'
      }
    ];

    setSubscriptions(sampleSubscriptions);

    // Calculate stats
    const active = sampleSubscriptions.filter(s => s.status === 'active');
    const monthlyTotal = active.reduce((sum, sub) => {
      return sum + (sub.billingCycle === 'monthly' ? sub.cost : sub.cost / 12);
    }, 0);

    setStats({
      totalSpending: monthlyTotal,
      activeSubscriptions: active.length,
      potentialSavings: 140,
      monthlyTrend: 12.5
    });
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Spending',
        data: [65, 78, 82, 95, 89, 78],
        borderColor: '#7F5AF0',
        backgroundColor: 'rgba(127, 90, 240, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Subscription Spending Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          }
        }
      }
    }
  };

  const handleAddSubscription = () => {
    // Add subscription logic here
    setAddDialogOpen(false);
    setNewSubscription({
      name: '',
      cost: '',
      billingCycle: 'monthly',
      category: '',
      status: 'active'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'paused': return <Warning />;
      case 'cancelled': return <Cancel />;
      default: return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {userProfile?.displayName || currentUser?.email}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton>
            <Notifications />
          </IconButton>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {userProfile?.displayName?.[0] || currentUser?.email?.[0]}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Monthly Spending
                </Typography>
                <Typography variant="h4">
                  ${stats.totalSpending.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {stats.monthlyTrend > 0 ? <TrendingUp color="error" /> : <TrendingDown color="success" />}
                  <Typography variant="body2" color={stats.monthlyTrend > 0 ? 'error' : 'success.main'}>
                    {Math.abs(stats.monthlyTrend)}% vs last month
                  </Typography>
                </Box>
              </Box>
              <MonetizationOn sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Active Subscriptions
                </Typography>
                <Typography variant="h4">
                  {stats.activeSubscriptions}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {subscriptions.length} total
                </Typography>
              </Box>
              <DashboardIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Potential Savings
                </Typography>
                <Typography variant="h4" color="success.main">
                  ${stats.potentialSavings}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  AI recommendations
                </Typography>
              </Box>
              <Insights sx={{ fontSize: 40, color: 'success.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Account Tier
                </Typography>
                <Typography variant="h4">
                  {userProfile?.tier.toUpperCase()}
                </Typography>
                <Button variant="text" size="small" sx={{ mt: 1, p: 0 }}>
                  Upgrade
                </Button>
              </Box>
              <AccountCircle sx={{ fontSize: 40, color: 'info.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Chart and Subscriptions */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Spending Analytics
            </Typography>
            <Line data={chartData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              AI Insights
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="warning">
                You have 3 duplicate streaming services. Consider consolidating to save $25/month.
              </Alert>
              <Alert severity="info">
                Switch to annual billing for Adobe to save 20% ($127/year).
              </Alert>
              <Alert severity="success">
                Great job! You cancelled 2 unused subscriptions this month.
              </Alert>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Subscriptions List */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Your Subscriptions
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
            >
              Add Subscription
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gap: 2 }}>
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} variant="outlined">
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: subscription.color }}>
                    {subscription.icon}
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {subscription.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {subscription.category} • Next billing: {subscription.nextBilling.toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6">
                      ${subscription.cost}{subscription.billingCycle === 'monthly' ? '/mo' : '/yr'}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(subscription.status)}
                      label={subscription.status}
                      color={getStatusColor(subscription.status) as any}
                      size="small"
                    />
                  </Box>

                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Add Subscription Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Subscription</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Subscription Name"
              value={newSubscription.name}
              onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
            />
            
            <TextField
              fullWidth
              label="Cost"
              type="number"
              value={newSubscription.cost}
              onChange={(e) => setNewSubscription({ ...newSubscription, cost: e.target.value })}
              InputProps={{
                startAdornment: '$'
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Billing Cycle</InputLabel>
              <Select
                value={newSubscription.billingCycle}
                label="Billing Cycle"
                onChange={(e) => setNewSubscription({ ...newSubscription, billingCycle: e.target.value as any })}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Category"
              value={newSubscription.category}
              onChange={(e) => setNewSubscription({ ...newSubscription, category: e.target.value })}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddSubscription}>
                Add Subscription
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add subscription"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddDialogOpen(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
}