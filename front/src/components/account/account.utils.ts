export const isSelectedTab = (tabName, pathname: string) => {
  switch (tabName) {
    case "experience":
      return pathname === "/profile/experience";
    case "accountsAndSecurity":
      return pathname === "/profile/security";
    case "Quests":
      return pathname === "/profile/quests";
    case "Rewards":
      return pathname === "/profile/rewards";
  }
};
