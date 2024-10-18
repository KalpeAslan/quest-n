import { useMemo, useState, FC } from "react";
import PhoneInputComp, {
  isValidPhoneNumber,
  Country,
} from "react-phone-number-input";
import { Box } from "@mui/material";
import classnames from "classnames";

import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getUserMetaData } from "@/store/slices/analytics/analytics.selector";
import { Wrapper } from "./phoneInput.styles";
import { t } from "@lingui/macro";

type Props = {
  value: string;
  placeholder?: string;
  isPhoneInvalid: boolean;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setIsPhoneInvalid?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  name?: string;
  onBlur?: (e: any) => void;
  setPhoneError?: (value: string) => void;
  noPlaceholder?: boolean;
};

const PhoneInput: FC<Props> = ({
  value,
  placeholder,
  isPhoneInvalid,
  setValue,
  setIsPhoneInvalid,
  className,
  name,
  onBlur,
  setPhoneError,
  noPlaceholder,
}) => {
  const [phoneErrorMessage, setPhoneErrorMessage] = useState<string>("");
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const userData = useTypedSelector(getUserMetaData);

  const userCountry = useMemo(() => {
    if (userData?.country) {
      return userData.country as Country;
    }

    return undefined;
  }, [userData]);

  return (
    <>
      {!noPlaceholder && (
        <Box className="c-font-14-20 c-font-color" component="p" mb={1.2}>
          {placeholder}
        </Box>
      )}

      <Wrapper
        sx={{ position: "relative" }}
        className={classnames(className, {
          touched: isTouched,
          focus: isFocus,
          invalid: isPhoneInvalid,
        })}
      >
        <PhoneInputComp
          international
          defaultCountry={userCountry}
          countryCallingCodeEditable={false}
          value={value}
          name={name}
          placeholder={placeholder}
          onChange={(value: string) => {
            if (value) {
              const isValid = isValidPhoneNumber(value);

              if (isValid) {
                setIsPhoneInvalid && setIsPhoneInvalid(false);
                setPhoneErrorMessage("");
                setPhoneError && setPhoneError("");
              } else {
                setIsPhoneInvalid && setIsPhoneInvalid(true);
                setPhoneErrorMessage(
                  t({
                    id: "93zNq2Vff6SmMA3nHG8Pzn-UI",
                    message: "Invalid phone number",
                  }),
                );
                setPhoneError &&
                  setPhoneError(
                    t({
                      id: "miYmCpeeKLNB8dBx2LyKzp-UI",
                      message: "Invalid phone number",
                    }),
                  );
              }
            } else {
              setIsPhoneInvalid && setIsPhoneInvalid(true);
            }

            setValue(value);
          }}
          onFocus={() => {
            if (!isTouched) {
              setIsTouched(true);
              setPhoneErrorMessage(
                t({
                  id: "fKpsVBf5dbebPbCNCw78hk-UI",
                  message: "Invalid phone number",
                }),
              );
            }
            setIsFocus(true);
          }}
          onPaste={(e: ClipboardEvent) => {
            const pastedValue = e.clipboardData.getData("text/plain");

            if (pastedValue.startsWith("+")) {
              e.preventDefault();
              setValue(pastedValue);
            }
          }}
          onBlur={e => {
            if (onBlur) {
              onBlur(e);
            }
            setIsFocus(false);
          }}
        />

        {isPhoneInvalid && (
          <Box
            sx={{
              position: "absolute",
              textAlign: "left",
              bottom: 0,
              transform: "translateY(calc(100% + 4px))",
            }}
            className="c-font-14-19 c-font-color-4"
            component="p"
            mt={0.5}
          >
            {phoneErrorMessage}
          </Box>
        )}
      </Wrapper>
    </>
  );
};

export default PhoneInput;
