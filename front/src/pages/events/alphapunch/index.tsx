import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Button from "@components/UI/button/Button";
import styled from "@emotion/styled";
import { mediaMaxWidth } from "@styles/mixins";
import { CBreakpoints } from "@styles/variables";
import { Theme, useMediaQuery } from "@mui/material";
import classNames from "classnames";
import Boxer2ArtboardD from "@public/images/alphapunch/Boxer2Artboard-1 1.png";
import Boxer2ArtboardM from "@public/images/alphapunch/Boxer2Artboard-1 2.png";
import VisualD from "@public/images/alphapunch/Visual 2.png";
import VisualM from "@public/images/alphapunch/Visual 2_m.png";
import Link from "next/link";
import { t, Trans } from "@lingui/macro";
import { useRef } from "react";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@store/slices/analytics/analytics.thunks";
import { useRouter } from "next/router";

const AlphaPunch: NextPage = () => {
  const isSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.md),
  );

  const ref = useRef<HTMLAnchorElement>(null);

  const scrollToElement = e => {
    e.preventDefault();
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const supportBoxer = t({
    id: "97cd48b0-8cf9-4d1e-8f27-9865a7b86446-alphapunch",
    message: "Support Ukrainian box and our ambassador",
  });

  const boxerName = t({
    id: "eb4b5f57-a360-4270-b540-cb5c47432581-Alphapunch",
    message: "Igor Shevadzutskyi",
  });

  const byUsingAlphaQuest = t({
    id: "eb801816-da8c-4189-81d6-7934dd953a7f-alphapunch",
    message:
      "by using AlphaQuest. Giveaway of 10 animated NFTs and 5 T-shirts with Igor's autograph.",
  });

  const dispatch = useAppDispatch();

  const { push } = useRouter();

  const handleClickSignUp = () => {
    dispatch(
      sendAnalyticsDataThunk({
        type: "signup_screen_tap",
        options: {},
      }),
    );
    push("/sign-up?utm_source=event&utm_medium=cpc&utm_campaign=boxer");
  };

  return (
    <div className="background-other">
      <StyledSection1 className={"c-wrap-4"}>
        {!isSm && (
          <div style={{ position: "relative", width: "100%" }}>
            <Image
              className={"alphapunch-d"}
              width={Boxer2ArtboardD.width}
              height={Boxer2ArtboardD.height}
              src={Boxer2ArtboardD.src}
              alt={"Alphapunch-d"}
              blurDataURL={Boxer2ArtboardD.blurDataURL}
            />
          </div>
        )}
        <StyledColumnItems
          alignItems={"flex-end"}
          style={{ position: "relative" }}
        >
          <div>
            <StyledAlphaPunch
              className={classNames({
                "t-align-right": !isSm,
                "t-align-center": isSm,
              })}
            >
              AlphaPunch
            </StyledAlphaPunch>
            <StyledGiveaway
              className={classNames("c-font-color-3", {
                "t-align-right": !isSm,
                "t-align-center": isSm,
              })}
            >
              Giveaway
            </StyledGiveaway>
          </div>

          {isSm && (
            <Image
              width={Boxer2ArtboardM.width}
              height={Boxer2ArtboardM.height}
              src={Boxer2ArtboardM.src}
              alt={"Alphapunch 3d"}
              blurDataURL={Boxer2ArtboardM.blurDataURL}
            />
          )}

          <p
            style={{ maxWidth: 518 }}
            className={classNames("c-font-24-31 c-font-color my-40", {
              "t-align-right": !isSm,
              "t-align-center": isSm,
            })}
          >
            {`${supportBoxer} `}
            <b className={"c-fw-700"}>{boxerName}</b> {byUsingAlphaQuest}
          </p>
          <a ref={ref} onClick={scrollToElement} className={"smooth"}>
            <Button type="button" style="colorfull">
              <Trans id={"9566818-9ee4-439a-917b-1e7426a1fe3d-alphapunch"}>
                Participate in giveaway
              </Trans>
            </Button>
          </a>
        </StyledColumnItems>
      </StyledSection1>

      <StyledSection2 id={"section2"} className={"c-wrap-4"}>
        <StyledColumnItems alignItems={"flex-start"}>
          <p
            className={classNames("t-align-left c-font-color", {
              "c-font-40-48": !isSm,
              "c-font-32-36": isSm,
            })}
          >
            <Trans id={"e0bf31c-232d-44af-958b-52b6fb549006-alphapunch"}>
              How to participate in giveaway?
            </Trans>
          </p>

          {isSm && (
            <Image
              width={601}
              height={448}
              src={VisualM.src}
              alt={"Alphapunch 3d"}
              blurDataURL={VisualM.blurDataURL}
              style={{ position: "relative", right: 50, pointerEvents: "none" }}
            />
          )}

          <StyledList>
            <li className={"c-font-color c-font-20-26 c-fw-400"}>
              <Link
                href={
                  "/login?utm_source=event&utm_medium=cpc&utm_campaign=boxer"
                }
                passHref
                className={"c-font-color-3"}
              >
                <Trans id={"720a85-bd52-402c-96fb-e638a669a260-alphapunch"}>
                  Login
                </Trans>
              </Link>{" "}
              <Trans id={"301f38bb-0e3f-45ea-9dd2-97af5c785652-alphapunch"}>
                or
              </Trans>{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={handleClickSignUp}
                className={"c-font-color-3"}
              >
                <Trans id={"56094afe-78f9-4f4a-af32-963d3a55e32b-alphapunch"}>
                  Register
                </Trans>
              </span>{" "}
              <Trans id={"86b086fe-d694-4c8e-905e-6a47a87d72c1-alphapunch"}>
                in AlphaGuilty.
              </Trans>
            </li>
            <li className={"c-font-color c-font-20-26 c-fw-400"}>
              <Trans id={"75afe53-bd87-41e2-95dd-7df622b2bcd6-alphapunch"}>
                Go to our
              </Trans>{" "}
              <Link
                href={
                  "/quest?utm_source=event&utm_medium=cpc&utm_campaign=boxer"
                }
                className={"c-font-color-3"}
              >
                <Trans id={"0060f793-bab1-42ce-9ddc-d149483756d8-alphapunch"}>
                  AlphaQuest
                </Trans>
              </Link>
            </li>
            <li className={"c-font-color c-font-20-26 c-fw-400"}>
              <Trans id={"216c0857-295a-4cee-a554-3ca466d4ddab-alphapunch"}>
                Collect 60 points by completing simple tasks till April 30, 2023
              </Trans>
            </li>
            <li className={"c-font-color c-font-20-26 c-fw-400"}>
              <Trans id={"95c4b15c-bc3c-4849-ba79-129e88639894-alphapunch"}>
                Get a chance to win one of 10 animated NFT’s or 5 T-Shirts
                autographed by Igor Shevadzutskyi
              </Trans>
            </li>
          </StyledList>
          <Button
            onClick={handleClickSignUp}
            style={"colorfull"}
            type={"button"}
          >
            <Trans id={"18086c13-6b65-4a11-a045-3623167f92db-alphapunch"}>
              Register Now
            </Trans>
          </Button>
        </StyledColumnItems>
        {!isSm && (
          <Image
            width={601}
            height={448}
            src={VisualD.src}
            blurDataURL={VisualD.blurDataURL}
            alt={"Alphapunch 3d"}
          />
        )}
      </StyledSection2>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Alphapunch Loyalty Event",
      description:
        "Support Ukrainian box and our ambassador Igor Shevadzutskyi by using AlphaQuest. Giveaway of 10 animated NFTs and 5 T-shirts with Igor's autograph.",
      link: "/events/alphapunch",
    },
  };
};

