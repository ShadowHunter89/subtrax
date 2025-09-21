# Subtrax - Advanced Subscription Management Platform

A modern, production-ready React application for managing and optimizing your subscriptions with AI-powered insights, comprehensive analytics, and secure payment processing.

## 🚀 Features

### Core Features
- **Subscription Management**: Add, edit, and delete subscriptions with detailed tracking
- **Smart Analytics**: Visual charts and spending trends with Chart.js integration
- **AI Insights**: Intelligent recommendations for cost optimization
- **Payment Integration**: Secure Stripe integration for premium subscriptions
- **User Authentication**: Firebase Auth with Google OAuth support
- **Real-time Data**: Firestore database with real-time updates
- **Responsive Design**: Modern Material-UI components that work on all devices

### User Management
- **Profile Management**: Complete user profiles with preferences
- **Tier System**: Free, Pro, and Enterprise subscription tiers
- **Settings & Preferences**: Customizable notifications and display options
- **Security**: Protected routes and secure authentication

### Data & Analytics
- **Comprehensive Database**: Full Firestore schemas with relationships
- **Export Capabilities**: CSV export for admin users
- **Billing History**: Complete transaction tracking
- **Usage Analytics**: Track subscription usage patterns

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI v5)** for modern UI components
- **Chart.js & react-chartjs-2** for data visualization
- **React Router v6** for navigation
- **Firebase SDK v9** for authentication and database

### Backend & Services
- **Firebase Authentication** for user management
- **Firestore Database** for data storage
- **Stripe** for payment processing
- **Firebase Functions** (server-side logic)

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Vite/Create React App** for building

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase project with Authentication and Firestore enabled
- Stripe account for payment processing (optional)

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd Subtrax/client
npm install
```

### Step 2: Environment Configuration
1. Copy `.env.example` to `.env.local`
2. Get your Firebase config from Firebase Console
3. Add your Stripe publishable key (for payment features)
4. Update the environment variables:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456

REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### Step 3: Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password and Google providers)
3. Create a Firestore database in production mode
4. Set up security rules (see below)

### Step 4: Run the Application
```bash
npm start
```

The app will be available at `http://localhost:3000`

## 🔥 Firebase Configuration

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can manage their own subscriptions
    match /subscriptions/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can read their own analytics
    match /analytics/{document} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can manage their own recommendations
    match /recommendations/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Authentication Setup
1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Enable Google (add your domain to authorized domains)
4. Configure OAuth consent screen

## 🧩 Project Structure

```
client/src/
├── components/           # Reusable UI components
│   ├── AuthComponent.tsx    # Authentication forms
│   ├── SimpleDashboard.tsx  # Main dashboard
│   ├── PaymentIntegration.tsx # Stripe integration
│   └── ProtectedRoute.tsx   # Route protection
├── contexts/             # React Context providers
│   └── AuthContext.tsx      # Authentication state
├── services/            # Business logic and API calls
│   └── DatabaseService.ts   # Firestore operations
├── lib/                 # Utility functions
│   └── exportUtils.ts       # CSV export utilities
├── styles/              # Global styles
│   └── styles.css          # Custom CSS
├── firebase.ts          # Firebase configuration
├── App.tsx             # Main app component
└── index.tsx           # App entry point
```

## 🎨 Key Components

### SimpleDashboard
The main dashboard provides:
- Statistics overview with spending metrics
- Tabbed interface (Overview, Subscriptions, Profile, Settings)
- Subscription CRUD operations
- AI recommendations display
- User preferences management

### AuthComponent
Complete authentication system featuring:
- Login/Signup forms with validation
- Google OAuth integration
- Password reset functionality
- Error handling and user feedback

### PaymentIntegration
Stripe-powered payment system including:
- Subscription plan selection
- Payment method management
- Billing history
- Secure card processing

### DatabaseService
Comprehensive Firestore integration providing:
- User profile management
- Subscription CRUD operations
- Analytics data handling
- Real-time updates
- Batch operations

## 📊 Database Schema

### Users Collection
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  tier: 'free' | 'pro' | 'enterprise';
  preferences: UserPreferences;
  metadata: UserMetadata;
  createdAt: Timestamp;
  lastActive: Timestamp;
}
```

### Subscriptions Collection
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
  provider: ProviderInfo;
  billing: BillingInfo;
  usage: UsageInfo;
  aiInsights: AIInsights;
  notifications: NotificationSettings;
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify or connect Git repository
```

## 🔐 Security Features

- **Authentication**: Firebase Auth with secure token management
- **Route Protection**: Protected routes for authenticated users only
- **Data Validation**: Input validation and sanitization
- **HTTPS Only**: All communication over secure connections
- **Environment Variables**: Sensitive data in environment variables
- **Firestore Rules**: Database-level security rules

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- AuthComponent.test.tsx
```

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading of routes and components
- **Image Optimization**: Optimized images and icons
- **Bundle Analysis**: Webpack bundle analyzer for optimization
- **Caching**: Service worker for offline functionality
- **Tree Shaking**: Dead code elimination

## 🛟 Support & Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Verify environment variables are correct
   - Check Firebase project settings
   - Ensure Firestore is enabled

2. **Authentication Issues**
   - Check OAuth configuration
   - Verify domain is authorized
   - Clear browser cache/cookies

3. **Build Errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again
   - Check for TypeScript errors

### Development Commands

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run ESLint
npm run type-check # Check TypeScript types
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For support or questions, please contact [your-email@domain.com]

---

Built with ❤️ using React, TypeScript, Material-UI, Firebase, and Stripe.