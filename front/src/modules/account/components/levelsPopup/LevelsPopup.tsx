import { Modal } from "@/components/UI/modal";
import { Wrapper, Gradient, Header } from "./levelsPopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { FC, useCallback } from "react";
import { LevelExp } from "../../models";
import Image from "next/image";
import { appConfig } from "@/app.config";
import { Trans } from "@lingui/macro";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  levels: LevelExp[];
}

const LevelsPopup: FC<Props> = ({ isOpen, setIsOpen, levels }) => {
  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Box overflow={"hidden"} borderRadius={"16px 16px 0 0"}>
            <Gradient />
            <Header className="c-font-color c-font-20-24 c-sm-font-24-24 c-fw-500">
              <Trans id="5eBgW1z4F23BxttsgVix3n-levelsPopup">
                Milestones & Benefits
              </Trans>
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={handleClose}
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Header>
            <Wrapper className="c-font-color">
              <Box className="content">
                {levels.map(item => (
                  <Box key={item.id} className="item">
                    <Box className="leftWrapper">
                      <Box className="imageWrapper">
                        <Image
                          src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${item.image}`}
                          width={65}
                          height={65}
                          alt={item.name}
                        />
                      </Box>

                      <Box>
                        <Box
                          className="c-font-18-18 c-sm-font-20-20 c-fw-500"
                          mb="12px"
                        >
                          {item.name.split(": ")[0]}:{" "}
                          <Box component="span" className="c-font-color-3">
                            {item.name.split(": ")[1]}
                          </Box>
                        </Box>

                        <Box className="desktop">
                          {item.benefits.map(benefitItem => (
                            <Box
                              key={benefitItem}
                              className="c-font-18-24 benefitItem"
                            >
                              <Icon
                                name="star"
                                size="14"
                                className="c-font-color-3"
                              />
                              {benefitItem}
                            </Box>
                          ))}
                        </Box>

                        <Box className="c-font-color-3 c-font-20-20 c-fw-500 pointsWrapper mobile">
                          {item.pointsFrom === 1 ? (
                            <>&gt;{item.pointsTo}</>
                          ) : (
                            <>&ge;{item.pointsFrom}</>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <Box className="c-font-color-3 c-font-20-20 c-fw-500 pointsWrapper desktop">
                      {item.pointsFrom === 1 ? (
                        <>&gt;{item.pointsTo}</>
                      ) : (
                        <>&ge;{item.pointsFrom}</>
                      )}
                    </Box>

                    <Box className="mobile">
                      {item.benefits.map(benefitItem => (
                        <Box
                          key={benefitItem}
                          className="c-font-18-24 benefitItem"
                        >
                          <Icon
                            name="star"
                            size="14"
                            className="c-font-color-3"
                          />
                          {benefitItem}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Wrapper>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default LevelsPopup;
