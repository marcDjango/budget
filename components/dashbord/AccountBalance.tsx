import { useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import useFetchAccounts from "@/hooks/useFetchAccounts";
import useFetchBalance from "@/hooks/useFetchBalance";
import { Account } from "@/app/types/types"; 

interface Balance {
  id: string;
  amount: number;
  userId: string;
  accountId:string;
}

const AccountBalance: React.FC = () => {
  const { data: session } = useSession();

  // Utiliser useRef avec le type Account[] | null
  const accountsRef = useRef<Account[] | null>(null);
  const balancesRef = useRef<Balance[] | null>(null);

  // Fetch accounts uniquement si non chargé
  const { accounts } = useFetchAccounts({default:true});

  if (!accountsRef.current && accounts.length > 0) {
    accountsRef.current = accounts; // Mémoriser les comptes après fetch
  }

  // Ne passe accounts que si ce n'est pas null
  const { balances } = useFetchBalance({ accounts: accountsRef.current || [] });
  if (!balancesRef.current && balances.length > 0) {
    balancesRef.current = balances; // Mémoriser les balances après fetch
  }

  const [balanceInput, setBalanceInput] = useState<number | null>(null);
  const [showBalanceForm, setShowBalanceForm] = useState<boolean>(false);

  // Afficher le premier solde si disponible
  const balance = balancesRef.current ? balancesRef.current[0] : null;

  const handleUpdateClick = useCallback(() => {
    setBalanceInput(balance ? balance.amount : null);
    setShowBalanceForm(true);
  }, [balance]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBalanceInput(parseFloat(e.target.value));
    },
    []
  );

  const handleUpdateBalance = async () => {
    if (balance?.id && balanceInput !== null) {
      try {
        const response = await fetch(`/api/balance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            userId:balance.userId,
            accountId:balance.accountId,
            amount: balanceInput }),
        });

        const data = await response.json();
        if (data) {
          setShowBalanceForm(false);
          if (balancesRef.current) {
            balancesRef.current[0].amount = balanceInput; // mettre à jour localement après succès
          }
        }
      } catch (error) {
        console.error("Failed to update balance:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {balance && (
        <Card className="max-w-md mx-auto shadow-lg rounded-lg border border-gray-200 mb-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Solde du compte:
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showBalanceForm ? (
              <div className="flex flex-col items-center space-y-2">
                <input
                  type="number"
                  value={balanceInput !== null ? balanceInput : ""}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full text-center"
                  placeholder="Entrez le solde"
                />
                <Button
                  onClick={() => setShowBalanceForm(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Annuler
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <p className="text-2xl font-bold text-green-600">
                  {balance?.amount} €
                </p>
                <Button
                  variant="ghost"
                  onClick={handleUpdateClick}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Mettre à jour le solde
                </Button>
              </div>
            )}
          </CardContent>
          {showBalanceForm && (
            <CardFooter className="flex flex-col items-center space-y-2">
              <Button
                onClick={handleUpdateBalance}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Enregistrer
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};

export default AccountBalance;
