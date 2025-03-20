import { configureStore } from "@reduxjs/toolkit"
import tasksReducer from "./features/tasks/tasksSlice"

// Create a simple initial state
const initialState = {}

// Create the store with the initial state
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState: initialState,
})

// Only set up localStorage persistence after the app has mounted on the client
if (typeof window !== "undefined") {
  // Load state from localStorage
  try {
    const savedState = localStorage.getItem("taskManagerState")
    if (savedState) {
      // We'll handle loading the state in the TaskManager component
    }
  } catch (err) {
    console.error("Error loading state from localStorage:", err)
  }

  // Save state to localStorage when it changes
  store.subscribe(() => {
    try {
      const state = store.getState()
      localStorage.setItem(
        "taskManagerState",
        JSON.stringify({
          tasks: state.tasks,
        }),
      )
    } catch (err) {
      console.error("Error saving state to localStorage:", err)
    }
  })
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

