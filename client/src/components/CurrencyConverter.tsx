import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Grid,
  Chip,
  Paper,
} from '@mui/material';
import {
  SwapHoriz,
  Refresh,
  TrendingUp,
  TrendingDown,
  Info,
  History,
} from '@mui/icons-material';
import { 
  GoogleAnalyticsAPI,
  ExchangeRateAPI,
  FixerAPI 
} from '../services/ComprehensiveApiService.ts';
import { NotificationHelpers } from './NotificationSystem';

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: Date;
}

interface CurrencyConverterProps {
  onConversion?: (from: string, to: string, amount: number, result: number) => void;
  compact?: boolean;
  defaultFromCurrency?: string;
  defaultToCurrency?: string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  onConversion,
  compact = false,
  defaultFromCurrency = 'USD',
  defaultToCurrency = 'EUR',
}) => {
  const [fromCurrency, setFromCurrency] = useState(defaultFromCurrency);
  const [toCurrency, setToCurrency] = useState(defaultToCurrency);
  const [amount, setAmount] = useState('100');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [recentRates, setRecentRates] = useState<ExchangeRate[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
  ];

  const convertCurrency = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (fromCurrency === toCurrency) {
      setConvertedAmount(parseFloat(amount));
      setExchangeRate(1);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try both APIs for better reliability
      let rate = null;
      let apiUsed = '';

      try {
        const result = await ExchangeRateAPI.convertCurrency(fromCurrency, toCurrency, parseFloat(amount));
        rate = result / parseFloat(amount); // Get the rate
        apiUsed = 'ExchangeRate-API';
      } catch (err) {
        // Fallback to Fixer API
        try {
          const result = await FixerAPI.convertCurrency(fromCurrency, toCurrency, parseFloat(amount));
          if (result) {
            rate = result / parseFloat(amount); // Get the actual rate
            apiUsed = 'Fixer.io';
          }
        } catch (err2) {
          throw new Error('Both currency APIs failed');
        }
      }

      if (rate) {
        const result = parseFloat(amount) * rate;
        setConvertedAmount(result);
        setExchangeRate(rate);
        setLastUpdated(new Date());

        // Add to recent rates
        const newRate: ExchangeRate = {
          from: fromCurrency,
          to: toCurrency,
          rate,
          timestamp: new Date(),
        };
        setRecentRates(prev => [newRate, ...prev.slice(0, 4)]);

        // Track conversion
        GoogleAnalyticsAPI.trackEvent('currency_conversion', {
          from_currency: fromCurrency,
          to_currency: toCurrency,
          amount: parseFloat(amount),
          result,
          rate,
          api_used: apiUsed,
        });

        // Notify about significant rate changes
        const lastRate = recentRates.find(r => r.from === fromCurrency && r.to === toCurrency);
        if (lastRate && Math.abs((rate - lastRate.rate) / lastRate.rate) > 0.05) {
          NotificationHelpers.notifyCurrencyExchange(
            fromCurrency,
            toCurrency,
            rate
          );
        }

        // Call onConversion callback
        if (onConversion) {
          onConversion(fromCurrency, toCurrency, parseFloat(amount), result);
        }
      }
    } catch (err: any) {
      setError('Failed to get exchange rate. Please try again.');
      // Error handled silently for production

      // Track error
      GoogleAnalyticsAPI.trackEvent('currency_conversion_error', {
        from_currency: fromCurrency,
        to_currency: toCurrency,
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    
    // Auto-convert after swap
    setTimeout(() => convertCurrency(), 100);
  };

  const getRateChangeIndicator = () => {
    if (recentRates.length < 2) return null;
    
    const current = recentRates[0];
    const previous = recentRates.find(r => 
      r.from === current.from && 
      r.to === current.to && 
      r.timestamp !== current.timestamp
    );
    
    if (!previous) return null;
    
    const change = ((current.rate - previous.rate) / previous.rate) * 100;
    const isUp = change > 0;
    
    return (
      <Tooltip title={`${isUp ? 'Up' : 'Down'} ${Math.abs(change).toFixed(2)}% from last check`}>
        <Chip
          size="small"
          icon={isUp ? <TrendingUp /> : <TrendingDown />}
          label={`${isUp ? '+' : ''}${change.toFixed(2)}%`}
          color={isUp ? 'success' : 'error'}
          variant="outlined"
        />
      </Tooltip>
    );
  };

  // Auto-convert on mount and when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency && amount) {
      convertCurrency();
    }
  }, [fromCurrency, toCurrency]);

  if (compact) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Currency Converter
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              size="small"
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl size="small" fullWidth>
              <Select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <IconButton size="small" onClick={swapCurrencies} disabled={loading}>
              <SwapHoriz />
            </IconButton>
          </Grid>
          <Grid item xs={3}>
            <FormControl size="small" fullWidth>
              <Select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button
              size="small"
              onClick={() => convertCurrency()}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
            >
              Convert
            </Button>
          </Grid>
        </Grid>
        
        {convertedAmount !== null && (
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant="body2" color="primary">
              {currencies.find(c => c.code === toCurrency)?.symbol}{convertedAmount.toFixed(2)} {toCurrency}
            </Typography>
            {exchangeRate && (
              <Typography variant="caption" color="text.secondary">
                Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h5">Currency Converter</Typography>
          <Tooltip title="Real-time exchange rates">
            <Info color="action" />
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <TextField
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>From Currency</InputLabel>
              <Select
                value={fromCurrency}
                label="From Currency"
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span">{currency.symbol}</Typography>
                      <Typography component="span">{currency.code}</Typography>
                      <Typography variant="body2" color="text.secondary" component="span">
                        - {currency.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton 
              onClick={swapCurrencies} 
              disabled={loading}
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <SwapHoriz />
            </IconButton>
          </Grid>

          <Grid item xs={12} md={5}>
            <TextField
              label="Converted Amount"
              value={convertedAmount !== null ? convertedAmount.toFixed(2) : ''}
              InputProps={{ readOnly: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>To Currency</InputLabel>
              <Select
                value={toCurrency}
                label="To Currency"
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span">{currency.symbol}</Typography>
                      <Typography component="span">{currency.code}</Typography>
                      <Typography variant="body2" color="text.secondary" component="span">
                        - {currency.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => convertCurrency()}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
            size="large"
          >
            {loading ? 'Converting...' : 'Convert Currency'}
          </Button>
        </Box>

        {exchangeRate && (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">Exchange Rate</Typography>
                {getRateChangeIndicator()}
              </Box>
              <Typography variant="h6" color="primary">
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </Typography>
              {lastUpdated && (
                <Typography variant="caption" color="text.secondary">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Typography>
              )}
            </Paper>
          </Box>
        )}

        {recentRates.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              <History sx={{ mr: 1, verticalAlign: 'middle' }} />
              Recent Conversions
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {recentRates.slice(0, 3).map((rate, index) => (
                <Chip
                  key={index}
                  label={`${rate.from}/${rate.to}: ${rate.rate.toFixed(4)}`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;