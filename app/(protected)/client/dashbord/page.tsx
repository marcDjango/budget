"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TrashIcon, PlusIcon, HomeIcon,CheckIcon, Pencil2Icon, Cross1Icon  } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { NewButton } from "@/components/dashbord/new-depencies-button";
import { BarChartIcon } from "@radix-ui/react-icons";
import { FixedExpensesCard } from "@/components/dashbord/FixedExpensesCard";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name?: string; amount?: number; category?: string }>({});
  const totalFixedExpenses = fixedExpenses.reduce((total, expense) => total + expense.amount, 0);
  
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

  const handleEdit = (id: string) => {
    setEditingId(id);
    const expense = fixedExpenses.find((expense) => expense.id === id);
    if (expense) {
      setEditData({ name: expense.name, amount: expense.amount, category: expense.category });
    }
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });
      if (response.ok) {
        const updatedData = await response.json();
        setFixedExpenses((prev) =>
          prev.map((expense) => (expense.id === id ? updatedData : expense))
        );
        setEditingId(null);
      } else {
        console.error("Erreur lors de la sauvegarde des modifications.");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setFixedExpenses((prev) => prev.filter((expense) => expense.id !== id));
      } else {
        console.error("Erreur lors de la suppression de la charge.");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 bg-gradient-to-r from-sky-400 to-blue-800 pb-20">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-2">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h1 className={cn("text-3xl md:text-4xl font-bold text-gray-800", font.className)}>
              Tableau de bord
            </h1>
            <Button variant="secondary" size="lg" className="flex items-center mt-4 md:mt-0">
              <BarChartIcon className="w-6 h-6 mr-2" />
              Statistiques
            </Button>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card for Fixed Expenses */}
            <FixedExpensesCard totalAmount={totalFixedExpenses} />
  
            {/* Card for Monthly Expenses */}
            <div className="bg-white rounded-lg shadow-lg p-2 md:p-4">
              <h2 className="text-xl font-semibold text-gray-800">Dépenses Mensuelles</h2>
              <p className="text-lg font-medium text-gray-600 mt-2">
                {monthlyExpenses.reduce((total, expense) => total + expense.amount, 0)} €
              </p>
              <p className="text-sm text-gray-500">Total des dépenses mensuelles</p>
            </div>
          </div>
  
          {/* List of Fixed Expenses */}
          <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Détails des Charges Fixes</h2>
    <ul className="space-y-2">
      {fixedExpenses.map((expense) => (
        <li key={expense.id} className="flex items-center bg-gray-100 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-shrink-0">
              {categoryIcons[expense.category] || <HomeIcon className="w-6 h-6 text-gray-500" />}
            </div>
            {editingId === expense.id ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full border rounded p-2"
                  placeholder="Nom"
                />
                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                  className="w-full border rounded p-2"
                  placeholder="Montant"
                />
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="w-full border rounded p-2"
                >
                  {Object.keys(categoryIcons).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave(expense.id)}
                    className="p-1"
                  >
                    <CheckIcon className="w-5 h-5 text-green-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(null)}
                    className="p-1"
                  >
                    <Cross1Icon className="w-5 h-5 text-red-600" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-600">{expense.name}</h3>
                <p className="text-sm text-gray-500">{expense.amount} €</p>
              </div>
            )}
          </div>
          {!editingId && (
            <div className="ml-4 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(expense.id)}
                className="p-1"
              >
                <Pencil2Icon className="w-5 h-5 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(expense.id)}
                className="p-1"
              >
                <TrashIcon className="w-5 h-5 text-red-600" />
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
  
          {/* New Expense Button */}
          <div className="mt-8 flex justify-center">
            <NewButton>
              <Button variant="secondary" size="lg">
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
