import * as React from "react";
import InputUnstyled, { InputUnstyledProps } from "@mui/base/InputUnstyled";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import classNames from "classnames";

import { Icon } from "@components/UI/icon";

import { InputWrapper } from "./inputWithNoChangingText.styles";
import { CSSProperties } from "react";

// @ts-ignore
const StyledInputElement = styled("input")(({ ownerState }) => {
  return {
    backgroundColor: "transparent",
    outline: "none",
    border: "none",
    color: "var(--input-primary-text-color)",
    fontFamily: "var(--font-family-1)",
    fontSize: "16px",
    lineHeight: "22px",
    width: "100%",
    padding: 0,
  };
});

const CustomInputComponent = (
  { clearbtn, isDisabled, notChangingText, ...props }: Props,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  return (
    <div className={props.className}>
      <InputWrapper error={props.error}>
        <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>
          {notChangingText}
        </span>
        <>
          <InputUnstyled
            slots={{
              input: StyledInputElement,
            }}
            slotProps={{
              input: {
                type: props.type,
              },
            }}
            ref={ref}
            disabled={isDisabled}
            {...props}
          />

          {props.value && clearbtn && !isDisabled && (
            <div
              style={{
                position: "absolute",
                top: "0",
                right: "8px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                color: "var(--input-primary-text-color)",
                cursor: "pointer",
              }}
              className={props.classnames?.clear}
            >
              <Icon
                name="menu-close"
                size="24"
                onClick={() => {
                  if (props.onChange) {
                    props.onChange({
                      target: { value: "", name: props.name },
                    } as any);
                  }
                }}
              />
            </div>
          )}
        </>
      </InputWrapper>

      {props.error && props.errortext && (
        <Box
          className={classNames(
            "c-font-14-19 c-font-color-4 error",
            props.classnames?.error || "",
          )}
          component="p"
          mt={0.5}
        >
          {props.errortext}
        </Box>
      )}
    </div>
  );
};

const CustomInput = React.forwardRef(CustomInputComponent);

// @ts-ignore
interface Props extends InputUnstyledProps {
  label?: string;
  errortext?: string;
  name?: string;
  type?: "text" | "number" | "password";
  className: string;
  placeholder: string;
  error?: boolean;
  value?: string;
  onChange?: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  onClick?: (e: any) => void;
  clearbtn?: boolean;
  classnames?: {
    error?: string;
    clear?: string;
  };
  isDisabled?: boolean;
  notChangingText: string;
  style?: CSSProperties;
}

const InputWithNoChangingText = ({
  className,
  label,
  name,
  placeholder,
  value,
  error,
  errortext,
  type,
  clearbtn,
  onChange,
  onFocus,
  onKeyDown,
  onClick,
  onBlur,
  classnames,
  isDisabled,
  notChangingText,
}: Props) => {
  return (
    <CustomInput
      className={className}
      name={name}
      aria-label={label}
      placeholder={placeholder}
      value={value}
      error={error}
      type={type}
      errortext={errortext}
      onChange={onChange}
      clearbtn={clearbtn}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onBlur={onBlur}
      classnames={classnames}
      isDisabled={isDisabled}
      notChangingText={notChangingText}
      style={{
        width: "100%",
      }}
    />
  );
};

InputWithNoChangingText.defaultProps = {
  styles: "primary",
  type: "text",
  clearbtn: true,
} as Partial<Props>;

export default InputWithNoChangingText;
