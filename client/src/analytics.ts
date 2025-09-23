// Simple analytics event logger (extend for production)
export function logEvent(_event: string, _data?: any) {
  // In production, send to Google Analytics, Mixpanel, or your backend
  // In a real application, this would send data to your analytics service
  // For now, we'll just handle it silently in production
  if (process.env.NODE_ENV === 'development') {
    // Debug analytics events only in development
  }
}
