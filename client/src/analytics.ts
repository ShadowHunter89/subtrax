// Simple analytics event logger (extend for production)
export function logEvent(event: string, data?: any) {
  // In production, send to Google Analytics, Mixpanel, or your backend
  console.log("Analytics event:", event, data);
}
