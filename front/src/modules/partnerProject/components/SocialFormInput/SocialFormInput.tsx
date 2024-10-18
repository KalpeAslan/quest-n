import { FC, useMemo } from "react";
import {
  SocialFormInputStyles,
  SocialFormStylesContainer,
  SocialFormInputStylesWrapper,
} from "@modules/partnerProject/components/SocialFormInput/SocialFormInput.styles";
import Icon from "@components/UI/icon/Icon";
import Button from "@components/UI/button/Button";

interface IProps {
  value: string;
  iconName: string;
  onClose: () => void;
}

export const PartnerProjectSocialFormInput: FC<IProps> = ({
  value,
  iconName,
  onClose,
}) => {
  const parsedValue = useMemo(() => {
    const extractId = (url: string) => {
      const urlParts = url.split("/");
      return urlParts[urlParts.length - 1];
    };
    return value ? `@${extractId(value)}` : value;
  }, [value]);

  return (
    <SocialFormInputStylesWrapper
      className={"c-full-width c-flex-items-center"}
    >
      <SocialFormStylesContainer
        iconName={iconName}
        className={"c-flex-center c-flex-items-center"}
      >
        <span className={"partner-project-social-form-input__icon"}>
          <Icon name={iconName} size="24" />
        </span>

        <SocialFormInputStyles className={"c-font-16-22"}>
          {parsedValue}
        </SocialFormInputStyles>
      </SocialFormStylesContainer>
      <Button
        className={"partner-project-social-form-input__close-button"}
        type={"button"}
        style={"secondary"}
        size={"extraSmall"}
        onClick={onClose}
      >
        <Icon name={"menu-close"} size="24" />
      </Button>
    </SocialFormInputStylesWrapper>
  );
};
