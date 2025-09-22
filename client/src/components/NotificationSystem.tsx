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
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  MonetizationOn as MoneyIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  MarkEmailRead as MarkReadIcon
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'renewal' | 'savings' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationSystemProps {
  userId?: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      },
      {
        id: '4',
        type: 'info',
        title: 'New Feature Available',
        message: 'AI recommendations are now available for all users',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        read: true,
        actionUrl: '/ai',
        actionText: 'Try Now'
      },
      {
        id: '5',
        type: 'success',
        title: 'Subscription Cancelled Successfully',
        message: 'Your Hulu subscription has been cancelled and you\'ll save $12.99/month',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        read: true
      }
    ];

    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.read).length);
  }, [userId]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'renewal': return <MoneyIcon color="warning" />;
      case 'savings': return <MoneyIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'info': return <InfoIcon color="info" />;
      case 'success': return <CheckCircleIcon color="success" />;
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
      default: return 'default';
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // In real app, make API call to mark as read
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      setSnackbarMessage('Notification marked as read');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // In real app, make API call to mark all as read
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      setSnackbarMessage('All notifications marked as read');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // In real app, make API call to delete notification
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setSnackbarMessage('Notification deleted');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting notification:', error);
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
                                  // Navigate to action URL
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationSystem;