import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDriverProfile,
  updateDriverProfile,
} from "../services/driversService";
import { DriverProfile } from "../types/schema";
import { notify } from "../app/ToastBoundary";


// Provides:
// - Mutation functions for CRUD operations
// - Automatic cache invalidation
// - Optimistic updates
// - Error handling with toast notifications
// - Loading states for UI feedback

export const useAddDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (driverData: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    }) => createDriverProfile(driverData),

    onSuccess: (newDriver) => {
      // Invalidate and refetch drivers list
      queryClient.invalidateQueries({ queryKey: ["drivers", "list"] });

      notify.success("Driver added successfully");
    },

    onError: (error: any) => {
      notify.error(error?.message ?? "Failed to add driver");
    },
  });
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<DriverProfile>;
    }) => updateDriverProfile(id, updates),

    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["drivers", "list"] });

      // Snapshot the previous value
      const previousDrivers = queryClient.getQueriesData({
        queryKey: ["drivers", "list"],
      });

      // Optimistically update to the new value
      queryClient.setQueriesData(
        { queryKey: ["drivers", "list"] },
        (old: any) => {
          if (!old?.items) return old;

          return {
            ...old,
            items: old.items.map((driver: DriverProfile) =>
              driver.id === id ? { ...driver, ...updates } : driver
            ),
          };
        }
      );

      // Return a context object with the snapshotted value
      return { previousDrivers };
    },

    onError: (error: any, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousDrivers) {
        context.previousDrivers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      notify.error(error?.message ?? "Failed to update driver");
    },

    onSuccess: () => {
      notify.success("Driver updated successfully");
    },

    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["drivers", "list"] });
    },
  });
};
