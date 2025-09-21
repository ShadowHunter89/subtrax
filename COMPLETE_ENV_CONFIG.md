# Complete Environment Configuration for Subtrax Application
# Copy this to .env.local in your client folder and .env in your server folder

# ============================
# FIREBASE CONFIGURATION
# ============================

# Frontend Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_from_firebase_console
REACT_APP_FIREBASE_AUTH_DOMAIN=subtrax-4964f.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=subtrax-4964f
REACT_APP_FIREBASE_STORAGE_BUCKET=subtrax-4964f.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id_from_firebase_console

# Backend Firebase Admin Configuration
FIREBASE_PROJECT_ID=subtrax-4964f
FIREBASE_CLIENT_EMAIL=secret-uploader@subtrax-4964f.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=109373183728030860797
FIREBASE_PRIVATE_KEY_ID=0584aed4d854dfe2aec7015fe5a1a1e6e6a5df71

# Firebase Service Account (Base64 encoded - ready for deployment)
FIREBASE_SERVICE_ACCOUNT_BASE64=ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAic3VidHJheC00OTY0ZiIsCiAgInByaXZhdGVfa2V5X2lkIjogIjA1ODRhZWQ0ZDg1NGRmZTJhZWM3MDE1ZmU1YTFhMWU2ZTZhNWRmNzEiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQ3JRNzJkekhwM0pFcHpcbmNudEExT1Z4K0Vjdi9rWUluTURWMG50WGFQV0Zxdi92SE5FNzBNMit6dlo0TlhlNTVFSEN5NFhielIxUGlIODBcbnpHZlZ4Q3hJVUpMU0E4eWNySHhpLzR6R3hFL2hBWXhhUTlrQXRYWVd0SVE0MXdPaU1SeGpxSnRMb3dTbk8vYmJcbkNqbEEwMDJnbVBiV1pYZzhyZWNqejMyQ2ZSQmFxaFNYVUJCRWZFTnIvSW5XcGFMWmNaUFJ4QlBDRUlrbnNsUGxcbnllenZ2L3Q3c3hSUlU5ZmlpMHhzQlJRWEh3QUZrcWZMVzhnWmhLTlJZOFZRY2J1bkxjQVdDL1k2M3N6cmFsNW9cbmJKbU43SXliNTUrWXlwNWs1VklETGhvZnJWOXdtd0ttNkY0NUNPZHp4dUpMTi9SY0NKVlY1SlZiZUNRZ2FmTWlcblcxalIrcUIzQWdNQkFBRUNnZ0VBQks4cklnUkVPenIrWUU3NnlRaXBwK2JiQjVpRVVOcjh1VHh6REM1K1BLUXpcbk1OYVFjSHJqRGJ0NmFVcEpGb2dFTm5BN25vbnJLZEE1Ym5mQ3hVbUN6bzJKbm4zbEhFbnBjd203VDNweUZ0emtcbmVsbU50Mk8vTVpySlhRYWdmbENxanAwL2RoK2swbkFrN2RQSFFoc2xiZVdSSnNjS3RWb3FUc1B2a21DYVVHaDNcbjZlNFp6Q1E5djQrSFhXR3l2YVFOajZ2Q0t6cjVKWEpuRG1OQ2RYM0d4bjU5dEN4M0piN2dxWjh4SVp3cWRFeWtcbkZ1WThwMlNrOGU1U2JpSWpqSEdhTEtvb3d3eW1VZHBzV1A4ZWZsZEthZ25pUTRHZi93ZXh3UUowZU9TSUJUUEpcbmhqcExnSkhqd2dSZysyQzV6NUVod01CQTFRN1NNTzhLVFNKak5odHFDUUtCZ1FEeDJ1S2NaM1Y4Y1lwZFZ6QjBcbmVLN3VXY2xCSHlJdVRnc3BvK2NVV0tYY240U3V3ZFdUalRYVDB1bnFWZnNFT2lSL25va2FFenVldC9WTDd3am9cbmRyWC9BYlFHemNoSW8wVy9VaDRrM0ptczdxd2xackgvVzVLZ0E0WkpzRXQzaS9mdzRvQmdvSTZCQWhjTDFNY2hcblZ5c0VEaThCQXBjSHRZbDRFZXpLcFJqZk9RS0JnUUMxUi9VOVJjY0dhdUFDenRycnh0VXZDb2s4Q1labXlXK3Vcbkc1RGtEUnRlS1RGd1pCKy9WeDJTTzk0QVMxaGphZDliQXlVbUw4MXV4ZlBRWE5SWEpBVnBmbzFKdW0rblJZbWlcbno5UzBtKzZVWFcwaWN6eWNYMFdXUTFJeXBNdXNxWGQ2VHEzZDZOUUs2VmtsMVJsU1hzYjA2WEx4ZmJSTlhnL0tcbmhGOWVDL0hOTHdLQmdRQ2J1cnhGeDF4Z0I5LzNJRWdrQnYxa25rMjNiK3ViYzBjK3hibnFZUFpUckNkTU82VmhcblFBRFQ1ekFWWXMyaHVDcCtQais3bVh5L1EyWmdRWWN6NEJScUlkZWd0ZXByMHkzNjlrNVFuL2NYNGdyWWZscklcbnVWY2RUNGV0ZFNYeTBSNlNiZFlKNGZoQVcyOHBnQlhFZ3hOQXBqMWY0aUlMcGJuaHBYRWFQdHBZQ1FLQmdIcHVcbkI3V0MrNkJjNjc5WnZzWi91WmlVa0F5SkRrazYvLzdoUlNDUHJZMFJXdjloejRNbExhYUdZaTltczJJb3JaMUVcbjZZRDV4YzlyUjNmUVNlUTBRcWQxdmF3dWlwdTR2ZlRFVWc1TVJYdlVBUkhFTEFvYjJkNWF4eGZHN250RTFKazRcbnEvbno5Y2tNd1pWb2J6cVBJZVZrQ0tvSjBJeHoyMHhWekNhekFISW5Bb0dBRExmUnZpY1plcDFTbG1Gd3dnWnFcblRRcXRKV2VHUFkrVVA1WktVZ2tPR3FYYXJURVo2and0UDdVZVVMVUNNdzhIdmVvTy9OME5yeU1LZjFabHkyWWVcbjNYVGtJNTlWVTJJSnlKT1R2YWJlcER4N2VSUVNUa3VkOEsxZVFxZC85Q24rREdCVUR3UUVsdjZMUUZnRmxSL2Fcbjg3Yy9vS0xIUk96WkVCUEJkc2ZVU1JvPVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogInNlY3JldC11cGxvYWRlckBzdWJ0cmF4LTQ5NjRmLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwOTM3MzE4MzcyODAzMDg2MDc5NyIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvc2VjcmV0LXVwbG9hZGVyJTQwc3VidHJheC00OTY0Zi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQo=

