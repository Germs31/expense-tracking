import Card from "@/components/Card/Card"


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

export default function Home() {
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
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">
                2023-10-01
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">
                Grocery Shopping
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">
                $150
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">
                2023-10-02
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">
                Gas
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">
                $50
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">
                2023-10-03
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">
                Dining Out
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-700">
                $75
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
