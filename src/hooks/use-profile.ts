'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { UserProfile } from '@/types';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setProfile({
            id: user.uid,
            currentIncome: userData.currentIncome || 0,
            updatedAt: userData.updatedAt?.toDate() || new Date(),
            email: user.email || '',
            displayName: user.displayName || '',
            createdAt: new Date(),
          });
        } else {
          // Initialize with defaults if no profile exists
          setProfile({
            id: user.uid,
            currentIncome: 0,
            updatedAt: new Date(),
            email: user.email || '',
            displayName: user.displayName || '',
            createdAt: new Date(),
          });
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      });

      setProfile(prev => prev ? {
        ...prev,
        ...updates,
        updatedAt: new Date(),
      } : null);

      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      throw err;
    }
  };

  return { profile, loading, error, updateProfile };
} 