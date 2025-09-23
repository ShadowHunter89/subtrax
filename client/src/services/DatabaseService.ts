// Firestore database service with comprehensive schemas and operations
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  Timestamp,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase.ts';

// Database Schemas
export interface User {
  uid: string;
  email: string;
  displayName: string;
  tier: 'free' | 'pro' | 'enterprise';
  stripeCustomerId?: string;
  createdAt: Timestamp;
  lastActive: Timestamp;
  preferences: UserPreferences;
  metadata: UserMetadata;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    renewalReminders: boolean;
    savingsAlerts: boolean;
  };
  privacy: {
    analyticsOptIn: boolean;
    marketingOptIn: boolean;
  };
  display: {
    darkMode: boolean;
    currency: string;
    dateFormat: string;
    timezone: string;
  };
}

export interface UserMetadata {
  signupSource: string;
  lastLoginIp?: string;
  totalSavings: number;
  subscriptionCount: number;
  accountStatus: 'active' | 'suspended' | 'deleted';
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  description?: string;
  cost: number;
  currency: string;
  billingCycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: string;
  status: 'active' | 'paused' | 'cancelled' | 'trial';
  provider: {
    name: string;
    website?: string;
    logo?: string;
    color?: string;
  };
  billing: {
    startDate: Timestamp;
    nextBilling?: Timestamp;
    lastBilled?: Timestamp;
    renewalDate?: Timestamp;
  };
  usage: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'rarely' | 'never';
    lastUsed?: Timestamp;
    usageScore: number; // 0-100
  };
  aiInsights: {
    recommendation: 'keep' | 'downgrade' | 'cancel' | 'switch';
    confidence: number;
    reasoning: string[];
    potentialSavings?: number;
  };
  notifications: {
    renewalReminder: boolean;
    usageAlerts: boolean;
    priceChangeAlerts: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Analytics {
  id: string;
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Timestamp;
  metrics: {
    totalSpending: number;
    activeSubscriptions: number;
    cancelledSubscriptions: number;
    newSubscriptions: number;
    averageCost: number;
    savingsRealized: number;
    categoryBreakdown: Record<string, number>;
    billingCycleBreakdown: Record<string, number>;
  };
  trends: {
    spendingChange: number;
    subscriptionChange: number;
    savingsChange: number;
  };
  aiInsights: {
    summary: string;
    recommendations: string[];
    alerts: string[];
  };
  createdAt: Timestamp;
}

export interface Transaction {
  id: string;
  userId: string;
  subscriptionId: string;
  type: 'charge' | 'refund' | 'credit';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: Timestamp;
  processedAt?: Timestamp;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  type: 'cost_optimization' | 'usage_alert' | 'alternative_suggestion' | 'billing_optimization';
  title: string;
  description: string;
  impact: {
    savings: number;
    effort: 'low' | 'medium' | 'high';
    timeframe: string;
  };
  status: 'pending' | 'accepted' | 'dismissed' | 'implemented';
  relatedSubscriptions: string[];
  actionUrl?: string;
  validUntil?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Database Service Class
export class DatabaseService {
  // User operations
  static async createUser(user: Omit<User, 'createdAt' | 'lastActive'>): Promise<void> {
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, {
      ...user,
      createdAt: Timestamp.now(),
      lastActive: Timestamp.now()
    });
  }

  static async getUser(uid: string): Promise<User | null> {
    const userDoc = doc(db, 'users', uid);
    const snapshot = await getDoc(userDoc);
    return snapshot.exists() ? snapshot.data() as User : null;
  }

  static async updateUser(uid: string, data: Partial<User>): Promise<void> {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, {
      ...data,
      lastActive: Timestamp.now()
    });
  }

  static async updateUserPreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
    const userDoc = doc(db, 'users', uid);
    await updateDoc(userDoc, {
      preferences,
      lastActive: Timestamp.now()
    });
  }

  // Subscription operations
  static async createSubscription(subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const subscriptionsRef = collection(db, 'subscriptions');
    const docRef = await addDoc(subscriptionsRef, {
      ...subscription,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  static async getUserSubscriptions(userId: string, status?: Subscription['status']): Promise<Subscription[]> {
    const subscriptionsRef = collection(db, 'subscriptions');
    let q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (status) {
      q = query(q, where('status', '==', status));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription));
  }

  static async updateSubscription(id: string, data: Partial<Subscription>): Promise<void> {
    const subscriptionDoc = doc(db, 'subscriptions', id);
    await updateDoc(subscriptionDoc, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  static async deleteSubscription(id: string): Promise<void> {
    const subscriptionDoc = doc(db, 'subscriptions', id);
    await deleteDoc(subscriptionDoc);
  }

  // Analytics operations
  static async createAnalytics(analytics: Omit<Analytics, 'id' | 'createdAt'>): Promise<string> {
    const analyticsRef = collection(db, 'analytics');
    const docRef = await addDoc(analyticsRef, {
      ...analytics,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  }

  static async getUserAnalytics(
    userId: string, 
    period: Analytics['period'],
    limitCount = 12
  ): Promise<Analytics[]> {
    const analyticsRef = collection(db, 'analytics');
    const q = query(
      analyticsRef,
      where('userId', '==', userId),
      where('period', '==', period),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Analytics));
  }

  // AI Recommendations
  static async createRecommendation(recommendation: Omit<AIRecommendation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const recommendationsRef = collection(db, 'recommendations');
    const docRef = await addDoc(recommendationsRef, {
      ...recommendation,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  static async getUserRecommendations(userId: string, status?: AIRecommendation['status']): Promise<AIRecommendation[]> {
    const recommendationsRef = collection(db, 'recommendations');
    let q = query(
      recommendationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (status) {
      q = query(q, where('status', '==', status));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AIRecommendation));
  }

  static async updateRecommendation(id: string, data: Partial<AIRecommendation>): Promise<void> {
    const recommendationDoc = doc(db, 'recommendations', id);
    await updateDoc(recommendationDoc, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  // Real-time subscriptions
  static subscribeToUserSubscriptions(
    userId: string, 
    callback: (subscriptions: Subscription[]) => void
  ): () => void {
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const subscriptions = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Subscription));
      callback(subscriptions);
    });
  }

  static subscribeToUserRecommendations(
    userId: string,
    callback: (recommendations: AIRecommendation[]) => void
  ): () => void {
    const recommendationsRef = collection(db, 'recommendations');
    const q = query(
      recommendationsRef,
      where('userId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const recommendations = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as AIRecommendation));
      callback(recommendations);
    });
  }

  // Batch operations
  static async batchUpdateSubscriptions(updates: Array<{ id: string; data: Partial<Subscription> }>): Promise<void> {
    const batch = writeBatch(db);
    
    updates.forEach(({ id, data }) => {
      const subscriptionDoc = doc(db, 'subscriptions', id);
      batch.update(subscriptionDoc, {
        ...data,
        updatedAt: Timestamp.now()
      });
    });

    await batch.commit();
  }

  // Statistics and aggregations
  static async getUserStats(userId: string): Promise<{
    totalSpending: number;
    activeSubscriptions: number;
    totalSavings: number;
    averageCost: number;
    categoryBreakdown: Record<string, number>;
  }> {
    const subscriptions = await this.getUserSubscriptions(userId, 'active');
    
    const totalSpending = subscriptions.reduce((sum, sub) => {
      const monthlyCost = sub.billingCycle === 'monthly' ? sub.cost : 
                         sub.billingCycle === 'yearly' ? sub.cost / 12 :
                         sub.billingCycle === 'quarterly' ? sub.cost / 3 :
                         sub.cost * 4.33; // weekly
      return sum + monthlyCost;
    }, 0);

    const categoryBreakdown = subscriptions.reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + sub.cost;
      return acc;
    }, {} as Record<string, number>);

    const user = await this.getUser(userId);

    return {
      totalSpending,
      activeSubscriptions: subscriptions.length,
      totalSavings: user?.metadata.totalSavings || 0,
      averageCost: subscriptions.length > 0 ? totalSpending / subscriptions.length : 0,
      categoryBreakdown
    };
  }
}

export default DatabaseService;