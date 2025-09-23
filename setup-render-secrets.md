# Render Environment Setup Guide

Based on your Firebase config, here are the exact environment variables you need to set in Render:

## 1. Create Environment Group in Render

Go to Render Dashboard → Environment Groups → New Environment Group
Name: `subtrax-secrets`

## 2. Add These Environment Variables

### Firebase Backend (Server) Variables
```
FIREBASE_PROJECT_ID=subtrax-4964f
FIREBASE_SERVICE_ACCOUNT_BASE64=[YOUR_SERVICE_ACCOUNT_BASE64]
```

### Firebase Frontend (Client) Variables
```
REACT_APP_FIREBASE_API_KEY=AIzaSyCMeGFClPnbhx9VaSDk_5yN-3ChJ8joc9o
REACT_APP_FIREBASE_AUTH_DOMAIN=subtrax-4964f.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=subtrax-4964f
REACT_APP_FIREBASE_STORAGE_BUCKET=subtrax-4964f.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1078963671877
REACT_APP_FIREBASE_APP_ID=1:1078963671877:web:a1e7fded4ce6adbfa8642c
REACT_APP_FIREBASE_MEASUREMENT_ID=G-K0X719P26G
```

### API Configuration
```
REACT_APP_API_URL=https://subtrax.onrender.com
```

### Optional but Recommended
```
REDIS_URL=[YOUR_REDIS_CLOUD_URL]
STRIPE_SECRET_KEY=[YOUR_STRIPE_SECRET_KEY]
STRIPE_WEBHOOK_SECRET=[YOUR_STRIPE_WEBHOOK_SECRET]
OPENAI_API_KEY=[YOUR_OPENAI_KEY]
GEMINI_API_KEY=[YOUR_GEMINI_KEY]
ADMIN_API_KEY=[CHOOSE_A_SECURE_ADMIN_PASSWORD]
```

## 3. Generate Firebase Service Account Base64

You need to:
1. Download your Firebase service account JSON file from Firebase Console
2. Convert it to base64 using this PowerShell command:

```powershell
$bytes = [System.IO.File]::ReadAllBytes("path\to\your\service-account.json")
[System.Convert]::ToBase64String($bytes)
```

3. Copy the output and paste it as the value for `FIREBASE_SERVICE_ACCOUNT_BASE64`

## 4. Link Environment Group

After creating the environment group:
1. Go to your `subtrax` service → Settings → Environment
2. Link the `subtrax-secrets` environment group
3. Trigger a manual deploy

## 5. Verify Setup

After deployment, check:
- https://subtrax.onrender.com/api/health (should show `firebase: true`)
- Your frontend should stop showing mock data