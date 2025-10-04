import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Clock, User, Trash2 } from "lucide-react";
import type { Task } from "../../types/task";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

export function TaskCard({ task, onDelete, onUpdateStatus, isDeleting, isUpdating }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500 hover:bg-emerald-600 text-white";
      case "in-progress":
        return "bg-amber-500 hover:bg-amber-600 text-white";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600 text-white";
      default: // pending
        return "bg-blue-500 hover:bg-blue-600 text-white";
    }
  };

  const formatDate = (dateString: string | number) => {
    // Handle Zoho Catalyst date format: "YYYY-MM-DD HH:MM:SS:mmm"
    let date: Date;
    if (typeof dateString === 'string') {
      // Replace space with 'T' and remove milliseconds for ISO format
      const isoString = dateString.replace(' ', 'T').split(':').slice(0, 3).join(':');
      date = new Date(isoString);
    } else {
      date = new Date(Number(dateString));
    }

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">{task.TITLE}</CardTitle>
            {task.DESCRIPTION && (
              <CardDescription className="mt-2">{task.DESCRIPTION}</CardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.ROWID)}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(task.STATUS)}>
            {task.STATUS.replace("-", " ").toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Creator: {task.CREATORID}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Created: {formatDate(task.CREATEDTIME)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Modified: {formatDate(task.MODIFIEDTIME)}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {task.STATUS !== "pending" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(task.ROWID, "pending")}
              disabled={isUpdating}
              className="flex-1"
            >
              Pending
            </Button>
          )}
          {task.STATUS !== "in-progress" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(task.ROWID, "in-progress")}
              disabled={isUpdating}
              className="flex-1"
            >
              In Progress
            </Button>
          )}
          {task.STATUS !== "completed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(task.ROWID, "completed")}
              disabled={isUpdating}
              className="flex-1"
            >
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
