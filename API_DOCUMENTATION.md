# Subtrax API Documentation

Complete API documentation for the Subtrax subscription management platform, including database operations, authentication, and payment processing.

## 📚 Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Database Service API](#database-service-api)
- [User Management](#user-management)
- [Subscription Management](#subscription-management)
- [Analytics](#analytics)
- [Payments](#payments)
- [Error Handling](#error-handling)

## 🔍 Overview

The Subtrax API provides a comprehensive interface for managing subscriptions, users, analytics, and payments. Built on Firebase Firestore with TypeScript for type safety.

### Base Configuration
```typescript
// Firebase Configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};

// Database Service Instance
import { DatabaseService } from './services/DatabaseService';
const dbService = new DatabaseService();
```

## 🔐 Authentication

### Firebase Authentication Integration

```typescript
// Authentication Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  googleSignIn: () => Promise<UserCredential>;
}
```

### Authentication Methods

#### Login
```typescript
const login = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await dbService.createUserProfile(result.user.uid, {
      email: result.user.email!,
      displayName: result.user.displayName || 'User'
    });
    return result;
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};
```

#### Google Sign-In
```typescript
const googleSignIn = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await dbService.createUserProfile(result.user.uid, {
    email: result.user.email!,
    displayName: result.user.displayName || 'User'
  });
  return result;
};
```

## 💾 Database Service API

### Core Database Operations

#### User Profile Management

**Create User Profile**
```typescript
async createUserProfile(
  userId: string, 
  userData: Partial<User>
): Promise<void>

// Usage
await dbService.createUserProfile('user123', {
  email: 'user@example.com',
  displayName: 'John Doe',
  tier: 'free'
});
```

**Get User Profile**
```typescript
async getUserProfile(userId: string): Promise<User | null>

// Usage
const user = await dbService.getUserProfile('user123');
```

**Update User Profile**
```typescript
async updateUserProfile(
  userId: string, 
  updates: Partial<User>
): Promise<void>

// Usage
await dbService.updateUserProfile('user123', {
  tier: 'pro',
  preferences: {
    notifications: true,
    currency: 'USD'
  }
});
```

#### Subscription Management

**Add Subscription**
```typescript
async addSubscription(subscription: Omit<Subscription, 'id'>): Promise<string>

// Usage
const subscriptionId = await dbService.addSubscription({
  userId: 'user123',
  name: 'Netflix',
  cost: 15.99,
  currency: 'USD',
  billingCycle: 'monthly',
  category: 'Entertainment',
  status: 'active',
  nextBilling: new Date('2024-02-01'),
  provider: {
    name: 'Netflix',
    url: 'https://netflix.com',
    logo: 'netflix-logo.png'
  },
  billing: {
    method: 'credit_card',
    lastCharged: new Date(),
    paymentMethodId: 'pm_123'
  },
  usage: {
    lastAccessed: new Date(),
    frequency: 'daily'
  }
});
```

**Get User Subscriptions**
```typescript
async getUserSubscriptions(userId: string): Promise<Subscription[]>

// Usage
const subscriptions = await dbService.getUserSubscriptions('user123');
```

**Update Subscription**
```typescript
async updateSubscription(
  subscriptionId: string, 
  updates: Partial<Subscription>
): Promise<void>

// Usage
await dbService.updateSubscription('sub123', {
  cost: 17.99,
  status: 'paused'
});
```

**Delete Subscription**
```typescript
async deleteSubscription(subscriptionId: string): Promise<void>

// Usage
await dbService.deleteSubscription('sub123');
```

#### Real-time Subscriptions

**Subscribe to User Data Changes**
```typescript
subscribeToUserSubscriptions(
  userId: string, 
  callback: (subscriptions: Subscription[]) => void
): () => void

// Usage
const unsubscribe = dbService.subscribeToUserSubscriptions('user123', (subs) => {
  console.log('Subscriptions updated:', subs);
});

// Cleanup
unsubscribe();
```

### Analytics Operations

**Add Analytics Data**
```typescript
async addAnalyticsData(analytics: Omit<Analytics, 'id'>): Promise<string>

// Usage
const analyticsId = await dbService.addAnalyticsData({
  userId: 'user123',
  date: new Date(),
  totalSpending: 150.97,
  subscriptionCount: 8,
  categoryBreakdown: {
    'Entertainment': 45.98,
    'Productivity': 29.99,
    'Cloud Storage': 15.00,
    'Music': 9.99
  },
  monthlyTrend: [120.50, 135.75, 150.97],
  insights: {
    topCategory: 'Entertainment',
    growthRate: 12.5,
    recommendations: ['Consider downgrading Netflix plan']
  }
});
```

**Get User Analytics**
```typescript
async getUserAnalytics(
  userId: string, 
  startDate?: Date, 
  endDate?: Date
): Promise<Analytics[]>

// Usage
const analytics = await dbService.getUserAnalytics(
  'user123',
  new Date('2024-01-01'),
  new Date('2024-02-01')
);
```

### AI Recommendations

**Add AI Recommendation**
```typescript
async addAIRecommendation(
  recommendation: Omit<AIRecommendation, 'id'>
): Promise<string>

// Usage
const recId = await dbService.addAIRecommendation({
  userId: 'user123',
  type: 'cost_optimization',
  title: 'Consider downgrading your streaming plan',
  description: 'You could save $5/month by switching to the basic plan',
  priority: 'medium',
  potentialSavings: 5.00,
  category: 'Entertainment',
  actionable: true,
  relatedSubscriptionId: 'sub123',
  createdAt: new Date(),
  status: 'pending'
});
```

**Get User Recommendations**
```typescript
async getUserRecommendations(userId: string): Promise<AIRecommendation[]>

// Usage
const recommendations = await dbService.getUserRecommendations('user123');
```

### Transaction Management

**Add Transaction**
```typescript
async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<string>

// Usage
const transactionId = await dbService.addTransaction({
  userId: 'user123',
  subscriptionId: 'sub123',
  amount: 15.99,
  currency: 'USD',
  type: 'subscription_payment',
  status: 'completed',
  paymentMethod: 'credit_card',
  stripePaymentIntentId: 'pi_123',
  description: 'Netflix monthly subscription',
  createdAt: new Date(),
  metadata: {
    plan: 'standard',
    billing_cycle: 'monthly'
  }
});
```

**Get User Transactions**
```typescript
async getUserTransactions(
  userId: string, 
  limit?: number
): Promise<Transaction[]>

// Usage
const transactions = await dbService.getUserTransactions('user123', 50);
```

### Batch Operations

**Process Multiple Operations**
```typescript
async batchWrite(operations: BatchOperation[]): Promise<void>

// Usage
await dbService.batchWrite([
  {
    type: 'create',
    collection: 'subscriptions',
    data: { /* subscription data */ }
  },
  {
    type: 'update',
    collection: 'users',
    id: 'user123',
    data: { lastActive: new Date() }
  },
  {
    type: 'delete',
    collection: 'subscriptions',
    id: 'sub456'
  }
]);
```

### User Statistics

**Get Comprehensive User Stats**
```typescript
async getUserStatistics(userId: string): Promise<UserStatistics>

// Usage
const stats = await dbService.getUserStatistics('user123');
// Returns:
// {
//   totalSubscriptions: 8,
//   activeSubscriptions: 6,
//   pausedSubscriptions: 2,
//   totalMonthlySpending: 150.97,
//   averageSubscriptionCost: 18.87,
//   categoryBreakdown: { /* categories */ },
//   upcomingRenewals: [ /* subscriptions */ ],
//   recentActivity: [ /* recent changes */ ]
// }
```

## 💳 Payment Integration

### Stripe Integration

**Create Payment Intent**
```typescript
// Client-side payment processing
const createPaymentIntent = async (amount: number, currency: string) => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await user.getIdToken()}`
    },
    body: JSON.stringify({
      amount: amount * 100, // Convert to cents
      currency: currency.toLowerCase()
    })
  });
  
  return response.json();
};
```

**Subscription Management**
```typescript
// Create subscription
const createSubscription = async (priceId: string, paymentMethodId: string) => {
  const response = await fetch('/api/create-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await user.getIdToken()}`
    },
    body: JSON.stringify({
      priceId,
      paymentMethodId
    })
  });
  
  return response.json();
};
```

### Payment Methods

**Add Payment Method**
```typescript
const addPaymentMethod = async (paymentMethod: any) => {
  const response = await fetch('/api/payment-methods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await user.getIdToken()}`
    },
    body: JSON.stringify({ paymentMethod })
  });
  
  return response.json();
};
```

**Get Payment Methods**
```typescript
const getPaymentMethods = async () => {
  const response = await fetch('/api/payment-methods', {
    headers: {
      'Authorization': `Bearer ${await user.getIdToken()}`
    }
  });
  
  return response.json();
};
```

## 📊 Data Models

### User Interface
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  tier: 'free' | 'pro' | 'enterprise';
  preferences: UserPreferences;
  metadata: UserMetadata;
  createdAt: Timestamp;
  lastActive: Timestamp;
}

interface UserPreferences {
  currency: string;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  emailNotifications: {
    renewalReminders: boolean;
    savingsAlerts: boolean;
    weeklyDigest: boolean;
  };
}

interface UserMetadata {
  signupMethod: 'email' | 'google' | 'facebook';
  referralCode?: string;
  lastLoginIP?: string;
  deviceInfo?: string;
}
```

