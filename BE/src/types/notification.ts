import mongoose from 'mongoose';
import { NotificationType } from '../constants';
import { UserDoc } from './user';

export interface NotificationAttrs {
  sender: UserDoc;
  recipient: UserDoc;
  notiType: NotificationType;
  isRead: boolean;
  message: string;
  redirectUrl: string;
}

export interface NotificationDoc extends mongoose.Document {
  sender: UserDoc;
  recipient: UserDoc;
  notiType: NotificationType;
  isRead: boolean;
  message: string;
  redirectUrl: string;
  createdAt: Date;
}

export interface NotificationModel extends mongoose.Model<NotificationDoc> {
  build(attrs: NotificationAttrs): NotificationDoc;
}

export interface NotificationItem {
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  notiType: NotificationType;
  isRead: boolean;
  message: string;
  redirectUrl: string;
  createdAt: string;
}

export interface NotificationRespone {
  notificationList: NotificationItem[];
  isEnd: boolean;
  isReadAll: boolean;
}
