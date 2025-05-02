"use client"

import { useState, useEffect } from "react"
import { Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TransactionForm from "@/components/transaction-form"
import TransactionList from "@/components/transaction-list"
import BudgetChart from "@/components/budget-chart"
import type { Transaction, Category } from "@/lib/types"
import { calculateTotals } from "@/lib/utils"

export default function BudgetDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("transactions")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("categories")
      return saved
        ? JSON.parse(saved)
        : [
            { id: "1", name: "Food", color: "#10b981" },
            { id: "2", name: "Transportation", color: "#3b82f6" },
            { id: "3", name: "Entertainment", color: "#8b5cf6" },
            { id: "4", name: "Housing", color: "#ef4444" },
            { id: "5", name: "Utilities", color: "#f59e0b" },
            { id: "6", name: "Income", color: "#22c55e", type: "income" },
          ]
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
    localStorage.setItem("categories", JSON.stringify(categories))
  }, [transactions, categories])

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now().toString() }])
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const { income, expenses, balance } = calculateTotals(transactions)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{balance.toFixed(2)}</div>
            <p className="text-xs text-blue-100">Current balance</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Income</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-emerald-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{income.toFixed(2)}</div>
            <p className="text-xs text-emerald-100">Total income</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-100">Expenses</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-rose-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{expenses.toFixed(2)}</div>
            <p className="text-xs text-rose-100">Total expenses</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-blue-50 p-1">
          <TabsTrigger
            value="transactions"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Add Transaction
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Card className="border-none shadow-md bg-white">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View and manage your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={transactions} categories={categories} onDelete={deleteTransaction} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card className="border-none shadow-md bg-white">
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
              <CardDescription>Record a new income or expense</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionForm onAddTransaction={addTransaction} categories={categories} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card className="border-none shadow-md bg-white">
            <CardHeader>
              <CardTitle>Spending Reports</CardTitle>
              <CardDescription>Visualize your spending patterns</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <BudgetChart transactions={transactions} categories={categories} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
