
"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, onSnapshot, DocumentData } from 'firebase/firestore';
import { useToast } from './use-toast';
import { onAuthStateChanged, type User } from 'firebase/auth';

// Define a generic type for the documents, which must have an 'id' property.
type DocumentWithId = { id: string } & DocumentData;

export function useFirestoreQuery<T extends DocumentWithId>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  // First, explicitly wait for the auth state to be resolved on the client.
  // This ensures we don't try to connect to Firestore before we have a valid user session.
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);


  // Only attempt to connect to Firestore AFTER the client-side user has been determined.
  useEffect(() => {
    // Do not run if the collection name is missing or if we are still waiting for auth resolution.
    if (!collectionName || currentUser === undefined) return;
    
    // If auth is resolved and there is no user, there's nothing to fetch.
    if (!currentUser) {
      setData([]); // Clear data if user logs out
      return;
    }

    const q = query(collection(db, collectionName));

    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));
      setData(documents);
    }, (error) => {
      console.error(`Error fetching ${collectionName}: `, error);
      // Avoid spamming toasts for the known 'Listen' error if it persists.
      if (error.code !== 'unavailable') {
         toast({
            title: "Erro de Conexão",
            description: `Não foi possível buscar os dados de ${collectionName}. Verifique sua conexão e as configurações do Firebase.`,
            variant: "destructive",
        });
      }
    });

    // Cleanup subscription on unmount or when the user changes.
    return () => unsubscribeSnapshot();
  }, [collectionName, currentUser, toast]); // Dependency on currentUser is key.

  return data;
}
