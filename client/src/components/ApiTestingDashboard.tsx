import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  Error,
  Warning,
  Info,
  Settings,
  Speed,
  ExpandMore,
  Code,
  Api,
} from '@mui/icons-material';
import ComprehensiveApiManager, {
  ExchangeRateAPI,
  GoogleAnalyticsAPI,
  SendGridAPI,
  TwilioAPI,
  ClearbitAPI
} from '../services/ComprehensiveApiService.ts';

interface ApiTest {
  id: string;
  name: string;
  category: string;
  endpoint: string;
  method: string;
  status: 'idle' | 'running' | 'success' | 'error' | 'warning';
  lastRun?: Date;
  responseTime?: number;
  errorMessage?: string;
  testData?: any;
}

interface ApiHealth {
  api: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastCheck: Date;
}

const ApiTestingDashboard: React.FC = () => {
  const [apiTests, setApiTests] = useState<ApiTest[]>([]);
  const [apiHealth, setApiHealth] = useState<ApiHealth[]>([]);
  const [running, setRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ApiTest | null>(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  // Initialize API tests
  useEffect(() => {
    const initialTests: ApiTest[] = [
      // Payment APIs
      {
        id: 'stripe-create-session',
        name: 'Create Stripe Session',
        category: 'Payment',
        endpoint: '/api/stripe/create-session',
        method: 'POST',
        status: 'idle',
      },
      {
        id: 'paypal-create-order',
        name: 'Create PayPal Order',
        category: 'Payment',
        endpoint: '/api/paypal/create-order',
        method: 'POST',
        status: 'idle',
      },
      {
        id: 'square-payment',
        name: 'Square Payment',
        category: 'Payment',
        endpoint: '/api/square/payment',
        method: 'POST',
        status: 'idle',
      },
      
      // Currency APIs
      {
        id: 'exchange-rate',
        name: 'Get Exchange Rate',
        category: 'Currency',
        endpoint: '/api/currency/exchange-rate',
        method: 'GET',
        status: 'idle',
      },
      {
        id: 'currency-convert',
        name: 'Convert Currency',
        category: 'Currency',
        endpoint: '/api/currency/convert',
        method: 'POST',
        status: 'idle',
      },
      
      // Analytics APIs
      {
        id: 'ga-track-event',
        name: 'Track Analytics Event',
        category: 'Analytics',
        endpoint: '/api/analytics/track',
        method: 'POST',
        status: 'idle',
      },
      
      // Communication APIs
      {
        id: 'sendgrid-email',
        name: 'Send Email',
        category: 'Communication',
        endpoint: '/api/email/send',
        method: 'POST',
        status: 'idle',
      },
      {
        id: 'twilio-sms',
        name: 'Send SMS',
        category: 'Communication',
        endpoint: '/api/sms/send',
        method: 'POST',
        status: 'idle',
      },
      
      // Business Intelligence APIs
      {
        id: 'clearbit-enrich',
        name: 'Enrich Company Data',
        category: 'Business Intelligence',
        endpoint: '/api/business/enrich',
        method: 'GET',
        status: 'idle',
      },
    ];

    setApiTests(initialTests);
    initializeApiHealth();
  }, []);

  const initializeApiHealth = () => {
    const healthData: ApiHealth[] = [
      { api: 'Stripe', status: 'healthy', responseTime: 120, uptime: 99.9, lastCheck: new Date() },
      { api: 'PayPal', status: 'healthy', responseTime: 180, uptime: 99.7, lastCheck: new Date() },
      { api: 'SendGrid', status: 'healthy', responseTime: 95, uptime: 99.8, lastCheck: new Date() },
      { api: 'Twilio', status: 'degraded', responseTime: 450, uptime: 98.5, lastCheck: new Date() },
      { api: 'ExchangeRate-API', status: 'healthy', responseTime: 200, uptime: 99.5, lastCheck: new Date() },
      { api: 'Google Analytics', status: 'healthy', responseTime: 300, uptime: 99.9, lastCheck: new Date() },
    ];
    setApiHealth(healthData);
  };

  const runSingleTest = async (testId: string) => {
    setApiTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status: 'running', lastRun: new Date() }
        : test
    ));

    try {
      const test = apiTests.find(t => t.id === testId);
      if (!test) return;

      const startTime = Date.now();
      let result = null;

      // Simulate API calls based on test type
      switch (testId) {
        case 'stripe-create-session':
          result = await ComprehensiveApiManager.processPayment('stripe', 10, 'USD');
          break;
        case 'paypal-create-order':
          result = await ComprehensiveApiManager.processPayment('paypal', 15, 'USD');
          break;
        case 'square-payment':
          result = await ComprehensiveApiManager.processPayment('square', 20, 'USD');
          break;
        case 'exchange-rate':
          result = await ExchangeRateAPI.convertCurrency('USD', 'EUR', 1);
          break;
        case 'currency-convert':
          result = await ExchangeRateAPI.convertCurrency('USD', 'EUR', 100);
          break;
        case 'ga-track-event':
          GoogleAnalyticsAPI.trackEvent('test_event', { test: true });
          result = { success: true };
          break;
        case 'sendgrid-email':
          result = await SendGridAPI.sendEmail(
            'test@example.com',
            'Test Email',
            'This is a test email'
          );
          break;
        case 'twilio-sms':
          result = await TwilioAPI.sendSMS(
            '+1234567890',
            'Test SMS message'
          );
          break;
        case 'clearbit-enrich':
          result = await ClearbitAPI.enrichCompany('example.com');
          break;
        default:
          throw { message: 'Unknown test type' };
      }

      const responseTime = Date.now() - startTime;

      setApiTests(prev => prev.map(test => 
        test.id === testId 
          ? { 
              ...test, 
              status: result ? 'success' : 'warning',
              responseTime,
              testData: result,
              errorMessage: result ? undefined : 'No data returned'
            }
          : test
      ));

    } catch (error: any) {
      setApiTests(prev => prev.map(test => 
        test.id === testId 
          ? { 
              ...test, 
              status: 'error',
              errorMessage: error.message,
              responseTime: Date.now() - Date.now()
            }
          : test
      ));
    }
  };

  const runAllTests = async () => {
    setRunning(true);
    for (const test of apiTests) {
      await runSingleTest(test.id);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between tests
    }
    setRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Speed color="primary" />;
      case 'success': return <CheckCircle color="success" />;
      case 'error': return <Error color="error" />;
      case 'warning': return <Warning color="warning" />;
      default: return <Info color="disabled" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'primary';
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'degraded': return 'warning';
      case 'down': return 'error';
      default: return 'default';
    }
  };

  const groupedTests = apiTests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, ApiTest[]>);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          API Testing & Monitoring
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={runAllTests}
            disabled={running}
          >
            {running ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => setConfigDialogOpen(true)}
          >
            Configure
          </Button>
        </Box>
      </Box>

      {/* API Health Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            API Health Status
          </Typography>
          <Grid container spacing={2}>
            {apiHealth.map((health) => (
              <Grid item xs={12} sm={6} md={4} key={health.api}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">{health.api}</Typography>
                    <Chip
                      size="small"
                      label={health.status}
                      color={getHealthColor(health.status) as any}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Response Time: {health.responseTime}ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Uptime: {health.uptime}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={health.uptime}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    color={getHealthColor(health.status) as any}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Test Results by Category */}
      {Object.entries(groupedTests).map(([category, tests]) => (
        <Accordion key={category} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Api />
              <Typography variant="h6">{category} APIs</Typography>
              <Chip
                size="small"
                label={`${tests.length} tests`}
                variant="outlined"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {tests.map((test) => (
                <ListItem
                  key={test.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    {getStatusIcon(test.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">
                          {test.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {test.responseTime && (
                            <Chip
                              size="small"
                              label={`${test.responseTime}ms`}
                              variant="outlined"
                            />
                          )}
                          <Chip
                            size="small"
                            label={test.status}
                            color={getStatusColor(test.status) as any}
                          />
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {test.method} {test.endpoint}
                        </Typography>
                        {test.lastRun && (
                          <Typography variant="caption" color="text.secondary">
                            Last run: {test.lastRun.toLocaleTimeString()}
                          </Typography>
                        )}
                        {test.errorMessage && (
                          <Alert severity="error" sx={{ mt: 1 }}>
                            {test.errorMessage}
                          </Alert>
                        )}
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => runSingleTest(test.id)}
                      disabled={test.status === 'running'}
                    >
                      <PlayArrow />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedTest(test);
                        setTestDialogOpen(true);
                      }}
                    >
                      <Code />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Test Details Dialog */}
      <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTest?.name} - Test Details
        </DialogTitle>
        <DialogContent>
          {selectedTest && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Endpoint: {selectedTest.method} {selectedTest.endpoint}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Status: {selectedTest.status}
              </Typography>
              {selectedTest.responseTime && (
                <Typography variant="subtitle2" gutterBottom>
                  Response Time: {selectedTest.responseTime}ms
                </Typography>
              )}
              {selectedTest.testData && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Response Data:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                    <Box component="pre" sx={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(selectedTest.testData, null, 2)}
                    </Box>
                  </Paper>
                </Box>
              )}
              {selectedTest.errorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {selectedTest.errorMessage}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Close</Button>
          {selectedTest && (
            <Button 
              variant="contained" 
              onClick={() => runSingleTest(selectedTest.id)}
              startIcon={<PlayArrow />}
            >
              Run Test
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>API Configuration</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Configure API keys and settings for testing. In production, these would be managed securely.
          </Alert>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Test Environment</InputLabel>
            <Select defaultValue="development">
              <MenuItem value="development">Development</MenuItem>
              <MenuItem value="staging">Staging</MenuItem>
              <MenuItem value="production">Production</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="API Base URL"
            defaultValue="https://api.subtrax.com"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Timeout (ms)"
            type="number"
            defaultValue="5000"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setConfigDialogOpen(false)}>
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApiTestingDashboard;