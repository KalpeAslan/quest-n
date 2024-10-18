import { Box } from "@mui/material";
import { IProfileReward } from "@modules/account/models";
import { FC } from "react";
import { ETokenType } from "@models";
import Image from "next/image";
import { Trans, t } from "@lingui/macro";
import Icon from "@components/UI/icon/Icon";
import { appConfig } from "@/app.config";
import Link from "next/link";

interface IProps {
  reward: IProfileReward;
  onClick: () => void;
}

export const Reward: FC<IProps> = ({ reward, onClick }) => {
  const renderLogo = () => {
    if (reward.contract.logo)
      return (
        <img
          src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${reward.contract.logo}`}
          alt={t({ id: "4j7npjTh9aUjyvRm1XjYKn-reward", message: "Reward" })}
          style={{ maxWidth: 60, maxHeight: 60 }}
        />
      );
    if (reward.contract.type === ETokenType.Token)
      return (
        <Image
          width={35}
          height={33}
          src={"/images/profile/usdt.png"}
          alt={t({ id: "9bHLaRuehndeXLW74FuSby-reward", message: "Reward" })}
        />
      );
    if (reward.contract.type === ETokenType.Nft)
      return (
        <Image
          width={62}
          height={48}
          src={"/images/profile/nft.png"}
          alt={t({ id: "byZaM55pdCnZKEjgiJfyur-reward", message: "Reward" })}
        />
      );
  };

  const renderClaimStatus = () => {
    if (reward.isClaimed)
      return (
        <Box
          borderRadius={"16px 0px 0px 16px"}
          border={"0.5px solid rgba(255, 255, 255, 0.10)"}
          bgcolor={"var(--color-gr2)"}
          position={"absolute"}
          padding={"8px 18px 8px 10px"}
          right={0}
          top={18}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={30}
        >
          <span>
            <Trans id={"slkdhv-34ghkdfv-dsbndkjf"}>Claimed</Trans>
          </span>
          <Box
            bgcolor={"#293131"}
            width={14}
            height={14}
            borderRadius={50}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            position={"relative"}
            ml={"5px"}
          >
            <Icon name={"claimMarkup"} size={"10"} />
          </Box>
        </Box>
      );
    return (
      <p className={"c-font-14-14 c-font-color"}>
        <Trans id={"sdkhg-2kjwkjebf-3ekbfvk"}>Not Claimed</Trans>
      </p>
    );
  };

  const computeName = () => {
    if (reward.contract.type === ETokenType.Token) return "Token";
    if (reward.contract.type === ETokenType.Nft) return "NFT";
    return "White List";
  };

  const computeDesc = () => {
    if (reward.contract.type)
      return `${
        Number.isInteger(+reward.amount)
          ? reward.amount
          : Number(reward.amount).toFixed(2)
      } ${reward.contract.symbol}`;
    return reward.contract.name;
  };

  return (
    <Box
      width={"100%"}
      p={2}
      onClick={onClick}
      minHeight={100}
      borderRadius={2}
      bgcolor={"var(--color-b25)"}
      border={"0.5px solid rgba(255, 255, 255, 0.10)"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      position={"relative"}
      sx={{
        "&:hover": {
          background:
            "linear-gradient(123deg, rgba(84, 126, 190, 0.10) 14.13%, rgba(81, 220, 94, 0.10) 85.37%)",
          border: "0.5px solid rgba(255, 255, 255, 0.10)",
        },
      }}
    >
      <Box>
        <Box
          justifyContent={"center"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"start"}
        >
          {reward.contract.type !== ETokenType.Whitelist && (
            <Box>{renderLogo()}</Box>
          )}
          <p style={{ marginTop: 5 }} className={"c-font-16-16 c-font-color"}>
            {computeName()}
          </p>
          <Box component={"p"} className={"c-font-14-14 c-font-color-13"}>
            {computeDesc()}
          </Box>
        </Box>
      </Box>
      <Box
        display={"flex"}
        alignItems={"end"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box>{renderClaimStatus()}</Box>
        <Box>
          <Link
            target={"_blank"}
            onClick={e => e.stopPropagation()}
            href={`/quest/${reward.loyaltyProject.linkTitle}`}
            style={{ textDecoration: "none" }}
          >
            <Box
              component={"p"}
              mt={5.5}
              className={"c-font-14-16 c-fw-500 c-font-color-3 c-pointer"}
            >
              {reward.loyaltyProject.title}
            </Box>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
