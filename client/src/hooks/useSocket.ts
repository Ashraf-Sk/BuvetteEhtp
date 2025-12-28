import { useEffect, useRef } from 'react';
import { socketService } from '../services/socket.service';
import { useAuthStore } from '../store/authStore';
import { Socket } from 'socket.io-client';

export const useSocket = (events?: Record<string, (data: any) => void>) => {
  const { token, isAuthenticated } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = socketService.connect(token);
    socketRef.current = socket;

    // Set up event listeners
    if (events) {
      Object.entries(events).forEach(([event, handler]) => {
        socket.on(event, handler);
      });
    }

    return () => {
      if (events) {
        Object.keys(events).forEach((event) => {
          socket.off(event);
        });
      }
      socketService.disconnect();
    };
  }, [isAuthenticated, token]);

  return socketRef.current;
};

