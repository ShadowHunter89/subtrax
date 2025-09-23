import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  IconButton,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  MonetizationOn as MoneyIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  MarkEmailRead as MarkReadIcon,
  Email,
  Sms,
  Payment,
  Analytics,
  CurrencyExchange
} from '@mui/icons-material';
import { GoogleAnalyticsAPI, SendGridAPI, TwilioAPI } from '../services/ComprehensiveApiService';

interface Notification {
  id: string;
  type: 'renewal' | 'savings' | 'warning' | 'info' | 'success' | 'payment' | 'subscription' | 'analytics' | 'currency';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface NotificationSystemProps {
  userId?: string;
  enableEmailNotifications?: boolean;
  enableSmsNotifications?: boolean;
  phoneNumber?: string;
  emailAddress?: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  userId,
  enableEmailNotifications = false,
  enableSmsNotifications = false,
  phoneNumber,
  emailAddress
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  // Add notification function
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications
    setUnreadCount(prev => prev + 1);
    setCurrentNotification(newNotification);
    setSnackbarOpen(true);

    // Track notification
    GoogleAnalyticsAPI.trackEvent('notification_shown', {
      type: notification.type,
      severity: notification.severity || 'info',
      user_id: userId,
    });

    // Send external notifications if enabled
    if (enableEmailNotifications && emailAddress) {
      sendEmailNotification(newNotification);
    }

    if (enableSmsNotifications && phoneNumber) {
      sendSmsNotification(newNotification);
    }
  };

  // Send email notification
  const sendEmailNotification = async (notification: Notification) => {
    try {
      await SendGridAPI.sendEmail(
        emailAddress!,
        `Subtrax Notification: ${notification.title}`,
        `
          <h2>${notification.title}</h2>
          <p>${notification.message}</p>
          <p><strong>Time:</strong> ${notification.createdAt.toLocaleString()}</p>
          <p><strong>Type:</strong> ${notification.type}</p>
        `
      );
    } catch (error) {
      // Silent fail for demo
    }
  };

  // Send SMS notification
  const sendSmsNotification = async (notification: Notification) => {
    try {
      await TwilioAPI.sendSMS(
        phoneNumber!,
        `Subtrax: ${notification.title} - ${notification.message}`
      );
    } catch (error) {
      // Silent fail for demo
    }
  };

  // Notification helper functions
  const notifyPaymentSuccess = (amount: number, currency: string, provider: string) => {
    addNotification({
      type: 'payment',
      title: 'Payment Successful',
      message: `Payment of ${currency} ${amount} via ${provider} completed successfully.`,
      severity: 'success',
      read: false,
    });
  };

  const notifyPaymentFailure = (amount: number, currency: string, provider: string, error: string) => {
    addNotification({
      type: 'payment',
      title: 'Payment Failed',
      message: `Payment of ${currency} ${amount} via ${provider} failed: ${error}`,
      severity: 'error',
      read: false,
    });
  };

  const notifySubscriptionExpiring = (subscriptionName: string, daysLeft: number) => {
    addNotification({
      type: 'subscription',
      title: 'Subscription Expiring Soon',
      message: `Your ${subscriptionName} subscription expires in ${daysLeft} days.`,
      severity: 'warning',
      read: false,
    });
  };

  const notifySubscriptionRenewed = (subscriptionName: string) => {
    addNotification({
      type: 'subscription',
      title: 'Subscription Renewed',
      message: `Your ${subscriptionName} subscription has been successfully renewed.`,
      severity: 'success',
      read: false,
    });
  };

  const notifyCurrencyExchange = (fromCurrency: string, toCurrency: string, rate: number) => {
    addNotification({
      type: 'currency',
      title: 'Currency Exchange Update',
      message: `Current rate: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`,
      severity: 'info',
      read: false,
    });
  };

  const notifyAnalyticsInsight = (insight: string) => {
    addNotification({
      type: 'analytics',
      title: 'Analytics Insight',
      message: insight,
      severity: 'info',
      read: false,
    });
  };

