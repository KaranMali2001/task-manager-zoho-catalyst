import { taskService } from "@/services/task.service";
import { createTaskType, updateTaskType } from "@/types/task.type";
import { Request, Response } from "express";
import catalyst from "zcatalyst-sdk-node";

export const taskController = {
  createTask: async (req: Request, res: Response) => {
    try {
      const appCtx = catalyst.initialize(req as any, { type: catalyst.type.advancedio });
      const { title, description, status } = req.body as createTaskType;

      const result = await taskService.createTask(appCtx, title, description || "", status || "pending");
      res.json({ message: "task created", result });
    } catch (error) {
      console.error("error while creating task", error);
      res.status(500).json({ message: "error while creating task", error });
    }
  },
  getTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const appCtx = catalyst.initialize(req as any);

      const result = await taskService.getTask(appCtx, id);
      res.json({ message: "task retrieved by id via ZCQL", result });
    } catch (error) {
      console.error("error while retrieving task by id via ZCQL", error);
      res.status(500).json({ message: "error while retrieving task by id via ZCQL", error: error });
    }
  },
  updateTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body as updateTaskType;
      const appCtx = catalyst.initialize(req as any, { type: catalyst.type.advancedio });

      const result = await taskService.updateTask(appCtx, id, data);
      res.json({ message: "task updated via ZCQL", result });
    } catch (error) {
      if ((error as Error).message === "No fields to update") {
        res.status(400).json({ message: "No fields to update" });
        return;
      }
      console.error("error while updating task via ZCQL", error);
      res.status(500).json({ message: "error while updating task via ZCQL", error: error });
    }
  },
  deleteTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const appCtx = catalyst.initialize(req as any);

      const result = await taskService.deleteTask(appCtx, id);
      res.json({ message: "task deleted via ZCQL", result });
    } catch (error) {
      console.error("error while deleting task via ZCQL", error);
      res.status(500).json({ message: "error while deleting task via ZCQL", error: error });
    }
  },
  getAllTasks: async (req: Request, res: Response) => {
    try {
      const { nextToken, limit = 10 } = req.query;
      const appCtx = catalyst.initialize(req as any);

      const result = await taskService.getAllTasks(appCtx, Number(limit), nextToken as string);
      res.json({ message: "tasks retrieved", result });
    } catch (error) {
      console.error("error while retrieving tasks", error);
      res.status(500).json({ message: "error while retrieving tasks", error: error });
    }
  },
};
