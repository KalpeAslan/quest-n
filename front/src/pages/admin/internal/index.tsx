import { adminInternalService } from "@/api/services/admin/internal";
import { appConfig } from "@/app.config";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { LocalStorageService } from "@/services";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { t, Trans } from "@lingui/macro";
import classNames from "classnames";
import { DateTime } from "luxon";
import { EProjectType } from "../../../modules/quest/models";
import * as yup from "yup";
import Tooltip from "../../../components/UI/tooltip/Tooltip";
import { Icon } from "../../../components/UI/icon";
import { QuestTypeItem } from "../../../modules/quest/components/createQuestSteps/SetupStep/setupStep.styles";
import { Participants } from "@modules/internalAdmin/components/Participants/Participants";
import Tabs from "@components/UI/tabs/Tabs";
import { WYSIWYG } from "@components/WYSIWYG/WYSIWYG";
import { DESCRIPTION_MAX_LENGTH } from "@modules/quest/components/createQuestSteps/SetupStep/SetupStep";
import { IParticipant } from "@models/InternalAdmin";

const validateToken = async (token: string) => {
  try {
    const { data } = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${appConfig.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      { idToken: token },
    );

    return Boolean(data?.users?.[0] && !data.users[0].disabled);
  } catch (error) {
    return false;
  }
};

const schema = yup.object({
  title: yup.string().required(),
  projectType: yup.string().required(),
  visible: yup.boolean().notRequired(),
  featured: yup.boolean().notRequired(),
  startAt: yup.string().notRequired(),
  endAt: yup.string().notRequired(),
});

interface IQuestForm {
  title: string;
  description: string;
  projectType: string;
  visible: boolean;
  featured: boolean;
  startAt: string;
  endAt: string;
}

enum ETab {
  QuestInfo = "QuestInfo",
  Participants = "Participants",
}

