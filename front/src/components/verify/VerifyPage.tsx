import { Box, Grid, Theme } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import { VerifyAmbassadorForm } from "@components/verify/VerifyAmbassadorForm/VerifyAmbassadorForm";
import styled from "@emotion/styled";
import { CBreakpoints } from "@styles/variables";
import { ForLargeContainer } from "@components/Containers/ForLargeContainer";

export const VerifyPage = () => {
  return (
    <ForLargeContainer>
      <StyledWrapper>
        <Box
          width={"100%"}
          alignItems={"start"}
          sx={(theme: Theme) => ({
            [theme.breakpoints.down(CBreakpoints.tablet)]: {
              flexDirection: "column",
            },
          })}
          className={"c-flex items-justified-space-between"}
        >
          <Box maxWidth={540}>
            <Box
              component={"h1"}
              fontSize={56}
              className={"c-font-color title"}
            >
              <Trans id={"jsdhfsdjk-weufghvb-quest"}>
                Collab Manager Verification Center
              </Trans>
            </Box>
            <div className={"description"}>
              <p className={"c-font-color"}>
                {
                  "To ensure you're interacting with an authentic AlphaGuilty Ambassador, use our verification center."
                }
              </p>
              <p className={"c-font-color"}>
                {
                  "Avoid scams and unauthorized representatives by confirming the legitimacy of the ambassador's details."
                }
              </p>
            </div>
          </Box>
          <VerifyAmbassadorForm />
        </Box>
        <Box className={"inner-wrapper"} mt={13}>
          <p
            className={"c-font-32-36 c-font-color"}
            style={{ marginBottom: 32, fontWeight: 500 }}
          >
            {t({
              message: "Instructions",
              id: "dfjvbjkbv-qwiqojnvasv-sdgn-quest",
            })}
          </p>
          <Grid spacing={1} container color={"white"}>
            {introductionItems.map(
              ({ title, subTitle, md, description, lg, sm, xs }, index) => (
                <Grid item key={index} md={md} lg={lg} xs={xs} sm={sm}>
                  <StyledIntroductionItem index={index + 1}>
                    <p className={"c-font-20-26"} style={{ fontWeight: 500 }}>
                      {title}
                    </p>
                    {description && (
                      <p className={"c-font-16-22"} style={{ fontWeight: 400 }}>
                        {description}
                      </p>
                    )}
                    {subTitle && (
                      <a
                        style={{ marginTop: 10 }}
                        href={subTitle}
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        {subTitle}
                      </a>
                    )}
                  </StyledIntroductionItem>
                </Grid>
              ),
            )}
          </Grid>
        </Box>
      </StyledWrapper>
    </ForLargeContainer>
  );
};

const introductionItems = [
  {
    title: t({
      message: "Make sure you are on the official AlphaGuilty platform:",
      id: "cnvbnvsb-qwfANVJ-quest",
    }),
    subTitle: "https://alphaguilty.io",
    md: 4,
    lg: 4,
    sm: 4,
    xs: 12,
  },
  {
    title: t({
      message: "Enter the details ",
      id: "c2nvbnvsb-qwfANVJ-quest",
    }),
    description: t({
      message:
        "Which you received from the individual claiming to be an AlphaGuilty Ambassador. This can be a Telegram ID, Twitter handle.",
      id: "dbcvmxcv-qwijdn-quest",
    }),
    md: 8,
    lg: 8,
    sm: 8,
    xs: 12,
  },
  //
  {
    title: t({
      message: "Click on the Verify button ",
      id: "1c2nvbnvsb-qwfANVJ-quest",
    }),
    description: t({
      message: "To check if the details match with our official records.",
      id: "1dbcvmxcv-qwijdn-quest",
    }),
    md: 6,
    lg: 4,
    sm: 6,
    xs: 12,
  },
  {
    title: t({
      message: "The verification is case-sensitive. ",
      id: "1casd2nvbnvsb-qwfANVJ-quest",
    }),
    description: t({
      message: "Please enter the exact details you've received. ",
      id: "123fdbcvmxcv-qwijdn-quest",
    }),
    md: 6,
    lg: 4,
    sm: 6,
    xs: 12,
  },
  {
    title: t({
      message: "Avoid sharing any personal information",
      id: "casn82nvbnvsb-qwfANVJ-quest",
    }),
    description: t({
      message: "Unless you've verified the authenticity of the ambassador.",
      id: "24vdbcvmxcv-qwijdn-quest",
    }),
    md: 6,
    lg: 4,
    sm: 6,
    xs: 12,
  },
];

const StyledIntroductionItem = styled.div<{ index: number }>`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #161c1c;
  border-radius: 16px;
  height: 150px;
  position: relative;
  * {
    position: relative;
    z-index: 2;
  }
  &::after {
    content: "${({ index }) => index}";
    position: absolute;
    right: 20px;
    top: 0;
    font-size: 100px;
    color: #1d2f26;
    z-index: 1;
  }

  a {
    color: var(--color-gr2);
  }
`;

const StyledWrapper = styled.div`
  padding: 80px;
  .title {
    position: relative;
    z-index: 2;
    &::after {
      content: "";
      position: absolute;
      z-index: 1;
      background: url("/images/verify/verify_target-line.svg") no-repeat;
      transform: scale(1.09);
      right: 0;
      left: -25px;
      height: 100%;
      top: 0;
    }
  }

  .description {
    margin-top: 21px;
  }

  @media screen and (max-width: ${CBreakpoints.lg}px) {
    padding: 25px 25px 80px 25px;
    .title::after {
      left: 5px;
      top: -8px;
    }

    .description {
      margin-top: 30px;
    }
  }

  @media screen and (max-width: ${CBreakpoints.md}px) {
    padding-top: 72px;
    .title {
      &::after {
        left: -26px;
        top: -22px;
      }
    }
  }

  @media screen and (max-width: ${CBreakpoints.sm}px) {
    .title {
      font-size: 40px;
      &::after {
        top: 0;
        left: 0;
        background: url("/images/verify/verify_target-line_mb.svg") no-repeat;
        transform: scale(1.1);
      }
    }
  }
`;
