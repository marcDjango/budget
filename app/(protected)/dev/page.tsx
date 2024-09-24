"use client";
import React, { useEffect, useState } from "react";
import useFetchAccounts from "@/hooks/useFetchAccounts";
import { useUserExpenses } from "@/app/(protected)/dev/_hooks/useFetchData"; // Importation du hook personnalisé
import AddCharge from "./_components/AddCharge";

const ExpenseList = () => {
  const { accounts, loading: loadingAccounts, error: errorAccounts } = useFetchAccounts({ default: true });
  const [accountId, setAccountId] = useState<string>("");

  // Vérification des comptes et définition du premier compte comme sélection par défaut
  useEffect(() => {
    if (accounts && accounts.length > 0) {
      setAccountId(accounts[0].id);
    }
  }, [accounts]);

  // Vérification si accountId est défini avant de récupérer les dépenses
  const {
    expenses,
    loading: loadingExpenses,
    error: errorExpenses,
  } = useUserExpenses(accountId || undefined); // Passer undefined si accountId est vide

  // Affichage pendant le chargement des comptes
  if (loadingAccounts || loadingExpenses) {
    return <p>Chargement des informations...</p>;
  }

  // Affichage en cas d'erreur lors du chargement des comptes
  if (errorAccounts) {
    return <p>Erreur lors du chargement des comptes : {errorAccounts}</p>;
  }

  // Si aucun compte n'est disponible
  if (!accountId) {
    return <p>Aucun compte disponible.</p>;
  }

  return (
    <div>
      <div>
        <h2>Compte utilisateur : {accountId}</h2>
        {loadingExpenses ? (
          <p>Chargement des dépenses...</p>
        ) : errorExpenses ? (
          <p>Erreur lors du chargement des dépenses : {errorExpenses}</p>
        ) : expenses.length === 0 ? (
          <p>Aucune dépense trouvée</p>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id}>
              <p>id de la dépense : {expense.id}</p>
              <p>Nom de la dépense : {expense.name}</p>
              <p>Montant : {expense.amount} €</p>
              <p>Catégorie : {expense.category}</p>
              <p>Payé : {expense.paid ? "Oui" : "Non"}</p>
              {expense.paymentDate && (
                <p>Date de paiement : {new Date(expense.paymentDate).toLocaleDateString()}</p>
              )}
            </div>
          ))
        )}
      </div>
      {/* Rendre AddCharge seulement si accountId est défini */}
      {accountId && <AddCharge accountId={accountId} existingCharge={{ id:"cm1ga34wy0007ds1oh02qolem"}} />}
    </div>
  );
};

export default ExpenseList;
