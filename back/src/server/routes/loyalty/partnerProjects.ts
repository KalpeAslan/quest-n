import { Router } from 'express';
import { getPartnerProject } from '../../services/loyalty/partnerProject';
import { RequestLogger } from '../../services/logger';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';

const logger = new RequestLogger();
export const partnerProject = Router();

partnerProject.get('/partner-projects/:link', async (req, res, next) => {
  try {
    const projectLinkTitle = req.params.link;
    const language = req.header('language');
    if (!projectLinkTitle) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'no link');

    const project = await getPartnerProject(projectLinkTitle, language);
    logger.info(req, { response: { project } });
    res.send({ project });
  } catch (error) {
    next(error);
  }
});
