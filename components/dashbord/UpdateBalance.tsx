import { useState, useEffect } from 'react';

function UpdateBalance({ userId }: { userId: string }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [newBalance, setNewBalance] = useState<string>('');

  useEffect(() => {
    async function fetchBalance() {
      const res = await fetch(`/api/balance/${userId}`);
      const data = await res.json();
      if (data.balance) {
        setBalance(data.balance.amount);
      }
    }
    fetchBalance();
  }, [userId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/balance/${userId}', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount: parseFloat(newBalance) }),
    });

    const data = await res.json();
    if (data.updatedBalance) {
      setBalance(data.updatedBalance.amount);
      setNewBalance('');
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Mettre à jour votre solde</h2>
      <p>Solde actuel : {balance !== null ? `${balance} €` : 'Chargement...'}</p>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={newBalance}
          onChange={(e) => setNewBalance(e.target.value)}
          placeholder="Entrez le nouveau solde"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Mettre à jour
        </button>
      </form>
    </div>
  );
}

export default UpdateBalance;
