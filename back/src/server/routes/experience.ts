import express from 'express';
import { RequestLogger } from '../services/logger';
import { authMiddleware } from '../middlewares/authValidating';
import {
  addExperience,
  claimDailyVisitExperiece,
  mintExperienceLevel,
  verifyExperienceLevel,
} from '../services/experience';

const logger = new RequestLogger();
export const experience = express.Router();

experience.post('/experience/claim-daily-visit', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'] as number;
    const result = await claimDailyVisitExperiece(investorId);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

experience.post('/experience/level/mint', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'] as number;
    const result = await mintExperienceLevel(investorId);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

// assign level 1 to investor
experience.post('/experience/level/verify', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'] as number;
    const result = await verifyExperienceLevel(investorId);
    // create first daily visit, concurent visits will be posted by frontend
    await addExperience(investorId, { experienceType: 'dailyVisit' });
    res.send({
      isProfileMinted: result,
    });
  } catch (err) {
    next(err);
  }
});

experience.post('/experience/daily-visit', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'] as number;
    console.log(investorId);
    await addExperience(investorId, { experienceType: 'dailyVisit' });

    res.send({ success: true });
  } catch (err) {
    next(err);
  }
});
