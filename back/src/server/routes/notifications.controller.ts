import express from 'express';
import { RequestLogger } from '../services/logger';
import { NotificationsServerService } from '../services/notifications.service';
import { authMiddleware } from '../middlewares/authValidating';
const logger = new RequestLogger();

export const notifications = express.Router();

notifications.get('/notifications', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'] as number;
    const { viewed } = req.query;
    const { page, pageSize } = req.query;
    const notifications = await NotificationsServerService.getNotifications({
      investorId,
      viewed: viewed ? viewed === 'true' : null,
      pagination:
        !page && !pageSize
          ? undefined
          : {
              page: page as unknown as number,
              pageSize: pageSize as unknown as number,
            },
    });
    logger.info(req, { response: { notifications } });
    res.send(notifications);
  } catch (err) {
    next(err);
  }
});

notifications.post('/notifications', authMiddleware, async (req, res, next) => {
  try {
    const body = req.body as { IDs: number[] };
    const investorId = req['investorId'] as number;
    const notifications = await NotificationsServerService.viewNotifications(body.IDs, investorId);
    logger.info(req, { response: { notifications } });
    res.send(notifications);
  } catch (err) {
    next(err);
  }
});
