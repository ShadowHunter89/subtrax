import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  alpha
} from '@mui/material';
import {
  Security,
  Analytics,
  Notifications,
  Group,
  AutoAwesome,
  PlayArrow,
  CheckCircle,
  Twitter,
  GitHub,
  LinkedIn,
  Email
} from '@mui/icons-material';

const ModernLandingPage: React.FC = () => {
  const features = [
    {
      icon: <AutoAwesome sx={{ fontSize: 40, color: '#6366f1' }} />,
      title: 'AI-Powered Detection',
      description: 'Advanced algorithms automatically identify and categorize your recurring subscriptions'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#06b6d4' }} />,
      title: 'Secure Bank Integration',
      description: 'Connect your accounts safely with bank-level security via secure integration'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      title: 'Smart Analytics',
      description: 'Get insights into spending patterns and subscription trends with visual dashboards'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#10b981' }} />,
      title: 'Enterprise Security',
      description: 'Your financial data is protected with military-grade encryption and compliance'
    },
    {
      icon: <Notifications sx={{ fontSize: 40, color: '#f59e0b' }} />,
      title: 'Real-time Alerts',
      description: 'Instant notifications for new subscriptions, price changes, and renewal reminders'
    },
    {
      icon: <Group sx={{ fontSize: 40, color: '#ef4444' }} />,
      title: 'Team Management',
      description: 'Manage subscriptions across teams with role-based access and approval workflows'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'Perfect for individuals managing personal subscriptions',
      features: [
        'Up to 20 connected subscriptions',
        'Basic analytics and insights',
        'Email notifications',
        'Mobile app access',
        'Standard support'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for freelancers and small businesses',
      features: [
        'Up to 100 connected subscriptions',
        'Advanced analytics & reporting',
        'Team collaboration (up to 5 users)',
        'API access',
        'Priority support',
        'Custom categories',
        'Export capabilities'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'Complete solution for growing companies',
      features: [
        'Unlimited subscriptions',
        'Advanced AI insights',
        'Unlimited team members',
        'SSO integration',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
        'Advanced security features'
      ],
      popular: false
    }
  ];

  const stats = [
    { value: '$2.4M+', label: 'Money Saved' },
    { value: '50K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#6366f1' }}>
            Subtrax
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" sx={{ borderRadius: 2 }}>
              Sign In
            </Button>
            <Button variant="contained" sx={{ borderRadius: 2, bgcolor: '#6366f1' }}>
              Get Started
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* AI Banner */}
      <Container maxWidth="lg">
        <Box sx={{ 
          bgcolor: alpha('#6366f1', 0.1), 
          borderRadius: 2, 
          p: 2, 
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AutoAwesome sx={{ color: '#6366f1', mr: 1 }} />
          <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
            🚀 Now with AI-powered subscription detection
          </Typography>
        </Box>
      </Container>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h1" sx={{ 
            fontWeight: 800, 
            fontSize: { xs: '3rem', md: '4.5rem' },
            lineHeight: 1.2,
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🚀 Take Control of Your Subscriptions
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'text.secondary', 
            mb: 4,
            maxWidth: '800px',
            mx: 'auto',
            fontWeight: 400,
            lineHeight: 1.6
          }}>
            Discover, manage, and optimize all your recurring payments in one powerful platform. 
            Save money, prevent unwanted charges, and get complete visibility into your subscription spending.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 6 }}>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                bgcolor: '#6366f1', 
                borderRadius: 2, 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              startIcon={<PlayArrow />}
              sx={{ 
                borderRadius: 2, 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              View Demo
            </Button>
          </Stack>

          {/* Stats */}
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#6366f1' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
            Everything You Need to Master Your Subscriptions
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            Our comprehensive platform combines cutting-edge AI with intuitive design to 
            give you complete control over your recurring payments.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha('#6366f1', 0.1),
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 20px 40px ${alpha('#6366f1', 0.1)}`
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Choose the plan that fits your needs. All plans include our core features.
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
            <Typography>Monthly</Typography>
            <Button variant="outlined" size="small">Yearly</Button>
            <Chip label="Save 20%" color="primary" size="small" />
          </Stack>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 3,
                border: plan.popular ? '2px solid #6366f1' : '1px solid',
                borderColor: plan.popular ? '#6366f1' : alpha('#6366f1', 0.1),
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 20px 40px ${alpha('#6366f1', 0.15)}`
                }
              }}>
                {plan.popular && (
                  <Chip 
                    label="Most Popular" 
                    color="primary" 
                    sx={{ 
                      position: 'absolute', 
                      top: -12, 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      bgcolor: '#6366f1'
                    }} 
                  />
                )}
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {plan.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                    {plan.description}
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" component="span" sx={{ fontWeight: 700, color: '#6366f1' }}>
                      {plan.price}
                    </Typography>
                    <Typography variant="h6" component="span" sx={{ color: 'text.secondary' }}>
                      {plan.period}
                    </Typography>
                  </Box>
                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {plan.features.map((feature, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle sx={{ color: '#10b981', mr: 2, fontSize: 20 }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Button 
                    variant={plan.popular ? "contained" : "outlined"}
                    fullWidth
                    size="large"
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: plan.popular ? '#6366f1' : 'transparent',
                      fontWeight: 600
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ 
          textAlign: 'center',
          bgcolor: alpha('#6366f1', 0.05),
          borderRadius: 4,
          p: 6
        }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
            Ready to Take Control?
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Join thousands of users who have already saved money and simplified their subscription management.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ 
              bgcolor: '#6366f1', 
              borderRadius: 2, 
              px: 6, 
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600
            }}
          >
            Start Your Free Trial Today
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: alpha('#000', 0.05), py: 6, mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#6366f1', mb: 2 }}>
                Subtrax
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                The most comprehensive subscription management platform. Take control of your 
                recurring payments and save money effortlessly.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton size="small"><Twitter /></IconButton>
                <IconButton size="small"><GitHub /></IconButton>
                <IconButton size="small"><LinkedIn /></IconButton>
                <IconButton size="small"><Email /></IconButton>
              </Stack>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Product</Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Features</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Pricing</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Security</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>API</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Company</Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>About</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Blog</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Careers</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Press</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Support</Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Help Center</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Contact</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Status</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Community</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Legal</Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Privacy</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Terms</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Security</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Cookies</Typography>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4, pt: 4, borderTop: '1px solid', borderColor: alpha('#000', 0.1) }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              © 2024 Subtrax. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ModernLandingPage;