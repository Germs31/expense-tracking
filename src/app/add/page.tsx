"use client";

import { useState } from "react";
import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";

const AddExpensePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    minimumPayment: "",
    category: "credit card",
    dueDate: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/add-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Expense added successfully!");
        setFormData({ title: "", amount: "", minimumPayment: "", category: "credit card", dueDate: "", notes: "" });
      } else {
        alert("Failed to add expense.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-white">Add New Expense</h1>
        <div className="flex justify-center items-center h-auto text-white">
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
          >
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">$</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 p-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Minimum Payment - only shows for credit cards */}
            {formData.category === "credit card" && (
              <div>
              <label htmlFor="minimumPayment" className="block text-sm font-medium mb-2">
                Minimum Payment
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">$</span>
                <input
                type="number"
                id="minimumPayment"
                name="minimumPayment"
                value={formData.minimumPayment}
                onChange={handleChange}
                step="0.01"
                className="w-full pl-8 p-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              </div>
            )}

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="credit card">Credit Card</option>
                <option value="car loan">Car Loan</option>
                <option value="utility">Utility</option>
                <option value="loan">Loan</option>
                <option value="pets">Pets</option>
                <option value="insurance">Insurance</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default AddExpensePage;