### Subscription Interface
```typescript
interface Subscription {
  id: string;
  userId: string;
  name: string;
  cost: number;
  currency: string;
  billingCycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: string;
  status: 'active' | 'paused' | 'cancelled' | 'trial';
  nextBilling: Date;
  provider: ProviderInfo;
  billing: BillingInfo;
  usage: UsageInfo;
  aiInsights: AIInsights;
  notifications: NotificationSettings;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ProviderInfo {
  name: string;
  url: string;
  logo?: string;
  supportContact?: string;
  cancellationUrl?: string;
}

interface BillingInfo {
  method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
  lastCharged: Date;
  nextCharge: Date;
  paymentMethodId?: string;
  invoiceUrl?: string;
}

interface UsageInfo {
  lastAccessed: Date;
  frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  usageScore?: number; // 1-10 scale
  features: string[];
}
```

### Analytics Interface
```typescript
interface Analytics {
  id: string;
  userId: string;
  date: Date;
  totalSpending: number;
  subscriptionCount: number;
  categoryBreakdown: Record<string, number>;
  monthlyTrend: number[];
  insights: AnalyticsInsights;
  createdAt: Timestamp;
}

interface AnalyticsInsights {
  topCategory: string;
  growthRate: number;
  savingsOpportunity: number;
  recommendations: string[];
  spendingPattern: 'increasing' | 'decreasing' | 'stable';
}
```

