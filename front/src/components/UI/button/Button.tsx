import { ElementType, ReactElement } from "react";
import { CircularProgress } from "@mui/material";

import { IButtonType } from "@models";
import { useRouter } from "next/router";
import classnames from "classnames";
import { ButtonStyled } from "./button.styles";

type Props = {
  id?: string;
  className?: string;
  children?: ReactElement | string;
  loading?: boolean;
  size?: "extraSmall" | "small" | "medium" | "task";
  type?: "button" | "submit";
  style: IButtonType;
  disabled?: boolean;
  href?: string;
  target?: "_blank" | "_self";
  onClick?: (any?: any) => void;
  connect?: any;
  disableTouchStart?: boolean;
  as?: ElementType;
  htmlFor?: string;
};

const Button = ({
  id,
  className,
  children,
  loading,
  size,
  type,
  style,
  href,
  disabled,
  target,
  onClick,
  connect,
  as,
  disableTouchStart,
  ...otherProps
}: Props) => {
  const { push } = useRouter();

  return href ? (
    <ButtonStyled
      id={id}
      className={classnames(className, { disabled: disabled })}
      //@ts-ignore
      target={target}
      type={type || "button"}
      size={size || "medium"}
      btnStyle={style}
      onClick={e => {
        if (disabled) {
          return;
        }

        if (target === "_self") {
          push(href);
        }

        if (target === "_blank") {
          window.open(`${href}`);
        }

        if (onClick) {
          onClick(e);
        }
      }}
      as={"div"}
      disabled={disabled}
      {...otherProps}
    >
      {loading ? (
        <p className="loadtrt">
          <CircularProgress size={16} color="inherit" />
        </p>
      ) : (
        children
      )}
    </ButtonStyled>
  ) : (
    <ButtonStyled
      id={id}
      as={as}
      className={classnames(className, { disabled: disabled })}
      //@ts-ignore
      target={target}
      type={type || "button"}
      size={size || "medium"}
      btnStyle={style}
      onClick={e => {
        if (disabled) {
          return;
        }

        if (onClick) {
          onClick(e);
        }
      }}
      disabled={disabled}
      {...otherProps}
    >
      {loading ? (
        <p className="loadtrt">
          <CircularProgress size={16} color="inherit" />
        </p>
      ) : (
        children
      )}
    </ButtonStyled>
  );
};

export default Button;
