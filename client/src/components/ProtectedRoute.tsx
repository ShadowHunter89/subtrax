import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireTier?: 'free' | 'pro' | 'enterprise';
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireTier,
  fallback 
}: ProtectedRouteProps) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (requireAuth && !currentUser) {
    return fallback ? <>{fallback}</> : <Navigate to="/auth" replace />;
  }

  if (requireTier && userProfile) {
    const tierLevels = { free: 0, pro: 1, enterprise: 2 };
    const userTierLevel = tierLevels[userProfile.tier];
    const requiredTierLevel = tierLevels[requireTier];
    
    if (userTierLevel < requiredTierLevel) {
      return <Navigate to="/upgrade" replace />;
    }
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}