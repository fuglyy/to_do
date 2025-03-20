import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/lib/store"
import { v4 as uuidv4 } from "uuid"

// Define the Task type
export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
}

// Define the state type
interface TasksState {
  items: Task[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  cache: {
    timestamp: number
    expiresIn: number // in milliseconds
  }
}

// Initial state
const initialState: TasksState = {
  items: [],
  status: "idle",
  error: null,
  cache: {
    timestamp: 0,
    expiresIn: 5 * 60 * 1000, // 5 minutes
  },
}


const api = {
  fetchTasks: (): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            title: "Learn Redux Toolkit",
            description: "Understand how to use Redux Toolkit with React",
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Build a Task Manager",
            description: "Create a task manager application with Redux",
            completed: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
        ])
      }, 1000)
    })
  },
  addTask: (task: Omit<Task, "id" | "createdAt">): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...task,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        })
      }, 500)
    })
  },
  updateTask: (task: Task): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(task)
      }, 500)
    })
  },
  deleteTask: (id: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(id)
      }, 500)
    })
  },
}

// Async thunks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { getState }) => {
  const state = getState() as RootState
  const { cache } = state.tasks

  // Check if cache is still valid
  if (state.tasks.items.length > 0 && Date.now() - cache.timestamp < cache.expiresIn) {
    return state.tasks.items
  }

  const response = await api.fetchTasks()
  return response
})

export const addTask = createAsyncThunk("tasks/addTask", async (task: { title: string; description: string }) => {
  const response = await api.addTask({
    ...task,
    completed: false,
  })
  return response
})

export const updateTask = createAsyncThunk("tasks/updateTask", async (task: Task) => {
  const response = await api.updateTask(task)
  return response
})

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id: string) => {
  await api.deleteTask(id)
  return id
})

// Create the slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Add a new action to set tasks directly (for loading from localStorage)
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload
      state.status = "succeeded"
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload
        state.cache.timestamp = Date.now()
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch tasks"
      })

      // Add task
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })

      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((task) => task.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })

      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload)
      })
  },
})

// Export actions
export const { setTasks } = tasksSlice.actions

// Export selectors
export const selectAllTasks = (state: RootState) => state.tasks.items
export const selectTasksStatus = (state: RootState) => state.tasks.status
export const selectTasksError = (state: RootState) => state.tasks.error

export default tasksSlice.reducer

