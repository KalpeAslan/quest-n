import { BaseRepositoryService } from './BaseRepository';
import { NotificationEntity } from '../entity';
import { TNotificationTypes } from '../types/interfaces/notifications.types';

type TBaseNotificationParams = {
  title: string;
  description: string;
  type: TNotificationTypes;
  questLinkTitle?: string;
};

export class NotificationModel extends BaseRepositoryService<NotificationEntity> {
  constructor() {
    super(NotificationEntity);
  }

  createByInvestorIDs(
    { title, description, type, questLinkTitle }: TBaseNotificationParams,
    investorIDs: number[],
  ): Promise<NotificationEntity[]> {
    return Promise.all(
      investorIDs.map((investorId) => {
        let entity = new NotificationEntity();
        entity = {
          ...entity,
          title,
          payload: {
            message: description,
            questLinkTitle,
          },
          type,
          investorId,
        };
        return this.repository.save(entity);
      }),
    );
  }

  findNotViewedNotificationsByInvestorId(investorId: number) {
    return this.repository.find({
      where: {
        investorId,
        viewed: false,
      },
    });
  }

  findOneByTypeAndInvestorId(investorId: number, type: TNotificationTypes): Promise<NotificationEntity | undefined> {
    return this.repository.findOne({
      where: {
        investorId,
        type,
        viewed: false,
      },
    });
  }
}

export const notificationModel = new NotificationModel();
