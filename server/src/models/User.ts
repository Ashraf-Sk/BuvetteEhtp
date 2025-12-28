import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  fullName: string;
  email: string;
  studentId: string;
  password: string;
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
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateVerificationCode(): string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-\.]+@ehtp\.ac\.ma$/.test(v);
        },
        message: 'Email must be a valid EHTP email (@ehtp.ac.ma)',
      },
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      uppercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^EHTP-\d{4}$/.test(v);
        },
        message: 'Student ID must be in format EHTP-XXXX',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['student', 'employee', 'admin'],
      default: 'student',
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v: string) {
          if (!v) return true;
          return /^(\+212|0)[5-7]\d{8}$/.test(v);
        },
        message: 'Phone number must be a valid Moroccan number',
      },
    },
    profileImage: String,
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    orderHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    pushSubscription: {
      endpoint: String,
      keys: {
        p256dh: String,
        auth: String,
      },
    },
    preferredLanguage: {
      type: String,
      enum: ['fr', 'ar', 'en'],
      default: 'fr',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    resetPasswordCode: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ studentId: 1 }, { unique: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate verification code
UserSchema.methods.generateVerificationCode = function (): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;

