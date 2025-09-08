
"use client";

import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, getDocs, DocumentData } from 'firebase/firestore';
import { useToast } from './use-toast';
import { onAuthStateChanged, type User } from 'firebase/auth';

type DocumentWithId = { id: string } & DocumentData;

// This hook fetches a collection once, avoiding real-time listeners.
export function useFirestoreCollection<T extends DocumentWithId>(collectionName: string) {
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
      const q = query(collection(db, collectionName));
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));
      setData(documents);
    } catch (error: any) {
      console.error(`Error fetching ${collectionName}: `, error);
      toast({
        title: "Erro de Conexão",
        description: `Não foi possível buscar os dados de ${collectionName}. Verifique sua conexão e as configurações do Firebase.`,
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
