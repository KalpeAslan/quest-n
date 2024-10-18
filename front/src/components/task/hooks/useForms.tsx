import { loyaltyService } from "@/api";
import { ETaskStatus, ILoyaltyTask, ITaskTrackingData } from "@/models";
import { LoggerService } from "@/services";
import { t } from "@lingui/macro";
import { FormikHelpers, FormikProps, useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { mixed, object, string } from "yup";

export interface QuizFormFields {
  answer: string;
}

const quizInitialValues: QuizFormFields = {
  answer: "",
};

export interface EmailFormFields {
  email: string;
}

const emailInitialValues: EmailFormFields = {
  email: "",
};

export interface SuggestionFormFields {
  description: string;
}

const suggestionInitialValues: SuggestionFormFields = {
  description: "",
};

export interface DailyFormFields {
  answer: string;
}

const dailyInitialValues: DailyFormFields = {
  answer: "",
};

export interface WalletFormFields {
  wallet: string;
}
const walletInitialValues: WalletFormFields = {
  wallet: "",
};

export interface WebhookEmailFormFields {
  email: string;
}

const webhookEmailInitialValues: WebhookEmailFormFields = {
  email: "",
};

export interface WebhookPhoneFormFields {
  phone: string;
}

const webhookPhoneInitialValues: WebhookPhoneFormFields = {
  phone: "",
};

export interface WebhookTextFormFields {
  text: string;
}

const webhookTextInitialValues: WebhookTextFormFields = {
  text: "",
};

export interface ImageUploadFormFields {
  imgSrc: string;
}

const imageUploadInitValues: ImageUploadFormFields = {
  imgSrc: "",
};

interface Props {
  setIsLoaded: (value: boolean) => void;
  taskId: number;
  localTasksData: ILoyaltyTask[];
  setLocalTasksData: (value: SetStateAction<ILoyaltyTask[]>) => void;
  setLocalPoints: (value: SetStateAction<number>) => void;
  trackIsDone: (data: ITaskTrackingData) => void;
  localPoints: number;
  setLocalDone: (value: SetStateAction<boolean>) => void;
  getScores: () => Promise<void>;
  setIsError: (value: SetStateAction<boolean>) => void;
  setErrorMessage: (value: SetStateAction<string>) => void;
  activeStep: number;
  setActiveStep: (value: number) => void;
  task: ILoyaltyTask;
  setIsWarning: (value: SetStateAction<boolean>) => void;
  setWarningMessage: (value: SetStateAction<string>) => void;
  increaseErrorsCount?: () => void;
  setQuizPreDone: Dispatch<SetStateAction<boolean>>;
  executeRecaptcha: () => Promise<string>;
}

const useForms = ({
  setIsLoaded,
  taskId,
  localTasksData,
  setLocalTasksData,
  setLocalPoints,
  trackIsDone,
  localPoints,
  setLocalDone,
  getScores,
  setIsError,
  setErrorMessage,
  task,
  activeStep,
  setActiveStep,
  setWarningMessage,
  setIsWarning,
  increaseErrorsCount,
  setQuizPreDone,
  executeRecaptcha,
}: Props) => {
  const quizValidationSchema = object({
    answer: string()
      .trim()
      .required(
        t({
          id: "brKv9A3CZbewV4GQy65V5G-task",
          message: "This field is required",
        }),
      ),
  });

  const quizFormik: FormikProps<QuizFormFields> = useFormik({
    initialValues: quizInitialValues,
    validateOnBlur: true,
    validationSchema: quizValidationSchema,
    onSubmit: async (
      values: QuizFormFields,
      formikHelpers: FormikHelpers<QuizFormFields>,
    ) => {
      try {
        setIsLoaded(false);

        const reCaptchaToken = await executeRecaptcha();

        const { data: fullfiledData } =
          await loyaltyService.postLoyaltyTaskCompleted(taskId, {
            answer: values.answer,
            reCaptchaToken,
          });

        if (
          fullfiledData.success.status &&
          fullfiledData.success.body.completedAt
        ) {
          const index = localTasksData.findIndex(
            (item: ILoyaltyTask) => item.id === taskId,
          );
          const taskData = [...localTasksData];
          taskData[index].status = ETaskStatus.DONE;
          taskData[index].body = {
            ...taskData[index].body,
            completedAt: fullfiledData.success.body.completedAt,
            answer: fullfiledData.success.body.answer,
          };

          setLocalTasksData(taskData);

          setLocalPoints(localPoints + taskData[index].points);

          trackIsDone({
            questPointsSum: localPoints + taskData[index].points,
          });

          setQuizPreDone(true);

          setTimeout(() => {
            setQuizPreDone(false);
            formikHelpers.resetForm();
          }, 2000);

          setLocalDone(true);
          await getScores();

          return;
        }

        if (fullfiledData.success) {
          if (!fullfiledData.success.body.attemptsLeftNumber) {
            const index = localTasksData.findIndex(
              (item: ILoyaltyTask) => item.id === taskId,
            );
            const taskData = [...localTasksData];
            taskData[index].status = ETaskStatus.EXPIRED;
            taskData[index].body = {
              ...taskData[index].body,
              completedAt: fullfiledData.success.body.completedAt,
              answer: fullfiledData.success.body.answer,
            };

            setLocalTasksData(taskData);

            setLocalPoints(localPoints + taskData[index].points);

            trackIsDone({
              questPointsSum: localPoints + taskData[index].points,
            });

            formikHelpers.resetForm();
            await getScores();
          } else {
            await getScores();

            const taskData = [...localTasksData];
            const index = localTasksData.findIndex(
              (item: ILoyaltyTask) => item.id === taskId,
            );
            taskData[index].body.answers = [
              ...(taskData[index].body.answers || []),
              {
                status: fullfiledData.success.body.status,
                answer: fullfiledData.success.body.answer,
                id: fullfiledData.success.body.attemptsLeftNumber,
              },
            ];
            setLocalTasksData(taskData);
            setIsWarning(true);
            setWarningMessage(
              t({
                id: "8c77a154-1015-11ee-be56-0242ac120002-task",
                message: `Answer is incorrect. You have ${fullfiledData.success.body.attemptsLeftNumber} attempts left.`,
              }),
            );
            formikHelpers.setErrors({
              answer: t({
                id: "8c77a154-1015-11ee-be56-0242ac120002-task",
                message: `Answer is incorrect. You have ${fullfiledData.success.body.attemptsLeftNumber} attempts left.`,
              }),
            });
          }
          return;
        }

        increaseErrorsCount();
        setIsError(true);
        setErrorMessage(
          t({
            id: "eGbde6gmod2WJGiabMgdJV-task",
            message: `Your answer "${values.answer}" is incorrect, try again`,
          }),
        );
      } catch (error) {
        setIsError(true);
        LoggerService.error("Error during referral task response", error);
      } finally {
        setIsLoaded(true);
      }
    },
  });

  const emailValidationSchema = object({
    email: string()
      .trim()
      .required(
        t({
          id: "ue3MRrp6EzoDsCUQ5jUU5v-task",
          message: "This field is required",
        }),
      )
      .matches(
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        t({
          id: "n6JPFGYE9eK44nEXCfqPRj-task",
          message: "The email you've entered is invalid",
        }),
      ),
  });

  const emailFormik: FormikProps<EmailFormFields> = useFormik({
    initialValues: emailInitialValues,
    validateOnBlur: true,
    validationSchema: emailValidationSchema,
    onSubmit: async (
      values: EmailFormFields,
      formikHelpers: FormikHelpers<EmailFormFields>,
    ) => {
      try {
        setIsLoaded(false);

        const reCaptchaToken = await executeRecaptcha();

        const { data: suggestionData } =
          await loyaltyService.postLoyaltyTaskCompleted(taskId, {
            email: values.email,
            reCaptchaToken,
          });

        if (suggestionData.success.status) {
          setIsError(false);
          setErrorMessage("");
          const index = localTasksData.findIndex(
            (item: ILoyaltyTask) => taskId === item.id,
          );
          const taskData = [...localTasksData];

          taskData[index].status = ETaskStatus.DONE;
          taskData[index].body = {
            ...taskData[index].body,
            completedAt: suggestionData.success.body.completedAt,
            email: suggestionData.success.body.email,
          };

          setLocalTasksData(taskData);

          setLocalPoints(localPoints + taskData[index].points);

          formikHelpers.resetForm();
          setLocalDone(true);
          await getScores();

          trackIsDone({
            questPointsSum: localPoints + taskData[index].points,
          });
        } else {
          setIsError(true);
          setErrorMessage(
            t({
              id: "mqwBu56x8iecyzdupxUaeN-task",
              message: `Your answer "${values.email}" is incorrect, try again`,
            }),
          );
        }
      } catch (error) {
        LoggerService.error("Error during referral task response", error);
      } finally {
        setIsLoaded(true);
      }
    },
  });

  const walletFormik: FormikProps<WalletFormFields> = useFormik({
    initialValues: walletInitialValues,
    validateOnBlur: true,
    validationSchema: emailValidationSchema,
    onSubmit: async (
      values: WalletFormFields,
      formikHelpers: FormikHelpers<WalletFormFields>,
    ) => {
      try {
        setIsLoaded(false);

        const reCaptchaToken = await executeRecaptcha();

        const { data: suggestionData } =
          await loyaltyService.postLoyaltyTaskCompleted(taskId, {
            wallet: values.wallet,
            reCaptchaToken,
          });

        if (suggestionData.success.status) {
          const index = localTasksData.findIndex(
            (item: ILoyaltyTask) => taskId === item.id,
          );
          const taskData = [...localTasksData];

          taskData[index].status = ETaskStatus.DONE;
          taskData[index].body = {
            ...taskData[index].body,
            completedAt: suggestionData.success.body.completedAt,
            email: suggestionData.success.body.email,
          };

          setLocalTasksData(taskData);

          setLocalPoints(localPoints + taskData[index].points);

          formikHelpers.resetForm();
          setLocalDone(true);
          await getScores();

          trackIsDone({
            questPointsSum: localPoints + taskData[index].points,
          });
        }
      } catch (error) {
        LoggerService.error("Error during referral task response", error);
      } finally {
        setIsLoaded(true);
      }
    },
  });

  const suggestionValidationSchema = object({
    description: string()
      .trim()
      .required(
        t({
          id: "qd89hVEAE1pZfjPB3L39ey-task",
          message: "This field is required",
        }),
      ),
  });

  const suggestionFormik: FormikProps<SuggestionFormFields> = useFormik({
    initialValues: suggestionInitialValues,
    validateOnBlur: true,
    validationSchema: suggestionValidationSchema,
    onSubmit: async (
      values: SuggestionFormFields,
      formikHelpers: FormikHelpers<SuggestionFormFields>,
    ) => {
      try {
        setIsLoaded(false);

        const reCaptchaToken = await executeRecaptcha();

        const { data: suggestionData } =
          await loyaltyService.postLoyaltyTaskCompleted(taskId, {
            description: values.description,
            reCaptchaToken,
          });

        if (suggestionData.success.status) {
          setIsError(false);
          setErrorMessage("");
          const index = localTasksData.findIndex(
            (item: ILoyaltyTask) => taskId === item.id,
          );
          const tasksData = [...localTasksData];

          tasksData[index].status = ETaskStatus.DONE;
          tasksData[index].body = {
            ...tasksData[index].body,
            completedAt: suggestionData.success.body.completedAt,
            suggestionDescription:
              suggestionData.success.body.suggestionDescription,
          };

          setLocalTasksData(tasksData);

          setLocalPoints(localPoints + tasksData[index].points);

          formikHelpers.resetForm();
          setLocalDone(true);

          await getScores();

          trackIsDone({
            questPointsSum: localPoints + tasksData[index].points,
          });
        } else {
          setIsError(true);
          setErrorMessage(
            t({
              id: "mqwBu56x8iecyzdupxUaeN-task",
              message: `Your answer "${values.description}" is incorrect, try again`,
            }),
          );
        }
      } catch (error) {
        LoggerService.error("Error during referral task response", error);
      } finally {
        setIsLoaded(true);
      }
    },
  });

  const dailyValidationSchema = object({
    answer: string()
      .trim()
      .required(
        t({
          id: "qd89hVEAE1pZfjPB3L39ey-task",
          message: "This field is required",
        }),
      ),
  });

  const dailyFormik: FormikProps<DailyFormFields> = useFormik({
    initialValues: dailyInitialValues,
    validateOnBlur: true,
    validationSchema: dailyValidationSchema,
    onSubmit: async (
      values: DailyFormFields,
      formikHelpers: FormikHelpers<DailyFormFields>,
    ) => {
      try {
        if (
          task.body.subTasks[activeStep].regex &&
          !new RegExp(task.body.subTasks[activeStep].regex).test(values.answer)
        ) {
          formikHelpers.setFieldError("answer", "Incorrect answer");
          formikHelpers.setSubmitting(false);
          return;
        }

        setIsLoaded(false);

        const reCaptchaToken = await executeRecaptcha();

        const { data: dailyData } =
          await loyaltyService.postLoyaltyTaskCompleted(taskId, {
            answer: values.answer,
            id: task.body.subTasks[activeStep].id,
            reCaptchaToken,
          });

        if (dailyData.success.status) {
          const index = localTasksData.findIndex(
            (item: ILoyaltyTask) => taskId === item.id,
          );

          const taskData = [...localTasksData];
          const item: ILoyaltyTask = { ...localTasksData[index] };

          taskData[index].body.subTasks = item.body.subTasks.map(subTask => ({
            ...subTask,
            status:
              subTask.id === task.body.subTasks[activeStep].id
                ? "confirmed"
                : subTask.status,
          }));

          setActiveStep(0);

          setLocalTasksData(taskData);

          await getScores();

          trackIsDone({
            questPointsSum: localPoints + item.points,
            subTaskId: task.body.subTasks[activeStep].id,
          });

          formikHelpers.resetForm();
        }
      } catch (error) {
        LoggerService.error("Error during daily task response", error);
      } finally {
        setIsLoaded(true);
      }
    },
  });

  const webhookTaskEmailSchema = object({
    email: string()
      .trim()
      .required(
        t({
          id: "ue3MRrp6EzoDsCUQ5jUU5v-task",
          message: "This field is required",
        }),
      )
      .matches(
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        t({
          id: "n6JPFGYE9eK44nEXCfqPRj-task",
          message: "The email you've entered is invalid",
        }),
      ),
  });

  const webhookEmailFormik: FormikProps<WebhookEmailFormFields> = useFormik({
    initialValues: webhookEmailInitialValues,
    validateOnBlur: true,
    validationSchema: webhookTaskEmailSchema,
    onSubmit: async (
      values: WebhookEmailFormFields,
      formikHelpers: FormikHelpers<WebhookEmailFormFields>,
    ) => {
      try {
        setIsLoaded(false);

        const reCaptchaToken = await executeRecaptcha();

        const { data: webhookTaskData } =
          await loyaltyService.postLoyaltyTaskCompleted(taskId, {
            email: values.email,
            reCaptchaToken,
          });

        if (webhookTaskData.success.status) {
          const index = localTasksData.findIndex(
            (item: ILoyaltyTask) => item.id === taskId,
          );
          const taskData = [...localTasksData];
          taskData[index].status = ETaskStatus.DONE;
          taskData[index].body = {
            ...taskData[index].body,
          };

          setLocalTasksData(taskData);

          setLocalPoints(localPoints + taskData[index].points);

          trackIsDone({
            questPointsSum: localPoints + taskData[index].points,
          });

          formikHelpers.resetForm();
          setLocalDone(true);
          await getScores();

          return;
        }

        increaseErrorsCount();
        setIsError(true);
        setErrorMessage(
          t({
            id: "mqwBu56x8iecyzdupxUaeN-task",
            message: `Your answer "${values.email}" is incorrect, try again`,
          }),
        );
      } catch (error) {
        setIsError(true);
        LoggerService.error("Error during referral task response", error);
      } finally {
        setIsLoaded(true);
      }
    },
  });

  const webhookTaskPhoneSchema = object({
    phone: string().required(
      t({
        id: "ue3MRrp6EzoDsCUQ5jUU5v-task",
        message: "This field is required",
      }),
    ),
  });

  const webhookPhoneFormik: FormikProps<WebhookPhoneFormFields> = useFormik({
    initialValues: webhookPhoneInitialValues,
    validateOnBlur: true,
    validationSchema: webhookTaskPhoneSchema,
    onSubmit: async (
      values: WebhookPhoneFormFields,
      formikHelpers: FormikHelpers<WebhookPhoneFormFields>,
    ) => {
      try {
        setIsLoaded(false);

        const reCaptchaToken = await executeRecaptcha();

        const { data: webhookTaskData } =
          await loyaltyService.postLoyaltyTaskCompleted(taskId, {
            phone: values.phone.replace("+", ""),
            reCaptchaToken,
          });

        if (webhookTaskData.success.status) {
          const index = localTasksData.findIndex(
            (item: ILoyaltyTask) => item.id === taskId,
          );
          const taskData = [...localTasksData];
          taskData[index].status = ETaskStatus.DONE;
          taskData[index].body = {
            ...taskData[index].body,
          };

          setLocalTasksData(taskData);

          setLocalPoints(localPoints + taskData[index].points);

          trackIsDone({
            questPointsSum: localPoints + taskData[index].points,
          });

          formikHelpers.resetForm();
          setLocalDone(true);
          await getScores();

          return;
        }

        increaseErrorsCount();
        setIsError(true);
        setErrorMessage(
          t({
            id: "3d8wZ84XncGzFB5wjTxNtx-task",
            message: `Your answer "${values.phone}" is incorrect, try again`,
          }),
        );
      } catch (error) {
        setIsError(true);
        LoggerService.error("Error during referral task response", error);
      } finally {
        setIsLoaded(true);
      }
    },
  });

  const webhookTaskTextSchema = object({
    text: string()
      .trim()
      .required(
        t({
          id: "ue3MRrp6EzoDsCUQ5jUU5v-task",
          message: "This field is required",
        }),
      ),
  });

  const webhookTextFormik: FormikProps<WebhookTextFormFields> = useFormik({
    initialValues: webhookTextInitialValues,
    validateOnBlur: true,
    validationSchema: webhookTaskTextSchema,
    onSubmit: async (
      values: WebhookTextFormFields,
      formikHelpers: FormikHelpers<WebhookTextFormFields>,
    ) => {
      try {
        setIsLoaded(false);

        const reCaptchaToken = await executeRecaptcha();

        const { data: webhookTaskData } =
          await loyaltyService.postLoyaltyTaskCompleted(taskId, {
            text: values.text,
            reCaptchaToken,
          });

        if (webhookTaskData.success.status) {
          const index = localTasksData.findIndex(
            (item: ILoyaltyTask) => item.id === taskId,
          );
          const taskData = [...localTasksData];
          taskData[index].status = ETaskStatus.DONE;
          taskData[index].body = {
            ...taskData[index].body,
          };

          setLocalTasksData(taskData);

          setLocalPoints(localPoints + taskData[index].points);

          trackIsDone({
            questPointsSum: localPoints + taskData[index].points,
          });

          formikHelpers.resetForm();
          setLocalDone(true);
          await getScores();

          return;
        }

        increaseErrorsCount();
        setIsError(true);
        setErrorMessage(
          t({
            id: "xkbHGTAbdoa1vrVjievEC5-task",
            message: `Your answer "${values.text}" is incorrect, try again`,
          }),
        );
      } catch (error) {
        setIsError(true);
        LoggerService.error("Error during referral task response", error);
      } finally {
        setIsLoaded(true);
      }
    },
  });

  const imageUploadValidationSchema = object().shape({
    imgSrc: mixed().required("A file is required"),
  });

  const imageUploadFormik: FormikProps<ImageUploadFormFields> = useFormik({
    initialValues: imageUploadInitValues,
    validateOnBlur: true,
    validationSchema: imageUploadValidationSchema,
    onSubmit: async (
      values: ImageUploadFormFields,
      formikHelpers: FormikHelpers<ImageUploadFormFields>,
    ) => {
      try {
        setIsLoaded(false);

        const reCaptchaToken = await executeRecaptcha();

        const formData = new FormData();

        formData.append("imgSrc", values.imgSrc);
        formData.append("reCaptchaToken", reCaptchaToken);
        formData.append("reCaptchaVersion", "v3");

        const { data: imageUploadTaskData } =
          await loyaltyService.postLoyaltyTaskCompleted(taskId, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

        if (
          imageUploadTaskData.success.status &&
          imageUploadTaskData.success.body &&
          imageUploadTaskData.success.body.completedAt
        ) {
          const index = localTasksData.findIndex(
            (item: ILoyaltyTask) => item.id === taskId,
          );
          const taskData = [...localTasksData];
          taskData[index].status = ETaskStatus.DONE;
          taskData[index].body = {
            ...taskData[index].body,
          };

          setLocalTasksData(taskData);

          setLocalPoints(localPoints + taskData[index].points);

          trackIsDone({
            questPointsSum: localPoints + taskData[index].points,
          });

          formikHelpers.resetForm();
          setLocalDone(true);
          await getScores();

          return;
        }
      } catch (error) {
        increaseErrorsCount();
        setIsError(true);
        if (
          error.response &&
          (error.response.status === 413 || error.response.status === 400)
        ) {
          return setErrorMessage(
            t({
              id: "axaAGTAbdoa1vrVjievfdgvs-task",
              message: "File is too large, max size: 5MB",
            }),
          );
        }
        setErrorMessage(
          t({
            id: "qweAGTAbdoa1vrVjiev3ff-task",
            message: "Something is wrong, try again",
          }),
        );
        LoggerService.error("Error during image upload task", error);
      } finally {
        setIsLoaded(true);
      }
    },
  });

  return {
    quizFormik,
    emailFormik,
    suggestionFormik,
    walletFormik,
    dailyFormik,
    webhookEmailFormik,
    webhookPhoneFormik,
    webhookTextFormik,
    imageUploadFormik,
  };
};

export default useForms;
