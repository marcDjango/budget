import { useState, useEffect, useMemo, useCallback } from "react";
import { Account } from "@/app/types/types";
import { useSession } from "next-auth/react";

interface UseFetchAccountsProps {
  default?: boolean;
}

const useFetchAccounts = ({ default: showDefault = false }: UseFetchAccountsProps = {}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const fetchAccounts = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.id) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/accounts/${session.user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const data = await response.json();
      setAccounts(data);
      setError(null);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAccounts();
    }
  }, [fetchAccounts, status]);

  const filteredAccounts = useMemo(() => 
    showDefault ? accounts.filter(account => account.isDefault ?? false) : accounts,
    [accounts, showDefault]
  );

  return { accounts: filteredAccounts, loading, error, refetch: fetchAccounts };
};

export default useFetchAccounts;