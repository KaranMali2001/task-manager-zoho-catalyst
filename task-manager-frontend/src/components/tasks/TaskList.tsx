import { useEffect, useRef } from "react";
import { TaskCard } from "./TaskCard";
import { Loader2 } from "lucide-react";
import type { Task } from "../../types/task";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  isDeleting: boolean;
  isUpdating: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export function TaskList({
  tasks,
  onDelete,
  onUpdateStatus,
  isDeleting,
  isUpdating,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore
}: TaskListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore?.();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.ROWID}
            task={task}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            isDeleting={isDeleting}
            isUpdating={isUpdating}
          />
        ))}
      </div>

      {hasNextPage && (
        <div ref={observerTarget} className="flex justify-center pt-4 min-h-[60px]">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more tasks...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
