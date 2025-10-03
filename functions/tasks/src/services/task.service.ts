import { createTaskType, updateTaskType } from "@/types/task.type";
import catalyst from "zcatalyst-sdk-node";

type CatalystApp = ReturnType<typeof catalyst.initialize>;

export const taskService = {
  createTask: async (appCtx: CatalystApp, title: string, description: string) => {
    const zcql = appCtx.zcql();
    const query = `INSERT INTO Task_manager (TITLE, DESCRIPTION, STATUS) VALUES ('${title.replace(/'/g, "''")}', '${description.replace(/'/g, "''")}', 'pending')`;
    const result = await zcql.executeZCQLQuery(query);
    return result;
  },

  getTask: async (appCtx: CatalystApp, id: string) => {
    const zcql = appCtx.zcql();
    const query = `SELECT * FROM Task_manager WHERE ROWID=${id}`;
    const result = await zcql.executeZCQLQuery(query);
    return result;
  },

  updateTask: async (appCtx: CatalystApp, id: string, data: updateTaskType) => {
    const { title, description, status } = data;
    const zcql = appCtx.zcql();

    const setParts: string[] = [];
    if (title !== undefined) setParts.push(`TITLE='${title.replace(/'/g, "''")}'`);
    if (description !== undefined) setParts.push(`DESCRIPTION='${description.replace(/'/g, "''")}'`);
    if (status !== undefined) setParts.push(`STATUS='${status}'`);

    if (setParts.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `UPDATE Task_manager SET ${setParts.join(", ")} WHERE ROWID=${id}`;
    const result = await zcql.executeZCQLQuery(query);
    return result;
  },

  deleteTask: async (appCtx: CatalystApp, id: string) => {
    const zcql = appCtx.zcql();
    const query = `DELETE FROM Task_manager WHERE ROWID=${id}`;
    const result = await zcql.executeZCQLQuery(query);
    return result;
  },

  getAllTasks: async (appCtx: CatalystApp) => {
    const zcql = appCtx.zcql();
    const query = "SELECT * FROM Task_manager";
    const result = await zcql.executeZCQLQuery(query);
    return result;
  },
};
