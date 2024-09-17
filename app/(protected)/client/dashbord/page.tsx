"use client";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  TrashIcon,
  PlusIcon,
  HomeIcon,
  CheckIcon,
  Pencil2Icon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { NewButton } from "@/components/dashbord/new-depencies-button";
import { BarChartIcon } from "@radix-ui/react-icons";
import { FixedExpensesCard } from "@/components/dashbord/FixedExpensesCard";
import TabCategory from "@/components/dashbord/tabCategory";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
interface Expense {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
}

interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  paid: boolean;
}

interface MonthlyExpense {
  id: string;
  month: number;
  year: number;
  amount: number;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Home: <HomeIcon className="w-6 h-6 text-blue-500" />,
  // Add more categories and icons as needed
};

export default function Dashboard() {
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);

  const calculateTotalPaidAmount = (expenses: Expense[]): number => {
    return expenses
      .filter((expense) => expense.paid) // Filtrer les dépenses dont le statut est 'paid' (true)
      .reduce((total, expense) => total + expense.amount, 0); // Additionner les montants
  };
  const totalPaidAmount = calculateTotalPaidAmount(fixedExpenses);

  const totalFixedExpenses = fixedExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  const restantàpayer = totalFixedExpenses - totalPaidAmount;
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses");
        const data = await response.json();
        setFixedExpenses(data.fixedExpenses);
        setMonthlyExpenses(data.monthlyExpenses);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-0 bg-gradient-to-r from-sky-400 to-blue-800 pb-20">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto bg-gray-100 md:rounded-lg shadow-lg p-2 md:p-2">
          <div className="flex flex-row md:flex-col items-center justify-between mb-4">
            <h1
              className={cn(
                "text-3xl md:text-4xl font-bold text-gray-800",
                font.className
              )}
            >
              Tableau de bord
            </h1>
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center py-4 md:mt-0"
            >
              <BarChartIcon className="w-6 h-6 mr-2" />
              <span className="hidden md:inline">Statistiques</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card for Fixed Expenses */}
            <FixedExpensesCard
              totalAmount={totalFixedExpenses}
              restant={restantàpayer}
            />

            {/* Card for Monthly Expenses */}
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

          {/* New Expense Button */}
          <div className="mt-8 mb-8 flex justify-center">
            <NewButton>
              <Button variant="default" size="lg">
                <PlusIcon className="w-5 h-5 mr-2" />
                Nouvelle Charge
              </Button>
            </NewButton>
          </div>
        </div>
      </main>

      {/* Bottom Action Block */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 p-4 flex flex-wrap justify-around items-center gap-2">
        <Button variant="secondary" size="sm" className="flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Action 1
        </Button>
        <Button variant="secondary" size="sm" className="flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Action 2
        </Button>
        <Button variant="secondary" size="sm" className="flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Action 3
        </Button>
      </div>
    </div>
  );
}
