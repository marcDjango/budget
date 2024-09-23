import { useState, useEffect, useCallback } from "react";
import { Account } from "@/app/types/types";

interface Balance {
  id: string;
  amount: number;
  userId: string;
  accountId: string;
}

interface UseFetchBalancesProps {
  accounts: Account[];
}

interface UseFetchBalancesReturn {
  balances: Balance[];
  isUpdating: boolean[];
  error: string | null;
}

const useFetchBalances = ({
  accounts,
}: UseFetchBalancesProps): UseFetchBalancesReturn => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    try {
      const fetchedBalances: Balance[] = [];
      const fetchedIsUpdating: boolean[] = [];

      const balancePromises = accounts?.map(async (account) => {
        const res = await fetch(`/api/balance/${account.id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch balance for account ${account.id}`);
        }
        const data = await res.json();
        console.log(data);
        if (data.exists) {
          const lastElement = data.balance.length - 1;
          return {
            balance: {
              id: data.balance[lastElement].id,
              amount: data.balance[lastElement].amount,
              userId: data.balance[lastElement].userId,
              accountId: data.balance[lastElement].accountId,
            },
            input: data.balance[lastElement].amount.toString(),
            showForm: false,
          };
        } else {
          return {
            balance: {
              id: data.balance[0].id,
              amount: 0,
              userId: data.balance[0].userId,
              accountId: data.balance[0].accountId,
            },
            input: "0",
            showForm: true,
          };
        }
      });

      const results = await Promise.all(balancePromises);

      results.forEach((result) => {
        fetchedBalances.push(result.balance);

        fetchedIsUpdating.push(false);
      });

      setBalances(fetchedBalances);
      setIsUpdating(fetchedIsUpdating);
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred while fetching balances");
      }
    }
  }, [accounts]);

  useEffect(() => {
    if (accounts.length > 0) {
      fetchBalances();
    }
  }, [accounts, fetchBalances]);

  return {
    balances,
    isUpdating,
    error,
  };
};

export default useFetchBalances;
