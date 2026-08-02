import { Injectable, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { User, UserRole } from '../../users/models/user.entity';
import { NotificationResponse } from '../types/responseType';
import { Notification } from '../models/notification.entity';
import { Between, In, IsNull, Repository } from 'typeorm';
import { NotificationStatus } from '../enums/notificationStatus.enum';
import { NotificationType } from '../enums/notificationType.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async getAllNotifications(user: any): Promise<NotificationResponse[]> {
    let userData: User;
    try {
      userData = await this.userService.findById(user.id);
    } catch (error) {
      throw new NotFoundException('User not exsists');
    }

    if (userData.role === UserRole.ADMIN) {
      return this.getAdminNotifications();
    } else if (userData.role === UserRole.HR) {
      return this.getHrNotifications();
    } else if (userData.role === UserRole.COMPANY) {
      return this.getCompanyNotifications();
    } else {
      return this.getUserNotifications(user.id);
    }
  }

  private async getAdminNotifications(): Promise<NotificationResponse[]> {
    const today = new Date();
    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - 7);

    const notifications = await this.notificationRepository.find({
      where: {
        status: In([NotificationStatus.NEW, NotificationStatus.READ, NotificationStatus.DELETED]),
        createdAt: Between(weekStartDate, today),
        notificationType: NotificationType.COMPANY_NOTIFICATION,
        readAt: IsNull(),
      },
      withDeleted: true,
      order: { createdAt: 'DESC' },
    });

    return notifications.map((n) => ({
      content: n.subject,
      status: n.status,
      receivedAt: n.createdAt.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      id: n.id,
    }));
  }

  private async getHrNotifications(): Promise<NotificationResponse[]> {
    const today = new Date();
    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - 7);

    const notifications = await this.notificationRepository.find({
      where: {
        status: In([NotificationStatus.NEW, NotificationStatus.READ]),
        createdAt: Between(weekStartDate, today),
        notificationType: NotificationType.USER_NOTIFICATION,
        readAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });

    return notifications.map((n) => ({
      content: n.subject,
      status: n.status,
      receivedAt: n.createdAt.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      id: n.id,
    }));
  }

  private async getCompanyNotifications(): Promise<NotificationResponse[]> {
    const today = new Date();
    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - 7);

    const notifications = await this.notificationRepository.find({
      where: {
        status: In([NotificationStatus.NEW, NotificationStatus.READ]),
        createdAt: Between(weekStartDate, today),
        notificationType: In([
          NotificationType.HR_NOTIFICATION,
          NotificationType.USER_NOTIFICATION,
        ]),
        readAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });

    return notifications.map((n) => ({
      content: n.subject,
      status: n.status,
      receivedAt: n.createdAt.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      id: n.id,
    }));
  }

  private async getUserNotifications(
    userId: string,
  ): Promise<NotificationResponse[]> {
    const today = new Date();
    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - 7);

    const notifications = await this.notificationRepository.find({
      where: {
        status: In([NotificationStatus.NEW, NotificationStatus.READ]),
        createdAt: Between(weekStartDate, today),
        notificationType: NotificationType.USER_NOTIFICATION,
        userId: userId,
        readAt: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });

    return notifications.map((n) => ({
      content: n.subject,
      status: n.status,
      receivedAt: n.createdAt.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      id: n.id,
    }));
  }

  async readNotification(notificationId: string): Promise<void> {
    const notification = await this.notificationRepository.findOneBy({
      id: notificationId,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.status = NotificationStatus.READ;
    notification.readAt = new Date();
    await this.notificationRepository.save(notification);

    return;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const notification = await this.notificationRepository.findOneBy({
      id: notificationId,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.status = NotificationStatus.DELETED;
    await this.notificationRepository.save(notification);

    await this.notificationRepository.softRemove(notification);
    return;
  }
}
