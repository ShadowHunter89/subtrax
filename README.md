# Subtrax - Pakistani Subscription Management Platform

## Recent Updates ✨

### Code Quality Improvements (September 2025)
- **✅ Fixed React Components**: Migrated all components from inline styles to CSS classes for better maintainability
- **✅ Enhanced TypeScript**: Added proper interfaces and type safety across all components
- **✅ Improved Accessibility**: Added ARIA labels and semantic HTML throughout the application
- **✅ Updated CI/CD**: Fixed GitHub Actions workflows for proper deployment
- **✅ Deployment Ready**: Updated render.yaml and deployment configurations

### Component Updates
- `LandingPage.tsx` - Complete rewrite with clean CSS architecture
- `About.tsx`, `Help.tsx`, `CheckoutButtons.tsx` - Style migration completed
- `PrivacyPolicy.tsx`, `TermsAndConditions.tsx` - Consistent styling applied
- `styles.css` - Comprehensive design system implementation

## Firebase Service Account Setup

**Production/Cloud Deployment:**
- Do NOT commit `server/config/firebase.json`.
- Instead, copy the contents of your Firebase service account JSON and set it as the environment variable `FIREBASE_SERVICE_ACCOUNT_JSON` in your hosting provider (Render, Vercel, etc).
- The backend will auto-detect and use this env var for Firebase Admin initialization.

**Local Development:**
- You may use a local `server/config/firebase.json` file, but this is NOT recommended for production.

Subtrax is a subscription optimization tool designed to help users manage and optimize their various subscriptions. The application analyzes user subscriptions and provides tailored recommendations to enhance user experience and reduce costs.

## Features

- **Optimize Subscriptions**: Analyze user subscriptions to suggest optimizations based on usage patterns and costs.
- **Personalized Recommendations**: Get tailored subscription recommendations based on user preferences and needs.
- **User-Friendly Interface**: Easy to navigate and understand, making subscription management a breeze.

## Project Structure

```
Subtrax
├── src
│   ├── index.ts                # Entry point of the application
│   ├── services
│   │   └── subscriptionOptimizer.ts  # Contains the SubscriptionOptimizer class
│   ├── models
│   │   └── subscription.ts      # Defines the Subscription model
│   └── types
│       └── index.ts            # Defines TypeScript interfaces
├── package.json                 # npm configuration file
├── tsconfig.json               # TypeScript configuration file
└── README.md                   # Project documentation
```

## Installation

To install the project dependencies, run:

```
npm install
```

## Usage

To start the application, use the following command:

```
npm start

## Deployment checklist

1. Do not commit `.env` or `server/config/firebase.json` to git. Use the platform environment settings.
2. Fill in environment variables listed in `.env.example` on your host (Render for backend, Netlify for frontend).
	- For Render (web service): set `OPENAI_API_KEY`, `OPENAI_MODEL`, `FIREBASE_*` vars, `STRIPE_SECRET_KEY`.
	- For Netlify (frontend): set `REACT_APP_FIREBASE_*` and `REACT_APP_STRIPE_PUBLISHABLE_KEY`.
	- For Netlify (frontend): set `REACT_APP_FIREBASE_*`, `REACT_APP_STRIPE_PUBLISHABLE_KEY` and optionally `REACT_APP_FRONTEND_BASE_URL`.
3. For backend on Render:
	- Build Command: `npm install`
	- Start Command: `node server.js`
	- Ensure service is set to `node` environment and correct `PORT`.
	- Consider setting `FRONTEND_BASE_URL` to your deployed frontend origin (e.g. https://subtrax.vercel.app) so server-generated redirects and Stripe webhooks redirect correctly.
4. For frontend on Netlify: link the `client` folder as the site root, set build commands and environment variables.
5. Verify `/api/health` on the deployed backend returns `{"status":"ok"}` and `openai_model` key.

## Notes
- If you are in Pakistan and need payments, use a local gateway (JazzCash/EasyPaisa) or an international aggregator; Stripe may not be available for payouts.
- Set `OPENAI_MODEL` to `gpt-5-mini` only if your OpenAI account has access; otherwise keep a supported fallback like `gpt-4o-mini`.
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.