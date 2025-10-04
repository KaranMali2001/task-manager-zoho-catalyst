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
