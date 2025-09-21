// Stripe payment integration component for subscription billing
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface BillingHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  description: string;
  date: Date;
  invoiceUrl?: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  recommended?: boolean;
}

const PaymentIntegration: React.FC = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false);
  
  // State for billing history
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  
  // State for subscription plans
  const [subscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      interval: 'month',
      features: [
        'Up to 5 subscriptions',
        'Basic analytics',
        'Email reminders',
        'Manual tracking'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Unlimited subscriptions',
        'Advanced analytics',
        'AI recommendations',
        'Smart alerts',
        'Export capabilities',
        'Priority support'
      ],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 19.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Custom integrations',
        'Advanced reporting',
        'Dedicated support',
        'White-label options'
      ]
    }
  ]);

  // Card form state
  const [cardForm, setCardForm] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  // Load payment data
  useEffect(() => {
    if (userProfile) {
      loadPaymentData();
    }
  }, [userProfile]);

  const loadPaymentData = async () => {
    if (!userProfile) return;
    
    try {
      setLoading(true);
      setError(null);

      // Mock data for demonstration
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'pm_1',
          type: 'card',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true
        }
      ];

      const mockBillingHistory: BillingHistory[] = [
        {
          id: 'inv_1',
          amount: 9.99,
          currency: 'USD',
          status: 'succeeded',
          description: 'Pro subscription - Monthly',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          invoiceUrl: '#'
        },
        {
          id: 'inv_2',
          amount: 9.99,
          currency: 'USD',
          status: 'succeeded',
          description: 'Pro subscription - Monthly',
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          invoiceUrl: '#'
        }
      ];

      setPaymentMethods(mockPaymentMethods);
      setBillingHistory(mockBillingHistory);

    } catch (err: any) {
      setError('Failed to load payment data');
      // eslint-disable-next-line no-console
      console.error('Payment data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionUpgrade = async (planId: string) => {
    if (!userProfile) return;

    try {
      setLoading(true);
      setError(null);

      // In a real implementation, this would:
      // 1. Create Stripe checkout session
      // 2. Redirect to Stripe checkout
      // 3. Handle webhook for successful payment
      // 4. Update user's subscription in database

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess(`Successfully upgraded to ${subscriptionPlans.find(p => p.id === planId)?.name} plan!`);
      
    } catch (err: any) {
      setError('Failed to process subscription upgrade');
      // eslint-disable-next-line no-console
      console.error('Subscription upgrade error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!cardForm.number || !cardForm.expiry || !cardForm.cvc || !cardForm.name) {
      setError('Please fill in all card details');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // In a real implementation, this would:
      // 1. Use Stripe Elements to securely collect card data
      // 2. Create payment method on Stripe
      // 3. Save payment method to customer
      // 4. Update local state

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: 'card',
        last4: cardForm.number.slice(-4),
        brand: 'visa', // Would be detected by Stripe
        expiryMonth: parseInt(cardForm.expiry.split('/')[0]),
        expiryYear: parseInt(`20${cardForm.expiry.split('/')[1]}`),
        isDefault: paymentMethods.length === 0
      };

      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      setCardForm({ number: '', expiry: '', cvc: '', name: '' });
      setAddCardDialogOpen(false);
      setSuccess('Payment method added successfully!');

    } catch (err: any) {
      setError('Failed to add payment method');
      // eslint-disable-next-line no-console
      console.error('Add payment method error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, this would call Stripe API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
      setSuccess('Payment method removed successfully!');

    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Remove payment method error:', err);
      setError('Failed to remove payment method');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Typography variant="h4" component="h1" gutterBottom>
        Billing & Payments
      </Typography>

      {/* Current Subscription */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Current Subscription
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Chip
            label={userProfile?.tier?.toUpperCase() || 'FREE'}
            color={userProfile?.tier === 'free' ? 'default' : 'primary'}
            sx={{ mr: 2 }}
          />
          {userProfile?.tier === 'free' && (
            <Typography variant="body2" color="text.secondary">
              Upgrade to unlock more features
            </Typography>
          )}
        </Box>
        
        {userProfile?.tier !== 'free' && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </Typography>
            <Button variant="outlined" size="small">
              Manage Subscription
            </Button>
          </Box>
        )}
      </Paper>

      {/* Subscription Plans */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Subscription Plans
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.id} 
              variant={plan.recommended ? 'outlined' : 'elevation'}
              sx={{ 
                position: 'relative',
                border: plan.recommended ? '2px solid' : undefined,
                borderColor: plan.recommended ? 'primary.main' : undefined
              }}
            >
              {plan.recommended && (
                <Chip
                  label="Recommended"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  ${plan.price}
                  <Typography component="span" variant="body2" color="text.secondary">
                    /{plan.interval}
                  </Typography>
                </Typography>
                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters>
                      <CheckIcon color="success" sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">{feature}</Typography>
                    </ListItem>
                  ))}
                </List>
                <Button
                  fullWidth
                  variant={plan.id === userProfile?.tier ? 'outlined' : 'contained'}
                  disabled={plan.id === userProfile?.tier || loading}
                  onClick={() => handleSubscriptionUpgrade(plan.id)}
                  sx={{ mt: 2 }}
                >
                  {plan.id === userProfile?.tier ? 'Current Plan' : 
                   plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      {/* Payment Methods */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Payment Methods</Typography>
          <Button
            variant="outlined"
            startIcon={<CreditCardIcon />}
            onClick={() => setAddCardDialogOpen(true)}
          >
            Add Card
          </Button>
        </Box>

        {paymentMethods.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CreditCardIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No payment methods added
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add a payment method to manage your subscription
            </Typography>
          </Box>
        ) : (
          <List>
            {paymentMethods.map((method) => (
              <ListItem key={method.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <CreditCardIcon sx={{ mr: 1 }} />
                </Box>
                <ListItemText
                  primary={`**** **** **** ${method.last4}`}
                  secondary={`${method.brand.toUpperCase()} • Expires ${method.expiryMonth}/${method.expiryYear}`}
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {method.isDefault && (
                      <Chip label="Default" size="small" color="primary" />
                    )}
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeletePaymentMethod(method.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Billing History */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Billing History
        </Typography>

        {billingHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No billing history yet
            </Typography>
          </Box>
        ) : (
          <List>
            {billingHistory.map((invoice) => (
              <ListItem key={invoice.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {invoice.status === 'succeeded' && <CheckIcon color="success" />}
                  {invoice.status === 'pending' && <InfoIcon color="info" />}
                  {invoice.status === 'failed' && <ErrorIcon color="error" />}
                </Box>
                <ListItemText
                  primary={invoice.description}
                  secondary={`${invoice.date.toLocaleDateString()} • $${invoice.amount.toFixed(2)} ${invoice.currency.toUpperCase()}`}
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={invoice.status}
                      size="small"
                      color={
                        invoice.status === 'succeeded' ? 'success' :
                        invoice.status === 'pending' ? 'warning' : 'error'
                      }
                    />
                    {invoice.invoiceUrl && (
                      <Button size="small" href={invoice.invoiceUrl} target="_blank">
                        Download
                      </Button>
                    )}
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Add Card Dialog */}
      <Dialog open={addCardDialogOpen} onClose={() => setAddCardDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Payment Method</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Your payment information is securely processed by Stripe. We never store your card details.
            </Typography>
          </Alert>
          
          <TextField
            fullWidth
            label="Card Number"
            value={cardForm.number}
            onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
            placeholder="1234 5678 9012 3456"
            inputProps={{ maxLength: 19 }}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField
              label="Expiry Date"
              value={cardForm.expiry}
              onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
              placeholder="MM/YY"
              inputProps={{ maxLength: 5 }}
            />
            <TextField
              label="CVC"
              value={cardForm.cvc}
              onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value.replace(/\D/g, '') })}
              placeholder="123"
              inputProps={{ maxLength: 4 }}
            />
          </Box>
          
          <TextField
            fullWidth
            label="Cardholder Name"
            value={cardForm.name}
            onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
            placeholder="John Doe"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCardDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddPaymentMethod} 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
          >
            Add Card
          </Button>
        </DialogActions>
      </Dialog>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default PaymentIntegration;