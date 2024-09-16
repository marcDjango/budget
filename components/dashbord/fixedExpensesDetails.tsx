import React, { useState } from 'react'; // Assurez-vous que React est importé

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface FixedExpensesDetailsProps {
  fixedExpenses: Expense[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleSave: (id: string) => void;
  categoryIcons: { [key: string]: JSX.Element };
}

const FixedExpensesDetails: React.FC<FixedExpensesDetailsProps> = ({
  fixedExpenses,
  handleEdit,
  handleDelete,
  handleSave,
  categoryIcons,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Expense>>({});
  const [isPointing, setIsPointing] = useState<boolean>(false);
  const [selectedAmounts, setSelectedAmounts] = useState<number[]>([]);

  const handlePointerClick = () => {
    setIsPointing(!isPointing);
  };

  const handleCheckboxChange = (amount: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedAmounts((prev) => [...prev, amount]);
    } else {
      setSelectedAmounts((prev) => prev.filter((amt) => amt !== amount));
    }
  };

  // Correction: Assurez-vous que tout le JSX est bien entouré de parenthèses après `return`
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Détails des Charges Fixes
      </h2>
      <ul className="space-y-1 border border-gray-300 rounded-lg p-2 pb-0">
        {fixedExpenses.map((expense) => (
          <li key={expense.id} className="flex items-center border-b border-b-gray-300 p-2 shadow-sm">
            {isPointing && (
              <input
                type="checkbox"
                className="mr-2"
                onChange={(e) => handleCheckboxChange(expense.amount, e.target.checked)}
              />
            )}
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                {categoryIcons[expense.category] || <div className="w-6 h-6 text-gray-500">Icone</div>}
              </div>
              {editingId === expense.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full border rounded p-2"
                    placeholder="Nom"
                  />
                  <input
                    type="number"
                    value={editData.amount !== undefined ? editData.amount : ''}
                    onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full border rounded p-2"
                    placeholder="Montant"
                  />
                  <select
                    value={editData.category || ''}
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
                    <button onClick={() => handleSave(expense.id)} className="p-1">
                      Valider
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1">
                      Annuler
                    </button>
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
                <button onClick={() => handleEdit(expense.id)} className="p-1">
                  Modifier
                </button>
                <button onClick={() => handleDelete(expense.id)} className="p-1">
                  Supprimer
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="flex justify-end mt-4">
        <button onClick={handlePointerClick} className="p-2">
          {isPointing ? 'Valider' : 'Pointer'}
        </button>
      </div>
    </div>
  );
};

export default FixedExpensesDetails;
