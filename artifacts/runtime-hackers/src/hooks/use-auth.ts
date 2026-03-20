import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useGetCurrentUser, getGetCurrentUserQueryKey, useLogout } from "@workspace/api-client-react";

export function useAuth() {
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error } = useGetCurrentUser({
    query: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
        setLocation("/");
      }
    }
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    logout,
    isLoggingOut: logoutMutation.isPending
  };
}