### AI Recommendation Interface
```typescript
interface AIRecommendation {
  id: string;
  userId: string;
  type: 'cost_optimization' | 'usage_improvement' | 'alternative_service' | 'cancellation_suggestion';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  potentialSavings: number;
  category: string;
  actionable: boolean;
  relatedSubscriptionId?: string;
  status: 'pending' | 'applied' | 'dismissed';
  createdAt: Timestamp;
  expiresAt?: Timestamp;
}
```

### Transaction Interface
```typescript
interface Transaction {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  type: 'subscription_payment' | 'refund' | 'upgrade' | 'downgrade';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  stripePaymentIntentId?: string;
  description: string;
  createdAt: Timestamp;
  metadata?: Record<string, any>;
}
```

## ❌ Error Handling

### Error Types
```typescript
enum DatabaseError {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  SUBSCRIPTION_NOT_FOUND = 'SUBSCRIPTION_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  INVALID_DATA = 'INVALID_DATA',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

class DatabaseServiceError extends Error {
  constructor(
    message: string,
    public code: DatabaseError,
    public details?: any
  ) {
    super(message);
    this.name = 'DatabaseServiceError';
  }
}
```

### Error Handling Examples
```typescript
try {
  const user = await dbService.getUserProfile('user123');
  if (!user) {
    throw new DatabaseServiceError(
      'User profile not found',
      DatabaseError.USER_NOT_FOUND
    );
  }
} catch (error) {
  if (error instanceof DatabaseServiceError) {
    console.error(`Database error: ${error.code} - ${error.message}`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Validation
```typescript
// Input validation example
const validateSubscription = (subscription: Partial<Subscription>): boolean => {
  if (!subscription.name || subscription.name.trim().length === 0) {
    throw new DatabaseServiceError(
      'Subscription name is required',
      DatabaseError.INVALID_DATA
    );
  }
  
  if (!subscription.cost || subscription.cost <= 0) {
    throw new DatabaseServiceError(
      'Subscription cost must be greater than 0',
      DatabaseError.INVALID_DATA
    );
  }
  
  return true;
};
```

## 🔧 Usage Examples

### Complete User Flow
```typescript
// 1. User signup and profile creation
const signupAndCreateProfile = async (email: string, password: string) => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in database
    await dbService.createUserProfile(userCredential.user.uid, {
      email: email,
      displayName: email.split('@')[0],
      tier: 'free',
      preferences: {
        currency: 'USD',
        notifications: true,
        theme: 'auto',
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        emailNotifications: {
          renewalReminders: true,
          savingsAlerts: true,
          weeklyDigest: false
        }
      }
    });
    
    return userCredential;
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};

