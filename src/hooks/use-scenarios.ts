'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { ScenarioBackend, ScenarioFrontend } from '@/types';
import { convertScenarioToFrontend } from '@/lib/utils';

export function useScenarios() {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<ScenarioFrontend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchScenarios() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const scenariosRef = collection(db, 'users', user.uid, 'scenarios');
        const scenariosQuery = query(scenariosRef, orderBy('createdAt', 'desc'));
        const scenariosSnap = await getDocs(scenariosQuery);

        const scenariosData = scenariosSnap.docs.map((doc) => {
          const data = doc.data() as ScenarioBackend;
          return {
            ...convertScenarioToFrontend(data),
            id: doc.id,
          };
        });

        setScenarios(scenariosData);
        setError(null);
      } catch (err) {
        console.error('Error fetching scenarios:', err);
        setError('Failed to load scenarios');
        setScenarios([]);
      } finally {
        setLoading(false);
      }
    }

    fetchScenarios();
  }, [user, refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);

  return { scenarios, loading, error, refresh };
} 