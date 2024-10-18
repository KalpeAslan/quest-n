import * as React from "react";
import InputUnstyled, { InputUnstyledProps } from "@mui/base/InputUnstyled";
import { Box } from "@mui/material";
import classNames from "classnames";
import { FC } from "react";
import { Wrapper } from "./numberInput.styles";
import styled from "@emotion/styled";
import { Button } from "../button";
import { Icon } from "../icon";

// @ts-ignore
const StyledInputElement = styled("input")(({ ownerState }) => {
  return {
    backgroundColor: "transparent",
    outline: "none",
    border: "none",
    color: ownerState.disabled
      ? "rgba(255, 255, 255, 0.3)"
      : "var(--input-primary-text-color)",
    fontFamily: "var(--font-family-1)",
    fontSize: "16px",
    lineHeight: "22px",
    width: "100%",
    textAlign: "center",
  };
});

const CustomInputComponent = (
  { isDisabled, setValue, min, max, inputDisabled, ...props }: Props,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const value = (() => {
    if (props.percentage) {
      return +String(props.value).replace("%", "");
    }
    return props.value;
  })();

  return (
    <div className={props.className}>
      <Wrapper error={props.error}>
        <Button
          style="secondary"
          className="btn"
          disabled={Number(value) <= 0 || Number(value) <= min || isDisabled}
          onClick={() =>
            setValue((!value || isNaN(Number(value)) ? 0 : Number(value)) - 1)
          }
        >
          <Icon name="minus" size="20" />
        </Button>

        <InputUnstyled
          slots={{
            input: StyledInputElement,
          }}
          slotProps={{
            input: {
              type: props.type,
              disabled: isDisabled || inputDisabled,
              className: inputDisabled && "input-primary-text-color",
            },
          }}
          ref={ref}
          disabled={isDisabled || inputDisabled}
          {...props}
        />

        <Button
          style="secondary"
          className="btn"
          onClick={() =>
            setValue((!value || isNaN(Number(value)) ? 0 : Number(value)) + 1)
          }
          disabled={Number(value) >= max || isDisabled}
        >
          <Icon name="plus" size="20" />
        </Button>
      </Wrapper>

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
  type?: "text" | "number";
  className: string;
  placeholder?: string;
  error?: boolean;
  value?: string;
  onChange?: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  onClick?: (e: any) => void;
  classnames?: {
    error?: string;
  };
  isDisabled?: boolean;
  setValue: (data: string | number) => void;
  min?: number;
  max?: number;
  percentage?: boolean;
  inputDisabled?: boolean;
}

const NumberInput: FC<Props> = ({
  className,
  name,
  label,
  placeholder,
  value,
  setValue,
  error,
  type,
  errortext,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onClick,
  classnames,
  isDisabled,
  min,
  max,
  percentage,
  inputDisabled,
}) => {
  return (
    <CustomInput
      className={className}
      name={name}
      aria-label={label}
      placeholder={placeholder}
      value={value}
      setValue={setValue}
      error={error}
      type={type}
      inputDisabled={inputDisabled}
      errortext={errortext}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onBlur={onBlur}
      classnames={classnames}
      isDisabled={isDisabled}
      min={min}
      max={max}
      percentage={percentage}
    />
  );
};

NumberInput.defaultProps = {
  styles: "primary",
} as Partial<Props>;

export default NumberInput;
