import { invoke } from '@tauri-apps/api/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface User {
  id: string;
  username: string;
  email: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserCmd {
  username: string;
  email?: string;
  role: string;
}

export function useUsers() {
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return await invoke<User[]>('list_users');
    },
  });

  const createUser = useMutation({
    mutationFn: async (cmd: CreateUserCmd) => {
      return await invoke<User>('create_user', { cmd });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      await invoke('delete_user', { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users,
    isLoading,
    error,
    createUser,
    deleteUser,
  };
}
