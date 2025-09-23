import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import ComprehensiveApiManager, { GoogleAnalyticsAPI } from '../services/ComprehensiveApiService.ts';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  subscription?: {
    id: string;
    name: string;
    cost: number;
    currency: string;
  };
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose, subscription }) => {
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'paypal' | 'square'>('stripe');
  const [amount, setAmount] = useState(subscription?.cost?.toString() || '');
  const [currency, setCurrency] = useState(subscription?.currency || 'USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const paymentAmount = parseFloat(amount);
      
      if (!paymentAmount || paymentAmount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      const result = await ComprehensiveApiManager.processPayment(
        paymentProvider,
        paymentAmount,
        currency
      );

      if (result) {
        setSuccess(true);
        
        // Track payment success
        GoogleAnalyticsAPI.trackEvent('payment_initiated', {
          provider: paymentProvider,
          amount: paymentAmount,
          currency: currency,
          subscription_id: subscription?.id,
        });
        
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      
      // Track payment failure
      GoogleAnalyticsAPI.trackEvent('payment_failed', {
        provider: paymentProvider,
        amount: parseFloat(amount),
        currency: currency,
        error: 'payment_processing_error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {subscription ? `Pay for ${subscription.name}` : 'Process Payment'}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Payment initiated successfully! Redirecting to payment provider...
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Payment Provider</InputLabel>
            <Select
              value={paymentProvider}
              label="Payment Provider"
              onChange={(e) => setPaymentProvider(e.target.value as 'stripe' | 'paypal' | 'square')}
              disabled={loading}
            >
              <MenuItem value="stripe">Stripe</MenuItem>
              <MenuItem value="paypal">PayPal</MenuItem>
              <MenuItem value="square">Square</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            inputProps={{ min: 0, step: 0.01 }}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select
              value={currency}
              label="Currency"
              onChange={(e) => setCurrency(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="USD">USD - US Dollar</MenuItem>
              <MenuItem value="EUR">EUR - Euro</MenuItem>
              <MenuItem value="GBP">GBP - British Pound</MenuItem>
              <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
              <MenuItem value="AUD">AUD - Australian Dollar</MenuItem>
              <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
            </Select>
          </FormControl>

          {subscription && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Subscription Details:
              </Typography>
              <Typography variant="body2">
                {subscription.name} - {currency} {amount}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handlePayment} 
          variant="contained" 
          disabled={loading || !amount}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Processing...' : `Pay with ${paymentProvider}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;