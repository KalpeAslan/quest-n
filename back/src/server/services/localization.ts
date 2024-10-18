import { getRepository } from 'typeorm';
import { Localization } from '../../db/entity';
import { Logger } from './logger';

const log = new Logger();
export const getLocalization = async (objId: string, language?: string, fieldType?: string) => {
  log.warn('getLocalization');
  if (language != 'en' && language != undefined) {
    return await getRepository(Localization)
      .findOne({
        where: {
          objId: objId,
          lang: language,
          fieldType: fieldType,
        },
      })
      .then((data) => {
        if (data != null) {
          return data.body;
        } else {
          return;
        }
      });
  }
  return;
};
