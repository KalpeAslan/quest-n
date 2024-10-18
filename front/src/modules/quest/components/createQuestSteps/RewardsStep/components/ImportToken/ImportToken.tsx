import { Box } from "@mui/material";
import { FormWrapper, ImportedTokenWrapper } from "./importToken.styles";
import { Tooltip } from "@/components/UI/tooltip";
import { Selector } from "@/components/UI/selector";
import { CHAIN_OPTIONS_FOR_ONCHAIN, IContract } from "@/models";
import { FormikHelpers, useFormik } from "formik";
import { object, string } from "yup";
import { isAddress } from "viem";
import { Input } from "@/components/UI/input";
import {
  Dispatch,
  FC,
  FocusEvent,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Button } from "@/components/UI/button";
import { contractService } from "@/api";
import { Icon } from "@/components/UI/icon";
import { Trans, t } from "@lingui/macro";

interface FormFields {
  address: string;
  chainId: `0x${string}`;
  name: string;
  symbol: string;
}

const initialValues: FormFields = {
  address: "",
  chainId: CHAIN_OPTIONS_FOR_ONCHAIN[0].value as `0x${string}`,
  name: "",
  symbol: "",
};

const initialErrors = {
  address: "",
  chainId: "",
  name: "",
  symbol: "",
};

interface Props {
  contractId: number;
  tokenImported: boolean;
  tokenContracts: IContract[];
  getTokensContracts: () => Promise<void>;
  setTokenImported: Dispatch<SetStateAction<boolean>>;
  setContractId: (value: number) => void;
}

