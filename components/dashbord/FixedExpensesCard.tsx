"use client";
import React, { useState } from "react";

interface FixedExpensesCardProps {
  totalAmount: number;
}

export const FixedExpensesCard: React.FC<FixedExpensesCardProps> = ({ totalAmount }) => {
  const [user1Percentage, setUser1Percentage] = useState(55); // Pourcentage utilisateur 1
  const user2Percentage = 100 - user1Percentage; // Calcul du pourcentage de l'utilisateur 2

  // Calcul des montants en fonction des pourcentages
  const user1Amount = (totalAmount * user1Percentage) / 100;
  const user2Amount = (totalAmount * user2Percentage) / 100;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-center justify-between">
      {/* Partie gauche - Total des charges */}
      <div className="w-full  flex flex-row md:w-1/2 gap-4">
        <div>
        <h2 className="text-xl font-semibold text-gray-800">Charges Fixes</h2>
        <p className="text-lg font-medium text-gray-600 mt-2">{totalAmount} €</p>
        <p className="text-sm text-gray-500">Total des charges fixes</p>
        </div>
        <div>
        <h2 className="text-xl font-semibold text-gray-800">Reste à payer</h2>
        <p className="text-lg font-medium text-gray-600 mt-2">{totalAmount} €</p>
        <p className="text-sm text-gray-500">Total des reste à payer</p>
        </div>
      </div>

      {/* Partie droite - Répartition */}
      <div className="w-full md:w-1/2 mt-4 md:mt-0">
        <h3 className="text-lg font-semibold text-gray-800">Répartition</h3>
        
        {/* Barre de curseur */}
        <input
          type="range"
          min="0"
          max="100"
          value={user1Percentage}
          onChange={(e) => setUser1Percentage(Number(e.target.value))}
          className="w-full mt-2"
        />
        
        <span className="text-sm text-gray-600 flex flex-row justify-between ">
          <p>Eugénie: {user1Amount.toFixed(2)} €</p>
          <p>Marcelo: {user2Amount.toFixed(2)} €</p>
        </span>


        {/* Affichage graphique (barre de répartition) */}
        <div className="flex items-center mt-2">
  {user1Percentage > 0 && (
    <div
      className="h-4 bg-blue-500 flex items-center justify-center text-white text-sm"
      style={{ width: `${user1Percentage}%`, minWidth: '0px' }} // minWidth pour éviter la barre trop fine
    >
      {user1Percentage}%
    </div>
  )}
  {user2Percentage > 0 && (
    <div
      className="h-4 bg-green-500 flex items-center justify-center text-white text-sm"
      style={{ width: `${user2Percentage}%`, minWidth: '0px' }} // minWidth pour éviter la barre trop fine
    >
      {user2Percentage}%
    </div>
  )}
</div>

      </div>
    </div>
  );
};
