import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { TaskList } from "./components/tasks/TaskList";
import { ThemeToggle } from "./components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { useTasks } from "./hooks/useTasks";
import { TaskStatus } from "./types/task";

function App() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined);
  const { tasks, isLoading, isError, error, createTask, updateTask, deleteTask, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks(statusFilter);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md mx-4 rounded-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle>Error Loading Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm sm:text-base">{error?.message || "An unexpected error occurred while loading tasks"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen overflow-y-auto bg-background p-4 sm:p-6 lg:p-8 relative">
      <div className="w-full mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Task Manager</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Organize and track your tasks efficiently</p>
          </div>
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? undefined : (value as TaskStatus))}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TaskList
          tasks={tasks || []}
          onDelete={(id) => deleteTask.mutate(id)}
          onUpdateStatus={(id, status) => updateTask.mutate({ id, status })}
          isDeleting={deleteTask.isPending}
          isUpdating={updateTask.isPending}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
          onCreateTask={(task) => createTask.mutate(task)}
          isCreating={createTask.isPending}
        />
      </div>
    </div>
  );
}

export default App;
