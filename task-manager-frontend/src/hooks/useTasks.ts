import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { toast } from "sonner";
import type { Task, CreateTaskInput, TaskStatus } from "../types/task";

interface TasksResponse {
  data: Task[];
  hasNext: boolean;
  nextToken?: string;
  limit: number;
}

export function useTasks(statusFilter?: TaskStatus, searchQuery?: string) {
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
    queryKey: ["tasks", statusFilter, searchQuery],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) {
        params.append("nextToken", pageParam as string);
      }
      if (statusFilter) {
        params.append("status", statusFilter);
      }
      if (searchQuery) {
        params.append("searchQuery", searchQuery);
      }
      const res = await apiClient.get(`/?${params.toString()}`);
      const result = res.data.result;

      // Handle search response format
      if (searchQuery && result && typeof result === 'object' && 'Tasks' in result) {
        const tasks = Array.isArray(result.Tasks) ? result.Tasks : [];
        return {
          data: tasks,
          hasNext: false,
          nextToken: undefined,
          limit: tasks.length,
        };
      }

      // Handle filtered response format: array of {Tasks: {...}}
      if (statusFilter && Array.isArray(result)) {
        return {
          data: result.map((item: any) => item.Tasks).filter(Boolean),
          hasNext: false,
          nextToken: undefined,
          limit: result.length,
        };
      }

      // Handle normal paginated response
      return result;
    },
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextToken : undefined,
    initialPageParam: undefined,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const tasks = data?.pages.flatMap((page) => page.data) ?? [];

  const createTask = useMutation({
    mutationFn: async (task: CreateTaskInput) => {
      if (!task.title?.trim()) {
        throw new Error("Title is required");
      }
      const res = await apiClient.post("/", task);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create task";
      toast.error(errorMessage);
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!id?.trim()) {
        throw new Error("Task ID is required");
      }
      if (!status?.trim()) {
        throw new Error("Status is required");
      }
      const res = await apiClient.put(`/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update task";
      toast.error(errorMessage);
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      if (!id?.trim()) {
        throw new Error("Task ID is required");
      }
      const res = await apiClient.delete(`/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete task";
      toast.error(errorMessage);
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
