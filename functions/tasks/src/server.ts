import express, { Errback, Request, Response } from "express";
import morgan from "morgan";

import { taskRouter } from "./routes/task.route";
const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use(taskRouter);
app.use((err: Errback, req: Request, res: Response, _next: Function) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.error(err);
  res.status(500).json({
    message: "Internal Server Error",
    error: JSON.stringify(err),
  });
});

export = app;
