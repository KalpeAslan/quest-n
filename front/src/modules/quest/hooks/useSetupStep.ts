import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ECreateQuestSteps,
  EProjectType,
  EQuestAdminStep,
  ILoyaltyProject,
  IPartnerProject,
} from "../models";
import { object, string } from "yup";
import { t } from "@lingui/macro";
import { FormikHelpers, FormikProps, useFormik } from "formik";
import { adminQuestService } from "@/api";
import { getEndDate, getStartDate } from "../helpers/tasks";
import {
  setPreviewOpen,
  setPreviewPanel,
} from "@/store/slices/system/system.slice";

export interface SetupStepFormFields {
  projectName: string;
  linkTitle: string;
  description: string;
  startAt: string;
  endAt: string;
}

export interface ISetupHookData {
  isUpdate: boolean;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  formik: FormikProps<SetupStepFormFields>;
  getError: (name: keyof SetupStepFormFields) => {
    error: boolean;
    errorText: string;
  };
  isFormLoaded: boolean;
  defaultPreviewImage: string;
  tempPreviewImage: string;
  imgUploadError: string;
  isPreviewImageLoaded: boolean;
  disabled: boolean;
  addPreviewImage: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  deletePreviewImage: () => Promise<void>;
  adminStep: EQuestAdminStep;
  currentQuest: ILoyaltyProject;
  setQuestType: Dispatch<SetStateAction<EProjectType>>;
  questType: EProjectType;
  saveData: (
    data: SetupStepFormFields,
    setFieldError: (field: string, message: string) => void,
    isShouldSave: boolean,
  ) => () => Promise<boolean>;
}

interface Props {
  partnerProject: IPartnerProject;
  setStep: (step: ECreateQuestSteps) => void;
  currentQuest: ILoyaltyProject;
  adminStep: EQuestAdminStep;
  updateQuest: (data: SetupStepFormFields) => Promise<ILoyaltyProject>;
  setCurrentQuest: (linkTitle: ILoyaltyProject) => void;
  shouldSave: boolean;
  questType: EProjectType;
  setQuestType: Dispatch<SetStateAction<EProjectType>>;
  setCurrentQuestForPreview: Dispatch<SetStateAction<ILoyaltyProject>>;
  setPreviewLoading: Dispatch<SetStateAction<boolean>>;
  setShouldSave: Dispatch<SetStateAction<boolean>>;
}

const fileSizeMinLimit = 100 * 1024;

const initialValues: SetupStepFormFields = {
  projectName: "",
  linkTitle: "",
  description: "",
  startAt: getStartDate(new Date()).toISOString(),
  endAt: getEndDate(new Date()).toISOString(),
};

const initialErrors: SetupStepFormFields = {
  projectName: "",
  linkTitle: "",
  description: "",
  startAt: "",
  endAt: "",
};

