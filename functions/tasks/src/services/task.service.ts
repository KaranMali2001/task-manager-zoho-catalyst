import { updateTaskType } from "@/types/task.type";
import catalyst from "zcatalyst-sdk-node";

type CatalystApp = ReturnType<typeof catalyst.initialize>;

export const taskService = {
  createTask: async (appCtx: CatalystApp, title: string, description: string, status: string = "pending") => {
    const datastore = appCtx.datastore();
    const table = datastore.table("Tasks");
    const rowData = { TITLE: title, DESCRIPTION: description, STATUS: status };
    const result = await table.insertRow(rowData);
    return result;
  },

  getTask: async (appCtx: CatalystApp, id: string) => {
    const datastore = appCtx.datastore();
    const table = datastore.table("Tasks");
    const result = await table.getRow(id);
    return result;
  },

  updateTask: async (appCtx: CatalystApp, id: string, data: updateTaskType) => {
    const { title, description, status } = data;

    const updatedRowData: {
      ROWID: string;
      TITLE?: string;
      DESCRIPTION?: string;
      STATUS?: string;
    } = { ROWID: id };
    if (title !== undefined) updatedRowData.TITLE = title;
    if (description !== undefined) updatedRowData.DESCRIPTION = description;
    if (status !== undefined) updatedRowData.STATUS = status;

    if (Object.keys(updatedRowData).length === 1) {
      throw new Error("No fields to update");
    }

    const datastore = appCtx.datastore();
    const table = datastore.table("Tasks");
    const result = await table.updateRow(updatedRowData);
    return result;
  },

  deleteTask: async (appCtx: CatalystApp, id: string) => {
    const datastore = appCtx.datastore();
    const table = datastore.table("Tasks");
    const result = await table.deleteRow(id);
    return result;
  },

  getAllTasks: async (appCtx: CatalystApp, limit: number = 10, nextToken?: string) => {
    const datastore = appCtx.datastore();
    const table = datastore.table("Tasks");

    const response = await table.getPagedRows({ maxRows: limit, nextToken });
    return {
      data: response.data,
      hasNext: response.more_records,
      nextToken: response.next_token,
      limit,
    };
  },
};
