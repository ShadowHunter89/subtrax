// Authentication context and hooks for user management with DatabaseService integration
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { auth } from '../firebase.ts';
import DatabaseService, { User as DBUser, UserPreferences } from '../services/DatabaseService.ts';

interface AuthContextType {
  currentUser: User | null;
  userProfile: DBUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateUserProfile: (data: Partial<DBUser>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default user preferences
  const defaultPreferences: UserPreferences = {
    notifications: {
      email: true,
      push: true,
      renewalReminders: true,
      savingsAlerts: true
    },
    privacy: {
      analyticsOptIn: true,
      marketingOptIn: false
    },
    display: {
      darkMode: false,
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  };

  const createUserProfile = async (user: User, additionalData: any = {}) => {
    try {
      const existingProfile = await DatabaseService.getUser(user.uid);
      
      if (!existingProfile) {
        const newProfile: Omit<DBUser, 'createdAt' | 'lastActive'> = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || additionalData.displayName || '',
          tier: 'free',
          preferences: { ...defaultPreferences, ...additionalData.preferences },
          metadata: {
            signupSource: additionalData.signupSource || 'web',
            totalSavings: 0,
            subscriptionCount: 0,
            accountStatus: 'active'
          }
        };
        
        await DatabaseService.createUser(newProfile);
        const profile = await DatabaseService.getUser(user.uid);
        setUserProfile(profile);
      } else {
        // Update last active
        await DatabaseService.updateUser(user.uid, {
          lastActive: Timestamp.now()
        });
        setUserProfile(existingProfile);
      }
    } catch (err: any) {
      setError('Failed to create/load user profile');
      // eslint-disable-next-line no-console
      console.error('Error creating user profile:', err);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      await createUserProfile(result.user, { 
        displayName,
        signupSource: 'email_signup' 
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user, {
        signupSource: 'google_oauth'
      });
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to sign in with Google');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to log out');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
      throw err;
    }
  };

  const updateUserProfile = async (data: Partial<DBUser>) => {
    if (!currentUser || !userProfile) {
      throw new Error('No user logged in');
    }

    try {
      setError(null);
      await DatabaseService.updateUser(currentUser.uid, data);
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      
      // Update Firebase profile if display name changed
      if (data.displayName && data.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: data.displayName });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!currentUser || !userProfile) {
      throw new Error('No user logged in');
    }

    try {
      setError(null);
      const updatedPreferences = { ...userProfile.preferences, ...preferences };
      
      await DatabaseService.updateUserPreferences(currentUser.uid, updatedPreferences);
      
      // Update local state
      setUserProfile(prev => prev ? { 
        ...prev, 
        preferences: updatedPreferences 
      } : null);
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        
        if (user) {
          await createUserProfile(user);
        } else {
          setUserProfile(null);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('Auth state change error:', err);
        setError('Authentication error occurred');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    updateUserProfile,
    updatePreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;