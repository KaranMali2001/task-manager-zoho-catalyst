import z from "zod";
export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  IN_PROGRESS = "in-progress",
}
export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional().default(""),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING),
});
export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING).optional(),
});
export const getTaskWithFilterSchema = z.object({
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING),
  searchQuery: z.string().optional(),
});
export const filterTaskSchema = z.object({
  status: z.nativeEnum(TaskStatus),
  searchQuery: z.string().optional(),
});
export type getTaskWithFilterType = z.infer<typeof getTaskWithFilterSchema>;
export type createTaskType = z.infer<typeof createTaskSchema>;
export type updateTaskType = z.infer<typeof updateTaskSchema>;
