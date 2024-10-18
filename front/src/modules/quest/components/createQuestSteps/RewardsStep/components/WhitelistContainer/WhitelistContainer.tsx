import { Box } from "@mui/material";
import { Wrapper } from "./whitelistContainer.styles";
import { ChangeEvent, FC } from "react";
import { Input } from "@/components/UI/input";
import { IWhitelistData } from "@/models";
import { NumberInput } from "@/components/UI/numberInput";
import { Tooltip } from "@/components/UI/tooltip";
import { WYSIWYG } from "@/components/WYSIWYG/WYSIWYG";
import { Trans, t } from "@lingui/macro";

interface Props {
  open: boolean;
  isLuckyDraw: boolean;
  whitelistData: IWhitelistData;
  onWhitelistNameChange: (value: string) => void;
  onWhitelistDescriptionChange: (value: string) => void;
  onWhitelistEndPlaceChange: (value: string) => void;
  isDraft: boolean;
}

const WhitelistContainer: FC<Props> = ({
  open,
  isLuckyDraw,
  whitelistData,
  onWhitelistNameChange,
  onWhitelistDescriptionChange,
  onWhitelistEndPlaceChange,
  isDraft,
}) => {
  return (
    <Wrapper my={2.5} borderRadius="10px" display={open ? "auto" : "none"}>
      <Box mt={2}>
        <Box display="flex" alignItems="center" mb="6px">
          <Box
            component="h3"
            mr="5px"
            className="c-font-color c-fw-500 c-font-16-22"
          >
            <Trans id="hwzbHRT7DSdgMNoB7j4Yvo-quest">Whitelist name</Trans>
          </Box>

          <Tooltip value="Whitelist name tooltip" placement="top" followCursor>
            <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
          </Tooltip>
        </Box>

        <Input
          style={{
            minHeight: 52,
          }}
          className="c-full-width"
          value={whitelistData.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onWhitelistNameChange(e.target.value);
          }}
          clearbtn={false}
          placeholder={"Whitelist Name"}
        />
      </Box>

      <Box mt={2}>
        <Box display="flex" alignItems="center" mb="6px">
          <Box
            component="h3"
            mr="5px"
            className="c-font-color c-fw-500 c-font-16-22"
          >
            <Trans id="qErJfzf6EgVtdMa5EgQFfA-quest">
              Description to claim
            </Trans>
          </Box>

          <Tooltip
            value="Description to claim tooltip"
            placement="top"
            followCursor
          >
            <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
          </Tooltip>
        </Box>

        <WYSIWYG
          minHeight={150}
          placeholder={t({
            id: "dycfCAugBQETTX7uq49gL1-quest",
            message: "Enter Description to claim",
          })}
          name="description"
          value={whitelistData.description || ""}
          onChange={value => onWhitelistDescriptionChange(value)}
          maxLength={1000}
          isDisabled={!isDraft}
        />
      </Box>

      {!isLuckyDraw && (
        <Box>
          <Box height="1px" width="100%" mt={2} mb={2} />

          <Box component="p" className="c-font-20-24 c-fw-500" mb={1}>
            <Trans id="crovBTVktKF8qGQfQRDJ19-quest">
              White List Distribution
            </Trans>
          </Box>

          <Box display="flex" mb={2}>
            <Box width="200px" mr={2}>
              <Box component="p" className="c-font-16-22 c-fw-500" mb={0.75}>
                <Trans id="4xs47wPo6uGBBuckX9LUnk-quest">Place from</Trans>
              </Box>

              <Box className="c-full-width inputWrapper">
                <NumberInput
                  className="c-full-width"
                  value={String(1)}
                  onChange={void 0}
                  setValue={void 0}
                  isDisabled={true}
                />
              </Box>
            </Box>

            <Box width="200px" mr={2}>
              <Box component="p" className="c-font-16-22 c-fw-500" mb={0.75}>
                <Trans id="hSAeWvgBUMPEUnsh5rMqiC-quest">Place to</Trans>
              </Box>

              <Box className="c-full-width inputWrapper">
                <NumberInput
                  className="c-full-width"
                  value={String(whitelistData.endPlace)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onWhitelistEndPlaceChange(e.target.value);
                  }}
                  setValue={data => {
                    onWhitelistEndPlaceChange(data as string);
                  }}
                  error={!!whitelistData.error}
                  errortext={whitelistData.error}
                  min={1}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Wrapper>
  );
};

export default WhitelistContainer;
