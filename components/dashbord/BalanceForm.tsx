import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import BalanceForm from '@/components/dashbord/BalanceForm'; // Assurez-vous que le chemin est correct
import { Button } from "@/components/ui/button"; // Utilisation du bouton stylisé de Shadcn
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"; // Utilisation de la carte Shadcn

const AccountBalance: React.FC = () => {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<{ amount: number; accountId: string } | null>(null);
  const [showBalanceForm, setShowBalanceForm] = useState(false);
  const [balanceInput, setBalanceInput] = useState<number | string>("");

  useEffect(() => {
    const fetchBalance = async () => {
      if (session?.user?.id) {
        const res = await fetch(`/api/balance/${session.user.id}`);
        const data = await res.json();

        if (data) {
          setBalance({ amount: data.balance.amount, accountId: data.balance.accountId });
          setBalanceInput(data.balance.amount); // Met à jour l'input avec le montant actuel
        } else {
          setShowBalanceForm(true); // Affiche le formulaire si aucun solde
        }
      }
    };

    fetchBalance();
  }, [session]);

  const handleBalanceFormClose = () => {
    setShowBalanceForm(false);
    const fetchBalance = async () => {
      if (session?.user?.id) {
        const res = await fetch(`/api/balance/${session.user.id}`);
        const data = await res.json();
        setBalance({ amount: data.amount, accountId: data.accountId });
        setBalanceInput(data.amount); // Met à jour l'input après la fermeture
      }
    };
    fetchBalance();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBalanceInput(e.target.value);
  };

  const handleUpdateBalance = () => {
    // Logique pour mettre à jour le solde via une API
    if (session?.user?.id && balance?.accountId) {
      fetch(`/api/balance/${balance.accountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: balanceInput }),
      })
      .then(response => response.json())
      .then(data => {
        setBalance({ amount: data.amount, accountId: data.accountId });
        setShowBalanceForm(false);
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="max-w-md mx-auto shadow-lg rounded-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Solde du compte</CardTitle>
        </CardHeader>
        <CardContent>
          {showBalanceForm ? (
            <div className="flex flex-col items-center space-y-2">
              <input
                type="number"
                value={balanceInput}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full text-center"
                placeholder="Entrez le solde"
              />
              <Button 
                onClick={handleUpdateBalance} 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Mettre à jour
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <p className="text-2xl font-bold text-green-600">{balance?.amount} €</p>
              <Button 
                variant="ghost" 
                onClick={() => setShowBalanceForm(true)} 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Mettre à jour le solde
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          {balance === null && !showBalanceForm && (
            <Button onClick={() => setShowBalanceForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Enregistrer
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountBalance;