const StyledSection1 = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;

  .alphapunch-d {
    position: absolute;
    left: -100px;
    pointer-events: none;
    z-index: 0;
    ${mediaMaxWidth(1280)({
      left: -250,
    })};
  }

  .smooth {
    scroll-behavior: smooth;
  }

  a {
    text-decoration: none;
  }
`;

const StyledColumnItems = styled.div<{ alignItems: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ alignItems }) => alignItems};
  ${mediaMaxWidth(CBreakpoints.md)({
    alignItems: "center",
    justifyItems: "center",
    width: "100%",
  })}
`;

const StyledAlphaPunch = styled.h2`
  font-family: var(--font-family-1);
  text-shadow: 1px 1px 0 #ffffff, -1px -1px 0 #ffffff, 1px -1px 0 #ffffff,
    -1px 1px 0 #ffffff;
  font-size: 80px;
  line-height: 80px;

  letter-spacing: -0.02em;

  ${mediaMaxWidth(CBreakpoints.md)({
    fontSize: 52,
    lineHeight: "52px",
    fontWeight: 500,
  })}
`;

const StyledGiveaway = styled.h2`
  font-size: 80px;
  line-height: 80px;
  ${mediaMaxWidth(CBreakpoints.md)({
    fontSize: 52,
    lineHeight: "52px",
    fontWeight: 500,
  })}
`;

//Section 2

const StyledSection2 = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  margin-top: 74px;
  padding-bottom: 80px;

  a {
    text-decoration: none;
  }
`;

const StyledList = styled.ul`
  list-style: none;
  max-width: 500px;
  min-width: 307px;
  padding: 0;

  margin: 32px 0;
  ${mediaMaxWidth(CBreakpoints.md)({
    margin: "24px 0",
  })};

  li {
    margin-bottom: 10px;

    &:last-of-type {
      margin-bottom: 0;
    }

    &::before {
      content: "\\2022";
      color: var(--color-gr2);
      font-weight: bold;
      display: inline-block;
      width: 1em;
    }
  }
`;

const StyledImage1 = styled(Image)`
  position: relative;
  ${mediaMaxWidth(CBreakpoints.tablet)({
    right: 140,
  })}
`;

export default AlphaPunch;
