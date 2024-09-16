"use client";
import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/auth/form-error';  // Import des composants d'erreur et succès
import { FormSucces } from '@/components/auth/form-succes';

const AddCharge = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    userId: session?.user?.id,
    paid: false,
    paymentDate: "",
    occurrence: "monthly", // Valeur par défaut
  });

  const [error, setError] = useState<string | undefined>("");  // Ajout de l'état pour l'erreur
  const [success, setSuccess] = useState<string | undefined>("");  // Ajout de l'état pour le succès
  const [isPending, startTransition] = useTransition();

  // Mettre à jour userId lorsque la session est disponible
  useEffect(() => {
    if (session && session.user) {
      setFormData((prevData) => ({
        ...prevData,
        userId: session.user.id,
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");  // Réinitialiser l'erreur
    setSuccess("");  // Réinitialiser le succès

    if (!session || !session.user) {
      setError("Session not found or user not logged in.");
      return;
    }

    // Formatage de la date de paiement
    const paymentDate = new Date(formData.paymentDate).toISOString();

    startTransition(async () => {
      try {
        const response = await fetch("/api/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            paymentDate,
          }),
        });

        if (response.ok) {
          setSuccess("Charge ajoutée avec succès !");
          // Ajout du délai de redirection de 2 secondes (2000 ms)
          setTimeout(() => {
            router.push("/client/dashbord");
          }, 2000);  // Délai de 2 secondes
          
        } else {
          const errorData = await response.json();
          console.log(response)
          setError(errorData.message || "Une erreur s'est produite.");
        }
      } catch (error) {
        setError("Une erreur s'est produite lors de l'ajout de la charge.");
        console.error("Error:", error);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-gray-500">Chargement en cours...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-gray-500">Non connecté</p>
      </div>
    );
  }

  return (
    <main className="flex h-full flex-col items-center justify-center bg-gray-100">
      <div className="space-y-6 w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold text-gray-800">
          Ajouter une nouvelle charge
        </h1>

        {/* Gestion du succès et de l'erreur */}
        <FormError message={error} />
        <FormSucces message={success} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom de la charge
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isPending}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Montant (€)
            </label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              disabled={isPending}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <Input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isPending}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label htmlFor="paid" className="block text-sm font-medium text-gray-700">
              Payé
            </label>
            <Input
              type="checkbox"
              id="paid"
              name="paid"
              checked={formData.paid}
              onChange={(e) => setFormData({
                ...formData,
                paid: e.target.checked,
              })}
              disabled={isPending}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
              Date de prélèvement
            </label>
            <Input
              type="date"
              id="paymentDate"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              required
              disabled={isPending}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label htmlFor="occurrence" className="block text-sm font-medium text-gray-700">
              Occurrence
            </label>
            <select
              id="occurrence"
              name="occurrence"
              value={formData.occurrence}
              onChange={handleChange}
              disabled={isPending}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="monthly">Chaque mois</option>
              <option value="every_2_months">Tous les 2 mois</option>
              <option value="quarterly">Trimestriel</option>
              <option value="annually">Annuel</option>
            </select>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            Ajouter Charge
          </Button>
        </form>
      </div>
    </main>
  );
};

export default AddCharge;
