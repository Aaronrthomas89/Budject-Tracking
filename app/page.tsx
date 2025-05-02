import { Suspense } from "react"
import BudgetDashboard from "@/components/budget-dashboard"
import { BudgetSkeleton } from "@/components/skeletons"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Budget Tracker
        </h1>
        <p className="text-center text-gray-600 mb-8">Manage your finances with ease</p>
        <Suspense fallback={<BudgetSkeleton />}>
          <BudgetDashboard />
        </Suspense>
      </div>
    </main>
  )
}
