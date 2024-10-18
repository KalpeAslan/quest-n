import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { Input } from "@/components/UI/input";
import { NumberInput } from "@/components/UI/numberInput";
import { IRewardPlacementItem } from "@/models";
import { CBreakpoints } from "@/styles/variables";
import { Trans } from "@lingui/macro";
import { Box, useMediaQuery } from "@mui/material";
import { ChangeEvent, FC } from "react";

interface Props {
  rewards: IRewardPlacementItem[];
  errors: boolean[];
  onAmountChange: (rewardFieldIndex: number, amountValue: string) => void;
  onEndPlaceChange: (rewardFieldIndex: number, endPlaceValue: string) => void;
  removeByIndex: (rewardFieldIndex: number) => void;
  addReward: () => void;
  removeLastReward: () => void;
}

const TokenInputs: FC<Props> = ({
  rewards,
  errors,
  onAmountChange,
  onEndPlaceChange,
  removeByIndex,
  addReward,
  removeLastReward,
}) => {
  const isMd = useMediaQuery(`(max-width:${CBreakpoints.md}px)`);

  return (
    <>
      <Box className="desktop" display="flex" mb={2}>
        <Box width="136px" mr={2}>
          <Box component="p" className="c-font-16-22 c-fw-500" mb={0.75}>
            <Trans id="mzeZCRcvW7LYdYwR5m9rjA-quest">Amount</Trans>
          </Box>

          {rewards.map((item, index) => (
            <Box key={index} className="c-full-width inputWrapper p">
              <Input
                className="c-full-width"
                value={String(item.amount)}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  onAmountChange(index, e.target.value);
                }}
                clearbtn={false}
              />
            </Box>
          ))}
        </Box>

        <Box width="200px" mr={2}>
          <Box component="p" className="c-font-16-22 c-fw-500" mb={0.75}>
            <Trans id="k7JJjE1M5MGNHs8ik5HRcN-quest">Place from</Trans>
          </Box>

          {rewards.map((_, index, arr) => (
            <Box key={index} className="c-full-width inputWrapper">
              <NumberInput
                key={index}
                className="c-full-width"
                value={String((arr[index - 1]?.endPlace || 0) + 1)}
                onChange={void 0}
                setValue={void 0}
                isDisabled={true}
              />
            </Box>
          ))}
        </Box>

        <Box width="200px" mr={2}>
          <Box component="p" className="c-font-16-22 c-fw-500" mb={0.75}>
            <Trans id="wvtZgcge61j8g35TAwKwcQ-quest">Place to</Trans>
          </Box>

          {rewards.map((item, index, arr) => (
            <Box key={index} className="c-full-width inputWrapper">
              <NumberInput
                key={index}
                className="c-full-width"
                value={String(item.endPlace)}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  onEndPlaceChange(index, e.target.value);
                }}
                setValue={data => {
                  onEndPlaceChange(index, data as string);
                }}
                min={(arr[index - 1]?.endPlace || 0) + 1}
                error={errors[index]}
              />
            </Box>
          ))}
        </Box>

        <Box width="50px" pt="94px">
          {rewards.map((_, index) => (
            <>
              {index === 0 ? null : (
                <Button
                  onClick={() => {
                    removeByIndex(index);
                  }}
                  style="secondary"
                  key={index}
                  className="deleteButton"
                >
                  <Icon name="menu-close" size="24" />
                </Button>
              )}
            </>
          ))}
        </Box>
      </Box>
      <Box className="mobile">
        {rewards.map((item, index, arr) => (
          <Box key={index} mb={2}>
            <Box mb={1}>
              <Box component="p" className="c-font-16-22 c-fw-500" mb={0.75}>
                <Trans id="mzeZCRcvW7LYdYwR5m9rjA-quest">Amount</Trans>
              </Box>

              <Box className="c-full-width inputWrapper p">
                <Input
                  className="c-full-width"
                  value={String(item.amount)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onAmountChange(index, e.target.value);
                  }}
                  clearbtn={false}
                />
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Box className="c-full-width" mr={2}>
                <Box component="p" className="c-font-16-22 c-fw-500" mb={0.75}>
                  <Trans id="k7JJjE1M5MGNHs8ik5HRcN-quest">Place from</Trans>
                </Box>

                <Box className="c-full-width inputWrapper p">
                  <Input
                    className="c-full-width"
                    value={String((arr[index - 1]?.endPlace || 0) + 1)}
                    onChange={void 0}
                    isDisabled={true}
                    clearbtn={false}
                  />
                </Box>
              </Box>

              <Box className="c-full-width">
                <Box component="p" className="c-font-16-22 c-fw-500" mb={0.75}>
                  <Trans id="wvtZgcge61j8g35TAwKwcQ-quest">Place to</Trans>
                </Box>

                <Box key={index} className="c-full-width inputWrapper p">
                  <Input
                    key={index}
                    className="c-full-width"
                    value={String(item.endPlace)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      onEndPlaceChange(index, e.target.value);
                    }}
                    clearbtn={false}
                    error={errors[index]}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Box display="flex">
        <Button
          style="secondary"
          className="deleteMobileButton"
          onClick={removeLastReward}
          disabled={rewards.length === 1}
        >
          <>
            <Icon name="menu-close" size="20" className="btnIcon" />
            <Trans id="43ZbzNzr1iQaYjQMVozLNh-quest">Remove</Trans>
          </>
        </Button>

        <Button
          style="secondary"
          onClick={addReward}
          className="addRewardButton"
        >
          <>
            <Icon name="plus" size="20" className="btnIcon" />
            {isMd ? (
              <Trans id="3454FioGh8NEEZtTyPGvfs-quest">Add</Trans>
            ) : (
              <Trans id="cryRFioGh8NEEZtTyPGLrF-quest">Add Fields</Trans>
            )}
          </>
        </Button>
      </Box>
    </>
  );
};

export default TokenInputs;
