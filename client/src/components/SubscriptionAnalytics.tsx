import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Schedule,
  Lightbulb,
  Warning,
  Cancel,
  Refresh,
  Insights,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { GoogleAnalyticsAPI } from '../services/ComprehensiveApiService';
import { NotificationHelpers } from './NotificationSystem';

interface SubscriptionMetrics {
  totalMonthlySpending: number;
  totalAnnualSpending: number;
  activeSubscriptions: number;
  unusedSubscriptions: number;
  potentialSavings: number;
  averageSubscriptionCost: number;
  mostExpensive: { name: string; cost: number };
  leastUsed: { name: string; lastUsed: Date; cost: number };
}

interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface UsagePattern {
  subscription: string;
  usage: number;
  trend: 'up' | 'down' | 'stable';
  lastUsed: Date;
  cost: number;
}

interface AIInsight {
  type: 'saving' | 'warning' | 'optimization' | 'trend';
  title: string;
  description: string;
  actionable: boolean;
  potentialSavings?: number;
  confidence: number;
}

const SubscriptionAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<SubscriptionMetrics | null>(null);
  const [categoryData, setCategoryData] = useState<CategorySpending[]>([]);
  const [usagePatterns, setUsagePatterns] = useState<UsagePattern[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  // Sample data - in production, this would come from your API
  const generateSampleData = () => {
    const metrics: SubscriptionMetrics = {
      totalMonthlySpending: 156.97,
      totalAnnualSpending: 1883.64,
      activeSubscriptions: 12,
      unusedSubscriptions: 3,
      potentialSavings: 47.99,
      averageSubscriptionCost: 13.08,
      mostExpensive: { name: 'Adobe Creative Cloud', cost: 52.99 },
      leastUsed: { name: 'Zoom Pro', lastUsed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), cost: 14.99 },
    };

    const categories: CategorySpending[] = [
      { category: 'Entertainment', amount: 45.97, percentage: 29.3, color: COLORS[0] },
      { category: 'Productivity', amount: 67.99, percentage: 43.3, color: COLORS[1] },
      { category: 'Cloud Storage', amount: 23.99, percentage: 15.3, color: COLORS[2] },
      { category: 'Development', amount: 19.02, percentage: 12.1, color: COLORS[3] },
    ];

    const usage: UsagePattern[] = [
      { subscription: 'Netflix', usage: 87, trend: 'up', lastUsed: new Date(), cost: 15.99 },
      { subscription: 'Spotify', usage: 92, trend: 'stable', lastUsed: new Date(), cost: 9.99 },
      { subscription: 'Microsoft 365', usage: 76, trend: 'down', lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), cost: 12.99 },
      { subscription: 'Adobe Creative Cloud', usage: 45, trend: 'down', lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), cost: 52.99 },
      { subscription: 'Zoom Pro', usage: 12, trend: 'down', lastUsed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), cost: 14.99 },
    ];

    const insights: AIInsight[] = [
      {
        type: 'saving',
        title: 'High Savings Potential',
        description: 'You could save $47.99/month by canceling 3 unused subscriptions',
        actionable: true,
        potentialSavings: 47.99,
        confidence: 94,
      },
      {
        type: 'warning',
        title: 'Low Usage Detected',
        description: 'Adobe Creative Cloud usage dropped 60% this month',
        actionable: true,
        confidence: 89,
      },
      {
        type: 'optimization',
        title: 'Bundle Opportunity',
        description: 'Microsoft 365 Family could save you $24/year vs individual plans',
        actionable: true,
        potentialSavings: 24,
        confidence: 82,
      },
      {
        type: 'trend',
        title: 'Entertainment Spending Rising',
        description: 'Your entertainment subscriptions increased 23% this quarter',
        actionable: false,
        confidence: 76,
      },
    ];

    setMetrics(metrics);
    setCategoryData(categories);
    setUsagePatterns(usage);
    setAiInsights(insights);
  };

  const refreshAnalytics = async () => {
    setRefreshing(true);
    
    try {
      // Track analytics refresh
      GoogleAnalyticsAPI.trackEvent('analytics_refresh', {
        timestamp: new Date().toISOString(),
      });

      // In production, fetch real data
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      generateSampleData();

      // Notify about insights
      const highValueInsights = aiInsights.filter(i => i.confidence > 85 && i.actionable);
      if (highValueInsights.length > 0) {
        NotificationHelpers.notifyAnalyticsInsight(
          `Found ${highValueInsights.length} high-confidence optimization opportunities`
        );
      }

    } catch (error) {
      // Handle error
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Track page visit
        GoogleAnalyticsAPI.trackEvent('page_view', {
          page: '/analytics',
          timestamp: new Date().toISOString(),
        });
        
        generateSampleData();
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'saving': return <AttachMoney color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'optimization': return <Lightbulb color="info" />;
      case 'trend': return <TrendingUp color="primary" />;
      default: return <Insights />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'saving': return 'success';
      case 'warning': return 'warning';
      case 'optimization': return 'info';
      case 'trend': return 'primary';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      default: return <TrendingUp color="disabled" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Subscription Analytics
        </Typography>
        <Button
          variant="outlined"
          startIcon={refreshing ? <CircularProgress size={20} /> : <Refresh />}
          onClick={refreshAnalytics}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Monthly Spending
              </Typography>
              <Typography variant="h4" color="primary">
                ${metrics?.totalMonthlySpending.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ${metrics?.totalAnnualSpending.toFixed(2)} annually
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Subscriptions
              </Typography>
              <Typography variant="h4" color="success.main">
                {metrics?.activeSubscriptions}
              </Typography>
              <Typography variant="body2" color="error.main">
                {metrics?.unusedSubscriptions} unused
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Potential Savings
              </Typography>
              <Typography variant="h4" color="success.main">
                ${metrics?.potentialSavings.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                per month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Cost
              </Typography>
              <Typography variant="h4">
                ${metrics?.averageSubscriptionCost.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                per subscription
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Spending by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData.map(item => ({ ...item, value: item.amount }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry: any) => `${entry.category}: ${entry.percentage}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`$${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Usage Patterns */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usage Patterns
              </Typography>
              <List>
                {usagePatterns.map((pattern, index) => (
                  <React.Fragment key={pattern.subscription}>
                    <ListItem>
                      <ListItemIcon>
                        {getTrendIcon(pattern.trend)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                              {pattern.subscription}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ${pattern.cost}/month
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={pattern.usage}
                                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                {pattern.usage}%
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Last used: {pattern.lastUsed.toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < usagePatterns.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Insights & Recommendations
              </Typography>
              <List>
                {aiInsights.map((insight, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {getInsightIcon(insight.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                              {insight.title}
                            </Typography>
                            <Chip
                              size="small"
                              label={`${insight.confidence}%`}
                              color={getInsightColor(insight.type) as any}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {insight.description}
                            </Typography>
                            {insight.potentialSavings && (
                              <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                                Potential savings: ${insight.potentialSavings}/month
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < aiInsights.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Cancel />}
            color="error"
            onClick={() => {
              NotificationHelpers.notifyAnalyticsInsight('Initiated bulk cancellation process');
            }}
          >
            Cancel Unused Subscriptions
          </Button>
          <Button
            variant="outlined"
            startIcon={<Schedule />}
            onClick={() => {
              NotificationHelpers.notifyAnalyticsInsight('Scheduled monthly analytics report');
            }}
          >
            Schedule Monthly Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<AttachMoney />}
            onClick={() => {
              NotificationHelpers.notifyAnalyticsInsight('Exported financial data for tax purposes');
            }}
          >
            Export Financial Data
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SubscriptionAnalytics;