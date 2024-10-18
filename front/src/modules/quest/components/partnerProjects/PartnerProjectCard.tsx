import { PartnerProjectAdmin, QuestStatus } from "@modules/quest/models";
import { PartnerProjectCardStyles } from "@modules/quest/components/partnerProjects/partnerProjectCard.styles";
import Image from "next/image";
import { appConfig } from "@/app.config";
import { Icon } from "@components/UI/icon";
import { t, Trans } from "@lingui/macro";
import { Button } from "@components/UI/button";
import { FC } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

interface IProps {
  data: PartnerProjectAdmin;
}
export const PartnerProjectCard: FC<IProps> = ({
  data: { logo, quests, name, verificationIcon, linkTitle, isDelegated },
}: IProps) => {
  const { active, soon, expired, draft, completed } = (quests || []).reduce(
    (acc, item) => {
      if (item.questStatus === QuestStatus.Soon) acc.soon += 1;
      else if (item.questStatus === QuestStatus.Completed) acc.expired += 1;
      else if (item.questStatus === QuestStatus.Draft) acc.draft += 1;
      else acc.active += 1;

      return acc;
    },
    {
      active: 0,
      expired: 0,
      soon: 0,
      draft: 0,
      completed: 0,
    },
  );

  const { push } = useRouter();

  return (
    <PartnerProjectCardStyles.Wrapper
      className={"partner-project-card"}
      delegated={isDelegated}
    >
      <div className={"partner-project-card__header"}>
        <div>
          <Image
            style={{ borderRadius: "50%" }}
            width={50}
            height={50}
            src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${logo}`}
            alt={name}
          />
          {verificationIcon && (
            <Icon
              className="icon"
              name={"quest-check-mark"}
              size="20"
              style={{ position: "absolute", bottom: 0, right: 0 }}
            />
          )}
        </div>
        <p className={"c-font-color c-fw-500 c-font-20-22"}>{name}</p>
      </div>
      {isDelegated && (
        <span
          className={
            "partner-project-card__delegated c-font-color-11 c-fw-500 c-font-14-14"
          }
        >
          <Trans id={"745jhdvb-fvdjkb347vshjbo-dfb"}>DELEGATED</Trans>
        </span>
      )}
      <div>
        <p className={"c-font-color-3 c-fw-500 c-font-16-22"}>
          <Trans id={"sjkdvj-23lndjf-wnksjdv"}>{`${
            quests ? quests.length : 0
          } Quests Total`}</Trans>
        </p>

        <Box
          mt={1}
          component={"p"}
          className={"c-font-color c-font-14-18 c-sm-font-16-22 c-fw-400"}
        >
          <Trans id={"bdfb-53geuinvkvw-vdfkdb723knvf_lksdsdfsdfj"}>
            {`${active} Active | ${soon} Soon | ${expired} Expired | ${draft} Draft | ${completed} Completed`}
          </Trans>
        </Box>
      </div>

      <div className={"partner-project-card__footer"}>
        <Button
          onClick={() => push(`/admin/project/${linkTitle}/quest/create/init`)}
          style={"colorfull"}
        >
          {t({
            id: "k4eotAW9eX5WpEFPWvasdWTY6-quest",
            message: "Create a new Quest",
          })}
        </Button>

        <Button
          onClick={() => push(`/admin/project/${linkTitle}/quests`)}
          style={"secondary"}
        >
          <Trans id={"2hire7fdvjknv-fjsdf23ke7v"}>Profile & Quests</Trans>
        </Button>
      </div>
    </PartnerProjectCardStyles.Wrapper>
  );
};
