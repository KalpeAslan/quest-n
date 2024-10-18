import { Modal } from "@/components/UI/modal";
import { CHAINS, ETokenType, IFullRewardWithNft } from "@/models";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Wrapper } from "./rewardDescriptionPopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import Image from "next/image";
import { appConfig } from "@/app.config";
import { HelperService } from "@/services";
import classNames from "classnames";
import CopyToClipboard from "react-copy-to-clipboard";
import { MarkdownAndHTML } from "@/components/MarkdownAndHTML/MarkdownAndHTML";
import { Trans, t } from "@lingui/macro";

interface Props {
  reward: IFullRewardWithNft;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const RewardDescriptionPopup: FC<Props> = ({ reward, isOpen, setIsOpen }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const isNft = useMemo(
    () => reward.contract.type === ETokenType.Nft,
    [reward.contract.type],
  );

  const isToken = useMemo(
    () => reward.contract.type === ETokenType.Token,
    [reward.contract.type],
  );

  const isWhitelist = useMemo(
    () => reward.contract.type === ETokenType.Whitelist,
    [reward.contract.type],
  );

  const handleCopy = useCallback(() => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }, []);

  const modalData = useMemo(
    () =>
      isNft
        ? [
            {
              name: t({
                id: "jeGcdSkbw5S9GjWb8TQjML-quest",
                message: "Contract Address",
              }),
              data: reward.contract.address
                ? HelperService.getShortAddress(reward.contract.address, 6)
                : "",
              fullData: reward.contract.address,
              copy: true,
              color: "#87F696",
            },
            {
              name: t({
                id: "5SxAzjSsbavFrnCSXxMca3-quest",
                message: "Blockchain",
              }),
              data: CHAINS[reward.contract.chainId]?.title,
              icon: CHAINS[reward.contract.chainId]?.icon,
            },
          ]
        : [
            {
              name: t({
                id: "wKsxe6Rr6W2gRbn3ASSnVM-quest",
                message: "Amount",
              }),
              data: `${reward.amount} ${reward.contract.symbol}`,
            },
            {
              name: t({
                id: "sKGw7iCnkerhRsd33tJ4wM-quest",
                message: "Contract Address",
              }),
              data: reward.contract.address
                ? HelperService.getShortAddress(reward.contract.address, 6)
                : "",
              fullData: reward.contract.address,
              copy: true,
              color: "#87F696",
            },
            {
              name: t({
                id: "kEBUn99rSF2xBbckGycqo4-quest",
                message: "Blockchain",
              }),
              data: CHAINS[reward.contract.chainId]?.title,
              icon: CHAINS[reward.contract.chainId]?.icon,
            },
          ],
    [
      isNft,
      reward.amount,
      reward.contract.address,
      reward.contract.chainId,
      reward.contract.symbol,
    ],
  );

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={() => setIsOpen(false)}>
          <Wrapper>
            <Box className="header c-fw-500 c-font-color">
              <Box display="flex" alignItems="center">
                {(isNft || isWhitelist) && reward.contract.name}
                {isToken && (
                  <>
                    {reward.contract.logo && (
                      <Image
                        src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${reward.contract.logo}`}
                        width={23}
                        height={23}
                        alt={t({
                          id: "w2166WWshb8ZufYCdjU1Jo-quest",
                          message: "Token logo",
                        })}
                        style={{ marginRight: "10px" }}
                      />
                    )}
                    <Trans id="7RFQA3ubt6ToWjuXJhbLQm-quest">
                      Token Reward
                    </Trans>
                  </>
                )}
              </Box>
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={() => setIsOpen(false)}
                disableTouchStart
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Box>

            <Box className="content">
              {isWhitelist && (
                <>
                  <Box className="c-font-color c-font-20-24 c-fw-500" mb="15px">
                    <Trans id="21zrz46WMXURK9xwdGwBs1-quest">
                      Here is a guide for you to get the White List
                    </Trans>
                  </Box>

                  <Box className="c-font-color c-font-16-22">
                    <MarkdownAndHTML description={reward.description} />
                  </Box>
                </>
              )}

              {!isWhitelist && (
                <>
                  {isNft && reward.nftMetadata?.image && (
                    <Box className="nftImageContainer">
                      <Box className="nftImageWrapper">
                        <Image
                          src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${reward.nftMetadata.image}`}
                          width={334}
                          height={334}
                          alt={t({
                            id: "fBX2KFwtecAW2XgEWnyKJB-quest",
                            message: "Nft image",
                          })}
                        />
                      </Box>
                    </Box>
                  )}

                  <Box width="100%">
                    {modalData.map((item, index) => (
                      <Box
                        className={classNames(
                          "infoItem c-font-color c-font-14-22 c-sm-font-16-22 c-fw-500",
                          {
                            paddingTop:
                              index === 0 && isNft && reward.nftMetadata?.image,
                          },
                        )}
                        key={item.name}
                      >
                        <Box>{item.name}</Box>
                        <Box
                          sx={item.color ? { color: item.color } : {}}
                          className="infoItemData"
                        >
                          {item.data}
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              size="25"
                              className="infoItemIcon"
                            />
                          )}
                          {item.copy && (
                            <CopyToClipboard
                              text={item.fullData || item.data}
                              onCopy={handleCopy}
                            >
                              <Icon
                                name={copied ? "check-mark" : "account-copy"}
                                size="20"
                                className="infoItemIcon copy"
                              />
                            </CopyToClipboard>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default RewardDescriptionPopup;
