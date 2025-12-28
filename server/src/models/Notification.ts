import mongoose, { Schema, Document, Model } from 'mongoose';

export type NotificationType = 'order_confirmed' | 'order_ready' | 'promotion' | 'general';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: NotificationType;
  title: {
    fr: string;
    ar: string;
    en: string;
  };
  message: {
    fr: string;
    ar: string;
    en: string;
  };
  data?: {
    orderId?: string;
    url?: string;
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['order_confirmed', 'order_ready', 'promotion', 'general'],
      required: true,
    },
    title: {
      fr: { type: String, required: true },
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    message: {
      fr: { type: String, required: true },
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    data: {
      type: Schema.Types.Mixed,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, isRead: 1 });

const Notification: Model<INotification> = mongoose.model<INotification>(
  'Notification',
  NotificationSchema
);

export default Notification;

