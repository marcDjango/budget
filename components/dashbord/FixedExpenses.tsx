import React, { useState } from "react"; // Assurez-vous que React est importé
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxIndicator } from "@radix-ui/react-checkbox";
import {
  CheckIcon,
  Cross1Icon,
  HomeIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  paid: boolean;
}
interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  paid: boolean;
}
interface FixedExpensesDetailsProps {
  fixedExpenses: Expense[];
}
const categoryIcons: Record<string, React.ReactNode> = {
  Home: <HomeIcon className="w-6 h-6 text-blue-500" />,
  // Add more categories and icons as needed
};
const FixedExpenses: React.FC<FixedExpensesDetailsProps> = ({
  fixedExpenses,
}) => {
  const [isfixedExpenses, setFixedExpenses] =
    useState<FixedExpense[]>(fixedExpenses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    name?: string;
    amount?: number;
    category?: string;
  }>({});
  // Fonctionnalité du bouton "Pointer"
  const [isPointerActive, setPointerActive] = useState(false);
  const handleEdit = (id: string) => {
    setEditingId(id);
    const expense = fixedExpenses.find((expense) => expense.id === id);
    if (expense) {
      setEditData({
        name: expense.name,
        amount: expense.amount,
        category: expense.category,
      });
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

  const handlePointerClick = async () => {
    setPointerActive(!isPointerActive); // Active le mode de pointage
  };

  const updatePaymentStatus = async (id: string, isPaid: boolean) => {
    try {
      await fetch("/api/expenses/update-payment-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, paid: isPaid }),
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleCheckboxChange = async (id: string, isChecked: boolean) => {
    // Mettre à jour l'état local
    setFixedExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, paid: isChecked } : expense
      )
    );

    // Mettre à jour le statut de paiement dans le backend
    try {
      await updatePaymentStatus(id, isChecked);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between px-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-8">
          Détails des Charges Fixes
        </h2>
        {/* Bouton "Pointer" */}
        <Button variant="primaryBorder" size="sm" onClick={handlePointerClick}>
          {isPointerActive ? "Valider" : "Pointer"}
        </Button>
      </div>
      <ul className="space-y-1 border border-gray-300 bg-white rounded-lg p-2 pb-0">
        {isfixedExpenses.map((expense) => (
          <li
            key={expense.id}
            className="flex items-center border-b border-b-gray-300 p-2 shadow-sm"
          >
            <div className="flex items-center space-x-4 flex-1">
              {/* Affichage des cases à cocher si "Pointer" est actif */}
              {isPointerActive ? (
                <>
                  <Checkbox
                    checked={expense.paid}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(expense.id, Boolean(checked))
                    }
                    className={`border-2 w-5 h-5 flex items-center justify-center rounded ${
                      expense.paid
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-blue-600 bg-white"
                    }`}
                  >
                    <CheckboxIndicator>
                      <CheckIcon className="w-6 h-6" />
                    </CheckboxIndicator>
                  </Checkbox>
                </>
              ) : (
                <></>
              )}
              <div className="flex-shrink-0">
                {categoryIcons[expense.category] || (
                  <HomeIcon className="w-6 h-6 text-gray-500" />
                )}
              </div>
              {editingId === expense.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full border rounded p-2"
                    placeholder="Nom"
                  />
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full border rounded p-2"
                    placeholder="Montant"
                  />
                  <select
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        category: e.target.value,
                      })
                    }
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
                  <h3 className="text-lg font-semibold text-gray-600">
                    {expense.name}
                  </h3>
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
  );
};

export default FixedExpenses;
