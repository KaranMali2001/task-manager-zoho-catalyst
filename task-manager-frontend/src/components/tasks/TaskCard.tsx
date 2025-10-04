import { Clock, Trash2, User } from "lucide-react";
import type { Task } from "../../types/task";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

export function TaskCard({ task, onDelete, onUpdateStatus, isDeleting, isUpdating }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-500 hover:bg-gray-600 text-white";

    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-500 hover:bg-emerald-600 text-white";
      case "in-progress":
        return "bg-amber-500 hover:bg-amber-600 text-white";

      default: // pending
        return "bg-blue-500 hover:bg-blue-600 text-white";
    }
  };

  const formatDate = (dateString: string | number | null | undefined) => {
    if (!dateString) return "N/A";

    // Handle Zoho Catalyst date format: "YYYY-MM-DD HH:MM:SS:mmm"
    let date: Date;
    if (typeof dateString === "string") {
      // Replace space with 'T' and remove milliseconds for ISO format
      const isoString = dateString.replace(" ", "T").split(":").slice(0, 3).join(":");
      date = new Date(isoString);
    } else {
      date = new Date(Number(dateString));
    }

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!task || !task.ROWID) {
    return null;
  }

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col rounded-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg line-clamp-2">{task.TITLE || "Untitled Task"}</CardTitle>
            {task.DESCRIPTION && task.DESCRIPTION.trim() && <CardDescription className="mt-2 text-xs sm:text-sm line-clamp-3">{task.DESCRIPTION}</CardDescription>}
          </div>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.ROWID)} disabled={isDeleting} className="text-destructive hover:text-destructive shrink-0 h-8 w-8 sm:h-10 sm:w-10">
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2">
          <Badge className={`${getStatusColor(task.STATUS)} select-none`}>{task.STATUS ? task.STATUS.replace("-", " ").toUpperCase() : "UNKNOWN"}</Badge>
        </div>

        <div className="space-y-1.5 text-xs sm:text-sm text-muted-foreground flex-1">
          {task.CREATORID && (
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Creator: {task.CREATORID}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Created: {formatDate(task.CREATEDTIME)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Modified: {formatDate(task.MODIFIEDTIME)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {task.STATUS !== "pending" && (
            <Button size="sm" variant="outline" onClick={() => onUpdateStatus(task.ROWID, "pending")} disabled={isUpdating} className="flex-1 min-w-[80px] text-xs sm:text-sm">
              Pending
            </Button>
          )}
          {task.STATUS !== "in-progress" && (
            <Button size="sm" variant="outline" onClick={() => onUpdateStatus(task.ROWID, "in-progress")} disabled={isUpdating} className="flex-1 min-w-[80px] text-xs sm:text-sm">
              In Progress
            </Button>
          )}
          {task.STATUS !== "completed" && (
            <Button size="sm" variant="outline" onClick={() => onUpdateStatus(task.ROWID, "completed")} disabled={isUpdating} className="flex-1 min-w-[80px] text-xs sm:text-sm">
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
