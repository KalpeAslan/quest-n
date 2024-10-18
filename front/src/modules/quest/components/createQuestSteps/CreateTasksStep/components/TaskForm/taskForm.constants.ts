import { ENetworks } from "@models";
import { isAddress } from "viem";
import { DateTime } from "luxon";
import { ILoyaltyProject } from "@modules/quest/models";

const scansOfNetworks = {
  [ENetworks.Ethereum]: { scanLink: "https://etherscan.io/" },
  [ENetworks.Polygon]: { scanLink: "https://polygonscan.com/" },
  [ENetworks.BNB]: { scanLink: "https://bscscan.com/" },
  [ENetworks.Avalanche]: { scanLink: "https://explorer.avax.network/" },
  [ENetworks.Arbitrum]: { scanLink: "https://arbiscan.io/" },
  [ENetworks.Optimism]: { scanLink: "https://optimistic.etherscan.io/" },
  [ENetworks.BitGert]: { scanLink: "https://brisescan.com/" },
  [ENetworks.ZetaChain]: { scanLink: "https://explorer.zetachain.com/" },
  [ENetworks.GoerliArbitrum]: { scanLink: "https://goerli.arbiscan.io/" },
  [ENetworks.Goerli]: { scanLink: "https://goerli.etherscan.io/" },
  [ENetworks.Aurora]: { scanLink: "https://old.explorer.aurora.dev/" },
};

export const validateScanUrlAndGetNetworkKey = (
  url,
): { chainId: ENetworks; contractAddress: string } | false => {
  const matchingNetwork = Object.entries(scansOfNetworks).find(([_, network]) =>
    url.includes(network.scanLink),
  );

  const contractAddress = url.split("/address/")[1];

  if (matchingNetwork && isAddress(contractAddress)) {
    const [networkKey] = matchingNetwork;
    return {
      contractAddress,
      chainId: networkKey as ENetworks,
    };
  }

  return false;
};

export const getScanByAddressAndChainId = (
  address: string,
  chainId: ENetworks,
) => {
  return `${scansOfNetworks[chainId].scanLink}address/${address}`;
};

export function validateTGLink(link: string): boolean {
  return !link.startsWith("https://t.me/+");
}

export function validateRegex(rule: string) {
  let isValid = true;
  try {
    new RegExp(rule);
  } catch (_) {
    isValid = false;
  }
  return isValid;
}
export const computeStartAt = (
  startAt: string | Date,
  currentQuest: ILoyaltyProject,
) =>
  startAt
    ? DateTime.fromISO(new Date(startAt).toISOString()).toFormat(
        "yyyy-LL-dd'T'T",
      )
    : currentQuest
    ? DateTime.fromISO(new Date(currentQuest.startAt).toISOString()).toFormat(
        "yyyy-LL-dd'T'T",
      )
    : "";

export const computeEndAt = (
  endAt: string | Date,
  currentQuest: ILoyaltyProject,
) =>
  endAt
    ? DateTime.fromISO(new Date(endAt).toISOString()).toFormat("yyyy-LL-dd'T'T")
    : currentQuest
    ? DateTime.fromISO(new Date(currentQuest.endAt).toISOString()).toFormat(
        "yyyy-LL-dd'T'T",
      )
    : "";
