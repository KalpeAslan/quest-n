import { dbConnection, dbTruncateAll } from '../testDb';
import { populateLoyaltyProject } from './loyalty-project';
import { populateLoyaltyTasks } from './loyalty-task';
import { populateLoyaltyRewards } from './loyalty-reward';
import { populateTokens } from './token';
import { populateInvestor } from './investor';
import { populateEmailUsers } from './email-user';
import { populateTokensStorage } from './token-storage';
import { populateWalletUsers } from './wallet-user';
import { populateDiscordUsers } from './discord-user';
import { populateTelegramUsers } from './telegram-user';
import { populatePartnerProject } from './partner-project';

export const main: () => void = async () => {
  await dbConnection();
  await dbTruncateAll();
  await populateInvestor();
  await populateWalletUsers();
  await populateDiscordUsers();
  await populateTelegramUsers();
  await populateEmailUsers();
  await populateLoyaltyProject();
  await populateLoyaltyTasks();
  await populateTokens();
  await populateLoyaltyRewards();
  await populateTokensStorage();
  await populatePartnerProject();
};

main();
