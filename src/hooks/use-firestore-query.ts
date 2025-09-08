
"use client";

import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { useToast } from './use-toast';
import { onAuthStateChanged, type User } from 'firebase/auth';

type DocumentWithId = { id: string };

// This hook fetches a collection once from Realtime Database.
export function useRealtimeDatabaseCollection<T extends DocumentWithId>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);
  
  const fetchData = useCallback(async () => {
    if (!currentUser) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const collectionRef = ref(db, collectionName);
      const snapshot = await get(collectionRef);
      if (snapshot.exists()) {
        const dataFromDb = snapshot.val();
        const documents = Object.keys(dataFromDb).map(key => ({
          id: key,
          ...dataFromDb[key],
        }));
        setData(documents as T[]);
      } else {
        setData([]);
      }
    } catch (error: any) {
      console.error(`Error fetching ${collectionName}: `, error);
      toast({
        title: "Erro de Conexão com o Banco de Dados",
        description: `Não foi possível buscar os dados de ${collectionName}. Verifique sua conexão e as configurações do Realtime Database.`,
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  }, [collectionName, currentUser, toast]);

  useEffect(() => {
    if (currentUser !== null) { // Ensures we only fetch after auth state is determined
        fetchData();
    }
  }, [currentUser, fetchData]);

  // Return data, loading state, and a manual refresh function
  return { data, loading, refresh: fetchData };
}
