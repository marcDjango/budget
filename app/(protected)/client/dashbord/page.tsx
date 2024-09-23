"use client";
import React, { useEffect, useState } from "react";
import { NewButton } from "@/components/dashbord/new-depencies-button";
import { FixedExpensesCard } from "@/components/dashbord/FixedExpensesCard";
import TabCategory from "@/components/dashbord/tabCategory";
import BottomActionBar from "@/components/dashbord/BottomActionBar";
import Header from "@/components/dashbord/HeaderSection";
import Loader from "@/components/dashbord/Loader";
import { Expense, FixedExpense, MonthlyExpense } from "./types/types";
import AccountBalance from "@/components/dashbord/AccountBalance";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const calculateTotalPaidAmount = (expenses: Expense[]): number => {
    return expenses
      .filter((expense) => expense.paid)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const totalPaidAmount = calculateTotalPaidAmount(fixedExpenses);
  const totalFixedExpenses = fixedExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  const restantàpayer = totalFixedExpenses - totalPaidAmount;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/expenses");
        const data = await response.json();
        setFixedExpenses(data.fixedExpenses);
        setMonthlyExpenses(data.monthlyExpenses);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-0 bg-gradient-to-r from-sky-400 to-blue-800 pb-20">
        <div className="max-w-4xl mx-auto bg-gray-100 md:rounded-lg shadow-lg p-2 md:p-2">
          <Header title="Tableau de bord" />
          <AccountBalance  />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <FixedExpensesCard
              totalAmount={totalFixedExpenses}
              restant={restantàpayer}
            />
            <div className="bg-white rounded-lg shadow-lg p-2 md:p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Dépenses Mensuelles
              </h2>
              <p className="text-lg font-medium text-gray-600 mt-2">
                {monthlyExpenses.reduce(
                  (total, expense) => total + expense.amount,
                  0
                )}{" "}
                €
              </p>
              <p className="text-sm text-gray-500">
                Total des dépenses mensuelles
              </p>
            </div>
          </div>
          <TabCategory fixedExpenses={fixedExpenses} />
          <div className="mt-8 mb-8 flex justify-center">
            <NewButton>Nouvelle Charge</NewButton>
          </div>
        </div>
      </main>
      <BottomActionBar />
    </div>
  );
}
