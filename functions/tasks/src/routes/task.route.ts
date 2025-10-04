import { taskController } from "@/controllers/task.controller";
import { validateRequest } from "@/middlewares/zod.middleware";
import { createTaskSchema, updateTaskSchema } from "@/types/task.type";
import { Router } from "express";
export const taskRouter = Router();

taskRouter.get("/", taskController.getAllTasks);
taskRouter.get("/:id", taskController.getTask);
taskRouter.post("/", validateRequest(createTaskSchema), taskController.createTask);
taskRouter.put("/:id", validateRequest(updateTaskSchema), taskController.updateTask);
taskRouter.delete("/:id", taskController.deleteTask);
