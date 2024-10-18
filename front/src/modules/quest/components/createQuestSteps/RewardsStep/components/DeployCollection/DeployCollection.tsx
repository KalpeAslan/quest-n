import { Box } from "@mui/material";
import { Wrapper } from "./deployCollection.styles";
import { Icon } from "@/components/UI/icon";
import { Tooltip } from "@/components/UI/tooltip";
import { Dispatch, FC, SetStateAction, useMemo } from "react";
import { Input } from "@/components/UI/input";
import { Selector } from "@/components/UI/selector";
import classNames from "classnames";
import { Button } from "@/components/UI/button";
import { LogoLoader } from "@/components/logoLoader";
import { Trans, t } from "@lingui/macro";
import { CHAIN_OPTIONS_FOR_ONCHAIN, IContract } from "@/models";
import { ImageInput } from "@/components/UI/imageInput";
import { useDeployNftCollection } from "@/modules/quest/hooks/useDeployNftCollection";
import { ConnectWalletPopup } from "@/components/ConnectWalletPopup";
import { DeployCollectionSuccessPopup } from "../DeployCollectionSuccessPopup";

interface Props {
  getNftCollections: () => Promise<void>;
  nftCollections: IContract[];
  setChosenCollection: (value: number) => void;
  setIsCreateNftFlow: Dispatch<SetStateAction<boolean>>;
}

