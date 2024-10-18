import { notificationModel } from '../../db/models/Notification.model';
import { TNotificationTypes } from '../../db/types/interfaces/notifications.types';
import { taskProgressModel } from '../../db/models';
import axios from 'axios';
import { getConfig } from '../config';
import { LoyaltyProject, NotificationEntity } from '../../db/entity';
import { Logger } from './logger';
import { getOnboardingQuestLinkTitle } from './loyalty/loyaltyProject';

const log = new Logger();

export namespace NotificationsServerService {
  export interface IGetNotifications {
    investorId: number;
    viewed: boolean | null;
    pagination?: {
      page?: number;
      pageSize?: number;
    };
  }

  export const getNotifications = async ({ investorId, viewed, pagination }: IGetNotifications) => {
    const where = {
      investorId,
    };
    if (viewed !== null) {
      where['viewed'] = viewed;
    }

    if (!pagination) {
      const items = await notificationModel.findAll({ where, order: 'DESC' });
      return {
        items,
        total: items.length,
      };
    }

    return notificationModel.paginatable({
      where,
      page: pagination.page as number,
      pageSize: pagination.pageSize as number,
      order: 'DESC',
    });
  };

  export const viewNotifications = async (IDs: number[], investorId: number) => {
    await Promise.all(
      IDs.map(async (id) => {
        const notification = await notificationModel.findOneById(id);
        if (notification?.type !== 'onBoarding') {
          await notificationModel.update(id, { viewed: true });
        }
      }),
    );
    return notificationModel.findNotViewedNotificationsByInvestorId(investorId);
  };

  export const notifyGuaranteedWinners = async (loyaltyProject: LoyaltyProject, investors: number[]) => {
    try {
      const notifications = await Promise.all(
        investors.map(async (investorId) => {
          const investorProgress = await taskProgressModel.getInvestorScoreboardInfo(loyaltyProject.id, investorId);

          const isWinner = investorProgress.earnedPoints > (loyaltyProject.threshold || 0);

          return isWinner
            ? await notificationModel.create({
                title: loyaltyProject.title,
                payload: {
                  message: 'You are eligible for the main draw!',
                },
                investorId: investorId,
                type: 'guaranteed',
              })
            : null;
        }),
      );
      return notifyBySocket(notifications.filter(Boolean));
    } catch (e) {
      console.log('Error on sending notification by socket', e);
      log.error(`Error on notifyGuaranteedWinners ${e}`);
    }
  };

  export const notifyBySocket = async (notifications: NotificationEntity[]): Promise<void> => {
    const config = getConfig();
    try {
      await axios.post(`${config.NOTIFICATION_SERVICE_HOST}/notify`, {
        notifications,
      });
    } catch (e) {
      console.log('Error on sending notification by socket', e);
      log.error(`Error on sending notification by socket ${e}`);
    }
  };

  export const addOnBoardingNotification = async (investorId: number) => {
    const title = 'Complete onboarding quest';
    const description = 'Complete onboarding quest to start earning experience';
    const type = 'onBoarding' as TNotificationTypes;
    const isExists = await notificationModel.findOne({ where: { investorId, type } });
    if (isExists) {
      return;
    }

    return notificationModel
      .createByInvestorIDs(
        {
          title,
          description,
          questLinkTitle: (await getOnboardingQuestLinkTitle()).linkTitle,
          type,
        },
        [investorId],
      )
      .then(notifyBySocket);
  };

  export const addExperienceNotification = async (investorId: number) => {
    const title = 'Get experience points';
    const description = 'We launched a new experience system!';
    const type = 'experience' as TNotificationTypes;
    const isExists = await notificationModel.findOne({ where: { investorId, type } });
    if (isExists) {
      return;
    }

    return notificationModel
      .createByInvestorIDs(
        {
          title,
          description,
          type,
        },
        [investorId],
      )
      .then(notifyBySocket);
  };

  export const findAndReadOnBoardingNotification = async (investorId: number) => {
    try {
      const notification = await notificationModel.findOneByTypeAndInvestorId(investorId, 'onBoarding');
      if (notification) {
        await notificationModel.update(notification.id, { viewed: true });
      }
    } catch (e) {
      log.error(`Failed NotificationsServerService.findAndReadOnBoardingNotification => ${e.message || e}`);
      console.log(`Failed NotificationsServerService.findAndReadOnBoardingNotification => ${e.message || e}`);
    }
  };

  export const isNewNotificationsExistByInvestorId = async (investorId: number) =>
    notificationModel.findNotViewedNotificationsByInvestorId(investorId).then((res) => !!res.length);
}