const Internal = () => {
  const [token, setToken] = useState<string | null>(null);
  const [linkTitle, setLinkTitle] = useState<string>("");
  const [quest, setQuest] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] =
    useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<string>(ETab.QuestInfo);

  const authFormik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: async data => {
      try {
        const res = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${appConfig.NEXT_PUBLIC_FIREBASE_API_KEY}`,
          data,
        );

        setToken(res.data.idToken);
        LocalStorageService.setItem("marketing-token", res.data.idToken);
      } catch (error) {
        console.log("Error", error);
      }
    },
  });

  const onSearch = useCallback(async () => {
    try {
      setQuest(null);
      setIsLoadingParticipants(true);
      const { data } = await adminInternalService.getQuest(token, linkTitle);
      adminInternalService
        .getQuestParticipants(token, linkTitle)
        .then(res => setParticipants(res.data))
        .finally(() => setIsLoadingParticipants(false));
      setQuest(data);
      setError(false);
    } catch (error) {
      setError(true);
    }
  }, [linkTitle, token]);

  const init = useCallback(async () => {
    const localStorageToken = await LocalStorageService.getItemAsync(
      "marketing-token",
    );

    if (localStorageToken && (await validateToken(localStorageToken))) {
      setToken(localStorageToken);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const questFormik = useFormik<IQuestForm>({
    initialValues: {
      title: quest?.title || "",
      description: quest?.description || "",
      projectType: quest?.projectType || "",
      visible: quest?.visible || false,
      featured: quest?.featured || false,
      startAt: quest?.startAt || "",
      endAt: quest?.endAt || "",
    },
    validationSchema: schema,
    onSubmit: async data => {
      try {
        setLoading(true);
        await adminInternalService.updateQuest(token, linkTitle, data);
      } catch (error) {
        setError(true);
      } finally {
        setError(null);
        setLoading(false);
        await onSearch();
      }
    },
  });

  useEffect(() => {
    if (quest) {
      questFormik.setFieldValue("title", quest.title);
      questFormik.setFieldValue("description", quest.description);
      questFormik.setFieldValue("projectType", quest.projectType);
      questFormik.setFieldValue("visible", quest.visible);
      questFormik.setFieldValue("featured", quest.featured);
      questFormik.setFieldValue("startAt", quest.startAt);
      questFormik.setFieldValue("endAt", quest.endAt);
    }
  }, [quest]);

  const setprojectType = value =>
    questFormik.setFieldValue("projectType", value);

  console.log("questFormik", questFormik.errors);

  return (
    <div className="background-other c-font-color">
      {token ? (
        <Box margin="50px auto 0">
          {error && <Box color="red">Quest not found</Box>}
          <Box
            mb="20px"
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
          >
            <Box
              maxWidth={400}
              display={"flex"}
              justifyContent={"center"}
              flexDirection={"column"}
              width={"100%"}
              gap={2}
            >
              <Input
                className="c-full-width"
                type="text"
                placeholder="Link title"
                value={linkTitle}
                onChange={e => setLinkTitle(e.target.value)}
              />
              <Button style="primary" type="button" onClick={onSearch}>
                Search
              </Button>
            </Box>
          </Box>

          {quest && (
            <Box mt="40px" minWidth={400} width={"80vw"} maxWidth={"80vw"}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  ".tabs": {
                    maxWidth: 400,
                    width: "100%",
                  },
                }}
              >
                <Tabs
                  type={"primary"}
                  activeTab={String(selectedTab)}
                  tabs={[
                    {
                      id: 0,
                      tab: ETab.QuestInfo,
                      title: "Quest Info",
                    },
                    {
                      id: 1,
                      tab: ETab.Participants,
                      title: "Participants Info",
                    },
                  ]}
                  changeFn={value => setSelectedTab(value as any)}
                />
              </Box>
              {selectedTab === ETab.QuestInfo && (
                <Box mt={4} pb={3}>
                  <Box component="h3" mb={3}>
                    {quest.title || quest.projectName}
                  </Box>

                  <Box my={3} className="inputWrapper">
                    <Box
                      className="c-font-16-22 c-fw-500"
                      component="p"
                      mb={0.75}
                    >
                      <Trans id="v2tdzwBdWdetFGi32ih849-quest">Name</Trans>
                    </Box>
                    <Input
                      className={classNames("c-full-width", "input")}
                      placeholder={t({
                        id: "q2QV7zbfUFaQzJBAb3HbAc-quest",
                        message: "Enter a project name",
                      })}
                      name="title"
                      value={questFormik.values.title}
                      onBlur={questFormik.handleBlur}
                      onChange={questFormik.handleChange}
                      error={
                        !!(
                          questFormik.touched.title && questFormik.errors.title
                        )
                      }
                      errortext={questFormik.errors.title}
                      classnames={{ error: "error" }}
                    />
                  </Box>

                  <Box width={"100%"}>
                    <WYSIWYG
                      name={"description"}
                      placeholder={t({
                        id: "wjvEKELxrmtDmgHueA3NZv-quest",
                        message:
                          "This text will be a project description on the quest page",
                      })}
                      value={questFormik.values.description}
                      onChange={value =>
                        questFormik.setFieldValue("description", value)
                      }
                      error={!!questFormik.errors.description}
                      errorMessage={questFormik.errors.description}
                      maxLength={DESCRIPTION_MAX_LENGTH}
                      setFieldError={(error: boolean) =>
                        questFormik.setFieldError(
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
                  </Box>

                  <Box my={3}>
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
                      onClick={() => setprojectType(EProjectType.LuckyDraw)}
                      selected={
                        questFormik.values.projectType ===
                        EProjectType.LuckyDraw
                      }
                    >
                      <Box className="radio">
                        {questFormik.values.projectType ===
                          EProjectType.LuckyDraw && (
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
                            After the end of the quest - eligible random people
                            will be awarded rewards
                          </Trans>
                        </Box>
                      </Box>
                    </QuestTypeItem>

                    <QuestTypeItem
                      onClick={() => setprojectType(EProjectType.Scoreboard)}
                      selected={
                        questFormik.values.projectType ===
                        EProjectType.Scoreboard
                      }
                    >
                      <Box className="radio">
                        {questFormik.values.projectType ===
                          EProjectType.Scoreboard && (
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
                            place in scoreboard, they will receive rewards based
                            on their place
                          </Trans>
                        </Box>
                      </Box>
                    </QuestTypeItem>

                    <QuestTypeItem
                      mt={2}
                      onClick={() => setprojectType(EProjectType.Guaranteed)}
                      selected={
                        questFormik.values.projectType ===
                        EProjectType.Guaranteed
                      }
                    >
                      <Box className="radio">
                        {questFormik.values.projectType ===
                          EProjectType.Guaranteed && (
                          <Box className="radioSelected" />
                        )}
                      </Box>

                      <Box>
                        <Box component="h3" className="c-fw-500 c-font-16-22">
                          <Trans id="basdaRxw9uAkb6mKsDzxu6ZEZ-quest">
                            Guaranteed
                          </Trans>
                        </Box>
                        <Box component="p" className="c-font-14-20">
                          <Trans id="asdksq1zv82ZX9eJ8jEQ74mKK-quest">
                            Guaranteed rewards for all participants
                          </Trans>
                        </Box>
                      </Box>
                    </QuestTypeItem>
                  </Box>
                  <Box className="inputWrapper date" mr={3} mb={3}>
                    <Box
                      className="c-font-16-22 c-fw-500"
                      component="p"
                      mb={0.75}
                    >
                      <Trans id="bsdrCbKrhZTGq9G9KNpvadeD-quest">
                        Start Date
                      </Trans>
                    </Box>
                    <Input
                      className={classNames("c-full-width", "input")}
                      name="startAt"
                      value={DateTime.fromISO(
                        questFormik.values.startAt,
                      ).toFormat("yyyy-LL-dd'T'T")}
                      onBlur={questFormik.handleBlur}
                      onChange={questFormik.handleChange}
                      error={
                        !!(questFormik.touched && questFormik.errors.startAt)
                      }
                      errortext={questFormik.errors.startAt}
                      classnames={{ error: "error" }}
                      type="datetime-local"
                      clearbtn={false}
                      placeholder={"End At"}
                    />
                  </Box>

                  <Box className="inputWrapper date" mr={3} mb={3}>
                    <Box
                      className="c-font-16-22 c-fw-500"
                      component="p"
                      mb={0.75}
                    >
                      <Trans id="xrCbKrhZTGq9G9KNpvadeD-quest">End Date</Trans>
                    </Box>
                    <Input
                      className={classNames("c-full-width", "input")}
                      name="endAt"
                      value={DateTime.fromISO(
                        questFormik.values.endAt,
                      ).toFormat("yyyy-LL-dd'T'T")}
                      onBlur={questFormik.handleBlur}
                      onChange={questFormik.handleChange}
                      error={
                        !!(questFormik.touched && questFormik.errors.endAt)
                      }
                      errortext={questFormik.errors.endAt}
                      classnames={{ error: "error" }}
                      type="datetime-local"
                      clearbtn={false}
                      placeholder={"End At"}
                    />
                  </Box>

                  <Box mb={2}>
                    <Box
                      className="c-font-16-22 c-fw-500"
                      component="p"
                      mb={0.75}
                    >
                      <Trans id="vfdj4rCbKrhZTGq9G9KNpvadeD-quest">
                        Quest Status
                      </Trans>
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={questFormik.values.featured}
                          onChange={e =>
                            questFormik.setFieldValue(
                              "featured",
                              e.target.checked,
                            )
                          }
                          sx={{ color: "white", fill: "white" }}
                        />
                      }
                      label="Featured"
                    />
                  </Box>

                  <Box mb={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={questFormik.values.visible}
                          onChange={e =>
                            questFormik.setFieldValue(
                              "visible",
                              e.target.checked,
                            )
                          }
                          sx={{ color: "white", fill: "white" }}
                        />
                      }
                      label="Visible"
                    />
                  </Box>

                  <Button
                    style="primary"
                    onClick={questFormik.handleSubmit}
                    loading={loading}
                    disabled={Object.values(questFormik.errors).some(Boolean)}
                  >
                    Save
                  </Button>
                </Box>
              )}
              {selectedTab === ETab.Participants && (
                <Participants
                  projectType={quest.projectType}
                  questLinkTitle={linkTitle}
                  data={participants}
                  isLoading={isLoadingParticipants}
                />
              )}
            </Box>
          )}
        </Box>
      ) : (
        <Box
          component="form"
          maxWidth="400px"
          margin="50px auto 0"
          onSubmit={authFormik.handleSubmit}
        >
          <Box mb="20px">
            <Input
              className="c-full-width"
              name="email"
              type="text"
              placeholder="Email"
              value={authFormik.values.email}
              onChange={authFormik.handleChange}
            />
          </Box>

          <Box mb="20px">
            <Input
              className="c-full-width"
              name="password"
              type="password"
              placeholder="Password"
              value={authFormik.values.password}
              onChange={authFormik.handleChange}
            />
          </Box>

          <Button style="primary" type="submit">
            Submit
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Internal;
