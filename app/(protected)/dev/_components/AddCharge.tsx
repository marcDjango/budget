"use client";
import React, { useState, useEffect } from "react";
import { useAddOrUpdateCharge } from "@/app/(protected)/dev/_hooks/useAddOrUpdateCharge";

export default function AddCharge({
  accountId,
  existingCharge,
}: {
  accountId: string;
  existingCharge?: any;
}) {
  const { saveExpense, isLoading, error, success } = useAddOrUpdateCharge();
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    accountId: accountId,
    category: "",
    paid: false,
    paymentDate: "",
    type: "FIXED", // FIXED or MONTHLY
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (existingCharge) {
      setFormData({
        name: existingCharge.name,
        amount: existingCharge.amount,
        accountId: accountId,
        category: existingCharge.category,
        paid: existingCharge.paid,
        paymentDate: existingCharge.paymentDate
          ? new Date(existingCharge.paymentDate).toISOString().substr(0, 10)
          : "",
        type: existingCharge.type,
        month: existingCharge.month || new Date().getMonth() + 1,
        year: existingCharge.year || new Date().getFullYear(),
      });
    }
  }, [existingCharge, accountId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;

    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("@accountId",accountId)
    await saveExpense(formData, existingCharge?.id);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6">
        {existingCharge ? "Modifier la charge" : "Ajouter une nouvelle charge"}
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Nom de la dépense
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nom de la dépense"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Montant
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Montant"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Catégorie
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Sélectionner une catégorie</option>
          <option value="Utilities">Maison</option>
          <option value="Rent">Rent</option>
          {/* Autres catégories */}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Date de paiement
        </label>
        <input
          type="date"
          name="paymentDate"
          value={formData.paymentDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="paid"
            checked={formData.paid}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="ml-2 text-gray-700">Paid</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Type de dépense
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
        >
          <option value="FIXED">Fixe</option>
          <option value="MONTHLY">Mensuel</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 transition ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {existingCharge ? "Mettre à jour la charge" : "Ajouter la charge"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {success && (
        <p className="mt-4 text-green-500">
          {existingCharge
            ? "Charge mise à jour"
            : "Dépense ajoutée avec succès"}
        </p>
      )}
    </form>
  );
}