const useSetupStep = ({
  setStep,
  currentQuest,
  adminStep,
  updateQuest,
  setCurrentQuest,
  shouldSave,
  questType,
  setQuestType,
  setCurrentQuestForPreview,
  setPreviewLoading,
  setShouldSave,
}: Props): ISetupHookData => {
  const [isFormLoaded, setIsFormLoaded] = useState<boolean>(true);
  const [isPreviewImageLoaded, setIsPreviewImageLoaded] =
    useState<boolean>(true);
  const [defaultPreviewImage, setDefaultPreviewImage] = useState<string | null>(
    null,
  );
  const [tempPreviewImage, setTempPreviewImage] = useState<string | null>(null);

  const [imgUploadError, setImgUploadError] = useState<string>("");

  const dispatch = useAppDispatch();

  const isUpdate = adminStep === EQuestAdminStep.edit;
  const formSchema = object({
    projectName: string()
      .trim()
      .required(
        t({
          id: "fepBMNhesjMUaPAckxCXKt-quest",
          message: "Name is required",
        }),
      ),
    linkTitle: string()
      .trim()
      .matches(
        /^([a-z0-9-]*)$/,
        t({
          id: "kEoa73iupUegfER64zgavJ-quest",
          message: "Only lowercase letters and dash allowed",
        }),
      )
      .not(
        ["create"],
        t({
          id: "rQBUGLHy8729RcrVMKUPFj-quest",
          message: `Can't be "create" (reserved word)`,
        }),
      )
      .required(
        t({
          id: "pdf1A5rcJf6PzF3UK8ZQcJ-quest",
          message: "Link title is required",
        }),
      ),
    description: string().notRequired().nullable(),
    startAt: string().required(
      t({
        id: "1art8A1MW8vnzu9KX2xMjF-quest",
        message: "Start date is required",
      }),
    ),
    endAt: string().required(
      t({
        id: "kAh8VnbE2f3uQ9PXiQkMNJ-quest",
        message: "End date is required",
      }),
    ),
  });

  const saveData = useCallback(
    (
        data: SetupStepFormFields,
        setFieldError: (field: string, message: string) => void,
        isShouldSave: boolean,
      ) =>
      async () => {
        let isSaved: boolean = false;
        try {
          setIsFormLoaded(false);

          const result = await updateQuest(data);

          setCurrentQuest(result);

          isSaved = true;
          if (!isShouldSave) {
            setStep(ECreateQuestSteps.SelectTasks);
          }
        } catch (error) {
          isSaved = false;
          setFieldError(
            "linkTitle",
            t({
              id: "rBz47sQxiwLqWJKcDqfkYw-quest",
              message: "This link title already exists",
            }),
          );
        } finally {
          setIsFormLoaded(true);
          return isSaved;
        }
      },
    [setCurrentQuest, setStep, updateQuest],
  );

  const onSubmit = useCallback(
    async (
      data: SetupStepFormFields,
      formikHelpers: FormikHelpers<SetupStepFormFields>,
    ) => {
      await saveData(data, formikHelpers.setFieldError, shouldSave)();
    },
    [saveData, shouldSave],
  );

  const getDefaultPreviewImage = useCallback(async () => {
    try {
      const { data: result } = await adminQuestService.getDefaultPreviewImage();
      setDefaultPreviewImage(result);
    } catch (error) {
      console.log("Failed to get default image", error);
    }
  }, []);

  const addPreviewImage = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        setIsPreviewImageLoaded(false);
        const [file] = e.target.files;

        if (file.size <= fileSizeMinLimit) {
          setIsPreviewImageLoaded(true);
          setImgUploadError(
            t({
              id: "1art8A1MasdadsdfW8vnzu9KX2xMjF-quest",
              message: "File size must be more than 100kb",
            }),
          );
          return;
        }

        if (!currentQuest?.linkTitle) {
          const { data: result } = await adminQuestService.savePreviewImage(
            file,
          );
          setTempPreviewImage(result);
          return;
        }

        const { data: result } =
          await adminQuestService.updateQuestPreviewImage(
            currentQuest.linkTitle,
            file,
          );

        setCurrentQuest(result);
        setImgUploadError("");
      } catch (error) {
        console.log("Failed to upload logo", error);
      } finally {
        setIsPreviewImageLoaded(true);
      }
    },
    [currentQuest?.linkTitle, setCurrentQuest],
  );

  const deletePreviewImage = useCallback(async () => {
    if (!currentQuest?.linkTitle) {
      setTempPreviewImage(null);
      return;
    }

    try {
      setIsPreviewImageLoaded(false);

      const { data: result } = await adminQuestService.deleteQuestPreviewImage(
        currentQuest.linkTitle,
      );

      setCurrentQuest(result);
    } catch (error) {
    } finally {
      setIsPreviewImageLoaded(true);
    }
  }, [currentQuest?.linkTitle, setCurrentQuest]);

  const formik: FormikProps<SetupStepFormFields> =
    useFormik<SetupStepFormFields>({
      initialValues,
      initialErrors,
      validateOnBlur: false,
      validationSchema: formSchema,
      onSubmit,
    });

  useEffect(() => {
    if (currentQuest) {
      setQuestType(currentQuest.projectType);
      formik.setValues({
        projectName: currentQuest.title,
        description: currentQuest.description,
        linkTitle: currentQuest.linkTitle,
        startAt: new Date(currentQuest.startAt).toISOString(),
        endAt: new Date(currentQuest.endAt).toISOString(),
      });
    }
  }, [currentQuest]);

  useEffect(() => {
    getDefaultPreviewImage();
  }, [getDefaultPreviewImage]);

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    formik.setTouched({ ...formik.touched, [e.target.name]: true });

    if (
      ["startAt", "endAt"].includes(e.target.name) &&
      new Date(formik.values.endAt).getTime() <=
        new Date(formik.values.startAt).getTime()
    ) {
      formik.setFieldError(
        e.target.name,
        e.target.name === "endAt"
          ? t({
              id: "vWu12kWNKE7sLHwiHG1kmw-quest",
              message: "Must be after start date",
            })
          : t({
              id: "vGWM6g6tqUgbGWnt2TyQJx-quest",
              message: "Must be before end date",
            }),
      );
    }
  };

  const getError = useCallback(
    (name: keyof typeof formik.errors) => ({
      error: Boolean(formik.touched[name] && formik.errors[name]),
      errorText: formik.touched[name] ? formik.errors[name] : "",
    }),
    [formik],
  );

  const disabled = useMemo(
    () =>
      Boolean(
        !isFormLoaded ||
          (formik.errors.projectName && adminStep === EQuestAdminStep.edit) ||
          !formik.values.projectName ||
          (formik.errors.linkTitle && adminStep === EQuestAdminStep.edit) ||
          !formik.values.linkTitle ||
          !formik.values.startAt ||
          !formik.values.endAt,
      ),
    [
      formik.errors.linkTitle,
      formik.errors.projectName,
      formik.values.endAt,
      formik.values.linkTitle,
      formik.values.projectName,
      formik.values.startAt,
      adminStep,
      isFormLoaded,
    ],
  );

  useEffect(() => {
    if (formik.values) {
      setCurrentQuestForPreview(prev => ({
        ...prev,
        projectType: questType || prev.projectType,
        description: formik.values.description,
        title: formik.values.projectName,
        startAt: formik.values.startAt,
        endAt: formik.values.endAt,
      }));
    }
  }, [formik.values, questType]);

  const onPreviewSave = useCallback(async () => {
    if (shouldSave) {
      setPreviewLoading(true);
      await formik.submitForm();

      dispatch(setPreviewOpen(true));
      dispatch(setPreviewPanel({ open: true, onClick: "close" }));

      setShouldSave(false);
      setPreviewLoading(false);
    }
  }, [dispatch, setPreviewLoading, setShouldSave, shouldSave]);

  useEffect(() => {
    onPreviewSave();
  }, [onPreviewSave]);

  return {
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
    saveData,
  };
};

export default useSetupStep;
