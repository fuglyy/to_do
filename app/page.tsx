"use client"

import { Provider } from "react-redux"
import { ThemeProvider } from "@/components/theme-provider"
import { store } from "@/lib/store"
import TaskManager from "@/components/task-manager"
import ThemeToggle from "@/components/theme-toggle"
import { useEffect, useState } from "react"

export default function Home() {
  // Use client-side only rendering to avoid hydration mismatches
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a minimal loading state that matches the structure
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <div className="w-10 h-10"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main className="min-h-screen p-4 md:p-8 transition-colors bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
              <ThemeToggle />
            </div>
            <TaskManager />
          </div>
        </main>
      </ThemeProvider>
    </Provider>
  )
}

