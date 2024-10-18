export interface TSocialDataType {
  code: string;
  oauthRequestToken?: string;
  oauthRequestTokenSecret?: string;
  error?: string;
}

export interface TWalletEntry {
  address: string;
  signature: string;
  error?: string;
}

export interface TEmailSignupDataType {
  referralCode: string;
  email: string;
  password: string;
  reCaptchaToken: string;
  redirect: string;
}

export interface TEmailLoginDataType {
  email: string;
  password: string;
}

export interface TPhoneSignupDataType {
  phone: string;
  password: string;
  reCaptchaToken: string;
}

export interface TPhoneLoginDataType {
  phone: string;
  password: string;
}

export interface TCredsSignupResult {
  confirmToken: string;
  email?: string;
  phone?: string;
}

export interface TCredsLoginResult {
  accessToken?: string;
  refreshToken?: string;

  twoFactorAuthToken?: string;
  twoFactorAuth?: boolean;
  phoneNumber?: string;
}

//deprecated
export interface ILevel {
  id?: number;
  number: number;
  place?: string;
  avatar: string;
  tokensFrom: number;
  name: string;
}

export interface ExperienceLevel {
  id: number;
  name: string;
  image: string;
  linkTitle: string;
  nftImage: string;
  contractAddress: string;
  chainId: string;
  benefits: string[];
  pointsFrom: number;
  pointsTo: number;
  bonusLuckyDrawPercentage: number;
  bonusPointsPercentage: number;
  questLimit: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum EAuthSteps {
  LOGING = "login",
  SIGNUP = "sign-up",
  USERNAME = "username",
  CODE = "code",
  CONFIRM = "confirm",
  REWARD = "reward",
}

export interface IPutReferralClaim {
  referralProfit: number;
  claimableReferralProfit: number;
  referralCode: string;
}

export interface IConnectWalletDto {
  wallet: string;
  signature: string;
}

export enum EExpTaskType {
  connectTelegram = "connectTelegram",
  connectTwitter = "connectTwitter",
  connectDiscord = "connectDiscord",
  connectWallet = "connectWallet",
  connectGoogle = "connectGoogle",
  registerWithTwitter = "registerWithTwitter",
  registerWithDiscord = "registerWithDiscord",
  registerWithGoogle = "registerWithGoogle",
  registerWithEmail = "registerWithEmail",
  registerWithPhone = "registerWithPhone",
  registerWithWallet = "registerWithWallet",
  connect2fa = "connect2fa",
  winGame = "winGame",
  dailyLogin = "dailyLogin",
  inviteReferral = "inviteReferral",
  completeFirstTask = "completeFirstTask",
  completeAllTasks = "completeAllTasks",
  winScoreboardQuest = "winScoreboardQuest",
  winLuckyDrawQuest = "winLuckyDrawQuest",
  winGuaranteedQuest = "winGuaranteedQuest",
  customTaskExperience = "customTaskExperience",
}

export interface IExpHistoryItem {
  id: number;
  type: EExpTaskType;
  earnedPoints: number;
  body: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  experienceTaskId: number;
  investorId: number;
  experienceTask: {
    id: number;
    name: string;
    points: number;
    body: Record<string, any>;
    type: EExpTaskType;
    createdAt: string;
    updatedAt: string;
  };
}

export enum EUserModalSettingsTypes {
  EXP_TOUR = "experience_tour",
}