const ImportToken: FC<Props> = ({
  contractId,
  tokenImported,
  tokenContracts,
  setTokenImported,
  setContractId,
  getTokensContracts,
}) => {
  const [needName, setNeedName] = useState<boolean>(false);

  const formSchema = useMemo(
    () =>
      object(
        needName
          ? {
              address: string()
                .required(
                  t({
                    id: "3Epq1xhCtLkqLfmwMGEDmc-quest",
                    message: "Is required",
                  }),
                )
                .test("is-contract-address", (value, { createError, path }) => {
                  if (!value) {
                    createError({
                      path,
                      message: t({
                        id: "3DuE65bxQxzbYzzmRmokEX-quest",
                        message: "Invalid contract address",
                      }),
                    });
                    return false;
                  }
                  return isAddress(value);
                }),
              chainId: string(),
              name: string()
                .trim()
                .max(
                  25,
                  t({
                    id: "a4kcGMj2PSP35qSdyCaDdG-quest",
                    message: "Max length is 25 characters",
                  }),
                )
                .required(
                  t({
                    id: "guZBYNi2xFczxWFb9g86qh-quest",
                    message: "Name is required",
                  }),
                ),
              symbol: string()
                .trim()
                .max(
                  5,
                  t({
                    id: "aBVJCnWcztguPBuMWfdA3i-quest",
                    message: "Max length is 5 characters",
                  }),
                )
                .required(
                  t({
                    id: "4mCpLXn92PSuatXZiBvM1F-quest",
                    message: "Symbol is required",
                  }),
                ),
            }
          : {
              address: string()
                .required(
                  t({
                    id: "5VfHki2EcTWQ8DVibFhHmr-quest",
                    message: "Is required",
                  }),
                )
                .test("is-contract-address", (value, { createError, path }) => {
                  if (!value) {
                    createError({
                      path,
                      message: t({
                        id: "hEH8JonAmnZC4aE3AxtXqU-quest",
                        message: "Invalid contract address",
                      }),
                    });
                    return false;
                  }
                  return isAddress(value);
                }),
              chainId: string(),
            },
      ),
    [needName],
  );

  const onSubmit = useCallback(
    async (data: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
      try {
        const res = await contractService.createTokenContract(
          needName
            ? {
                chainId: data.chainId,
                address: data.address,
                name: data.name,
                symbol: data.symbol,
              }
            : {
                chainId: data.chainId,
                address: data.address,
              },
        );

        await getTokensContracts();

        setTokenImported(true);
        setContractId(res.data.id);
        formikHelpers.resetForm();
      } catch (error) {
        if (error.response.data.errorCode === 1030) {
          setNeedName(true);
        } else if (error.response.data.errorCode === 4001) {
          formikHelpers.setFieldError(
            "address",
            t({
              id: "3mCLw5QpSKkAh2k4not8hS-quest",
              message: "Token already exists",
            }),
          );
        } else {
          formikHelpers.setFieldError(
            "address",
            t({
              id: "2ANr9xHGMYf6FS7d8HVgyk-quest",
              message: "Invalid token address",
            }),
          );
        }
      }
    },
    [getTokensContracts, needName, setContractId, setTokenImported],
  );

  const formik = useFormik<FormFields>({
    initialValues,
    initialErrors,
    validateOnBlur: false,
    validationSchema: formSchema,
    onSubmit,
  });

  const submitDisabled = useMemo(
    () =>
      Boolean(
        formik.errors.address ||
          !formik.values.address ||
          (needName &&
            (formik.errors.name ||
              !formik.values.name ||
              formik.errors.symbol ||
              !formik.values.symbol)),
      ),
    [
      formik.errors.address,
      formik.errors.name,
      formik.errors.symbol,
      formik.values.address,
      formik.values.name,
      formik.values.symbol,
      needName,
    ],
  );

  const contract: IContract | null = useMemo(() => {
    if (tokenImported) {
      return tokenContracts.find(item => item.id === contractId);
    }

    return null;
  }, [contractId, tokenContracts, tokenImported]);

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    formik.setTouched({ ...formik.touched, [e.target.name]: true });
  };

  const getError = useCallback(
    (name: keyof typeof formik.errors) => ({
      error: Boolean(formik.touched[name] && formik.errors[name]),
      errorText: formik.touched[name] ? formik.errors[name] : "",
    }),
    [formik],
  );

  return (
    <>
      {contract ? (
        <ImportedTokenWrapper>
          <Box display="flex" alignItems="center">
            <Icon name="checkmark" size="30" />

            <Box
              component="p"
              ml="2px"
              className="c-font-color c-font-14-22 c-sm-font-16-22 c-fw-500"
            >
              <Trans id="37Vork2zBSevEzeoStKeut-quest">Token imported</Trans>
            </Box>
          </Box>

          <Box display="flex" alignItems="center">
            <Box
              mr="15px"
              component="p"
              className="c-font-color-3 c-font-20-20 c-sm-font-32-32 c-fw-500"
            >
              {contract.symbol}
            </Box>

            <Icon
              name="menu-close"
              className="c-font-color closeImportedTokenIcon"
              size="20"
              onClick={() => {
                setTokenImported(false);
                setNeedName(false);
              }}
            />
          </Box>
        </ImportedTokenWrapper>
      ) : (
        <FormWrapper onSubmit={formik.handleSubmit}>
          <Box mb="15px">
            <Box display="flex" alignItems="center" mb="6px">
              <Box
                component="h3"
                mr="5px"
                className="c-font-color c-fw-500 c-font-16-22"
              >
                <Trans id="8eNqmS8ycc8h5kfZFamt45-quest">Blockchain</Trans>
              </Box>

              <Tooltip value="Blockchain tooltip" placement="top" followCursor>
                <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
              </Tooltip>
            </Box>

            <Selector
              className="c-full-width input"
              options={CHAIN_OPTIONS_FOR_ONCHAIN}
              value={formik.values.chainId}
              onSelect={data => formik.setFieldValue("chainId", data)}
              disabled={needName}
            />
          </Box>

          <Box mb={needName ? "15px" : 0} className="inputWrapper">
            <Box display="flex" alignItems="center" mb="6px">
              <Box
                component="h3"
                mr="5px"
                className="c-font-color c-fw-500 c-font-16-22"
              >
                <Trans id="1V2z8C5fVb21etr3PruToZ-quest">
                  Token contact address
                </Trans>
              </Box>

              <Tooltip
                value={t({
                  id: "6z8YAUgPZ5sa6EFazoqwHz-quest",
                  message: "Token contact address tooltip",
                })}
                placement="top"
                followCursor
              >
                <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
              </Tooltip>
            </Box>

            <Input
              className="c-full-width input"
              placeholder={t({
                id: "nuTXR2rqPxJ76YBrwrTWYf-quest",
                message: "Contact Adress",
              })}
              name="address"
              value={formik.values.address}
              onBlur={onBlur}
              onChange={formik.handleChange}
              error={getError("address").error}
              errortext={getError("address").errorText}
              classnames={{ error: "error" }}
              isDisabled={needName}
              clearbtn={!needName}
            />

            {needName && (
              <Icon name="checkmark" className="checkIcon" size="24" />
            )}
          </Box>

          {needName && (
            <Box className="nameInputsWrapper">
              <Box mb="15px" className="nameInput">
                <Box display="flex" alignItems="center" mb="6px">
                  <Box
                    component="h3"
                    mr="5px"
                    className="c-font-color c-fw-500 c-font-16-22"
                  >
                    <Trans id="hgQoMVpwWNc4qoDbEg2wWD-quest">Token Name</Trans>
                  </Box>

                  <Tooltip
                    value={t({
                      id: "afshkbRo1bJMFmqkbrEmr5-quest",
                      message: "Token Name tooltip",
                    })}
                    placement="top"
                    followCursor
                  >
                    <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
                  </Tooltip>
                </Box>

                <Input
                  className="c-full-width input"
                  placeholder={t({
                    id: "dGiEYmoFdt83Rw9Kv8i6nG-quest",
                    message: "Enter Token Name",
                  })}
                  name="name"
                  value={formik.values.name}
                  onBlur={onBlur}
                  onChange={formik.handleChange}
                  error={getError("name").error}
                  errortext={getError("name").errorText}
                  classnames={{ error: "error" }}
                />
              </Box>

              <Box className="nameInput">
                <Box display="flex" alignItems="center" mb="6px">
                  <Box
                    component="h3"
                    mr="5px"
                    className="c-font-color c-fw-500 c-font-16-22"
                  >
                    <Trans id="gzvRxifRymuTJb7u7EhvbL-quest">
                      Token Symbol
                    </Trans>
                  </Box>

                  <Tooltip
                    value={t({
                      id: "95RgPNeoYwfLJ9ia2U41LN-quest",
                      message: "Token Symbol tooltip",
                    })}
                    placement="top"
                    followCursor
                  >
                    <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
                  </Tooltip>
                </Box>

                <Input
                  className="c-full-width input"
                  placeholder={t({
                    id: "7zQ8XfkxdkcXxRrViYHzek-quest",
                    message: "Enter Token Symbol",
                  })}
                  name="symbol"
                  value={formik.values.symbol}
                  onBlur={onBlur}
                  onChange={formik.handleChange}
                  error={getError("symbol").error}
                  errortext={getError("symbol").errorText}
                  classnames={{ error: "error" }}
                />
              </Box>
            </Box>
          )}

          <Button
            style="secondary"
            type="submit"
            className="submitButton"
            disabled={submitDisabled}
          >
            <>
              {needName
                ? t({ id: "6ysD5pYCcL3vbcs2f7bojT-quest", message: "Continue" })
                : t({
                    id: "iKEuhLfY4NWnVQ82WytQVj-quest",
                    message: "Import Token",
                  })}
            </>
          </Button>
        </FormWrapper>
      )}
    </>
  );
};

export default ImportToken;
