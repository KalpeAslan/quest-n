import { ImageInput } from "@/components/UI/imageInput";
import { Wrapper } from "./createNftBlock.styles";
import {
  ChangeEvent,
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Box } from "@mui/material";
import { Selector } from "@/components/UI/selector";
import { Tooltip } from "@/components/UI/tooltip";
import { ERewardTabs, IContract } from "@/models";
import { Input } from "@/components/UI/input";
import { Trans, t } from "@lingui/macro";

interface Props {
  nftCollections: IContract[];
  setIsCreateNftFlow: Dispatch<SetStateAction<boolean>>;
  isLuckyDraw: boolean;
  nameError: string;
  contractId: number;
  image: File | string | null;
  name: string;
  luckyDrawAmount: number;
  activeTab: ERewardTabs;
  onLuckyDrawAmountChange: (value: string) => void;
  setContractId: (value: number) => void;
  setImage: (value: File | null) => void;
  onNameChange: (value: string) => void;
}

const CreateNftBlock: FC<Props> = ({
  nftCollections,
  setIsCreateNftFlow,
  isLuckyDraw,
  luckyDrawAmount,
  onLuckyDrawAmountChange,
  nameError,
  contractId,
  setContractId,
  image,
  setImage,
  name,
  onNameChange,
  activeTab,
}) => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const acceptedFile = useMemo(() => image || null, [image]);

  const setAcceptedFile = useCallback(
    (file: File | null) => setImage(file),
    [setImage],
  );

  const removeLogo = useCallback(
    (e?: MouseEvent<HTMLDivElement>) => {
      if (e) {
        e.stopPropagation();
      }
      setAcceptedFile(null);
      setIsLogoHovered(false);
    },
    [setAcceptedFile],
  );

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onNameChange(e.target.value);
    },
    [onNameChange],
  );

  useEffect(() => {
    if (activeTab === ERewardTabs.NFT && !contractId) {
      setContractId(nftCollections[0]?.id);
    }
  }, [setContractId, nftCollections, activeTab, contractId]);

  const nftImageInput = useMemo(
    () => (
      <ImageInput
        className="logoInput"
        label={t({
          id: "ibDB2fbwtktSv2iV8pA9qw-nreateNftBlock",
          message: "NFT Image",
        })}
        dropzoneText={t({
          id: "fSLKJunphNueEDzDWmE2VY-nreateNftBlock",
          message: "Upload Image",
        })}
        helperText={t({
          id: "fVyciXX4dbQ2BLMrYBByB4-nreateNftBlock",
          message:
            "Image should be square, at least 600×600, and JPG, PNG or GIF format.",
        })}
        logoTooltip={t({
          id: "pyWUyZbvGLkgktYK7CBvax-nreateNftBlock",
          message: "NFT Image Logo tooltip",
        })}
        acceptedFile={acceptedFile}
        setAcceptedFile={setAcceptedFile}
        removeLogo={removeLogo}
        isLogoHovered={isLogoHovered}
        setIsLogoHovered={setIsLogoHovered}
      />
    ),
    [acceptedFile, isLogoHovered, removeLogo, setAcceptedFile],
  );

  return (
    <Wrapper>
      {nftImageInput}

      <Box className="textInputs">
        <Box mb={2}>
          <Box display="flex" alignItems="center" mb="6px">
            <Box
              component="h3"
              mr="5px"
              className="c-font-color c-fw-500 c-font-16-22"
            >
              <Trans id="3nCmLBwAejqvF7WJ9m6Cci-nreateNftBlock">
                Collection
              </Trans>
            </Box>

            <Tooltip value={"Collection tooltip"} placement="top" followCursor>
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
                title: "Deploy new NFT Contract",
                value: "new",
                icon: "plus",
                iconColor: "#87F696",
              },
            ]}
            value={contractId || nftCollections[0]?.id}
            onSelect={data => {
              if (data === "new") {
                setIsCreateNftFlow(false);
                return;
              }
              if (typeof data === "string") return;
              setContractId(data as number);
              setIsCreateNftFlow(true);
            }}
          />
        </Box>

        <Box mb={2}>
          <Box display="flex" alignItems="center" mb="6px">
            <Box
              component="h3"
              mr="5px"
              className="c-font-color c-fw-500 c-font-16-22"
            >
              <Trans id="6Yma9MZ6WZMWuxKRuNYe8d-nreateNftBlock">NFT Name</Trans>
            </Box>

            <Tooltip value={"NFT Name tooltip"} placement="top" followCursor>
              <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
            </Tooltip>
          </Box>

          <Input
            className="c-full-width input"
            placeholder={t({
              id: "1prBZHiGUihyHf6EPDNzMe-nreateNftBlock",
              message: "Enter NFT Name",
            })}
            name="name"
            value={name || ""}
            onChange={handleNameChange}
            error={Boolean(nameError)}
            errortext={nameError}
            classnames={{ error: "error" }}
          />
        </Box>

        {isLuckyDraw && (
          <Box>
            <Box display="flex" alignItems="center" mb="6px">
              <Box
                component="h3"
                mr="5px"
                className="c-font-color c-fw-500 c-font-16-22"
              >
                <Trans id="mWXMckLbrLhGhioVBCc2xq-nreateNftBlock">Amount</Trans>
              </Box>

              <Tooltip
                value={t({
                  id: "wKQhtaxC4QiAW1V8CECnLr-nreateNftBlock",
                  message: "NFT Amount tooltip",
                })}
                placement="top"
                followCursor
              >
                <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
              </Tooltip>
            </Box>

            <Input
              className="c-full-width input"
              value={String(luckyDrawAmount)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onLuckyDrawAmountChange(e.target.value);
              }}
              clearbtn={false}
            />
          </Box>
        )}
      </Box>
    </Wrapper>
  );
};

export default CreateNftBlock;
