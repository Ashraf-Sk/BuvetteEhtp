export interface User {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
  role: 'student' | 'employee' | 'admin';
  phoneNumber?: string;
  profileImage?: string;
  favorites?: string[];
  preferredLanguage: 'fr' | 'ar' | 'en';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  fullName: string;
  email: string;
  studentId: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginData {
  studentId: string;
  password: string;
}

