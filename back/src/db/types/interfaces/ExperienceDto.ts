export class createExperienceDto {
  name!: string;
  points!: number;
  body?: any;
  type!: ExperienceTaskType;
}

export class createExperienceLevelDto {
  name!: string;
  pointsFrom!: number;
  pointsTo!: number;
  bonusLuckyDrawPercentage!: number;
  bonusPointsPercentage!: number;
  questLimit!: number;
  level!: number;
  image!: string;
  linkTitle!: string;
  nftImage!: string;
  benefits!: string[];
}

export type ExperienceTaskType =
  | 'connectTelegram'
  | 'connectTwitter'
  | 'connectDiscord'
  | 'connectWallet'
  | 'connectGoogle'
  | 'registerWithTwitter'
  | 'registerWithDiscord'
  | 'registerWithGoogle'
  | 'registerWithEmail'
  | 'registerWithPhone'
  | 'registerWithWallet'
  | 'connect2fa'
  | 'winGame'
  | 'dailyLogin'
  | 'dailyVisit'
  | 'inviteReferral'
  | 'completeFirstTask'
  | 'completeAllTasks'
  | 'winScoreboardQuest'
  | 'winLuckyDrawQuest'
  | 'winGuaranteedQuest'
  | 'customTaskExperience';

export type ExperienceBodyType = {
  concurrentReferralPoints?: number;
  concurrentDailyLoginPoints?: number[];
  concurrentDailyVisitPoints?: number[];
};
