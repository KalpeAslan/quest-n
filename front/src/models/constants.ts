import { appConfig } from "@/app.config";
import {
  mainnet,
  polygon,
  bsc,
  avalanche,
  arbitrum,
  optimism,
  goerli,
  arbitrumGoerli,
} from "wagmi/chains";

export const DEFAULT_META_DESCRIPTION_EN =
  "Don't miss out on the ultimate money making hub! At AlphaGuilty, your time equals real money. Complete tasks, get instant cryptocurrency rewards, and maximise your earnings today!";

export const DEFAULT_META_DESCRIPTION_UK =
  "Не пропустіть найкращий центр заробляння грошей! У Alpha Guilty Ваш час прирівнюється до реальних грошей. Виконуйте завдання, отримуйте миттєві винагороди в криптовалюта і максимізуйте свій заробіток вже сьогодні!";

export const DEFAULT_META_DESCRIPTION_RU =
  "Не упустите настоящий клондайк прибыли! В AlphaGuilty, ваше время - деньги. Гарантированно заработайте крипту, НФТ и токены!";

export const DEFAULT_META_TITLE_EN =
  "AlphaGuilty: Turn Your Time Into Real Crypto Profits - Start Earning Now!";

export const DEFAULT_META_TITLE_UK =
  "Alpha Guilty: Перетворіть свій час в реальну Криптоприбуток-почніть заробляти прямо зараз!";

export const DEFAULT_META_TITLE_RU =
  "AlphaGuilty: Превратите своё время в деньги - заработайте крипту прямо сейчас!";

export const CHAINS = {
  "0x1": {
    scanLink: "https://etherscan.io/",
    title: "Ethereum",
    value: "0x1",
    icon: "ethereum-icon",
    wagmiChain: mainnet,
  },
  "0x89": {
    scanLink: "https://polygonscan.com/",
    title: "Polygon",
    value: "0x89",
    icon: "polygon-icon",
    wagmiChain: polygon,
    deployer: appConfig.NEXT_PUBLIC_X89_DEPLOYER_ADDRESS,
    treasury: appConfig.NEXT_PUBLIC_X89_TREASURY_ADDRESS,
  },
  "0x38": {
    scanLink: "https://bscscan.com/",
    title: "BNB",
    value: "0x38",
    icon: "BNB-icon",
    wagmiChain: bsc,
    deployer: appConfig.NEXT_PUBLIC_X38_DEPLOYER_ADDRESS,
    treasury: appConfig.NEXT_PUBLIC_X38_TREASURY_ADDRESS,
  },
  "0xa86a": {
    scanLink: "https://explorer.avax.network/",
    title: "Avalanche",
    value: "0xa86a",
    icon: "avalanche-icon",
    wagmiChain: avalanche,
    deployer: appConfig.NEXT_PUBLIC_XA86A_DEPLOYER_ADDRESS,
    treasury: appConfig.NEXT_PUBLIC_XA86A_TREASURY_ADDRESS,
  },
  "0xa4b1": {
    scanLink: "https://arbiscan.io/",
    title: "Arbitrum",
    value: "0xa4b1",
    icon: "arbitrum-icon",
    wagmiChain: arbitrum,
    deployer: appConfig.NEXT_PUBLIC_XA4B1_DEPLOYER_ADDRESS,
    treasury: appConfig.NEXT_PUBLIC_XA4B1_TREASURY_ADDRESS,
  },
  "0xa": {
    scanLink: "https://optimistic.etherscan.io/",
    title: "Optimism",
    value: "0xa",
    icon: "optimism-icon",
    wagmiChain: optimism,
    deployer: appConfig.NEXT_PUBLIC_XA_DEPLOYER_ADDRESS,
    treasury: appConfig.NEXT_PUBLIC_XA_TREASURY_ADDRESS,
  },
  "0x141": {
    scanLink: "https://scan.kcc.io/",
    title: "KCC",
    value: "0x141",
    icon: "kcc-icon",
  },
  "0x42": { title: "OKT", value: "0x42", icon: "okt-icon" },
  "0x7f08": {
    scanLink: "https://brisescan.com/",
    title: "BitGert",
    value: "0x7f08",
    icon: "bitGert-icon",
  },
  "0x1b59": { title: "ZetaChain", value: "0x1b59", icon: "zetaChain-icon" },
  "0x5": {
    scanLink: "https://goerli.etherscan.io/",
    title: "Goerli",
    value: "0x5",
    icon: "ethereum-icon",
    deployer: appConfig.NEXT_PUBLIC_X5_DEPLOYER_ADDRESS,
    treasury: appConfig.NEXT_PUBLIC_X5_TREASURY_ADDRESS,
    wagmiChain: goerli,
  },
  "0x66eed": {
    scanLink: "https://goerli.arbiscan.io/",
    title: "Goerli Arbitrum",
    value: "0x66eed",
    icon: "arbitrum-icon",
    wagmiChain: arbitrumGoerli,
  },
  "0x4e454152": { title: "Aurora", value: "0x4e454152", icon: "aurora-icon" },
};

export const CHAIN_OPTIONS = Object.values(CHAINS);

export const CHAIN_OPTIONS_FOR_ONCHAIN = [
  CHAINS["0x89"],
  CHAINS["0x38"],
  CHAINS["0xa86a"],
  CHAINS["0xa4b1"],
  CHAINS["0xa"],
  CHAINS["0x5"],
];
