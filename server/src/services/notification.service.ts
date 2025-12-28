import webpush from 'web-push';
import { env } from '../config/env';
import Notification, { INotification } from '../models/Notification';
import User from '../models/User';

// Configure web-push with VAPID keys
if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:' + env.EMAIL_FROM,
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY
  );
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: any;
}

export const sendPushNotification = async (
  userId: string,
  payload: PushNotificationPayload
): Promise<void> => {
  try {
    const user = await User.findById(userId);

    if (!user || !user.pushSubscription) {
      console.log(`User ${userId} has no push subscription`);
      return;
    }

    const subscription = {
      endpoint: user.pushSubscription.endpoint,
      keys: {
        p256dh: user.pushSubscription.keys.p256dh,
        auth: user.pushSubscription.keys.auth,
      },
    };

    await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log(`✅ Push notification sent to user ${userId}`);
  } catch (error: any) {
    console.error('❌ Error sending push notification:', error);
    // Don't throw - push notifications are optional
  }
};

export const createNotification = async (
  userId: string,
  type: 'order_confirmed' | 'order_ready' | 'promotion' | 'general',
  title: { fr: string; ar: string; en: string },
  message: { fr: string; ar: string; en: string },
  data?: any
): Promise<INotification> => {
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    data,
    isRead: false,
  });

  // Send push notification
  const user = await User.findById(userId);
  if (user) {
    const lang = user.preferredLanguage || 'fr';
    await sendPushNotification(userId, {
      title: title[lang],
      body: message[lang],
      icon: '/icons/icon-192x192.png',
      data: { ...data, notificationId: notification._id },
    });
  }

  return notification;
};
