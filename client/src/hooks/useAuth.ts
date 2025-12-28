import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { RegisterData, LoginData } from '../types/user.types';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, logout: logoutStore, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.token);
      toast.success('Connexion réussie');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (response) => {
      setAuth(response.user, response.token);
      toast.success('Inscription réussie');
      navigate('/auth/verify-email');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur d\'inscription');
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      authService.verifyEmail(email, code),
    onSuccess: () => {
      toast.success('Email vérifié avec succès');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Code invalide');
    },
  });

  const { data: user } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
    enabled: isAuthenticated,
  });

  const logout = () => {
    logoutStore();
    queryClient.clear();
    navigate('/auth/login');
    toast.success('Déconnexion réussie');
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,
    logout,
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
};

