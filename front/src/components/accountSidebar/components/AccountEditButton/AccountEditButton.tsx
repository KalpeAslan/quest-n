import { AccountEditButtonStylesWrapper } from "@components/accountSidebar/components/AccountEditButton/AccountEditButton.styles";
import { useMemo } from "react";
import { appConfig } from "@/app.config";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { Icon } from "@components/UI/icon";
import Image from "next/image";
import Username from "../../../../modules/account/components/settings/components/personalInfo/components/username/Username";
import { useBoolean } from "@hooks/useBoolean";

export const AccountEditButton = () => {
  const accountInfo = useTypedSelector(getAccountInfo);

  const avatar: string = useMemo(() => {
    if (accountInfo?.currentLevel?.image) {
      return `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${accountInfo.currentLevel.image}`;
    }

    return "";
  }, [accountInfo]);
  const { value: openEditNickName, setTrue, setFalse } = useBoolean();

  return (
    <AccountEditButtonStylesWrapper>
      <div className={"c-flex-items-center"}>
        <div className={"avatar-wrapper"}>
          {avatar ? (
            <Image
              src={avatar}
              fill
              alt={""}
              style={{ borderRadius: "100%" }}
            />
          ) : (
            <Icon
              className={"header__md__avatar"}
              name="account-user"
              size="35"
            />
          )}
        </div>

        <p className={"c-font-14-20 c-font-color c-fw-500"}>
          {accountInfo && accountInfo.username}
        </p>
      </div>

      <div onClick={setTrue} className={"pencil-button"}>
        <Icon name={"pencil"} size={"14"} />
      </div>
      <Username onClose={setFalse} open={openEditNickName} />
    </AccountEditButtonStylesWrapper>
  );
};
