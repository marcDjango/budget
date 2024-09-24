import { useState } from 'react';

export function useAddOrUpdateCharge() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const saveExpense = async (expenseData: any, expenseId?: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch(`/api/dev${expenseId ? `/${expenseId}` : ''}`, {
        method: expenseId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      setSuccess(true);
    } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return { saveExpense, isLoading, error, success };
}
