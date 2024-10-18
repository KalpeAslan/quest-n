import { Box } from "@mui/material";
import { Wrapper } from "./nftRewardContainer.styles";
import { CHAINS, IFullRewardWithNft } from "@/models";
import { FC, useMemo, useState } from "react";
import { Icon } from "@/components/UI/icon";
import Image from "next/image";
import { appConfig } from "@/app.config";
import { RewardDescriptionPopup } from "../rewardDescriptionPopup";
import { Trans } from "@lingui/macro";

interface Props {
  reward: IFullRewardWithNft;
  className?: string;
}

const NftRewardContainer: FC<Props> = ({ reward, className }) => {
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  const chainIcon = useMemo(
    () => CHAINS[reward.contract.chainId]?.icon || "ethereum-icon",
    [reward.contract.chainId],
  );

  return (
    <>
      <Wrapper className={className} onClick={() => setPopupOpen(true)}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb="20px"
        >
          <Box className="c-font-color">
            <Box className="c-font-16-18 c-fw-500" mb="10px">
              <Trans id="fhEP2fCwsj7my7wziVFCLL-quest">
                {reward.amount} NFTs
              </Trans>
            </Box>
            <Box className="c-font-14-14 c-fw-400">{reward.contract.name}</Box>
          </Box>

          <Box>
            <Icon name={chainIcon} size="27" />
          </Box>
        </Box>

        {reward?.nftMetadata && (
          <Box className="nftImageContainer">
            <Image
              src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${reward.nftMetadata.image}`}
              height={224}
              width={224}
              alt="Nft image"
            />
          </Box>
        )}
      </Wrapper>

      <RewardDescriptionPopup
        reward={reward}
        isOpen={popupOpen}
        setIsOpen={setPopupOpen}
      />
    </>
  );
};

export default NftRewardContainer;
