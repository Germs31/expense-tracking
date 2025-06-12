"use client";

import Card from "@/components/Card/Card"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const dummyData = [
  {
    title: "debit",
    total: 20000
  },
  {
    title: "monthly income",
    total: 4000
  },
  {
    title: "extra",
    total: 10
  }
]

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/get-expenses");
        if (response.ok) {
          const data = await response.json();
          setExpenses(data.expenses);
        } else {
          console.error("Failed to fetch expenses");
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  return (
    <div className="p-10">
      {/* Top Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {dummyData.map((data, index) => (
          <Card key={index} title={data.title} total={data.total} />
        ))}
      </div>

      {/* Expense Table */}
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-neutral-900">
              <th className="px-6 py-3 border-b border-neutral-700 text-left text-xs font-medium text-emerald-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 border-b border-neutral-700 text-left text-xs font-medium text-emerald-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 border-b border-neutral-700 text-left text-xs font-medium text-emerald-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 border-b border-neutral-700 text-left text-xs font-medium text-emerald-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-white">Loading expenses...</td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-white">No expenses found</td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-neutral-700">
                  <td className="px-6 py-4 whitespace-nowrap border-b border-neutral-700 text-sm text-white">
                    {formatDate(expense.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-neutral-700 text-sm text-white">
                    {expense.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-neutral-700 text-sm text-white">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-neutral-700 text-sm">
                    <button 
                      onClick={() => handleEdit(expense._id)}
                      className="text-emerald-500 hover:text-emerald-400 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
