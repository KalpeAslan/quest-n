import { Router } from 'express';
import { authMiddleware } from '../middlewares/authValidating';
import { RequestLogger } from '../services/logger';
import { getGameInvestorInfo, getIframeResponse, postGameBet, postGameCancel, postGameWin } from '../services/games';
import { dtoValidationMiddleware } from '../middlewares/dtoValidating';
import { GamesBetDto, GamesCancelDto, GamesInfoDto, GamesWinDto } from '../../db/types/interfaces/GamesDto';
import { NotFoundError, NotFoundErrorKeys } from '../errors/NotFoundError';
import { addExperience } from '../services/experience';

const logger = new RequestLogger();

export const games = Router();

games.get('/games/:bundle', authMiddleware, async (req, res, next) => {
  try {
    const gameBundle = req.params.bundle;
    const investorId = req['investorId'];
    const language = req.header('language');

    const result = await getIframeResponse(investorId, gameBundle, language);

    if (!result) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Failed to get iframe');

    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

games.post('/games', dtoValidationMiddleware(GamesInfoDto), async (req, res, next) => {
  try {
    const result = await getGameInvestorInfo(req.body);

    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

games.post('/games/info', dtoValidationMiddleware(GamesInfoDto), async (req, res, next) => {
  try {
    const result = await getGameInvestorInfo(req.body);

    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

games.post('/games/bet', dtoValidationMiddleware(GamesBetDto), async (req, res, next) => {
  try {
    const result = await postGameBet(req.body);

    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

games.post('/games/win', dtoValidationMiddleware(GamesWinDto), async (req, res, next) => {
  try {
    const { result, investorId } = await postGameWin(req.body);

    logger.info(req, { response: { result } });
    if (result.success && investorId) {
      await addExperience(investorId, { experienceType: 'winGame' });
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
});

games.post('/games/cancel', dtoValidationMiddleware(GamesCancelDto), async (req, res, next) => {
  try {
    const result = await postGameCancel(req.body);

    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});
