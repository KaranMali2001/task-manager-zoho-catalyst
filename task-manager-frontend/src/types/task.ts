export const TaskStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
 
  IN_PROGRESS: "in-progress",
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
  ROWID: string;
  CREATORID: string;
  CREATEDTIME: string | number;
  MODIFIEDTIME: string | number;
  TITLE: string;
  DESCRIPTION: string;
  STATUS: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status: string;
}
