
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, DocumentData } from 'firebase/firestore';
import { useToast } from './use-toast';

// Define a generic type for the documents, which must have an 'id' property.
type DocumentWithId = { id: string } & DocumentData;

export function useFirestoreQuery<T extends DocumentWithId>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!collectionName) return;

    const q = query(collection(db, collectionName));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName, toast]);

  return data;
}
