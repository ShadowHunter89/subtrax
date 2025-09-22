import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Divider,
  Alert,
  Snackbar,
  Avatar,
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  AccountCircle as AccountIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Camera as CameraIcon,
  Download as ExportIcon,
  CloudDownload as BackupIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    renewalReminders: boolean;
    savingsAlerts: boolean;
    weeklyReports: boolean;
    marketingEmails: boolean;
  };
  privacy: {
    analyticsOptIn: boolean;
    marketingOptIn: boolean;
    shareUsageData: boolean;
    profileVisibility: 'public' | 'private' | 'friends';
  };
  display: {
    darkMode: boolean;
    currency: string;
    dateFormat: string;
    timezone: string;
    language: string;
  };
  account: {
    displayName: string;
    email: string;
    phoneNumber: string;
    bio: string;
  };
}

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const UserSettingsPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: false,
      renewalReminders: true,
      savingsAlerts: true,
      weeklyReports: true,
      marketingEmails: false
    },
    privacy: {
      analyticsOptIn: true,
      marketingOptIn: false,
      shareUsageData: true,
      profileVisibility: 'private'
    },
    display: {
      darkMode: false,
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      timezone: 'UTC',
      language: 'en'
    },
    account: {
      displayName: userProfile?.displayName || '',
      email: currentUser?.email || '',
      phoneNumber: '',
      bio: ''
    }
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'PKR', label: 'Pakistani Rupee (₨)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'ur', label: 'Urdu' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'Asia/Karachi', label: 'Pakistan Standard Time' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'Greenwich Mean Time' }
  ];

  useEffect(() => {
    // Load user settings from API
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      // In real app, fetch from API
      // const response = await fetch('/api/users/settings');
      // const data = await response.json();
      // setSettings(data.settings);
    } catch (error) {
      setShowError(true);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // In real app, save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
    } catch (error) {
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      // In real app, call export API
      const dataToExport = {
        settings,
        profile: userProfile,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subtrax-user-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setShowError(true);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // In real app, call delete API
      setDeleteDialogOpen(false);
      // Redirect to goodbye page
    } catch (error) {
      setShowError(true);
    }
  };

  const updateSettings = (section: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Settings
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Manage your account preferences and privacy settings
      </Typography>

      <Paper sx={{ borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab icon={<AccountIcon />} label="Account" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<SecurityIcon />} label="Privacy & Security" />
          <Tab icon={<ThemeIcon />} label="Display" />
        </Tabs>

        {/* Account Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton size="small" sx={{ bgcolor: 'primary.main', color: 'white' }}>
                        <CameraIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <Avatar
                      sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                      src={(userProfile as any)?.photoURL || undefined}
                    >
                      {settings.account.displayName.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                  <Typography variant="h6" gutterBottom>
                    {settings.account.displayName || 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userProfile?.tier?.toUpperCase() || 'FREE'} Plan
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Display Name"
                      value={settings.account.displayName}
                      onChange={(e) => updateSettings('account', 'displayName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={settings.account.email}
                      disabled
                      helperText="Contact support to change email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={settings.account.phoneNumber}
                      onChange={(e) => updateSettings('account', 'phoneNumber', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={3}
                      value={settings.account.bio}
                      onChange={(e) => updateSettings('account', 'bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
                disabled={isLoading}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={handleExportData}
              >
                Export Data
              </Button>
              <Button
                variant="outlined"
                startIcon={<BackupIcon />}
                color="secondary"
              >
                Backup Settings
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            
            <List>
              {Object.entries(settings.notifications).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    secondary={getNotificationDescription(key)}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={value}
                      onChange={(e) => updateSettings('notifications', key, e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </TabPanel>

        {/* Privacy & Security Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" gutterBottom>
              Privacy Settings
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText
                  primary="Analytics & Usage Data"
                  secondary="Help improve our service by sharing anonymous usage data"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.privacy.analyticsOptIn}
                    onChange={(e) => updateSettings('privacy', 'analyticsOptIn', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemText
                  primary="Marketing Communications"
                  secondary="Receive promotional emails and offers"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.privacy.marketingOptIn}
                    onChange={(e) => updateSettings('privacy', 'marketingOptIn', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom color="error">
              Danger Zone
            </Typography>
            
            <Card sx={{ border: '1px solid', borderColor: 'error.main', p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Delete Account
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Account
              </Button>
            </Card>
          </Box>
        </TabPanel>

        {/* Display Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={settings.display.currency}
                    onChange={(e) => updateSettings('display', 'currency', e.target.value)}
                    label="Currency"
                  >
                    {currencies.map(currency => (
                      <MenuItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.display.language}
                    onChange={(e) => updateSettings('display', 'language', e.target.value)}
                    label="Language"
                  >
                    {languages.map(lang => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.display.timezone}
                    onChange={(e) => updateSettings('display', 'timezone', e.target.value)}
                    label="Timezone"
                  >
                    {timezones.map(tz => (
                      <MenuItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date Format"
                  value={settings.display.dateFormat}
                  onChange={(e) => updateSettings('display', 'dateFormat', e.target.value)}
                  helperText="e.g., MM/DD/YYYY or DD/MM/YYYY"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.display.darkMode}
                      onChange={(e) => updateSettings('display', 'darkMode', e.target.checked)}
                    />
                  }
                  label="Dark Mode"
                />
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone and will permanently delete:
          </Typography>
          <List dense sx={{ mt: 2 }}>
            <ListItem>• All your subscription data</ListItem>
            <ListItem>• Payment history and analytics</ListItem>
            <ListItem>• Account preferences and settings</ListItem>
            <ListItem>• AI recommendations and insights</ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success">Settings saved successfully!</Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
      >
        <Alert severity="error">Error saving settings. Please try again.</Alert>
      </Snackbar>
    </Box>
  );
};

// Helper function for notification descriptions
const getNotificationDescription = (key: string): string => {
  const descriptions: { [key: string]: string } = {
    email: 'Receive notifications via email',
    push: 'Browser push notifications',
    renewalReminders: 'Get notified before subscriptions renew',
    savingsAlerts: 'Alerts about potential savings opportunities',
    weeklyReports: 'Weekly spending summary reports',
    marketingEmails: 'Promotional content and feature updates'
  };
  return descriptions[key] || '';
};

export default UserSettingsPage;