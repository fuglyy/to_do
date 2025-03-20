"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Task } from "@/lib/features/tasks/tasksSlice"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleComplete: (task: Task) => void
}

export default function TaskList({ tasks, onEdit, onDelete, onToggleComplete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No tasks yet. Add a new task to get started.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tasks.map((task) => (
        <Card key={task.id} className={task.completed ? "opacity-75" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => onToggleComplete(task)}
                  className="mt-1"
                />
                <div>
                  <CardTitle className={`text-lg ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{new Date(task.createdAt).toLocaleDateString()}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className={`text-sm ${task.completed ? "text-muted-foreground" : ""}`}>{task.description}</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

