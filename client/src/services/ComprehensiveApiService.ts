// ComprehensiveApiService.ts
// Complete API integrations for subscription management platform
// Based on ApiVault analysis and subscription management requirements

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  headers?: Record<string, string>;
}

// Environment variables for API keys
const API_KEYS = {
  // Payment APIs
  STRIPE_KEY: process.env.REACT_APP_STRIPE_KEY,
  PAYPAL_CLIENT_ID: process.env.REACT_APP_PAYPAL_CLIENT_ID,
  SQUARE_APP_ID: process.env.REACT_APP_SQUARE_APP_ID,
  
  // Finance & Currency APIs
  ALPHA_VANTAGE_KEY: process.env.REACT_APP_ALPHA_VANTAGE_KEY,
  FINNHUB_KEY: process.env.REACT_APP_FINNHUB_KEY,
  FIXER_IO_KEY: process.env.REACT_APP_FIXER_IO_KEY,
  EXCHANGERATE_API_KEY: process.env.REACT_APP_EXCHANGERATE_API_KEY,
  
  // VAT & Tax APIs
  VATLAYER_KEY: process.env.REACT_APP_VATLAYER_KEY,
  TAX_DATA_API_KEY: process.env.REACT_APP_TAX_DATA_API_KEY,
  
  // Communication APIs
  SENDGRID_KEY: process.env.REACT_APP_SENDGRID_KEY,
  MAILGUN_KEY: process.env.REACT_APP_MAILGUN_KEY,
  TWILIO_SID: process.env.REACT_APP_TWILIO_SID,
  
  // Analytics APIs
  GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
  MIXPANEL_TOKEN: process.env.REACT_APP_MIXPANEL_TOKEN,
  
  // Business Intelligence APIs
  CLEARBIT_KEY: process.env.REACT_APP_CLEARBIT_KEY,
  
  // Data APIs
  IPAPI_KEY: process.env.REACT_APP_IPAPI_KEY,
};

// =============================================================================
// PAYMENT PROCESSING APIs
// =============================================================================

export const StripeAPI = {
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.STRIPE_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: (amount * 100).toString(), // Stripe uses cents
        currency,
        automatic_payment_methods: 'enabled',
      }),
    });
    return response.json();
  },

  async retrieveCustomer(customerId: string) {
    const response = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEYS.STRIPE_KEY}`,
      },
    });
    return response.json();
  },

  async createSubscription(customerId: string, priceId: string) {
    const response = await fetch('https://api.stripe.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.STRIPE_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: customerId,
        items: `[{"price": "${priceId}"}]`,
      }),
    });
    return response.json();
  },
};

export const PayPalAPI = {
  async createOrder(amount: number, currency: string = 'USD') {
    const response = await fetch('https://api.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.PAYPAL_CLIENT_ID}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
        }],
      }),
    });
    return response.json();
  },
};

export const SquareAPI = {
  async createPayment(amount: number, currency: string = 'USD') {
    const response = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Square-Version': '2023-10-18',
        'Authorization': `Bearer ${API_KEYS.SQUARE_APP_ID}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_id: 'cnon:card-nonce-ok',
        amount_money: {
          amount: amount * 100, // Square uses cents
          currency,
        },
      }),
    });
    return response.json();
  },
};

// =============================================================================
// FINANCIAL DATA APIs
// =============================================================================

export const AlphaVantageAPI = {
  async getStockQuote(symbol: string) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEYS.ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    return response.json();
  },

  async getExchangeRate(fromCurrency: string, toCurrency: string) {
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${API_KEYS.ALPHA_VANTAGE_KEY}`;
    const response = await fetch(url);
    return response.json();
  },
};

export const FinnhubAPI = {
  async getCompanyProfile(symbol: string) {
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEYS.FINNHUB_KEY}`;
    const response = await fetch(url);
    return response.json();
  },

  async getQuote(symbol: string) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEYS.FINNHUB_KEY}`;
    const response = await fetch(url);
    return response.json();
  },
};

// =============================================================================
// CURRENCY EXCHANGE APIs
// =============================================================================

export const FixerAPI = {
  async getLatestRates(baseCurrency: string = 'USD') {
    const url = `https://api.fixer.io/latest?access_key=${API_KEYS.FIXER_IO_KEY}&base=${baseCurrency}`;
    const response = await fetch(url);
    return response.json();
  },

  async convertCurrency(from: string, to: string, amount: number) {
    const url = `https://api.fixer.io/convert?access_key=${API_KEYS.FIXER_IO_KEY}&from=${from}&to=${to}&amount=${amount}`;
    const response = await fetch(url);
    return response.json();
  },
};

