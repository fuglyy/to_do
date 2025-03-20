"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Task } from "@/lib/features/tasks/tasksSlice"

interface TaskFormProps {
  onSubmit: (task: any) => void
  initialData?: Task | null
  isEditing?: boolean
}

export default function TaskForm({ onSubmit, initialData, isEditing = false }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState({ title: "", description: "" })

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description)
    }
  }, [initialData])

  const validate = () => {
    const newErrors = { title: "", description: "" }
    let isValid = true

    if (!title.trim()) {
      newErrors.title = "Title is required"
      isValid = false
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    if (isEditing && initialData) {
      onSubmit({
        id: initialData.id,
        title,
        description,
        completed: initialData.completed,
      })
    } else {
      onSubmit({
        title,
        description,
      })
    }

    if (!isEditing) {
      setTitle("")
      setDescription("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={3}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit">{isEditing ? "Update Task" : "Add Task"}</Button>
      </div>
    </form>
  )
}

