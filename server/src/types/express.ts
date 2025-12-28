import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: mongoose.Types.ObjectId;
        fullName: string;
        email: string;
        studentId: string;
        password?: string;
        role: 'student' | 'employee' | 'admin';
        phoneNumber?: string;
        profileImage?: string;
        favorites: mongoose.Types.ObjectId[];
        orderHistory: mongoose.Types.ObjectId[];
        pushSubscription?: {
          endpoint: string;
          keys: {
            p256dh: string;
            auth: string;
          };
        };
        preferredLanguage: 'fr' | 'ar' | 'en';
        isVerified: boolean;
        verificationCode?: string;
        resetPasswordCode?: string;
        resetPasswordExpires?: Date;
        lastLogin?: Date;
        createdAt: Date;
        updatedAt: Date;
        comparePassword?(candidatePassword: string): Promise<boolean>;
        generateVerificationCode?(): string;
        save?(): Promise<any>;
        [key: string]: any;
      };
    }
  }
}

export {};

