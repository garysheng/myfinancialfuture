'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, collectionGroup, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { ScenarioBackend, ScenarioFrontend } from '@/types';
import { convertScenarioToFrontend } from '@/lib/utils';

export function useScenario(id: string) {
  const { user } = useAuth();
  const [scenario, setScenario] = useState<ScenarioFrontend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid scenario ID');
      setLoading(false);
      return;
    }

    async function fetchScenario() {
      try {
        // If user is logged in, try to fetch as user's private scenario first
        if (user) {
          const scenarioRef = doc(db, 'users', user.uid, 'scenarios', id);
          const scenarioSnap = await getDoc(scenarioRef);

          if (scenarioSnap.exists()) {
            const data = scenarioSnap.data() as ScenarioBackend;
            const scenarioData = convertScenarioToFrontend(data);
            setScenario(scenarioData);
            setError(null);
            setLoading(false);
            return;
          }
        }

        // If not found as private or user not logged in, try public scenario
        const publicScenariosQuery = query(
          collectionGroup(db, 'scenarios'),
          where('id', '==', id),
          where('isPublic', '==', true)
        );
        const publicScenarios = await getDocs(publicScenariosQuery);
        
        if (!publicScenarios.empty) {
          // Found as a public scenario
          const data = publicScenarios.docs[0].data() as ScenarioBackend;
          const scenarioData = convertScenarioToFrontend(data);
          setScenario(scenarioData);
          setError(null);
        } else {
          setError('Scenario not found');
          setScenario(null);
        }
      } catch (err) {
        console.error('Error fetching scenario:', err);
        setError('Failed to load scenario');
        setScenario(null);
      } finally {
        setLoading(false);
      }
    }

    fetchScenario();
  }, [user, id]);

  const deleteScenario = async () => {
    if (!user || !id) return;
    
    try {
      const scenarioRef = doc(db, 'users', user.uid, 'scenarios', id);
      await deleteDoc(scenarioRef);
      return true;
    } catch (err) {
      console.error('Error deleting scenario:', err);
      return false;
    }
  };

  return { scenario, loading, error, deleteScenario };
} 