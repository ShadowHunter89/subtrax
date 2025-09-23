// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestOptions = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Subscription methods
  async getSubscriptions() {
    return this.request('/subscriptions');
  }

  async createSubscription(subscriptionData: any) {
    return this.request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  }

  async updateSubscription(id: string, updates: any) {
    return this.request(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSubscription(id: string) {
    return this.request(`/subscriptions/${id}`, {
      method: 'DELETE',
    });
  }

  async getSubscriptionAnalytics() {
    return this.request('/subscriptions/analytics');
  }

  // Analytics methods
  async getDashboardAnalytics(timeframe = '30d') {
    return this.request(`/analytics/dashboard?timeframe=${timeframe}`);
  }

  async getSpendingTrends(timeframe = '6m') {
    return this.request(`/analytics/trends?timeframe=${timeframe}`);
  }

  async getCategoryBreakdown() {
    return this.request('/analytics/categories');
  }

  // User methods
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(updates: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // AI methods
  async getAIRecommendations() {
    return this.request('/ai/recommendations');
  }

  async analyzeSpending() {
    return this.request('/ai/analyze-spending');
  }

  // Billing methods
  async getBillingInfo() {
    return this.request('/billing/info');
  }

  async updatePaymentMethod(paymentData: any) {
    return this.request('/billing/payment-method', {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();