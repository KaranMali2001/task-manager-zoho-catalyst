import { AlertCircle, Loader2 } from "lucide-react";
import { CreateTaskDialog } from "./components/tasks/CreateTaskDialog";
import { TaskList } from "./components/tasks/TaskList";
import { ThemeToggle } from "./components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useTasks } from "./hooks/useTasks";

function App() {
  const { tasks, isLoading, isError, error, createTask, updateTask, deleteTask, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks();

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle>Error Loading Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error?.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Task Manager</h1>
            <p className="text-muted-foreground mt-2">Organize and track your tasks efficiently</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <CreateTaskDialog onCreateTask={(task) => createTask.mutate(task)} isPending={createTask.isPending} />
          </div>
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
        />
      </div>
    </div>
  );
}

export default App;
