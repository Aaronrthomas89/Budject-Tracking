"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Transaction, Category } from "@/lib/types"
import { Doughnut, Bar } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface BudgetChartProps {
  transactions: Transaction[]
  categories: Category[]
}

export default function BudgetChart({ transactions, categories }: BudgetChartProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [barChartData, setBarChartData] = useState<any>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only include expense transactions for the pie chart
    const expenseTransactions = transactions.filter((t) => t.type === "expense")

    // Group transactions by category
    const categoryTotals: Record<string, number> = {}
    expenseTransactions.forEach((transaction) => {
      if (!categoryTotals[transaction.categoryId]) {
        categoryTotals[transaction.categoryId] = 0
      }
      categoryTotals[transaction.categoryId] += transaction.amount
    })

    // Prepare data for pie chart
    const categoryNames: string[] = []
    const categoryAmounts: number[] = []
    const backgroundColors: string[] = []

    Object.keys(categoryTotals).forEach((categoryId) => {
      const category = categories.find((c) => c.id === categoryId)
      if (category) {
        categoryNames.push(category.name)
        categoryAmounts.push(categoryTotals[categoryId])
        backgroundColors.push(category.color)
      }
    })

    setChartData({
      labels: categoryNames,
      datasets: [
        {
          data: categoryAmounts,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    })

    // Prepare monthly data for bar chart
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return date
    }).reverse()

    const monthlyIncomes: number[] = []
    const monthlyExpenses: number[] = []
    const monthLabels: string[] = []

    last6Months.forEach((month) => {
      const monthYear = month.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
      monthLabels.push(monthYear)

      const monthIncome = transactions
        .filter(
          (t) =>
            t.type === "income" &&
            new Date(t.date).getMonth() === month.getMonth() &&
            new Date(t.date).getFullYear() === month.getFullYear(),
        )
        .reduce((sum, t) => sum + t.amount, 0)

      const monthExpense = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            new Date(t.date).getMonth() === month.getMonth() &&
            new Date(t.date).getFullYear() === month.getFullYear(),
        )
        .reduce((sum, t) => sum + t.amount, 0)

      monthlyIncomes.push(monthIncome)
      monthlyExpenses.push(monthExpense)
    })

    setBarChartData({
      labels: monthLabels,
      datasets: [
        {
          label: "Income",
          data: monthlyIncomes,
          backgroundColor: "#22c55e",
        },
        {
          label: "Expenses",
          data: monthlyExpenses,
          backgroundColor: "#ef4444",
        },
      ],
    })
  }, [transactions, categories])

  if (!chartData || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Add transactions to see your spending reports.</p>
      </div>
    )
  }

  return (
    <div className="w-full" ref={chartRef}>
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-blue-50 p-1 mb-4">
          <TabsTrigger
            value="categories"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Spending by Category
          </TabsTrigger>
          <TabsTrigger
            value="monthly"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Monthly Overview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="flex justify-center">
          <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-sm">
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  title: {
                    display: true,
                    text: "Expenses by Category",
                  },
                },
              }}
            />
          </div>
        </TabsContent>
        <TabsContent value="monthly">
          {barChartData && (
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Monthly Income vs Expenses",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
