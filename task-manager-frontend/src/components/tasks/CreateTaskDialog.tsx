import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CreateTaskInput } from "../../types/task";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface CreateTaskDialogProps {
  onCreateTask: (task: CreateTaskInput) => void;
  isPending: boolean;
}

export function CreateTaskDialog({ onCreateTask, isPending }: CreateTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: "",
    description: "",
    status: "pending",
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (formData.title.trim().length > 255) {
      toast.error("Title must be less than 255 characters");
      return;
    }
    if (!formData.status) {
      toast.error("Status is required");
      return;
    }
    onCreateTask({
      ...formData,
      title: formData.title.trim(),
      description: formData.description?.trim() || "",
    });
    setFormData({
      title: "",
      description: "",
      status: "pending",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed rounded-sm h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Plus className="w-16 h-16 text-muted-foreground" />
            <p className="text-base sm:text-lg font-medium text-muted-foreground">Create New Task</p>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[500px] max-h-[90vh] overflow-y-auto rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create New Task</DialogTitle>
          <DialogDescription className="text-sm">Add a new task to your list.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm">
              Title *
            </Label>
            <Input id="title" placeholder="Enter task title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="text-sm sm:text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="text-sm sm:text-base resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm">
              Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto text-sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} className="w-full sm:w-auto text-sm">
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
