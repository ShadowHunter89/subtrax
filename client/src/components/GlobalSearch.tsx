import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Subscriptions as SubscriptionsIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  ContactSupport as ContactIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'subscription' | 'feature' | 'help' | 'page';
  action?: () => void;
}

interface GlobalSearchProps {
  onNavigate?: (path: string) => void;
  onClose?: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Sample search data - in a real app, this would come from various sources
  const searchData: SearchResult[] = [
    // Subscriptions
    { id: '1', title: 'Add New Subscription', description: 'Track a new subscription service', category: 'Actions', type: 'feature', action: () => onNavigate?.('/dashboard') },
    { id: '2', title: 'View All Subscriptions', description: 'See all your tracked subscriptions', category: 'Actions', type: 'feature', action: () => onNavigate?.('/dashboard') },
    { id: '3', title: 'Cancel Subscription', description: 'Learn how to cancel subscriptions', category: 'Help', type: 'help' },
    
    // Analytics
    { id: '4', title: 'Spending Analytics', description: 'View your subscription spending trends', category: 'Analytics', type: 'feature', action: () => onNavigate?.('/analytics') },
    { id: '5', title: 'Cost Breakdown', description: 'See spending by category', category: 'Analytics', type: 'feature' },
    
    // Account
    { id: '6', title: 'Account Settings', description: 'Manage your account preferences', category: 'Account', type: 'page', action: () => onNavigate?.('/settings') },
    { id: '7', title: 'Billing Information', description: 'Update payment methods', category: 'Account', type: 'page', action: () => onNavigate?. ('/billing') },
    { id: '8', title: 'Upgrade Plan', description: 'Upgrade to Pro or Enterprise', category: 'Account', type: 'feature' },
    
    // Help & Support
    { id: '9', title: 'Contact Support', description: 'Get help from our team', category: 'Support', type: 'help', action: () => onNavigate?.('/help') },
    { id: '10', title: 'FAQ', description: 'Frequently asked questions', category: 'Support', type: 'help' },
    { id: '11', title: 'Privacy Policy', description: 'Read our privacy policy', category: 'Legal', type: 'page', action: () => onNavigate?.('/privacy') },
    { id: '12', title: 'Terms of Service', description: 'View terms and conditions', category: 'Legal', type: 'page', action: () => onNavigate?.('/terms') },
    
    // Features
    { id: '13', title: 'AI Recommendations', description: 'Get AI-powered subscription advice', category: 'Features', type: 'feature' },
    { id: '14', title: 'Export Data', description: 'Download your subscription data', category: 'Features', type: 'feature' },
    { id: '15', title: 'Notifications', description: 'Manage renewal reminders', category: 'Features', type: 'feature' }
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 8)); // Limit results
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.action) {
      result.action();
    }
    handleClear();
    onClose?.();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'subscription': return <SubscriptionsIcon />;
      case 'feature': return <AnalyticsIcon />;
      case 'help': return <ContactIcon />;
      case 'page': return <SettingsIcon />;
      default: return <PersonIcon />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: any } = {
      'Actions': 'primary',
      'Analytics': 'secondary',
      'Account': 'info',
      'Support': 'success',
      'Legal': 'warning',
      'Features': 'error'
    };
    return colors[category] || 'default';
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
      <TextField
        fullWidth
        placeholder="Search subscriptions, features, help..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: 'background.paper'
          }
        }}
      />
      
      {isOpen && results.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            maxHeight: 400,
            overflow: 'auto'
          }}
        >
          <List disablePadding>
            {results.map((result, index) => (
              <React.Fragment key={result.id}>
                <ListItem
                  onClick={() => handleResultClick(result)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getIcon(result.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">
                          {result.title}
                        </Typography>
                        <Chip
                          label={result.category}
                          size="small"
                          color={getCategoryColor(result.category)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={result.description}
                  />
                </ListItem>
                {index < results.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default GlobalSearch;