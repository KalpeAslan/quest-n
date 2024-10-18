import { Box, Theme, useMediaQuery } from "@mui/material";
import { LogoContainer, Wrapper } from "./createPartnerProject.styles";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import {
  setIsAdminPanelOpened,
  setPartnerProjectCreationPopup,
} from "@/store/slices/system/system.slice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { adminProjectService } from "@/api";
import { object, string } from "yup";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getPartnerProject } from "@/modules/account/store/account.selector";
import { HelperService } from "@/services";
import { FormikHelpers, useFormik } from "formik";
import { PartnerProjectSocialFormInput } from "../../components/SocialFormInput/SocialFormInput";
import { Input } from "@/components/UI/input";
import classNames from "classnames";
import { InputWithNoChangingText } from "@/components/UI/inputWithNoChangingText";
import { WYSIWYG } from "@/components/WYSIWYG/WYSIWYG";
import { addPartnerProject } from "@/modules/account/store/account.slice";
import CopyToClipboard from "react-copy-to-clipboard";
import { InviteBlock } from "@modules/partnerProject/components/InviteBlock/InviteBlock";
import { IPartnerProject } from "@modules/quest/models";
import { LeaveFromProjectBlock } from "@modules/partnerProject/components/LeaveFromProjectBlock/LeaveFromProjectBlock";
import { CBreakpoints } from "@styles/variables";
import { PartnerProjectsDropdown } from "@modules/quest/components/partnerProjectsDropdown/PartnerProjectsDropdown";
import { usePrivateRouteRedirect } from "@/hooks/usePrivateRouteRedirect";

const FILE_SIZE_MAX_LIMIT = 2 * 1024 * 1024;

interface FormFields {
  name: string;
  description: string;
  linkTitle: string;
  webPage: string;
  twitter: string;
  discord: string;
  telegram: string;
  twitterOrig: string;
  telegramOrig: string;
  discordOrig: string;
}

interface IProps {
  isEdit?: boolean;
}

