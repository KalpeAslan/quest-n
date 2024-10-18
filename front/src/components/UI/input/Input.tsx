import * as React from "react";
import InputUnstyled, { InputUnstyledProps } from "@mui/base/InputUnstyled";
import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import classNames from "classnames";

import { Icon } from "@components/UI/icon";

import { IInputType, InputTypes } from "@models";
import { CSSProperties } from "react";

// @ts-ignore
const StyledInputElement = styled("input")(({ ownerState }) => {
  return ownerState.slotProps.input.password
    ? {
        ...InputTypes[ownerState.styles],
        paddingRight: "60px",
      }
    : {
        ...InputTypes[ownerState.styles],
      };
});

// @ts-ignore
const StyledTextareaElement = styled("textarea")(({ ownerState }) => {
  return ownerState.slotProps.input.password
    ? {
        ...InputTypes[ownerState.styles],
        resize: "none",
        paddingRight: "60px",
      }
    : {
        ...InputTypes[ownerState.styles],
        resize: "none",
      };
});

const CustomInputComponent = (
  { clearbtn, password, isDisabled, ...props }: Props,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const [showPass, setShowPass] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <InputWrapper className={props.className}>
      {props["aria-label"] && (
        <Box
          className="c-font-14-20 c-letter-spacing-3 c-font-color-2"
          component="p"
          mb={0.5}
        >
          {props["aria-label"]}
        </Box>
      )}

      <div
        style={{
          position: "relative",
        }}
      >
        <>
          <InputUnstyled
            slots={{
              input: StyledInputElement,
              textarea: StyledTextareaElement,
            }}
            slotProps={{
              input: {
                ref: inputRef,
                // @ts-ignore
                password,
                type: password ? (showPass ? "text" : "password") : props.type,
                style: props.style,
              },
              textarea: {
                // @ts-ignore
                password,
                type: password ? (showPass ? "text" : "password") : props.type,
              },
            }}
            ref={ref}
            disabled={isDisabled}
            {...props}
          />

          {props.type === "datetime-local" && (
            <Icon name="dateInput" size="24" className="icon" />
          )}

          {props.value && clearbtn && (
            <div
              style={{
                position: "absolute",
                top: "0",
                right: password ? "32px" : "8px",
                height: props.styles === "primary" ? "48px" : "40px",
                display: "flex",
                alignItems: "center",
                color: "var(--input-primary-text-color)",
                cursor: "pointer",
              }}
              className={props.classnames?.clear}
            >
              <Icon
                name="menu-close"
                size={props.styles === "primary" ? "24" : "18"}
                onClick={() => {
                  if (props.onChange && !isDisabled) {
                    props.onChange({
                      target: { value: "", name: props.name },
                    } as any);
                  }
                }}
              />
            </div>
          )}

          {password && (
            <IconButton
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                height: "100%",
              }}
              onClick={() => setShowPass(prev => !prev)}
            >
              <Icon name={showPass ? "hide" : "show"} width={24} height={24} />
            </IconButton>
          )}
        </>
      </div>

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
    </InputWrapper>
  );
};

const CustomInput = React.forwardRef(CustomInputComponent);

// @ts-ignore
interface Props extends InputUnstyledProps {
  label?: string;
  errortext?: string;
  name?: string;
  styles?: IInputType;
  type?: "text" | "email" | "number" | "password" | "date" | "datetime-local";
  className: string;
  placeholder: any;
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
  password?: boolean;
  isDisabled?: boolean;
  multiline?: boolean;
  rows?: number;
  style?: CSSProperties;
  initiateChangeOnRender?: boolean;
}

const Input = ({
  className,
  label,
  name,
  styles,
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
  password,
  isDisabled,
  multiline,
  rows,
  style,
  initiateChangeOnRender,
}: Props) => {
  React.useEffect(() => {
    if (!initiateChangeOnRender) return;
    onChange({ target: { value, name } });
  }, []);

  return (
    <CustomInput
      className={className}
      name={name}
      styles={styles}
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
      password={password}
      isDisabled={isDisabled}
      multiline={multiline}
      rows={rows}
      style={style}
    />
  );
};

Input.defaultProps = {
  styles: "primary",
  type: "text",
  clearbtn: true,
} as Partial<Props>;

const InputWrapper = styled("div")`
  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    opacity: 1;
    position: absolute;
    display: block;
    background: none;
    width: 20px;
    height: 20px;
    border-width: thin;
    right: 15px;
    background: transparent;
    z-index: 1;
    cursor: pointer;
  }

  .icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
  }
`;
export default Input;