  // Generate sample notifications (in real app, this would come from API)
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'renewal',
        title: 'Netflix Renewal Coming Up',
        message: 'Your Netflix subscription renews in 3 days for $15.99',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: false,
        actionUrl: '/subscriptions',
        actionText: 'View Details'
      },
      {
        id: '2',
        type: 'savings',
        title: 'Potential Savings Detected',
        message: 'You could save $12/month by switching to annual billing',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        read: false,
        actionUrl: '/analytics',
        actionText: 'See Savings'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Unused Subscription Detected',
        message: 'You haven\'t used Adobe Creative Suite in 30 days',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        read: true,
        actionUrl: '/subscriptions',
        actionText: 'Review'
      }
    ];

    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.read).length);
  }, [userId]);

  // Expose notification methods globally
  useEffect(() => {
    // @ts-ignore
    window.SubtraxNotifications = {
      notifyPaymentSuccess,
      notifyPaymentFailure,
      notifySubscriptionExpiring,
      notifySubscriptionRenewed,
      notifyCurrencyExchange,
      notifyAnalyticsInsight,
      addNotification,
    };

    return () => {
      // @ts-ignore
      delete window.SubtraxNotifications;
    };
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'renewal': return <MoneyIcon color="warning" />;
      case 'savings': return <MoneyIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'info': return <InfoIcon color="info" />;
      case 'success': return <CheckCircleIcon color="success" />;
      case 'payment': return <Payment color="primary" />;
      case 'analytics': return <Analytics color="secondary" />;
      case 'currency': return <CurrencyExchange color="info" />;
      default: return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'renewal': return 'warning';
      case 'savings': return 'success';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'success': return 'success';
      case 'payment': return 'primary';
      case 'analytics': return 'secondary';
      case 'currency': return 'info';
      default: return 'default';
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      setSnackbarMessage('Notification marked as read');
      setCurrentNotification(null);
      setSnackbarOpen(true);
    } catch (error) {
      // Silent fail for demo
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      setSnackbarMessage('All notifications marked as read');
      setCurrentNotification(null);
      setSnackbarOpen(true);
    } catch (error) {
      // Silent fail for demo
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setSnackbarMessage('Notification deleted');
      setCurrentNotification(null);
      setSnackbarOpen(true);
    } catch (error) {
      // Silent fail for demo
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <IconButton 
          onClick={() => setIsOpen(!isOpen)}
          color="inherit"
        >
          <Badge badgeContent={unreadCount} color="error">
            {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
          </Badge>
        </IconButton>

        {isOpen && (
          <Card
            sx={{
              position: 'absolute',
              top: 50,
              right: 0,
              width: 400,
              maxHeight: 500,
              zIndex: 1000,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Notifications ({unreadCount} unread)
                </Typography>
                {unreadCount > 0 && (
                  <Button 
                    size="small" 
                    startIcon={<MarkReadIcon />}
                    onClick={markAllAsRead}
                  >
                    Mark All Read
                  </Button>
                )}
              </Box>
              
              <Divider />
              
              <List sx={{ maxHeight: 350, overflow: 'auto', p: 0 }}>
                {notifications.length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary="No notifications"
                      secondary="You're all caught up!"
                      sx={{ textAlign: 'center' }}
                    />
                  </ListItem>
                ) : (
                  notifications.map((notification) => (
                    <ListItem
                      key={notification.id}
                      sx={{
                        backgroundColor: !notification.read ? 'action.hover' : 'transparent',
                        borderLeft: !notification.read ? 3 : 0,
                        borderLeftColor: 'primary.main',
                        '&:hover': { backgroundColor: 'action.selected' }
                      }}
                    >
                      <ListItemIcon>
                        {getNotificationIcon(notification.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight={!notification.read ? 600 : 400}>
                              {notification.title}
                            </Typography>
                            <Chip
                              label={notification.type}
                              size="small"
                              color={getNotificationColor(notification.type) as any}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {formatDate(notification.createdAt)}
                            </Typography>
                            {notification.actionUrl && (
                              <Button 
                                size="small" 
                                sx={{ ml: 1, mt: 0.5 }}
                                onClick={() => {
                                  window.location.href = notification.actionUrl!;
                                }}
                              >
                                {notification.actionText}
                              </Button>
                            )}
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {!notification.read && (
                          <IconButton 
                            size="small" 
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <MarkReadIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton 
                          size="small" 
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Current Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={currentNotification?.severity || 'success'}
          variant="filled"
        >
          <Typography variant="subtitle2">
            {currentNotification?.title || snackbarMessage}
          </Typography>
          {currentNotification?.message && (
            <Typography variant="body2">
              {currentNotification.message}
            </Typography>
          )}
        </Alert>
      </Snackbar>

      {/* Notification Settings Info */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {enableEmailNotifications && emailAddress && (
            <Tooltip title="Email notifications enabled">
              <Chip icon={<Email />} label="Email" size="small" color="primary" />
            </Tooltip>
          )}
          {enableSmsNotifications && phoneNumber && (
            <Tooltip title="SMS notifications enabled">
              <Chip icon={<Sms />} label="SMS" size="small" color="secondary" />
            </Tooltip>
          )}
        </Box>
      </Box>
    </>
  );
};

export default NotificationSystem;

// Export notification helper functions for external use
export const NotificationHelpers = {
  notifyPaymentSuccess: (amount: number, currency: string, provider: string) => {
    // @ts-ignore
    if (window.SubtraxNotifications) {
      // @ts-ignore
      window.SubtraxNotifications.notifyPaymentSuccess(amount, currency, provider);
    }
  },
  notifyPaymentFailure: (amount: number, currency: string, provider: string, error: string) => {
    // @ts-ignore
    if (window.SubtraxNotifications) {
      // @ts-ignore
      window.SubtraxNotifications.notifyPaymentFailure(amount, currency, provider, error);
    }
  },
  notifySubscriptionExpiring: (subscriptionName: string, daysLeft: number) => {
    // @ts-ignore
    if (window.SubtraxNotifications) {
      // @ts-ignore
      window.SubtraxNotifications.notifySubscriptionExpiring(subscriptionName, daysLeft);
    }
  },
  notifySubscriptionRenewed: (subscriptionName: string) => {
    // @ts-ignore
    if (window.SubtraxNotifications) {
      // @ts-ignore
      window.SubtraxNotifications.notifySubscriptionRenewed(subscriptionName);
    }
  },
  notifyCurrencyExchange: (fromCurrency: string, toCurrency: string, rate: number) => {
    // @ts-ignore
    if (window.SubtraxNotifications) {
      // @ts-ignore
      window.SubtraxNotifications.notifyCurrencyExchange(fromCurrency, toCurrency, rate);
    }
  },
  notifyAnalyticsInsight: (insight: string) => {
    // @ts-ignore
    // @ts-ignore
    if (window.SubtraxNotifications) {
      // @ts-ignore
      window.SubtraxNotifications.notifyAnalyticsInsight(insight);
    }
  },
};