export const ExchangeRateAPI = {
  async getLatestRates(baseCurrency: string = 'USD') {
    const url = `https://v6.exchangerate-api.com/v6/${API_KEYS.EXCHANGERATE_API_KEY}/latest/${baseCurrency}`;
    const response = await fetch(url);
    return response.json();
  },

  async convertCurrency(from: string, to: string, amount: number) {
    const url = `https://v6.exchangerate-api.com/v6/${API_KEYS.EXCHANGERATE_API_KEY}/pair/${from}/${to}/${amount}`;
    const response = await fetch(url);
    return response.json();
  },
};

// =============================================================================
// VAT & TAX VALIDATION APIs
// =============================================================================

export const VATLayerAPI = {
  async validateVAT(vatNumber: string, countryCode?: string) {
    let url = `https://api.vatlayer.com/validate?access_key=${API_KEYS.VATLAYER_KEY}&vat_number=${vatNumber}`;
    if (countryCode) {
      url += `&country_code=${countryCode}`;
    }
    const response = await fetch(url);
    return response.json();
  },

  async getVATRates(countryCode?: string) {
    let url = `https://api.vatlayer.com/rate_list?access_key=${API_KEYS.VATLAYER_KEY}`;
    if (countryCode) {
      url += `&country_code=${countryCode}`;
    }
    const response = await fetch(url);
    return response.json();
  },
};

export const TaxDataAPI = {
  async validateTaxNumber(taxNumber: string, countryCode: string) {
    const url = `https://api.apilayer.com/tax_data/validate?country_code=${countryCode}&tax_number=${taxNumber}`;
    const response = await fetch(url, {
      headers: {
        'apikey': API_KEYS.TAX_DATA_API_KEY!,
      },
    });
    return response.json();
  },
};

// =============================================================================
// EMAIL & COMMUNICATION APIs
// =============================================================================

export const SendGridAPI = {
  async sendEmail(to: string, subject: string, content: string) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.SENDGRID_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject,
        }],
        from: { email: 'noreply@subtrax.com' },
        content: [{
          type: 'text/html',
          value: content,
        }],
      }),
    });
    return response.json();
  },
};

export const MailgunAPI = {
  async sendEmail(to: string, subject: string, content: string) {
    const formData = new FormData();
    formData.append('from', 'noreply@subtrax.com');
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('html', content);

    const response = await fetch('https://api.mailgun.net/v3/sandbox.mailgun.org/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${API_KEYS.MAILGUN_KEY}`)}`,
      },
      body: formData,
    });
    return response.json();
  },
};

export const TwilioAPI = {
  async sendSMS(to: string, message: string) {
    const formData = new URLSearchParams();
    formData.append('From', '+1234567890'); // Your Twilio number
    formData.append('To', to);
    formData.append('Body', message);

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${API_KEYS.TWILIO_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${API_KEYS.TWILIO_SID}:your_auth_token`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    return response.json();
  },
};

// =============================================================================
// ANALYTICS & TRACKING APIs
// =============================================================================

export const GoogleAnalyticsAPI = {
  trackEvent(eventName: string, parameters: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        ...parameters,
        custom_map: { metric1: 'subscription_value' },
      });
    }
  },

  trackSubscriptionCreated(subscriptionValue: number, currency: string) {
    this.trackEvent('subscription_created', {
      currency,
      value: subscriptionValue,
      event_category: 'subscriptions',
    });
  },

  trackSubscriptionCancelled(subscriptionId: string) {
    this.trackEvent('subscription_cancelled', {
      subscription_id: subscriptionId,
      event_category: 'subscriptions',
    });
  },
};

export const MixpanelAPI = {
  track(eventName: string, properties: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track(eventName, properties);
    }
  },

  trackSubscriptionEvent(eventType: string, subscription: any) {
    this.track(`subscription_${eventType}`, {
      subscription_id: subscription.id,
      subscription_name: subscription.name,
      subscription_cost: subscription.cost,
      subscription_category: subscription.category,
    });
  },
};

// =============================================================================
// BUSINESS INTELLIGENCE APIs
// =============================================================================

export const ClearbitAPI = {
  async enrichCompany(domain: string) {
    const url = `https://company.clearbit.com/v2/companies/find?domain=${domain}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEYS.CLEARBIT_KEY}`,
      },
    });
    return response.json();
  },

  async getCompanyLogo(domain: string, size: number = 128) {
    return `https://logo.clearbit.com/${domain}?size=${size}`;
  },
};

// =============================================================================
// UTILITY APIs
// =============================================================================

export const IPLocationAPI = {
  async getUserLocation() {
    const response = await fetch('https://ipapi.co/json/');
    return response.json();
  },

  async getLocationByIP(ip: string) {
    const url = `https://api.ipapi.com/${ip}?access_key=${API_KEYS.IPAPI_KEY}`;
    const response = await fetch(url);
    return response.json();
  },
};

