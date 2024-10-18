import { ELoyaltyTasks } from "@models/Quest";

export interface IParticipant {
  username: string | null;
  suggestionTask: {
    description: string;
    type: ELoyaltyTasks.SUGGESTION;
  };
  emailTask: {
    email: string;
    type: ELoyaltyTasks.EMAIL;
  };
  imageTasks: {
    img: string;
    type: ELoyaltyTasks.IMAGE_UPLOAD;
  };
  twitter: string | null;
  discord: string | null;
  wallet: string | null;
  status?: "winner"; //- lucky draw progress exists | "looser" - lucky draw progress not exists and points >= threshold | "notEligible" - points < threshold; - for LD
  scoreboardPlace?: number; //- for Scoreboard
}
