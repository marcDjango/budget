// app/hooks/useUpdateBalance.ts
import { createBalance } from "@/app/(protected)/dev/_utils/updateBalance";

export function useUpdateBalance() {
  const createBalanceHandler = async (userId: string, amount: number, accountId: string) => {
    return await createBalance(userId, amount, accountId);
  };

  return { createBalance: createBalanceHandler };
}
