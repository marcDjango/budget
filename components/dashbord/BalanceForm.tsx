import { useState, FormEvent, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react'; // Importer useSession pour accéder à la session

interface BalanceFormProps {
  onClose: () => void;
}

const BalanceForm: React.FC<BalanceFormProps> = ({ onClose }) => {
  const { data: session, status } = useSession({
    required: true,  // Empêche de déclencher des fetchs si la session n'est pas disponible
    onUnauthenticated() {
      // Redirige vers une page de connexion si nécessaire
      window.location.href = "/api/auth/signin";
    },
  });
  const [amount, setAmount] = useState<number | ''>(''); // Utilisez un état de type number ou chaîne vide

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (amount === '' || !session?.user?.id) return; // Vérifiez que le montant n'est pas vide et que l'userId est présent

    // Appel à l'API pour enregistrer le solde avec userId
    const res = await fetch('/api/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id, // Ajout de l'userId dans le corps de la requête
        amount,
      }),
    });

    if (res.ok) {
      onClose(); // Fermer la modal après la soumission
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value) || ''); // Met à jour l'état avec un nombre ou chaîne vide si la saisie est invalide
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="balance">Entrer votre solde actuel :</label>
      <input
        type="number"
        id="balance"
        value={amount === '' ? '' : amount} // Si `amount` est vide, afficher une chaîne vide
        onChange={handleAmountChange}
        required
      />
      <button type="submit">Valider</button>
    </form>
  );
};

export default BalanceForm;
