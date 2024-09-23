import { useState, useEffect } from 'react';

// Hook pour récupérer les dépenses d'un utilisateur spécifique
export function useUserExpenses(accountId: string | null) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
     const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/dev/${accountId}`, {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();
        setExpenses(data.userExpenses);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
  
    fetchExpenses();
  }, [accountId]);
  

  return { expenses, loading, error };
}
