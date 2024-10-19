import { QuestTypeItem, Wrapper } from "./setupStep.styles";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { Input } from "@/components/UI/input";
import classNames from "classnames";
import { ChangeEvent, FC, useMemo, useRef } from "react";
import { InputWithNoChangingText } from "@/components/UI/inputWithNoChangingText";
import { Button } from "@/components/UI/button";
import { DateTime } from "luxon";
import {
  EProjectType,
  EQuestAdminStep,
  QuestStatus,
} from "@/modules/quest/models";
import { Image } from "@/components/UI/image";
import { appConfig } from "@/app.config";
import { t, Trans } from "@lingui/macro";
import { WYSIWYG } from "@components/WYSIWYG/WYSIWYG";
import { CBreakpoints } from "@styles/variables";
import Tooltip from "@components/UI/tooltip/Tooltip";
import { Icon } from "@components/UI/icon";
import { ISetupHookData } from "@/modules/quest/hooks/useSetupStep";

export const DESCRIPTION_MAX_LENGTH = 6000;

interface Props {
  setupHookData: ISetupHookData;
}

const SetupStep: FC<Props> = ({ setupHookData }) => {
  const addPreviewImageInputRef = useRef<HTMLInputElement>(null);

  const {
    isUpdate,
    onBlur,
    formik,
    getError,
    isFormLoaded,
    defaultPreviewImage,
    tempPreviewImage,
    imgUploadError,
    isPreviewImageLoaded,
    disabled,
    addPreviewImage,
    deletePreviewImage,
    adminStep,
    currentQuest,
    setQuestType,
    questType,
  } = useMemo(() => setupHookData, [setupHookData]);

  const renderDescriptionForm = () => {
    if (!isUpdate)
      return (
        <WYSIWYG
          onBlur={onBlur}
          name={"description"}
          placeholder={t({
            id: "wjvEKELxrmtDmgHueA3NZv-quest",
            message:
              "This text will be a project description on the quest page",
          })}
          value={formik.values.description}
          onChange={value => formik.setFieldValue("description", value)}
          error={getError("description").error}
          errorMessage={getError("description").errorText}
          maxLength={DESCRIPTION_MAX_LENGTH}
          setFieldError={(error: boolean) =>
            formik.setFieldError(
              "description",
              error
                ? t({
                    id: "8iF5AvZoz6H7EEY2b54mwZ-quest",
                    message: "Max length is 6000 characters",
                  })
                : null,
            )
          }
        />
      );

    if (isFormLoaded && currentQuest) {
      return (
        <WYSIWYG
          onBlur={onBlur}
          name={"description"}
          placeholder={t({
            id: "wjvEKELxrmtDmgHueA3NZv-quest",
            message:
              "This text will be a project description on the quest page",
          })}
          value={formik.values.description || currentQuest.description}
          onChange={value => formik.setFieldValue("description", value)}
          error={getError("description").error}
          errorMessage={getError("description").errorText}
          maxLength={DESCRIPTION_MAX_LENGTH}
          setFieldError={(error: boolean) =>
            formik.setFieldError(
              "description",
              error
                ? t({
                    id: "8iF5AvZoz6H7EEY2b54mwZ-quest",
                    message: "Max length is 6000 characters",
                  })
                : null,
            )
          }
        />
      );
    }
    return null;
  };

  const isXLG = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.xLg),
  );

  return (
    <Wrapper
      style={{
        padding: !isXLG && "0px",
      }}
      className={"c-wrap"}
      onSubmit={formik.handleSubmit}
    >
      {(defaultPreviewImage ||
        tempPreviewImage ||
        currentQuest?.preview_img) && (
        <Box>
          <Box maxWidth={680} className="previewImageWrapper" mb={2.5}>
            <div style={{ width: "100%" }}>
              <Box>
                <Tooltip
                  value={t({
                    message: "Set Quest preview image",
                    id: "5oqPLw7LSg234-dnjvf-6KgZQomprpiv-quest",
                  })}
                >
                  <Box className={"c-flex-items-center"}>
                    <Box
                      component="p"
                      className="c-font-16-22 c-fw-500"
                      mb={1.5}
                    >
                      <Trans id="5oqPLw7LSg6KgZQomprpiv-quest">
                        Quest preview image
                      </Trans>
                    </Box>
                    <Box position={"relative"} left={5}>
                      <Icon name={"question-mark"} />
                    </Box>
                  </Box>
                </Tooltip>
              </Box>

              <Box mb={3.5}>
                <div
                  style={{ marginBottom: imgUploadError && 30 }}
                  className="imageWrapper"
                >
                  <div className="image">
                    <Image
                      lazyLoading
                      src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${
                        currentQuest?.preview_img ||
                        tempPreviewImage ||
                        defaultPreviewImage
                      }`}
                      alt="test"
                      size="96"
                    />
                  </div>

                  {imgUploadError && (
                    <Box display={"flex"} className="error c-text-error">
                      <Icon name="alert-task" size="14" />

                      <Box component="p" className="c-font-12-16" ml={0.5}>
                        {imgUploadError}
                      </Box>
                    </Box>
                  )}
                </div>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  maxWidth={350}
                  sx={theme => ({
                    [theme.breakpoints.down(CBreakpoints.sm)]: {
                      flexWrap: "wrap",
                      gap: "15px",
                      ".deleteButton": {
                        marginLeft: 0,
                      },
                    },
                  })}
                >
                  <label
                    onClick={() => {
                      setTimeout(() => {
                        addPreviewImageInputRef.current.click();
                      }, 0);
                    }}
                    className="uploadButton c-font-16-22"
                  >
                    <Trans id="5T2wXURAJHBgJyqxc8uwaN-quest">
                      Add Preview Image
                    </Trans>
                  </label>

                  <input
                    ref={addPreviewImageInputRef}
                    id="previewUpload"
                    type="file"
                    className="uploadInput"
                    onChange={addPreviewImage}
                    disabled={currentQuest?.questStatus !== QuestStatus.Draft}
                    onClick={(e: any) => {
                      e.target.value = null;
                    }}
                    accept="image/*"
                  />

                  {(currentQuest?.preview_img || tempPreviewImage) &&
                    currentQuest?.preview_img !== defaultPreviewImage && (
                      <Button
                        style="error"
                        className="deleteButton"
                        onClick={deletePreviewImage}
                        loading={!isPreviewImageLoaded}
                        disabled={
                          !isPreviewImageLoaded ||
                          currentQuest?.questStatus !== QuestStatus.Draft
                        }
                      >
                        <Trans id="15V732y8AUbqNn1UmA8KFP-quest">Delete</Trans>
                      </Button>
                    )}
                </Box>
              </Box>
            </div>

            {(!isUpdate || currentQuest?.questStatus === QuestStatus.Draft) && (
              <div>
                <Box>
                  <Tooltip
                    value={t({
                      message: "Set Quest type",
                      id: "maDx212-csrMAGbFuFj3ojXPxgWE-quest",
                    })}
                  >
                    <Box className={"c-flex-items-center"}>
                      <Box
                        component="p"
                        className="c-font-16-22 c-fw-500"
                        mb={1.5}
                      >
                        <Trans id="maDxrMAGbFuFj3ojXPxgWE-quest">
                          Quest Type
                        </Trans>
                      </Box>
                      <Box position={"relative"} left={5}>
                        <Icon name={"question-mark"} />
                      </Box>
                    </Box>
                  </Tooltip>
                </Box>

                <QuestTypeItem
                  mb={2}
                  onClick={() => setQuestType(EProjectType.LuckyDraw)}
                  selected={questType === EProjectType.LuckyDraw}
                >
                  <Box className="radio">
                    {questType === EProjectType.LuckyDraw && (
                      <Box className="radioSelected" />
                    )}
                  </Box>

                  <Box>
                    <Box component="h3" className="c-fw-500 c-font-16-22">
                      <Trans id="o7xbUtPELXKivjv165o2a8-quest">
                        Lucky Draw
                      </Trans>
                    </Box>
                    <Box component="p" className="c-font-14-20">
                      <Trans id="vtgPxm1zqbunpeD2ndSReL-quest">
                        After the end of the quest - eligible random people will
                        be awarded rewards
                      </Trans>
                    </Box>
                  </Box>
                </QuestTypeItem>

                <QuestTypeItem
                  onClick={() => setQuestType(EProjectType.Scoreboard)}
                  selected={questType === EProjectType.Scoreboard}
                >
                  <Box className="radio">
                    {questType === EProjectType.Scoreboard && (
                      <Box className="radioSelected" />
                    )}
                  </Box>

                  <Box>
                    <Box component="h3" className="c-fw-500 c-font-16-22">
                      <Trans id="bJRxw9uAkb6mKsDzxu6ZEZ-quest">
                        Scoreboard
                      </Trans>
                    </Box>
                    <Box component="p" className="c-font-14-20">
                      <Trans id="ksq1zv82ZX9eJ8jEQ74mKK-quest">
                        Users will earn points by doing tasks to get higher
                        place in scoreboard, they will receive rewards based on
                        their place
                      </Trans>
                    </Box>
                  </Box>
                </QuestTypeItem>
              </div>
            )}
          </Box>

          <Box className="divider" />
        </Box>
      )}

      <Box className="formWrapper" maxWidth={680}>
        <Box className="inputWrapper">
          <Box className="c-font-16-22 c-fw-500" component="p" mb={0.75}>
            <Trans id="v2tdzwBdWdetFGi32ih849-quest">Name</Trans>
          </Box>
          <Input
            className={classNames("c-full-width", "input")}
            placeholder={t({
              id: "q2QV7zbfUFaQzJBAb3HbAc-quest",
              message: "Enter a project name",
            })}
            name="projectName"
            value={formik.values.projectName}
            onBlur={onBlur}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              formik.handleChange(e);
              if (
                adminStep === EQuestAdminStep.edit ||
                currentQuest?.questStatus !== QuestStatus.Draft
              )
                return;
              const { value } = e.target;
              const linkTitle = value
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]+/g, "");
              formik.setFieldValue("linkTitle", linkTitle);
            }}
            error={getError("projectName").error}
            errortext={getError("projectName").errorText}
            classnames={{ error: "error" }}
          />
        </Box>

        <Box className="inputWrapper">
          <Box className="c-font-16-22" component="p" mb={0.75}>
            <Trans id="9MhzK6SBA5xjPqxvZs5jNd-quest">
              Quest URL (It cannot be changed later)
            </Trans>
          </Box>
          <InputWithNoChangingText
            name="linkTitle"
            className="input"
            value={formik.values.linkTitle}
            onBlur={onBlur}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.value.length > 25) {
                return formik.setFieldError(
                  "linkTitle",
                  t({
                    id: "mgXjfBMcD3GFFwys2XbHH7-quest",
                    message: "Max length is 25 characters",
                  }),
                );
              }
              formik.handleChange(e);
            }}
            error={getError("linkTitle").error}
            errortext={getError("linkTitle").errorText}
            classnames={{ error: "error" }}
            notChangingText="alphaguilty.io/quest/"
            isDisabled={
              adminStep === EQuestAdminStep.edit ||
              currentQuest?.questStatus !== QuestStatus.Draft
            }
            placeholder={""}
          />
        </Box>

        <Box className="inputWrapper">
          <Box className="c-font-16-22 c-fw-500" component="p" mb={0.75}>
            <Trans id="sdfgk5tTMRsE23voxxy5pi-quest">Description</Trans>
          </Box>
          {renderDescriptionForm()}
        </Box>

        <Box
          className="datesWrapper"
          sx={{
            [`@media (max-width: ${CBreakpoints.md}px)`]: {
              flexDirection: "column",
              width: "100%",
              gap: 2,
              ".inputWrapper": {
                width: "100%",
                maxWidth: "100% !important",
                mr: 0,
              },
            },
          }}
        >
          <Box className="inputWrapper date" mr={3}>
            <Box className="c-font-16-22 c-fw-500" component="p" mb={0.75}>
              <Trans id="brCbKrhZTGq9G9KNpvadeD-quest">Start Date</Trans>
            </Box>
            <Input
              className={classNames("c-full-width", "input")}
              name="startAt"
              value={DateTime.fromISO(formik.values.startAt).toFormat(
                "yyyy-LL-dd'T'T",
              )}
              onBlur={onBlur}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue(
                  "startAt",
                  new Date(e.target.value).toISOString(),
                );
              }}
              error={getError("startAt").error}
              errortext={getError("startAt").errorText}
              classnames={{ error: "error" }}
              type="datetime-local"
              clearbtn={false}
              isDisabled={currentQuest?.questStatus !== QuestStatus.Draft}
            />
          </Box>

          <Box className="inputWrapper date">
            <Box className="c-font-16-22 c-fw-500" component="p" mb={0.75}>
              <Trans id="oKUppZq9gKC7HMwfDYQP7n-quest">End Date</Trans>
            </Box>
            <Input
              className={classNames("c-full-width", "input")}
              name="endAt"
              value={DateTime.fromISO(formik.values.endAt).toFormat(
                "yyyy-LL-dd'T'T",
              )}
              onBlur={onBlur}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                formik.setFieldValue(
                  "endAt",
                  new Date(e.target.value).toISOString(),
                );
              }}
              error={getError("endAt").error}
              errortext={getError("endAt").errorText}
              classnames={{ error: "error" }}
              type="datetime-local"
              clearbtn={false}
              isDisabled={currentQuest?.questStatus !== QuestStatus.Draft}
            />
          </Box>
        </Box>

        <Button
          className="c-full-width btn"
          type="submit"
          style="primary"
          size="medium"
          loading={!isFormLoaded}
          disabled={disabled}
        >
          <Trans id="sEGBM6221WumFZg6xhhsV1-quest">Continue</Trans>
        </Button>
      </Box>
    </Wrapper>
  );
};

export default SetupStep;
