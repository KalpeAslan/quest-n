import { FC } from "react";
import Icon from "@components/UI/icon/Icon";
import { ETokenType } from "@models";
import { EReward } from "@modules/quest/models";
import classNames from "classnames";
import Button from "@components/UI/button/Button";
import { appConfig } from "@/app.config";
import Image from "next/image";

interface IProps {
  amount: number | string;
  type: ETokenType | EReward;
  symbol?: string;
  logo?: string;
  buttonStyle?: "primary" | "colorfull";
  className?: string;
}

export const RewardBadge: FC<IProps> = ({
  amount,
  type,
  buttonStyle,
  symbol,
  logo,
  className,
}) => {
  const computeIcon = () => {
    switch (type) {
      case ETokenType.Token:
        if (symbol && symbol.toLowerCase() === "usdt") {
          return (
            <Icon
              name="questUSDT"
              color={buttonStyle === "primary" ? "black" : "var(--color-gr2)"}
              size="15"
              className="rewardImg"
            />
          );
        }
        return <Icon name={"reward-ethereum-icon"} size={"16"}/>;
      case ETokenType.Aq:
        return <Icon name="alphaguilty-task" size="15" className="rewardImg" />;
      case ETokenType.Nft:
        return (
          <Icon
            name={"reward-nft"}
            size={"16"}
            style={{marginRight: 2}}
            color={buttonStyle === "primary" ? "black" : "var(--color-gr2)"}
          />
        );
      case ETokenType.Whitelist:
        return "";
      // return (
      //   <span className={"c-font-14-14 c-font-color"}>
      //     <Trans id={"xdjvh-2tkjrb-23kebjv"}>White List</Trans>
      //   </span>
      // );
    }
  };

  return (
    <Button
      style={buttonStyle || "colorfull"}
      className={classNames(
        `rewardItem c-font-15-16 c-fw-700 ${
          buttonStyle === "primary" ? "primary" : "colorfull"
        }`,
        {
          [className]: className,
        },
      )}
    >
      <>
        {logo ? (
          <Image
            src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${logo}`}
            alt={symbol}
            width={15}
            height={15}
            className="rewardImg"
          />
        ) : (
          computeIcon()
        )}
        {amount} {symbol}
      </>
    </Button>
  );
};
