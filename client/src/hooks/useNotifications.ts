import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

export const useNotifications = (unreadOnly = false) => {
  const { isAuthenticated } = useAuthStore();
  const { setNotifications, setUnreadCount } = useNotificationStore();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', unreadOnly],
    queryFn: async () => {
      const params = new URLSearchParams({ unreadOnly: String(unreadOnly) });
      const response = await fetch(`/api/notifications?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
      }
      return result.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    isLoading,
  };
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { markAsRead: markAsReadStore } = useNotificationStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.json();
    },
    onSuccess: (_, id) => {
      markAsReadStore(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

