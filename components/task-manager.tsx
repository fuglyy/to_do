"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  selectAllTasks,
  selectTasksStatus,
  selectTasksError,
  setTasks,
} from "@/lib/features/tasks/tasksSlice"
import type { AppDispatch } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TaskManager() {
  const dispatch = useDispatch<AppDispatch>()
  const tasks = useSelector(selectAllTasks)
  const status = useSelector(selectTasksStatus)
  const error = useSelector(selectTasksError)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const { toast } = useToast()
  const [isLoaded, setIsLoaded] = useState(false)

  // Load saved tasks from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoaded) {
      try {
        const savedState = localStorage.getItem("taskManagerState")
        if (savedState) {
          const parsedState = JSON.parse(savedState)
          if (parsedState.tasks && parsedState.tasks.items && parsedState.tasks.items.length > 0) {
            dispatch(setTasks(parsedState.tasks.items))
          } else {
            dispatch(fetchTasks())
          }
        } else {
          dispatch(fetchTasks())
        }
      } catch (err) {
        console.error("Error loading tasks from localStorage:", err)
        dispatch(fetchTasks())
      }
      setIsLoaded(true)
    }
  }, [dispatch, isLoaded])

  const handleAddTask = (task: { title: string; description: string }) => {
    dispatch(addTask(task))
      .unwrap()
      .then(() => {
        toast({
          title: "Task added",
          description: "Your task has been added successfully",
        })
        setIsFormOpen(false)
      })
      .catch((err) => {
        toast({
          title: "Failed to add task",
          description: err.message,
          variant: "destructive",
        })
      })
  }

  const handleUpdateTask = (task: { id: string; title: string; description: string; completed: boolean }) => {
    // Find the existing task to get its createdAt value
    const existingTask = tasks.find((t) => t.id === task.id)

    if (!existingTask) {
      toast({
        title: "Error",
        description: "Task not found",
        variant: "destructive",
      })
      return
    }

    dispatch(
      updateTask({
        ...task,
        createdAt: existingTask.createdAt, // Include the createdAt from the existing task
      }),
    )
      .unwrap()
      .then(() => {
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully",
        })
        setEditingTask(null)
        setIsFormOpen(false)
      })
      .catch((err) => {
        toast({
          title: "Failed to update task",
          description: err.message,
          variant: "destructive",
        })
      })
  }

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id))
      .unwrap()
      .then(() => {
        toast({
          title: "Task deleted",
          description: "Your task has been deleted successfully",
        })
      })
      .catch((err) => {
        toast({
          title: "Failed to delete task",
          description: err.message,
          variant: "destructive",
        })
      })
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Your Tasks</h2>
        <Button
          onClick={() => {
            setEditingTask(null)
            setIsFormOpen(!isFormOpen)
          }}
        >
          {isFormOpen ? "Cancel" : "Add New Task"}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-4">
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            initialData={editingTask}
            isEditing={!!editingTask}
          />
        </Card>
      )}

      {status === "loading" && !isLoaded && (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {status === "failed" && (
        <div className="p-4 border border-destructive rounded-md bg-destructive/10 text-destructive">
          <p>Error: {error}</p>
        </div>
      )}

      {(status === "succeeded" || isLoaded) && (
        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggleComplete={(task) =>
            handleUpdateTask({
              id: task.id,
              title: task.title,
              description: task.description,
              completed: !task.completed,
            })
          }
        />
      )}
    </div>
  )
}

