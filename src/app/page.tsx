import Card from "@/components/Card/Card"


const dummyData = [
  {
    title: "debit",
    total: 20000
  },
  {
    title: "monthly income",
    total: 4000
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
    </div>
  )
}
