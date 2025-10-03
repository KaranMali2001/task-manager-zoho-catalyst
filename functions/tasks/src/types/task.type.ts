import z from "zod";
export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
});
export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(1000).optional(),
  status: z.enum(["pending", "completed", "cancelled", "in-progress"]).optional(),
});
export type createTaskType = z.infer<typeof createTaskSchema>;
export type updateTaskType = z.infer<typeof updateTaskSchema>;
