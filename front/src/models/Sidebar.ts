export interface IMenuItem {
  id: number;
  path?: string;
  title: string;
  icon?: string;
  sublist?: IMenuItem[];
  type?: "self" | "redirect" | "reopen";
  status: "active" | "new" | "soon";
  closeMenu?: boolean;
  includeSubpaths: boolean;
}

export enum EPATH_IDS {
  HOME = 1,
  QUEST = 2,
  EXPLORE = 3,
  REFERRAL = 4,
  ECOSYSTEM = 5,
  GAMES = 6,

  COMMUNITY = 3,
  LAUNCHPAD = 4,
  KNOWLEDGE = 7,
  MORE = 10,
  EVENTS = 11,
}

export const PATHS = {
  "/twitter": EPATH_IDS.COMMUNITY,
  "/telegram": EPATH_IDS.COMMUNITY,
  "/discord": EPATH_IDS.COMMUNITY,
  "/medium": EPATH_IDS.COMMUNITY,
  "/nft-launchpad": EPATH_IDS.LAUNCHPAD,
  "/token-launchpad": EPATH_IDS.LAUNCHPAD,
  "/events/twitterspace2": EPATH_IDS.EVENTS,
  "/events/online-meetup": EPATH_IDS.EVENTS,
  "/analytics": EPATH_IDS.KNOWLEDGE,
  "/rankings": EPATH_IDS.KNOWLEDGE,
  "/products": EPATH_IDS.KNOWLEDGE,
  "/videos": EPATH_IDS.KNOWLEDGE,
  "/terms-and-condition": EPATH_IDS.MORE,
  "/privacy-policy": EPATH_IDS.MORE,
  "/cookies-policy": EPATH_IDS.MORE,
};
