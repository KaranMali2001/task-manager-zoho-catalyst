import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { toast } from "sonner";
import type { Task, CreateTaskInput } from "../types/task";

interface TasksResponse {
  data: Task[];
  hasNext: boolean;
  nextToken?: string;
  limit: number;
}

export function useTasks() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<TasksResponse>({
    queryKey: ["tasks"],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) {
        params.append("nextToken", pageParam as string);
      }
      const res = await apiClient.get(`/?${params.toString()}`);
      return res.data.result;
    },
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextToken : undefined,
    initialPageParam: undefined,
  });

  const tasks = data?.pages.flatMap((page) => page.data) ?? [];

  const createTask = useMutation({
    mutationFn: async (task: CreateTaskInput) => {
      const res = await apiClient.post("/", task);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create task");
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiClient.put(`/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update task");
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete task");
    },
  });

  return {
    tasks,
    isLoading,
    isError,
    error,
    createTask,
    updateTask,
    deleteTask,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
