"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";
import Card from "@/components/Card/Card";

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
  const router = useRouter();
  const { status } = useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Redirect to register if not authenticated
    if (status === "unauthenticated") {
      router.push("/register");
      return;
    }

    // Only fetch data if authenticated
    if (status === "authenticated") {
      const fetchData = async () => {
        try {
          // Fetch user data
          const userResponse = await fetch("/api/user");
          const userData = await userResponse.json();
          if (userData && userData.user) {
            setUserData(userData.user);
          }
          
          // Fetch expenses
          const expensesResponse = await fetch("/api/get-expenses");
          if (expensesResponse.ok) {
            const expensesData = await expensesResponse.json();
            setExpenses(expensesData.expenses || []);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [status, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const calculateTotalExpenses = () => {
    if (!expenses.length) return 0;
    
    return expenses.reduce((total, expense) => {
      return total + (typeof expense.amount === 'number' ? expense.amount : 0);
    }, 0);
  };

  const totalExpenses = calculateTotalExpenses();

  const generateCardData = () => {
    const totalDebit = totalExpenses;
    const monthlyIncome = userData?.monthlyIncome || 0; // Use the user's monthly income
    const leftOver = monthlyIncome - totalDebit;

    return [
      {
        title: "Total Debit",
        total: totalDebit
      },
      {
        title: "Monthly Income",
        total: monthlyIncome
      },
      {
        title: "Remaining Balance",
        total: leftOver
      }
    ];
  };

  const cardData = generateCardData();

  // Show loading state while checking auth
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-emerald-500 text-2xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will be redirected)
  if (status === "unauthenticated") {
    return null;
  }

  // Otherwise show normal content
  return (
    <AuthenticatedLayout>
      <div className="p-10">
        {/* Top Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {cardData.map((data, index) => (
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
    </AuthenticatedLayout>
  );
}
