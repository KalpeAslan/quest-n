import { CHAINS, ETokenType, IFullRewardWithNft } from "@/models";
import { Wrapper } from "./tokenRewardContainer.styles";
import { FC, useMemo, useState } from "react";
import Image from "next/image";
import { appConfig } from "@/app.config";
import { Box } from "@mui/material";
import { Icon } from "@/components/UI/icon";
import { RewardDescriptionPopup } from "../rewardDescriptionPopup";
import { t } from "@lingui/macro";

interface Props {
  reward: IFullRewardWithNft;
  className?: string;
}

const TokenRewardContainer: FC<Props> = ({ reward, className }) => {
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  const chainIcon = useMemo(
    () => CHAINS[reward.contract.chainId]?.icon || "ethereum-icon",
    [reward.contract.chainId],
  );

  const isToken = useMemo(
    () =>
      reward.contract.type === ETokenType.Token ||
      reward.contract.type === ETokenType.Aq,
    [reward.contract.type],
  );

  const isNft = useMemo(
    () => reward.contract.type === ETokenType.Nft,
    [reward.contract.type],
  );

  const isWhitelist = useMemo(
    () => reward.contract.type === ETokenType.Whitelist,
    [reward.contract.type],
  );

  return (
    <>
      <Wrapper className={className} onClick={() => setPopupOpen(true)}>
        <Box display="flex" alignItems="center">
          {(reward.nftMetadata || reward.contract.logo) && (
            <Box className="tokenLogoWrapper">
              <Image
                src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${
                  reward.nftMetadata?.image || reward.contract.logo
                }`}
                height={48}
                width={48}
                alt={t({
                  id: "bZLCavQua9Xx6eU14gudup-quest",
                  message: "Reward logo",
                })}
              />
            </Box>
          )}

          <Box className="c-font-color">
            <Box className="c-font-16-18 c-fw-500" mb="10px">
              {isToken && "Token Reward"}
              {isNft &&
                `${Math.round(reward.amount)} ${
                  Math.round(reward.amount) > 1
                    ? t({
                        id: "2eDXb17Q3criUtR1dLfgUA-quest",
                        message: `NFTs ${reward.description}`,
                      })
                    : t({
                        id: "rw2q6rxJmnP1tiMuiNYLi8-quest",
                        message: `NFT ${reward.description}`,
                      })
                }`}
              {isWhitelist &&
                t({
                  id: "kciRtNRrTKeuSp33LGc4k5-quest",
                  message: "White List",
                })}
            </Box>
            <Box className="c-font-14-14 c-fw-400">
              {isToken &&
                `${Math.round(reward.amount)} ${reward.contract.symbol}`}
              {(isNft || isWhitelist) &&
                (reward.contract.name || reward.contract.symbol)}
            </Box>
          </Box>
        </Box>

        {!isWhitelist && <Icon name={chainIcon} size="25" />}
      </Wrapper>

      {reward.contract.type !== ETokenType.Aq &&
        (reward.contract.address ||
          reward.contract.type === ETokenType.Whitelist) && (
          <RewardDescriptionPopup
            reward={reward}
            isOpen={popupOpen}
            setIsOpen={setPopupOpen}
          />
        )}
    </>
  );
};

export default TokenRewardContainer;