const DeployCollection: FC<Props> = ({
  getNftCollections,
  nftCollections,
  setChosenCollection,
  setIsCreateNftFlow,
}) => {
  const {
    formik,
    promptOpen,
    setPromptOpen,
    acceptedFile,
    setAcceptedFile,
    removeLogo,
    isLogoHovered,
    setIsLogoHovered,
    onBlur,
    getError,
    setTransferable,
    transferable,
    isDisabled,
    isLoading,
    buttonName,
    isWalletPopupOpen,
    chainToConnect,
    setIsWalletPopupOpen,
    needConnect,
    needSwitchChain,
    popupData,
    setPopupData,
    onContinue,
  } = useDeployNftCollection({
    getNftCollections,
    setChosenCollection,
    setIsCreateNftFlow,
  });

  const collectionImageInput = useMemo(
    () => (
      <ImageInput
        className="logoInput"
        label={t({
          id: "8xeZtdfUyEU2BAcp1NRN8R-quest",
          message: "NFT Collection Logo",
        })}
        dropzoneText={t({
          id: "veMSq6n4ae8HtnbvKBYVdo-quest",
          message: "Upload Image",
        })}
        helperText={t({
          id: "ppCyDwDoDmZecrABYsdpTc-quest",
          message:
            "Image should be square, at least 600×600, and JPG, PNG or GIF format.",
        })}
        logoTooltip={t({
          id: "6iPh1KLVqE5oEjPNX1jCgQ-quest",
          message: "NFT Collection Logo tooltip",
        })}
        acceptedFile={acceptedFile}
        setAcceptedFile={setAcceptedFile}
        removeLogo={removeLogo}
        isLogoHovered={isLogoHovered}
        setIsLogoHovered={setIsLogoHovered}
      />
    ),
    [
      acceptedFile,
      isLogoHovered,
      removeLogo,
      setAcceptedFile,
      setIsLogoHovered,
    ],
  );

  return (
    <>
      <Wrapper onSubmit={formik.handleSubmit}>
        {promptOpen && (
          <Box className="prompt">
            <Box display="flex" alignItems="center">
              <Tooltip
                value={t({
                  id: "48L9b4Ge7wkK5bvJnWmTRA-quest",
                  message: "What an NFT collection is tooltip",
                })}
                placement="top"
                followCursor
              >
                <Icon
                  name="info"
                  size="20"
                  className="promptIcon c-font-color"
                />
              </Tooltip>
              <Trans id="eNo8Dk2A3cqYfW48VGBDoM-quest">
                What an NFT collection is?
              </Trans>
            </Box>

            <Icon
              name="menu-close"
              size="15"
              className="closePrompt c-font-color"
              onClick={() => setPromptOpen(false)}
            />
          </Box>
        )}

        <Box className="inputsContainer">
          {collectionImageInput}

          <Box className="textInputs">
            {Boolean(nftCollections.length) && (
              <Box mb={2}>
                <Box display="flex" alignItems="center" mb="6px">
                  <Box
                    component="h3"
                    mr="5px"
                    className="c-font-color c-fw-500 c-font-16-22"
                  >
                    <Trans id="g3C9XsFWrVgfnwC3X5SkAa-quest">Collection</Trans>
                  </Box>

                  <Tooltip
                    value={"Collection tooltip"}
                    placement="top"
                    followCursor
                  >
                    <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
                  </Tooltip>
                </Box>

                <Selector
                  className="c-full-width input"
                  options={[
                    ...nftCollections.map(item => ({
                      title: item.name,
                      value: item.id,
                      image: item.logo,
                    })),
                    {
                      title: t({
                        id: "tVww3LyBAsUKhjLcWE4j2W-quest",
                        message: "Deploy new NFT Contract",
                      }),
                      value: "new",
                      icon: "plus",
                      iconColor: "#87F696",
                    },
                  ]}
                  value="new"
                  onSelect={data => {
                    if (data === "new" || typeof data === "string") return;
                    setChosenCollection(data);
                    setIsCreateNftFlow(true);
                  }}
                />
              </Box>
            )}

            <Box mb={2}>
              <Box display="flex" alignItems="center" mb="6px">
                <Box
                  component="h3"
                  mr="5px"
                  className="c-font-color c-fw-500 c-font-16-22"
                >
                  <Trans id="taXtf3NDkwnpg6wfNv764Z-quest">
                    NFT Collection Name
                  </Trans>
                </Box>

                <Tooltip
                  value={t({
                    id: "6PVBwUe4y1wqVHC2nfPgvf-quest",
                    message: "NFT Collection Name tooltip",
                  })}
                  placement="top"
                  followCursor
                >
                  <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
                </Tooltip>
              </Box>

              <Input
                className="c-full-width input"
                placeholder={t({
                  id: "9MJUJiBXMKGkrkgXDptqZA-quest",
                  message: "Enter NFT Collection Name",
                })}
                name="name"
                value={formik.values.name}
                onBlur={onBlur}
                onChange={formik.handleChange}
                error={getError("name").error}
                errortext={getError("name").errorText}
                classnames={{ error: "error" }}
              />
            </Box>

            <Box mb={2}>
              <Box display="flex" alignItems="center" mb="6px">
                <Box
                  component="h3"
                  mr="5px"
                  className="c-font-color c-fw-500 c-font-16-22"
                >
                  <Trans id="jNQdn9XqbKYCDiBohQXpQd-quest">
                    NFT Collection Symbol
                  </Trans>
                </Box>

                <Tooltip
                  value={t({
                    id: "rwYLREXxueE7SawbCTvCZi-quest",
                    message: "NFT Collection Symbol tooltip",
                  })}
                  placement="top"
                  followCursor
                >
                  <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
                </Tooltip>
              </Box>

              <Input
                className="c-full-width input"
                placeholder={t({
                  id: "ceGZQS7uyjQDcMJgZcbPfe-quest",
                  message: "Enter NFT Collection Symbol",
                })}
                name="symbol"
                value={formik.values.symbol}
                onBlur={onBlur}
                onChange={formik.handleChange}
                error={getError("symbol").error}
                errortext={getError("symbol").errorText}
                classnames={{ error: "error" }}
              />
            </Box>

            <Box mb="25px">
              <Box display="flex" alignItems="center" mb="6px">
                <Box
                  component="h3"
                  mr="5px"
                  className="c-font-color c-fw-500 c-font-16-22"
                >
                  <Trans id="xhNqiVELervy1cBem1Xjzc-quest">Blockchain</Trans>
                </Box>

                <Tooltip
                  value={t({
                    id: "cLCAw1nmYfXyJDE6GTh2bH-quest",
                    message: "Blockchain tooltip",
                  })}
                  placement="top"
                  followCursor
                >
                  <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
                </Tooltip>
              </Box>

              <Selector
                className="c-full-width input"
                options={CHAIN_OPTIONS_FOR_ONCHAIN}
                value={formik.values.chainId}
                onSelect={data => formik.setFieldValue("chainId", data)}
              />
            </Box>

            <Box
              display="flex"
              alignItems="center"
              className="c-font-color c-fw-500 c-font-16-22"
              mb="25px"
            >
              <Box
                className="selectorContainer"
                mr="10px"
                onClick={() => setTransferable(prev => !prev)}
              >
                <Box
                  className={classNames("selector", { checked: transferable })}
                />
              </Box>
              <Trans id="2vNhmGUQ4ZSaRmpUQ8v1LW-quest">Transferable</Trans>
            </Box>

            <Button
              style="secondary"
              type="submit"
              className={classNames("submitButton", {
                disabledButton: isDisabled && !isLoading,
              })}
              disabled={isDisabled || isLoading}
            >
              <>
                {isLoading && (
                  <LogoLoader
                    className="buttonLoader"
                    disableLogo
                    loaderSize={20}
                  />
                )}

                {buttonName}
              </>
            </Button>
          </Box>
        </Box>
      </Wrapper>
      <ConnectWalletPopup
        isOpen={isWalletPopupOpen && (needConnect || needSwitchChain)}
        handleClose={() => setIsWalletPopupOpen(false)}
        chainToConnect={chainToConnect}
        needConnect={needConnect}
        needSwitchChain={needSwitchChain}
        actionName={t({
          id: "gTyoj1n6pMAVk1bSo6P97x-quest",
          message: "deploy NFT",
        })}
      />

      <DeployCollectionSuccessPopup
        popupData={popupData}
        setPopupData={setPopupData}
        onContinue={onContinue}
      />
    </>
  );
};

export default DeployCollection;
