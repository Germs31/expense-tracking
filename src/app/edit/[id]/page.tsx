"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
}

export default function EditExpensePage({ params }: { params: { id: string } }) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    dueDate: "",
    notes: "",
  });
  
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(`/api/get-expenses/${id}`);
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          setExpense(data.expense);
          setFormData({
            title: data.expense.title,
            amount: data.expense.amount.toString(),
            category: data.expense.category,
            dueDate: data.expense.dueDate ? new Date(data.expense.dueDate).toISOString().split('T')[0] : "",
            notes: data.expense.notes || "",
          });
        } else {
          console.error("Failed to fetch expense");
        }
      } catch (error) {
        console.error("Error fetching expense:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchExpense();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/get-expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Update the expense state with the updated data
        const updatedExpense = {
          ...expense as Expense,
          title: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.category,
          dueDate: formData.dueDate,
          notes: formData.notes,
        };
        setExpense(updatedExpense);
        setIsEditing(false);
        alert("Expense updated successfully!");
      } else {
        alert("Failed to update expense.");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        const response = await fetch(`/api/delete-expense?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Expense deleted successfully!");
          router.push("/");
        } else {
          alert("Failed to delete expense.");
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="p-6 text-white">
          <p>Loading expense details...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!expense) {
    return (
      <AuthenticatedLayout>
        <div className="p-6 text-white">
          <p>Expense not found</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white"
          >
            Go Back
          </button>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="p-6 text-white max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Expense" : "Expense Details"}
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="bg-neutral-800 rounded-lg p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <h3 className="text-sm font-medium text-emerald-500 mb-1">Title</h3>
              {isEditing ? (
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter title"
                  className="w-full p-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-lg">{expense.title}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <h3 className="text-sm font-medium text-emerald-500 mb-1">Amount</h3>
              {isEditing ? (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">$</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className="w-full pl-8 p-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <p className="text-lg">{formatCurrency(expense.amount)}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <h3 className="text-sm font-medium text-emerald-500 mb-1">Category</h3>
              {isEditing ? (
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  aria-label="Select expense category"
                  className="w-full p-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="credit card">Credit Card</option>
                  <option value="car loan">Car Loan</option>
                  <option value="utility">Utility</option>
                  <option value="loan">Loan</option>
                  <option value="pets">Pets</option>
                </select>
              ) : (
                <p className="text-lg capitalize">{expense.category}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <h3 className="text-sm font-medium text-emerald-500 mb-1">Due Date</h3>
              {isEditing ? (
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  placeholder="Enter due date"
                  className="w-full p-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-lg">{expense.dueDate ? formatDate(expense.dueDate) : "N/A"}</p>
              )}
            </div>

            {/* Created At */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-emerald-500 mb-1">Created At</h3>
              <p className="text-lg">{formatDate(expense.createdAt)}</p>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-emerald-500 mb-1">Notes</h3>
              {isEditing ? (
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter notes"
                  rows={4}
                  className="w-full p-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              ) : (
                <p className="text-lg">{expense.notes || "No notes"}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end items-center mt-6 space-x-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Delete Expense
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          )}

          <button
            onClick={() => router.push("/")}
            className="mt-6 text-emerald-500 hover:text-emerald-400 flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Expenses
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