const CreatePartnerProjectPage = ({ isEdit }: IProps) => {
  const { push, query } = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imgUploadError, setImgUploadError] = useState<string>("");
  const [defaultLogoImage, setDefaultLogoImage] = useState<string | null>(null);
  const [tempLogoImage, setTempLogoImage] = useState<File | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [createdProjectLinkTitle, setCreatedProjectTitle] = useState("");

  const project = (useTypedSelector(
    getPartnerProject(query.linkTitle as string),
  ) || {}) as IPartnerProject;

  const dispatch = useAppDispatch();

  const linkTitle = query.linkTitle as string;

  const formSchema = object({
    name: string()
      .trim()
      .max(25, "Max length is 25 characters")
      .required("Name is required"),
    description: string(),
    linkTitle: string()
      .trim()
      .matches(/^([a-z0-9-]*)$/, "Only lowercase letters and dash allowed")
      .not(["create"], `Can't be "create" (reserved word)`)
      .required("Link title is required"),
    webPage: string().trim().url(),
    twitter: string().url("Enter correct url!"),
    discord: string().url("Enter correct url!"),
    telegram: string().url("Enter correct url!"),
    telegramOrig: string().notRequired().nullable(),
    discordOrig: string().notRequired().nullable(),
    twitterOrig: string().notRequired().nullable(),
  });

  const socialData = useMemo(() => {
    const parsed = HelperService.parseMd(project?.socialDescription || "");

    let data = { twitter: "", discord: "", telegram: "", projectSite: "" };

    try {
      data = JSON.parse(parsed.replace(":abbr", ""))[0] || {
        twitter: "",
        discord: "",
        telegram: "",
        projectSite: "",
      };
    } catch (error) {
      console.log("Parsing error");
    }

    return data;
  }, [project?.socialDescription]);

  const initialValues: FormFields = useMemo(
    () => ({
      name: project?.name || "",
      description: project?.shortDescription || "",
      linkTitle: project?.linkTitle || "",
      webPage: socialData.projectSite || "",
      twitter: socialData.twitter || "",
      discord: socialData.discord || "",
      telegram: socialData.telegram || "",
      twitterOrig: socialData.twitter || "",
      discordOrig: socialData.discord || "",
      telegramOrig: socialData.telegram || "",
    }),
    [
      project?.name,
      project?.shortDescription,
      project?.linkTitle,
      socialData.projectSite,
      socialData.twitter,
      socialData.discord,
      socialData.telegram,
    ],
  );

  const onSubmit = useCallback(
    async (data: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
      setIsLoading(true);
      const socialDescription = `:abbr[${JSON.stringify({
        twitter: data.twitter,
        discord: data.discord,
        telegram: data.telegram,
        projectSite: data.webPage,
      })}]`;

      try {
        if (isEdit) {
          const { data: result } = await adminProjectService.updateProject(
            tempLogoImage || null,
            linkTitle,
            {
              name: data.name,
              shortDescription: data.description,
              socialDescription,
            },
          );

          dispatch(addPartnerProject(result.project));
          dispatch(
            setPartnerProjectCreationPopup({
              open: true,
              partnerProjectLinkTitle: result.project.linkTitle,
              isUpdate: true,
            }),
          );
        } else {
          const { data: result } = await adminProjectService.createProject(
            tempLogoImage || null,
            {
              name: data.name,
              linkTitle: data.linkTitle,
              shortDescription: data.description,
              socialDescription,
            },
          );

          dispatch(addPartnerProject(result.project));
          setCreatedProjectTitle(result.project.linkTitle);
          dispatch(
            setPartnerProjectCreationPopup({
              open: true,
              partnerProjectLinkTitle: result.project.linkTitle,
            }),
          );
        }
      } catch (error) {
        formikHelpers.setFieldError(
          "linkTitle",
          "This link title already exists",
        );
        console.log("Partner project error");
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, linkTitle, tempLogoImage],
  );

  const formik = useFormik<FormFields>({
    initialValues,
    validationSchema: formSchema,
    validateOnBlur: true,
    initialErrors: {
      name: "",
      description: "",
      linkTitle: "",
      webPage: "",
      twitter: "",
      discord: "",
      telegram: "",
      twitterOrig: "",
      discordOrig: "",
      telegramOrig: "",
    },
    onSubmit,
  });

  useEffect(() => {
    formik.setValues(initialValues);
  }, [initialValues]);

  const goBack = useCallback(() => {
    push(`/admin/projects`);
  }, [push]);

  const getDefaultLogoImage = useCallback(async () => {
    try {
      const { data: result } = await adminProjectService.getDefaultLogo();
      setDefaultLogoImage(result);
    } catch (error) {
      console.log("Failed to get default image", error);
    }
  }, []);

  const addLogoImage = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files;

    if (!file) return;
    if (file.size >= FILE_SIZE_MAX_LIMIT) {
      setImgUploadError(
        "Image should be PNG/JPEG format and maximum size is 2MB",
      );
      return;
    }

    setTempLogoImage(file);

    setImgUploadError("");
  }, []);

  const deleteLogoImage = useCallback(async () => {
    if (tempLogoImage && project?.logo) {
      setTempLogoImage(null);
      return;
    }
    dispatch(addPartnerProject({ ...project, logo: null }));
  }, [dispatch, project, tempLogoImage]);

  useEffect(() => {
    getDefaultLogoImage();
  }, [getDefaultLogoImage]);

  useEffect(() => {
    dispatch(setIsAdminPanelOpened(true));

    return () => {
      dispatch(setIsAdminPanelOpened(false));
    };
  }, [dispatch]);

  const disabled = useMemo(() => {
    const {
      name,
      description,
      linkTitle,
      webPage,
      twitter,
      discord,
      telegram,
    } = formik.values;

    const isDisabled = Boolean(
      !name ||
        formik.errors.name ||
        !linkTitle ||
        formik.errors.linkTitle ||
        formik.errors.description ||
        formik.errors.webPage ||
        formik.errors.twitter ||
        formik.errors.discord,
    );

    if (project) {
      return (
        isDisabled ||
        Boolean(
          !tempLogoImage &&
            name === project.name &&
            description === project.shortDescription &&
            linkTitle === project.linkTitle &&
            webPage === socialData.projectSite &&
            twitter === socialData.twitter &&
            discord === socialData.discord &&
            telegram === socialData.telegram,
        )
      );
    }
    return isDisabled;
  }, [
    tempLogoImage,
    formik.errors.description,
    formik.errors.discord,
    formik.errors.linkTitle,
    formik.errors.name,
    formik.errors.twitter,
    formik.errors.webPage,
    formik.values,
    project,
    socialData.discord,
    socialData.projectSite,
    socialData.telegram,
    socialData.twitter,
  ]);

  usePrivateRouteRedirect();

  const handleCopy = useCallback(() => {
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  }, []);

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

  const computeSocialLink = (
    social: string,
    originalFieldName: string,
    placeholder: string,
  ) => {
    return formik.values[originalFieldName] ? (
      <PartnerProjectSocialFormInput
        value={formik.values[social]}
        iconName={social}
        onClose={() => formik.setFieldValue(originalFieldName, "")}
      />
    ) : (
      <>
        <Icon name={social} size="24" />
        <Input
          className={classNames("c-full-width", "input")}
          placeholder={placeholder}
          name={social}
          value={formik.values[social]}
          onBlur={onBlur}
          onChange={formik.handleChange}
          error={getError(social as any).error}
          errortext={getError(social as any).errorText}
        />
      </>
    );
  };

  const logoContainer = useMemo(
    () => (
      <LogoContainer
        mb="28px"
        image={project?.logo}
        tempImage={tempLogoImage}
        defaultImage={defaultLogoImage}
      >
        <Box className="imageContainer" component="label" htmlFor="logoUpload">
          {(!project?.logo || project?.logo === defaultLogoImage) &&
            !tempLogoImage && (
              <Icon name="plus" className="c-font-color" size="24" />
            )}
        </Box>
        <Box>
          <Box display="flex" mb="15px">
            <label
              htmlFor="logoUpload"
              className="logoUploadButton c-font-color c-font-14-16 c-fw-500"
            >
              Upload Logo
            </label>
            {((project?.logo && project?.logo !== defaultLogoImage) ||
              tempLogoImage) && (
              <Box
                component="button"
                onClick={deleteLogoImage}
                className="deleteButton c-font-color-4 c-font-14-16 c-fw-500"
              >
                Delete
              </Box>
            )}
          </Box>

          <Box color="rgba(255, 255, 255, 0.70)" className="c-font-12-14">
            {imgUploadError || "PNG/JPEG | Size 1:1 | Max 2Mb"}
          </Box>
          <input
            id="logoUpload"
            type="file"
            className="uploadInput"
            onChange={addLogoImage}
            accept="image/png, image/jpeg"
          />
        </Box>
      </LogoContainer>
    ),
    [
      addLogoImage,
      defaultLogoImage,
      deleteLogoImage,
      imgUploadError,
      project?.logo,
      tempLogoImage,
    ],
  );

  const isMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.md),
  );
  const isLg = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(CBreakpoints.lg),
  );

  return (
    <div className="background-other">
      <Wrapper className="c-font-color">
        {isLg && (
          <div className={"create-partner-project__sidebar"}>
            <Box p={2}>
              <PartnerProjectsDropdown />
            </Box>
          </div>
        )}
        <div className={"c-wrap create-partner-project__content"}>
          <Box className="header c-font-color c-font-32-38 c-fw-500">
            <Button style="secondary" className="backButton" onClick={goBack}>
              <Icon name="slider-arrow" size="19" className="backIcon" />
            </Button>
            {isEdit ? "Project Settings" : "Create a project profile"}
          </Box>

          {!isMd && (
            <Box position={"absolute"} right={100} display={"inline-block"}>
              {!project.isDelegated ? (
                <InviteBlock
                  projectLink={linkTitle || createdProjectLinkTitle}
                />
              ) : (
                <LeaveFromProjectBlock projectLink={linkTitle} />
              )}
            </Box>
          )}

          {!isEdit && (
            <>
              <Box className="c-font-color-3 c-font-20-24" mb="5px">
                To create quests, first tell us a bit about your project.
              </Box>

              <Box
                sx={{ color: "rgba(255, 255, 255, 0.80)" }}
                className="c-font-16-24"
                mb="28px"
              >
                All quests you create in the future will be attached to it.
              </Box>
            </>
          )}

          <Box component="form" onSubmit={formik.handleSubmit}>
            <Box mb="12px" className="c-font-color c-font-16-22 c-fw-500">
              Project logo
            </Box>

            {logoContainer}

            <Box mb="28px" maxWidth="320px">
              <Box mb="6px" className="c-font-color c-font-16-22 c-fw-500">
                Project name
              </Box>

              <Input
                className={classNames("c-full-width", "input")}
                placeholder="Enter a project name"
                name="name"
                value={formik.values.name}
                onBlur={onBlur}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  formik.handleChange(e);
                  const { value } = e.target;
                  const linkTitle = value
                    .toLowerCase()
                    .replace(" ", "-")
                    .replace(/[^a-z0-9-]+/gi, "");
                  formik.setFieldValue("linkTitle", linkTitle);
                }}
                error={getError("name").error}
                errortext={getError("name").errorText}
                classnames={{ error: "error" }}
              />
            </Box>

            <Box mb="28px" maxWidth="404px" position="relative">
              <Box mb="6px" className="c-font-color c-font-16-22 c-fw-500">
                Project&apos;s public link on the AlphaGuilty platform
              </Box>

              {project ? (
                <Box className="projectLink">
                  <Box mr="5px" className="linkText">
                    https://alphaguilty.io/partners/{project.linkTitle}
                  </Box>

                  <CopyToClipboard
                    text={`${window.location.hostname}/partners/${project.linkTitle}`}
                    onCopy={handleCopy}
                  >
                    <Icon
                      style={{
                        cursor: "pointer",
                      }}
                      color={!isCopied ? "#fafafa" : "#87f696"}
                      name={!isCopied ? "account-copy" : "check-mark"}
                      size="24"
                    />
                  </CopyToClipboard>
                </Box>
              ) : (
                <InputWithNoChangingText
                  className={classNames("c-full-width", "input")}
                  notChangingText="https://alphaguilty.io/partners/"
                  name="linkTitle"
                  value={formik.values.linkTitle}
                  onBlur={onBlur}
                  onChange={formik.handleChange}
                  error={getError("linkTitle").error}
                  errortext={getError("linkTitle").errorText}
                  classnames={{ error: "linkTitleError" }}
                />
              )}
            </Box>

            <Box mb="30px" maxWidth="404px">
              <Box mb="6px" className="c-font-color c-font-16-22 c-fw-500">
                Project webpage
              </Box>

              <Input
                className={classNames("c-full-width", "input")}
                placeholder="Enter your project webpage"
                name="webPage"
                value={formik.values.webPage}
                onBlur={onBlur}
                onChange={formik.handleChange}
                error={getError("webPage").error}
                errortext={getError("webPage").errorText}
                classnames={{ error: "error" }}
              />
            </Box>

            <Box mb="30px" maxWidth="680px">
              <Box mb="6px" className="c-font-color c-font-16-22 c-fw-500">
                Project description
              </Box>

              <WYSIWYG
                placeholder="This text will be a project description on the project page"
                name="projectDescription"
                value={formik.values.description}
                onBlur={onBlur}
                onChange={v => formik.setFieldValue("description", v)}
                error={getError("description").error}
                errorMessage={getError("description").errorText}
                maxLength={6000}
                setFieldError={error =>
                  formik.setFieldError(
                    "description",
                    error ? "Max length is 6000 characters" : null,
                  )
                }
              />
            </Box>

            <Box className="c-font-color c-font-20-24 c-fw-500" mb={2}>
              Socials
            </Box>

            <Box className="inputWrapper soc c-font-color">
              {computeSocialLink(
                "twitter",
                "twitterOrig",
                "Enter a twitter link",
              )}
            </Box>

            <Box className="inputWrapper soc c-font-color">
              {computeSocialLink(
                "discord",
                "discordOrig",
                "Enter a discord link",
              )}
            </Box>

            <Box className="inputWrapper soc c-font-color">
              {computeSocialLink(
                "telegram",
                "telegramOrig",
                "Enter a telegram link",
              )}
            </Box>

            <Button
              style="primary"
              type="submit"
              disabled={disabled}
              loading={isLoading}
            >
              Save changes
            </Button>
          </Box>

          {isMd && (
            <Box mb={3} mt={4}>
              {!project.isDelegated ? (
                <InviteBlock
                  projectLink={linkTitle || createdProjectLinkTitle}
                />
              ) : (
                <LeaveFromProjectBlock projectLink={linkTitle} />
              )}
            </Box>
          )}
        </div>
      </Wrapper>
    </div>
  );
};

export default CreatePartnerProjectPage;