# ============================
# STRIPE CONFIGURATION
# ============================

# Stripe Configuration (Test/Live keys)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ============================
# APPLICATION CONFIGURATION
# ============================

# Environment
NODE_ENV=production
PORT=10000

# API Configuration
REACT_APP_API_URL=https://subtrax-server.onrender.com
REACT_APP_ENVIRONMENT=production

# ============================
# EXTERNAL SERVICES
# ============================

# OpenAI API (for AI recommendations)
OPENAI_API_KEY=sk-your_openai_api_key

# Redis Configuration (for caching)
REDIS_URL=redis://your-redis-url:6379

# ============================
# SECURITY & MONITORING
# ============================

# JWT Secret for authentication
JWT_SECRET=your_super_secure_jwt_secret_here

# CORS Origin
CORS_ORIGIN=https://your-frontend-domain.com

# Sentry (Error Monitoring)
REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project

# Google Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# ============================
# INSTRUCTIONS
# ============================

# 1. For frontend (client/.env.local):
#    - Copy all REACT_APP_* variables
#    - Get API key and App ID from Firebase Console
#    - Add your Stripe publishable key

# 2. For backend (server/.env):
#    - Copy all non-REACT_APP variables
#    - The FIREBASE_SERVICE_ACCOUNT_BASE64 is ready to use
#    - Add your Stripe secret key and webhook secret

# 3. For deployment (Render/Vercel):
#    - Use FIREBASE_SERVICE_ACCOUNT_BASE64 for secure deployment
#    - Set all environment variables in your hosting platform
#    - Never commit actual API keys to version control