// 2. Add subscription and generate analytics
const addSubscriptionWithAnalytics = async (subscriptionData: any) => {
  try {
    // Add subscription
    const subscriptionId = await dbService.addSubscription(subscriptionData);
    
    // Update analytics
    const userSubscriptions = await dbService.getUserSubscriptions(subscriptionData.userId);
    const totalSpending = userSubscriptions.reduce((sum, sub) => sum + sub.cost, 0);
    
    await dbService.addAnalyticsData({
      userId: subscriptionData.userId,
      date: new Date(),
      totalSpending,
      subscriptionCount: userSubscriptions.length,
      categoryBreakdown: userSubscriptions.reduce((breakdown, sub) => {
        breakdown[sub.category] = (breakdown[sub.category] || 0) + sub.cost;
        return breakdown;
      }, {} as Record<string, number>),
      monthlyTrend: [totalSpending], // Would normally be historical data
      insights: {
        topCategory: 'Entertainment', // Would be calculated
        growthRate: 0,
        savingsOpportunity: 0,
        recommendations: [],
        spendingPattern: 'stable'
      }
    });
    
    return subscriptionId;
  } catch (error) {
    console.error('Failed to add subscription:', error);
    throw error;
  }
};

// 3. Real-time dashboard updates
const setupDashboardSubscriptions = (userId: string, updateCallback: Function) => {
  const unsubscribeSubscriptions = dbService.subscribeToUserSubscriptions(
    userId,
    (subscriptions) => {
      updateCallback({ subscriptions });
    }
  );
  
  // Cleanup function
  return () => {
    unsubscribeSubscriptions();
  };
};
```

## 🚀 Performance Optimization

### Firestore Best Practices
```typescript
// Use pagination for large datasets
const getPaginatedSubscriptions = async (
  userId: string, 
  pageSize: number = 10, 
  lastVisible?: any
) => {
  let query = db.collection('subscriptions')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(pageSize);
    
  if (lastVisible) {
    query = query.startAfter(lastVisible);
  }
  
  const snapshot = await query.get();
  const subscriptions = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  return {
    subscriptions,
    lastVisible: snapshot.docs[snapshot.docs.length - 1]
  };
};

// Use compound indexes for complex queries
const getSubscriptionsByStatusAndCategory = async (
  userId: string,
  status: string,
  category: string
) => {
  // Requires composite index: userId ASC, status ASC, category ASC
  const snapshot = await db.collection('subscriptions')
    .where('userId', '==', userId)
    .where('status', '==', status)
    .where('category', '==', category)
    .get();
    
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

### Caching Strategy
```typescript
// Simple cache implementation
class CacheService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutes
  
  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
  
  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
}
```

This API documentation provides a complete reference for all database operations, authentication flows, and payment processing in the Subtrax application. Use it as a guide for implementing features and integrating with the backend services.