export const ReqResAPI = {
  async getTestUsers() {
    const response = await fetch('https://reqres.in/api/users');
    return response.json();
  },

  async createTestUser(name: string, job: string) {
    const response = await fetch('https://reqres.in/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, job }),
    });
    return response.json();
  },
};

// =============================================================================
// WEBHOOK & NOTIFICATION SERVICES
// =============================================================================

export const WebhookService = {
  async sendWebhook(url: string, data: any, headers: Record<string, string> = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async sendSlackNotification(webhookUrl: string, message: string) {
    return this.sendWebhook(webhookUrl, {
      text: message,
      username: 'SubTrax Bot',
      icon_emoji: ':moneybag:',
    });
  },

  async sendDiscordNotification(webhookUrl: string, message: string) {
    return this.sendWebhook(webhookUrl, {
      content: message,
      username: 'SubTrax Bot',
    });
  },
};

// =============================================================================
// COMPREHENSIVE API MANAGER
// =============================================================================

export class ComprehensiveApiManager {
  // Payment methods
  async processPayment(provider: 'stripe' | 'paypal' | 'square', amount: number, currency: string) {
    switch (provider) {
      case 'stripe':
        return StripeAPI.createPaymentIntent(amount, currency);
      case 'paypal':
        return PayPalAPI.createOrder(amount, currency);
      case 'square':
        return SquareAPI.createPayment(amount, currency);
      default:
        throw new Error('Unsupported payment provider');
    }
  }

  // Currency conversion
  async convertCurrency(from: string, to: string, amount: number) {
    try {
      return await ExchangeRateAPI.convertCurrency(from, to, amount);
    } catch (error) {
      // Fallback to Fixer.io
      return await FixerAPI.convertCurrency(from, to, amount);
    }
  }

  // VAT validation
  async validateBusinessData(vatNumber: string, countryCode?: string) {
    const vatResult = await VATLayerAPI.validateVAT(vatNumber, countryCode);
    let taxResult = null;
    
    if (countryCode) {
      try {
        taxResult = await TaxDataAPI.validateTaxNumber(vatNumber, countryCode);
      } catch (error) {
        // Tax validation failed, return null
      }
    }

    return { vat: vatResult, tax: taxResult };
  }

  // Send notification
  async sendNotification(type: 'email' | 'sms', recipient: string, subject: string, content: string) {
    if (type === 'email') {
      try {
        return await SendGridAPI.sendEmail(recipient, subject, content);
      } catch (error) {
        // Fallback to Mailgun
        return await MailgunAPI.sendEmail(recipient, subject, content);
      }
    } else if (type === 'sms') {
      return await TwilioAPI.sendSMS(recipient, content);
    }
  }

  // Track analytics
  trackEvent(provider: 'google' | 'mixpanel', eventName: string, data: any) {
    if (provider === 'google') {
      GoogleAnalyticsAPI.trackEvent(eventName, data);
    } else if (provider === 'mixpanel') {
      MixpanelAPI.track(eventName, data);
    }
  }

  // Get financial data
  async getFinancialData(symbol: string) {
    const [alphaVantage, finnhub] = await Promise.allSettled([
      AlphaVantageAPI.getStockQuote(symbol),
      FinnhubAPI.getQuote(symbol),
    ]);

    return {
      alphaVantage: alphaVantage.status === 'fulfilled' ? alphaVantage.value : null,
      finnhub: finnhub.status === 'fulfilled' ? finnhub.value : null,
    };
  }

  // Enrich company data
  async enrichSubscriptionData(subscriptionName: string, domain?: string) {
    if (!domain) {
      // Try to extract domain from subscription name
      const extractedDomain = this.extractDomainFromName(subscriptionName);
      domain = extractedDomain || undefined;
    }

    if (domain) {
      try {
        const companyData = await ClearbitAPI.enrichCompany(domain);
        const logoUrl = ClearbitAPI.getCompanyLogo(domain);
        return { ...companyData, logoUrl };
      } catch (error) {
        // Company enrichment failed, return null
      }
    }

    return null;
  }

  private extractDomainFromName(name: string): string | null {
    const commonDomains: Record<string, string> = {
      'netflix': 'netflix.com',
      'spotify': 'spotify.com',
      'adobe': 'adobe.com',
      'microsoft': 'microsoft.com',
      'google': 'google.com',
      'amazon': 'amazon.com',
      'apple': 'apple.com',
      'dropbox': 'dropbox.com',
      'slack': 'slack.com',
      'figma': 'figma.com',
      'notion': 'notion.so',
      'trello': 'trello.com',
      'asana': 'asana.com',
      'zoom': 'zoom.us',
    };

    const lowerName = name.toLowerCase();
    for (const [key, domain] of Object.entries(commonDomains)) {
      if (lowerName.includes(key)) {
        return domain;
      }
    }

    return null;
  }
}

export default new ComprehensiveApiManager();