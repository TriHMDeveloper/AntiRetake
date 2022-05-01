import mongoose from 'mongoose';
import { NotificationType } from '../constants';
import {
  NotificationAttrs,
  NotificationDoc,
  NotificationModel,
  UserDoc,
} from '../types';

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    notiType: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

notificationSchema.statics.build = (attrs: NotificationAttrs) => {
  return new Notification(attrs);
};

export const Notification = mongoose.model<NotificationDoc, NotificationModel>(
  'notifications',
  notificationSchema
);

export const addNotification = async (
  sender: UserDoc,
  recipientList: { recipient: UserDoc; isRead: boolean }[],
  notiType: NotificationType,
  message: string,
  redirectUrl: string
) => {
  const notificationList = recipientList.map((recipient) => {
    return {
      sender: sender,
      recipient: recipient.recipient,
      notiType: notiType,
      isRead: recipient.isRead,
      message: message,
      redirectUrl: redirectUrl,
    };
  });
  await Notification.insertMany(notificationList);
};
