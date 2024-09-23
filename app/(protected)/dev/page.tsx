"use client";
import React, { useEffect, useState } from "react";
import useFetchAccounts from "@/hooks/useFetchAccounts";
import { useUserExpenses } from "@/app/(protected)/dev/_hooks/useFetchData"; // Importation du hook personnalisé

const ExpenseList = () => {
  const { accounts, loading: loadingAccounts, error: errorAccounts } = useFetchAccounts({ default: true });
  const [accountId, setAccountId] = useState<string | null>(null);
  
  // Vérification des comptes
  useEffect(() => {
    if (accounts.length > 0) {
      setAccountId(accounts[0].id); // Récupérer l'ID du premier compte
    }
  }, [accounts]);

  // Récupérer les dépenses uniquement si accountId est défini
  const { expenses, loading: loadingExpenses, error: errorExpenses } = useUserExpenses(accountId);

  return (
    <div>
      <h2>User Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        expenses.map((expense) => (
          <div key={expense.id}>
            <p>Expense Name: {expense.name}</p>
            <p>Amount: ${expense.amount}</p>
            <p>Category: {expense.category}</p>
            <p>Paid: {expense.paid ? "Yes" : "No"}</p>
            {expense.paymentDate && <p>Payment Date: {new Date(expense.paymentDate).toLocaleDateString()}</p>}
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseList;
